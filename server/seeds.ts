import { storage } from "./storage";
import { PROGRAMMING_LANGUAGES, DEFAULT_COURSES, DEFAULT_LESSONS, DEFAULT_EXERCISE } from "@/lib/constants";
import { 
  JAVASCRIPT_FUNDAMENTALS_LESSONS, 
  REACT_FUNDAMENTALS_LESSONS, 
  SQL_BASICS_LESSONS, 
  WEB_DEV_LESSONS,
  JAVASCRIPT_EXERCISE,
  REACT_EXERCISE,
  SQL_EXERCISE,
  HTML_CSS_EXERCISE
} from "@/lib/additional-lessons";

// Helper function to wait between DB operations
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Seed programming languages
    for (const lang of PROGRAMMING_LANGUAGES) {
      await storage.createLanguage({
        name: lang.name,
        icon: lang.icon,
        color: lang.color
      });
      await wait(100); // Small delay to avoid conflicts
    }
    console.log("✅ Languages seeded");
    
    // Seed courses
    for (const course of DEFAULT_COURSES) {
      await storage.createCourse({
        languageId: course.languageId,
        title: course.title,
        description: course.description,
        level: course.level
      });
      await wait(100);
    }
    console.log("✅ Courses seeded");
    
    // Seed Python lessons
    for (const lesson of DEFAULT_LESSONS) {
      await storage.createLesson({
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        duration: lesson.duration
      });
      await wait(100);
    }
    
    // Seed JavaScript lessons
    for (const lesson of JAVASCRIPT_FUNDAMENTALS_LESSONS) {
      await storage.createLesson({
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        duration: lesson.duration
      });
      await wait(100);
    }
    
    // Seed React lessons
    for (const lesson of REACT_FUNDAMENTALS_LESSONS) {
      await storage.createLesson({
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        duration: lesson.duration
      });
      await wait(100);
    }
    
    // Seed SQL lessons
    for (const lesson of SQL_BASICS_LESSONS) {
      await storage.createLesson({
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        duration: lesson.duration
      });
      await wait(100);
    }
    
    // Seed HTML & CSS lessons
    for (const lesson of WEB_DEV_LESSONS) {
      await storage.createLesson({
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        duration: lesson.duration
      });
      await wait(100);
    }
    
    console.log("✅ Lessons seeded");
    
    // Seed exercises
    const exercises = [
      DEFAULT_EXERCISE,
      JAVASCRIPT_EXERCISE,
      REACT_EXERCISE,
      SQL_EXERCISE,
      HTML_CSS_EXERCISE
    ];
    
    for (const exercise of exercises) {
      await storage.createExercise({
        lessonId: exercise.lessonId,
        title: exercise.title,
        instructions: exercise.instructions,
        starterCode: exercise.starterCode,
        solution: exercise.solution,
        language: exercise.language
      });
      await wait(100);
    }
    
    console.log("✅ Exercises seeded");
    
    // Create a demo user for testing
    try {
      await storage.createUser({
        username: "demo_user",
        password: "password123",
        displayName: "Demo User",
        level: "Beginner"
      });
      console.log("✅ Demo user created");
    } catch (error) {
      console.log("Demo user already exists, skipping creation");
    }
    
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}