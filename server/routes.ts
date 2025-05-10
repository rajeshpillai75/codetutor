import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertUserSchema, 
  insertLanguageSchema, 
  insertCourseSchema,
  insertLessonSchema,
  insertExerciseSchema,
  insertUserProgressSchema,
  insertCodeSubmissionSchema
} from "@shared/schema";
import { ZodError } from "zod";
import {
  MentorPersonalities,
  type MentorPersonality,
  getChatbotResponse,
  getCodeFeedback,
  ChatMessage
} from "./openai";
import { getChatbotResponseWithAnthropic } from "./anthropic";
import { log } from "./vite";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up PostgreSQL session store
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  });

  // Set up authentication routes and middleware
  setupAuth(app);
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Error handling middleware for Zod validation errors
  const handleZodError = (err: ZodError, res: Response) => {
    const errorMessages = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    res.status(400).json({ error: "Validation error", details: errorMessages });
  };

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err, res);
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // User progress routes
  app.get("/api/user-progress/:userId/:lessonId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const lessonId = parseInt(req.params.lessonId);
      
      // Ensure the requesting user can only access their own progress
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Forbidden: You can only access your own progress" });
      }
      
      const progress = await storage.getUserLessonProgress(userId, lessonId);
      
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });
  
  app.get("/api/user-progress/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Ensure the requesting user can only access their own progress
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Forbidden: You can only access your own progress" });
      }
      
      const progress = await storage.getUserProgressByUser(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });
  
  app.post("/api/user-progress", isAuthenticated, async (req, res) => {
    try {
      const data = insertUserProgressSchema.safeParse(req.body);
      
      if (!data.success) {
        return handleZodError(data.error, res);
      }
      
      // Ensure the requesting user can only create progress for themselves
      if (req.user?.id !== data.data.userId) {
        return res.status(403).json({ error: "Forbidden: You can only create progress for yourself" });
      }
      
      const progress = await storage.createUserProgress(data.data);
      res.status(201).json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user progress" });
    }
  });
  
  app.put("/api/user-progress/:id", isAuthenticated, async (req, res) => {
    try {
      const progressId = parseInt(req.params.id);
      const { completed } = req.body;
      
      // Get the progress to check ownership
      const userProgressList = await storage.getAllUserProgress();
      const existingProgress = userProgressList.find(p => p.id === progressId);
      
      if (!existingProgress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      
      // Ensure the requesting user can only update their own progress
      if (req.user?.id !== existingProgress.userId) {
        return res.status(403).json({ error: "Forbidden: You can only update your own progress" });
      }
      
      const progress = await storage.updateUserProgress(progressId, completed);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user progress" });
    }
  });
  
  // Recommended lessons API
  app.get("/api/recommended-lessons", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      // If userId is provided, ensure the requesting user can only access their own recommendations
      if (userId && req.user?.id !== userId) {
        return res.status(403).json({ error: "Forbidden: You can only access your own recommendations" });
      }
      
      // Get all lessons
      const allLessons = await storage.getAllLessons();
      const allCourses = await storage.getAllCourses();
      
      // If not authenticated or no userId provided, return random recommendations
      if (!userId || !req.isAuthenticated()) {
        const recommendations = allLessons
          .slice(0, 4)
          .map(lesson => {
            const course = allCourses.find(c => c.id === lesson.courseId)!;
            return {
              type: 'not_started' as const,
              lesson,
              course,
              progress: 0
            };
          });
        
        return res.json({ recommendations });
      }
      
      // Get user progress for all lessons
      const userProgress = await storage.getUserProgressByUser(userId);
      
      // Create a map for quick lookup
      const progressMap = new Map();
      userProgress.forEach(p => progressMap.set(p.lessonId, p));
      
      // 1. Find in-progress lessons (up to 2)
      const inProgressLessons = allLessons
        .filter(lesson => {
          const progress = progressMap.get(lesson.id);
          return progress && !progress.completed;
        })
        .slice(0, 2)
        .map(lesson => {
          const course = allCourses.find(c => c.id === lesson.courseId)!;
          return {
            type: 'in_progress' as const,
            lesson,
            course,
            progress: 0.4 // This would normally be calculated based on more detailed progress info
          };
        });
      
      // 2. Find not started lessons (up to 4)
      const completedOrInProgressLessonIds = new Set(userProgress.map(p => p.lessonId));
      const notStartedLessons = allLessons
        .filter(lesson => !completedOrInProgressLessonIds.has(lesson.id))
        .slice(0, 4 - inProgressLessons.length)
        .map(lesson => {
          const course = allCourses.find(c => c.id === lesson.courseId)!;
          return {
            type: 'not_started' as const,
            lesson,
            course,
            progress: 0
          };
        });
      
      // Combine and return
      const recommendations = [...inProgressLessons, ...notStartedLessons];
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Programming languages routes
  app.get("/api/languages", async (req, res) => {
    try {
      const languages = await storage.getAllLanguages();
      res.json(languages);
    } catch (err) {
      res.status(500).json({ error: "Failed to get languages" });
    }
  });

  app.post("/api/languages", async (req, res) => {
    try {
      const languageData = insertLanguageSchema.parse(req.body);
      const language = await storage.createLanguage(languageData);
      res.status(201).json(language);
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err, res);
      } else {
        res.status(500).json({ error: "Failed to create language" });
      }
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: "Failed to get courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Failed to get course" });
    }
  });

  app.get("/api/languages/:id/courses", async (req, res) => {
    try {
      const languageId = parseInt(req.params.id);
      const courses = await storage.getCoursesByLanguage(languageId);
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: "Failed to get courses by language" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err, res);
      } else {
        res.status(500).json({ error: "Failed to create course" });
      }
    }
  });

  // Lessons routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getAllLessons();
      res.json(lessons);
    } catch (err) {
      res.status(500).json({ error: "Failed to get lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (err) {
      res.status(500).json({ error: "Failed to get lesson" });
    }
  });

  app.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const lessons = await storage.getLessonsByCourse(courseId);
      res.json(lessons);
    } catch (err) {
      res.status(500).json({ error: "Failed to get lessons by course" });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err, res);
      } else {
        res.status(500).json({ error: "Failed to create lesson" });
      }
    }
  });

  // Exercises routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getAllExercises();
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ error: "Failed to get exercises" });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const exercise = await storage.getExercise(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ error: "Exercise not found" });
      }
      
      res.json(exercise);
    } catch (err) {
      res.status(500).json({ error: "Failed to get exercise" });
    }
  });

  app.get("/api/lessons/:id/exercises", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const exercises = await storage.getExercisesByLesson(lessonId);
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ error: "Failed to get exercises by lesson" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err, res);
      } else {
        res.status(500).json({ error: "Failed to create exercise" });
      }
    }
  });

  // Code submissions routes
  app.get("/api/code-submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllCodeSubmissions();
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ error: "Failed to get code submissions" });
    }
  });

  app.get("/api/code-submissions/:id", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const submission = await storage.getCodeSubmission(submissionId);
      
      if (!submission) {
        return res.status(404).json({ error: "Code submission not found" });
      }
      
      res.json(submission);
    } catch (err) {
      res.status(500).json({ error: "Failed to get code submission" });
    }
  });

  app.get("/api/users/:id/code-submissions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const submissions = await storage.getCodeSubmissionsByUser(userId);
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ error: "Failed to get code submissions by user" });
    }
  });

  app.get("/api/exercises/:id/code-submissions", async (req, res) => {
    try {
      const exerciseId = parseInt(req.params.id);
      const submissions = await storage.getCodeSubmissionsByExercise(exerciseId);
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ error: "Failed to get code submissions by exercise" });
    }
  });

  app.post("/api/code-submissions", async (req, res) => {
    try {
      const submissionData = insertCodeSubmissionSchema.parse(req.body);
      const submission = await storage.createCodeSubmission(submissionData);
      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err, res);
      } else {
        res.status(500).json({ error: "Failed to create code submission" });
      }
    }
  });

  // AI-related routes
  app.post("/api/ai/code-feedback", async (req, res) => {
    try {
      const { code, language } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
      }
      
      const feedback = await getCodeFeedback(code, language);
      res.json(feedback);
    } catch (err) {
      console.error("Error getting code feedback:", err);
      res.status(500).json({ error: "Failed to get code feedback" });
    }
  });

  app.post("/api/ai/chat/openai", async (req, res) => {
    try {
      const { messages, currentLanguage, currentTopic } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Valid messages array is required" });
      }
      
      let selectedPersonality: MentorPersonality = MentorPersonalities.FRIENDLY;
      if (req.body.personality && Object.values(MentorPersonalities).includes(req.body.personality)) {
        selectedPersonality = req.body.personality;
      }
      
      const response = await getChatbotResponse(
        messages as ChatMessage[],
        currentLanguage,
        currentTopic,
        selectedPersonality
      );
      
      res.json(response);
    } catch (err) {
      console.error("Error in OpenAI chat:", err);
      res.status(500).json({ error: "Failed to get chat response" });
    }
  });

  app.post("/api/ai/chat/anthropic", async (req, res) => {
    try {
      const { messages, currentLanguage, currentTopic } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Valid messages array is required" });
      }
      
      let selectedPersonality: MentorPersonality = MentorPersonalities.FRIENDLY;
      if (req.body.personality && Object.values(MentorPersonalities).includes(req.body.personality)) {
        selectedPersonality = req.body.personality;
      }
      
      const response = await getChatbotResponseWithAnthropic(
        messages as ChatMessage[],
        currentLanguage,
        currentTopic,
        selectedPersonality
      );
      
      res.json(response);
    } catch (err) {
      console.error("Error in Anthropic chat:", err);
      res.status(500).json({ error: "Failed to get chat response" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}