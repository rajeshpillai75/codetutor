import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getCodeFeedback, searchYouTubeVideos } from "./openai";
import {
  insertCodeSubmissionSchema,
  insertCourseSchema,
  insertExerciseSchema,
  insertLanguageSchema,
  insertLessonSchema,
  insertUserProgressSchema,
  insertUserSchema,
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const languageId = req.query.languageId ? parseInt(req.query.languageId as string) : undefined;
      const courses = languageId
        ? await storage.getCoursesByLanguage(languageId)
        : await storage.getAllCourses();
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
      const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
      const lessons = courseId
        ? await storage.getLessonsByCourse(courseId)
        : await storage.getAllLessons();
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
      const lessonId = req.query.lessonId ? parseInt(req.query.lessonId as string) : undefined;
      const exercises = lessonId
        ? await storage.getExercisesByLesson(lessonId)
        : await storage.getAllExercises();
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

  // User progress routes
  app.get("/api/user-progress", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const userProgress = userId
        ? await storage.getUserProgressByUser(userId)
        : await storage.getAllUserProgress();
      res.json(userProgress);
    } catch (err) {
      res.status(500).json({ error: "Failed to get user progress" });
    }
  });
  
  // Personalized learning paths - Get recommended next lessons based on user progress
  app.get("/api/recommended-lessons", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Get user progress
      const userProgress = await storage.getUserProgressByUser(userId);
      // Get all lessons
      const allLessons = await storage.getAllLessons();
      // Get all courses
      const allCourses = await storage.getAllCourses();
      
      // Maps for lookup
      const courseMap = new Map(allCourses.map(course => [course.id, course]));
      const completedLessonsMap = new Map();
      
      // Track completed lessons
      userProgress.forEach(progress => {
        if (progress.completed) {
          completedLessonsMap.set(progress.lessonId, true);
        }
      });
      
      // Calculate recommendations by finding in-progress courses and next uncompleted lessons
      const recommendations = [];
      const courseProgress = new Map(); // To track course completion status
      
      // Initialize course progress
      allCourses.forEach(course => {
        courseProgress.set(course.id, { total: 0, completed: 0 });
      });
      
      // Count lessons per course and completed lessons
      allLessons.forEach(lesson => {
        const courseStats = courseProgress.get(lesson.courseId);
        if (courseStats) {
          courseStats.total++;
          if (completedLessonsMap.has(lesson.id)) {
            courseStats.completed++;
          }
        }
      });
      
      // Find courses in progress (partially completed)
      const coursesInProgress = Array.from(courseProgress.entries())
        .filter(([_, stats]) => stats.completed > 0 && stats.completed < stats.total)
        .map(([courseId]) => courseId);
      
      // Add courses with no progress yet
      const coursesNotStarted = Array.from(courseProgress.entries())
        .filter(([_, stats]) => stats.completed === 0)
        .map(([courseId]) => courseId);
      
      // Find next lessons in in-progress courses
      coursesInProgress.forEach(courseId => {
        const course = courseMap.get(courseId);
        
        // Get lessons for this course and sort by order
        const courseLessons = allLessons
          .filter(lesson => lesson.courseId === courseId)
          .sort((a, b) => a.order - b.order);
        
        // Find first uncompleted lesson
        const nextLesson = courseLessons.find(lesson => !completedLessonsMap.has(lesson.id));
        
        if (nextLesson) {
          recommendations.push({
            type: 'in_progress',
            lesson: nextLesson,
            course: course,
            progress: Math.round((courseProgress.get(courseId).completed / courseProgress.get(courseId).total) * 100)
          });
        }
      });
      
      // Add recommendations from courses not yet started (take first lesson)
      if (recommendations.length < 3 && coursesNotStarted.length > 0) {
        // Sort by user preference (language level, etc) - simplified for now
        const notStartedRecommendations = coursesNotStarted
          .slice(0, 3 - recommendations.length)
          .map(courseId => {
            const course = courseMap.get(courseId);
            const firstLesson = allLessons
              .filter(lesson => lesson.courseId === courseId)
              .sort((a, b) => a.order - b.order)[0];
            
            if (firstLesson) {
              return {
                type: 'not_started',
                lesson: firstLesson,
                course: course,
                progress: 0
              };
            }
            return null;
          })
          .filter(Boolean);
        
        recommendations.push(...notStartedRecommendations);
      }
      
      res.json({ recommendations });
    } catch (err) {
      console.error("Failed to get recommended lessons:", err);
      res.status(500).json({ error: "Failed to get recommended lessons" });
    }
  });

  app.post("/api/user-progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(progressData);
      res.status(201).json(progress);
    } catch (err) {
      if (err instanceof ZodError) {
        handleZodError(err, res);
      } else {
        res.status(500).json({ error: "Failed to create user progress" });
      }
    }
  });

  // Code submissions and feedback routes
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

  // AI code feedback route
  app.post("/api/code-feedback", async (req, res) => {
    try {
      const { code, language, exerciseId } = req.body;
      if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
      }

      let exerciseContext = "";
      if (exerciseId) {
        const exercise = await storage.getExercise(parseInt(exerciseId));
        if (exercise) {
          exerciseContext = exercise.instructions || "";
        }
      }

      const feedback = await getCodeFeedback(code, language, exerciseContext);
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ error: "Failed to get code feedback" });
    }
  });

  // YouTube video search route
  app.get("/api/search-videos", async (req, res) => {
    try {
      const { topic } = req.query;
      if (!topic) {
        return res.status(400).json({ error: "Topic parameter is required" });
      }

      const videos = await searchYouTubeVideos(topic as string);
      res.json(videos);
    } catch (err) {
      res.status(500).json({ error: "Failed to search videos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
