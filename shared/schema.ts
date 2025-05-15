import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  level: text("level").default("Beginner"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  level: true,
});

// Programming languages table
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertLanguageSchema = createInsertSchema(languages).pick({
  name: true,
  icon: true,
  color: true,
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  languageId: integer("language_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  level: text("level").default("Beginner"),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  languageId: true,
  title: true,
  description: true,
  level: true,
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  order: integer("order").notNull(),
  duration: integer("duration"),
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  courseId: true,
  title: true,
  description: true,
  videoUrl: true,
  order: true,
  duration: true,
});

// Code exercises table
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  title: text("title").notNull(),
  instructions: text("instructions"),
  starterCode: text("starter_code"),
  solution: text("solution"),
  language: text("language").notNull(), // programming language for the editor
});

export const insertExerciseSchema = createInsertSchema(exercises).pick({
  lessonId: true,
  title: true,
  instructions: true,
  starterCode: true,
  solution: true,
  language: true,
});

// User progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completed: boolean("completed").default(false),
  lastAccessedAt: text("last_accessed_at"),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  lessonId: true,
  completed: true,
  lastAccessedAt: true,
});

// Code submissions table
export const codeSubmissions = pgTable("code_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  code: text("code").notNull(),
  feedback: jsonb("feedback"),
  submittedAt: text("submitted_at").notNull(),
});

export const insertCodeSubmissionSchema = createInsertSchema(codeSubmissions).pick({
  userId: true,
  exerciseId: true,
  code: true,
  feedback: true,
  submittedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type CodeSubmission = typeof codeSubmissions.$inferSelect;
export type InsertCodeSubmission = z.infer<typeof insertCodeSubmissionSchema>;

// Saved Programs table
export const savedPrograms = pgTable("saved_programs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  language: text("language").notNull(),
  code: text("code").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  description: text("description"),
  tags: text("tags").array(),
});

export const insertSavedProgramSchema = createInsertSchema(savedPrograms).pick({
  userId: true,
  name: true,
  language: true,
  code: true,
  createdAt: true,
  updatedAt: true,
  description: true,
  tags: true,
});

export type SavedProgram = typeof savedPrograms.$inferSelect;
export type InsertSavedProgram = z.infer<typeof insertSavedProgramSchema>;
