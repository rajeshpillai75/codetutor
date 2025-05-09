import { storage } from "./storage";
import { PROGRAMMING_LANGUAGES, DEFAULT_COURSES, DEFAULT_LESSONS, DEFAULT_EXERCISE } from "@/lib/constants";

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
    
    // Seed lessons
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
    console.log("✅ Lessons seeded");
    
    // Seed exercise
    await storage.createExercise({
      lessonId: DEFAULT_EXERCISE.lessonId,
      title: DEFAULT_EXERCISE.title,
      instructions: DEFAULT_EXERCISE.instructions,
      starterCode: DEFAULT_EXERCISE.starterCode,
      solution: DEFAULT_EXERCISE.solution,
      language: DEFAULT_EXERCISE.language
    });
    console.log("✅ Exercise seeded");
    
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}