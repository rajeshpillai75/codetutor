import {
  users, 
  type User, 
  type InsertUser,
  languages,
  type Language,
  type InsertLanguage,
  courses,
  type Course,
  type InsertCourse,
  lessons,
  type Lesson,
  type InsertLesson,
  exercises,
  type Exercise,
  type InsertExercise,
  userProgress,
  type UserProgress,
  type InsertUserProgress,
  codeSubmissions,
  type CodeSubmission,
  type InsertCodeSubmission,
  savedPrograms,
  type SavedProgram,
  type InsertSavedProgram
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Language operations
  getAllLanguages(): Promise<Language[]>;
  getLanguage(id: number): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByLanguage(languageId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Lesson operations
  getAllLessons(): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Exercise operations
  getAllExercises(): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  getExercisesByLesson(lessonId: number): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // User progress operations
  getAllUserProgress(): Promise<UserProgress[]>;
  getUserProgressByUser(userId: number): Promise<UserProgress[]>;
  getUserProgressByLesson(lessonId: number): Promise<UserProgress[]>;
  getUserLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, completed: boolean): Promise<UserProgress>;
  
  // Code submissions operations
  getAllCodeSubmissions(): Promise<CodeSubmission[]>;
  getCodeSubmission(id: number): Promise<CodeSubmission | undefined>;
  getCodeSubmissionsByUser(userId: number): Promise<CodeSubmission[]>;
  getCodeSubmissionsByExercise(exerciseId: number): Promise<CodeSubmission[]>;
  createCodeSubmission(submission: InsertCodeSubmission): Promise<CodeSubmission>;
  
  // Saved programs operations
  getAllSavedPrograms(): Promise<SavedProgram[]>;
  getSavedProgram(id: number): Promise<SavedProgram | undefined>;
  getSavedProgramsByUser(userId: number): Promise<SavedProgram[]>;
  getSavedProgramsByLanguage(userId: number, language: string): Promise<SavedProgram[]>;
  createSavedProgram(program: InsertSavedProgram): Promise<SavedProgram>;
  updateSavedProgram(id: number, program: Partial<InsertSavedProgram>): Promise<SavedProgram>;
  deleteSavedProgram(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Language operations
  async getAllLanguages(): Promise<Language[]> {
    return await db.select().from(languages);
  }
  
  async getLanguage(id: number): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.id, id));
    return language;
  }
  
  async createLanguage(insertLanguage: InsertLanguage): Promise<Language> {
    const [language] = await db
      .insert(languages)
      .values(insertLanguage)
      .returning();
    return language;
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }
  
  async getCoursesByLanguage(languageId: number): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.languageId, languageId));
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }
  
  // Lesson operations
  async getAllLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons);
  }
  
  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }
  
  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.courseId, courseId));
  }
  
  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db
      .insert(lessons)
      .values(insertLesson)
      .returning();
    return lesson;
  }
  
  // Exercise operations
  async getAllExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }
  
  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }
  
  async getExercisesByLesson(lessonId: number): Promise<Exercise[]> {
    return await db.select().from(exercises).where(eq(exercises.lessonId, lessonId));
  }
  
  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db
      .insert(exercises)
      .values(insertExercise)
      .returning();
    return exercise;
  }
  
  // User progress operations
  async getAllUserProgress(): Promise<UserProgress[]> {
    return await db.select().from(userProgress);
  }
  
  async getUserProgressByUser(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }
  
  async getUserProgressByLesson(lessonId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.lessonId, lessonId));
  }
  
  async getUserLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.lessonId, lessonId)
      )
    );
    return progress;
  }
  
  async createUserProgress(insertUserProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertUserProgress)
      .returning();
    return progress;
  }
  
  async updateUserProgress(id: number, completed: boolean): Promise<UserProgress> {
    const [progress] = await db
      .update(userProgress)
      .set({ completed })
      .where(eq(userProgress.id, id))
      .returning();
    return progress;
  }
  
  // Code submissions operations
  async getAllCodeSubmissions(): Promise<CodeSubmission[]> {
    return await db.select().from(codeSubmissions);
  }
  
  async getCodeSubmission(id: number): Promise<CodeSubmission | undefined> {
    const [submission] = await db.select().from(codeSubmissions).where(eq(codeSubmissions.id, id));
    return submission;
  }
  
  async getCodeSubmissionsByUser(userId: number): Promise<CodeSubmission[]> {
    return await db.select().from(codeSubmissions).where(eq(codeSubmissions.userId, userId));
  }
  
  async getCodeSubmissionsByExercise(exerciseId: number): Promise<CodeSubmission[]> {
    return await db.select().from(codeSubmissions).where(eq(codeSubmissions.exerciseId, exerciseId));
  }
  
  async createCodeSubmission(insertCodeSubmission: InsertCodeSubmission): Promise<CodeSubmission> {
    const [submission] = await db
      .insert(codeSubmissions)
      .values(insertCodeSubmission)
      .returning();
    return submission;
  }

  // Saved programs operations
  async getAllSavedPrograms(): Promise<SavedProgram[]> {
    return await db.select().from(savedPrograms);
  }
  
  async getSavedProgram(id: number): Promise<SavedProgram | undefined> {
    const [program] = await db.select().from(savedPrograms).where(eq(savedPrograms.id, id));
    return program;
  }
  
  async getSavedProgramsByUser(userId: number): Promise<SavedProgram[]> {
    return await db.select().from(savedPrograms).where(eq(savedPrograms.userId, userId));
  }
  
  async getSavedProgramsByLanguage(userId: number, language: string): Promise<SavedProgram[]> {
    return await db.select().from(savedPrograms).where(
      and(
        eq(savedPrograms.userId, userId),
        eq(savedPrograms.language, language)
      )
    );
  }
  
  async createSavedProgram(insertSavedProgram: InsertSavedProgram): Promise<SavedProgram> {
    const [program] = await db
      .insert(savedPrograms)
      .values(insertSavedProgram)
      .returning();
    return program;
  }
  
  async updateSavedProgram(id: number, programUpdate: Partial<InsertSavedProgram>): Promise<SavedProgram> {
    const [updatedProgram] = await db
      .update(savedPrograms)
      .set(programUpdate)
      .where(eq(savedPrograms.id, id))
      .returning();
    return updatedProgram;
  }
  
  async deleteSavedProgram(id: number): Promise<void> {
    await db
      .delete(savedPrograms)
      .where(eq(savedPrograms.id, id));
  }
}

export const storage = new DatabaseStorage();
