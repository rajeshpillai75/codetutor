import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { DEFAULT_COURSES, DEFAULT_LESSONS, PROGRAMMING_LANGUAGES, DEFAULT_EXERCISE } from "@/lib/constants";
import VideoPlayer from "@/components/VideoPlayer";
import CourseContent from "@/components/CourseContent";
import CodeEditor from "@/components/CodeEditor";
import { useQuery } from "@tanstack/react-query";

export default function CoursePage() {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const parsedLessonId = lessonId ? parseInt(lessonId) : 4; // Default to lesson 4 (NumPy Basics)
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the current lesson
  const currentLesson = DEFAULT_LESSONS.find(lesson => lesson.id === parsedLessonId);
  
  // Find the course this lesson belongs to
  const courseId = currentLesson?.courseId || 4; // Default to Python Data Science
  const course = DEFAULT_COURSES.find(course => course.id === courseId);
  
  // Find the language for this course
  const language = PROGRAMMING_LANGUAGES.find(lang => lang.id === course?.languageId);
  
  // Find the lesson index in the course
  const lessonIndex = DEFAULT_LESSONS
    .filter(lesson => lesson.courseId === courseId)
    .findIndex(lesson => lesson.id === parsedLessonId);
  
  // Get next lesson
  const nextLessonIndex = lessonIndex + 1;
  const nextLessons = DEFAULT_LESSONS
    .filter(lesson => lesson.courseId === courseId && lesson.id > parsedLessonId)
    .slice(0, 3);
  
  // Get previous lesson
  const prevLessonIndex = lessonIndex - 1;
  const prevLessonId = prevLessonIndex >= 0 
    ? DEFAULT_LESSONS
        .filter(lesson => lesson.courseId === courseId)
        [prevLessonIndex]?.id 
    : null;
  
  // Get next lesson
  const nextLessonId = nextLessonIndex < DEFAULT_LESSONS.filter(lesson => lesson.courseId === courseId).length 
    ? DEFAULT_LESSONS
        .filter(lesson => lesson.courseId === courseId)
        [nextLessonIndex]?.id 
    : null;
  
  // Find the exercise for this lesson
  const exercise = DEFAULT_EXERCISE.lessonId === parsedLessonId ? DEFAULT_EXERCISE : null;
  
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [parsedLessonId]);
  
  // Define the key concepts for the NumPy Basics lesson
  const keyPoints = [
    "Creating NumPy arrays from Python lists",
    "Array indexing and slicing",
    "Basic mathematical operations on arrays",
    "Broadcasting rules for operations on arrays of different shapes",
    "Universal functions (ufuncs) for efficient element-wise operations"
  ];
  
  // Define additional resources
  const additionalResources = [
    { title: "NumPy Documentation", url: "https://numpy.org/doc/stable/" },
    { title: "Cheat Sheet: NumPy Arrays", url: "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/Numpy_Python_Cheat_Sheet.pdf" },
    { title: "Data Science with Python eBook", url: "https://jakevdp.github.io/PythonDataScienceHandbook/" }
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!currentLesson || !course || !language) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
        <p className="text-gray-600 mb-6">The lesson you are looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <a className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Back to Home
          </a>
        </Link>
      </div>
    );
  }
  
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 md:pt-0 pt-16">
      {/* Learning Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <i className={language.icon} style={{ color: language.color }}></i>
            <h2 className="text-lg font-semibold">{language.name}: {course.title}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>Module {Math.floor(lessonIndex / 3) + 1}</span>
            <span>•</span>
            <span>Lesson {lessonIndex + 1}: {currentLesson.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {prevLessonId && (
            <Link href={`/lessons/${prevLessonId}`}>
              <a className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                <i className="ri-arrow-left-line"></i>
                <span className="hidden sm:inline ml-1">Previous</span>
              </a>
            </Link>
          )}
          {nextLessonId && (
            <Link href={`/lessons/${nextLessonId}`}>
              <a className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600 transition-colors">
                <span className="hidden sm:inline mr-1">Next</span>
                <i className="ri-arrow-right-line"></i>
              </a>
            </Link>
          )}
        </div>
      </div>
      
      {/* Learning Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-5 h-[calc(100vh-theme(space.16)-1px)] md:h-[calc(100vh-65px)]">
        {/* Video and Content Section */}
        <div className="lg:col-span-3 overflow-y-auto border-r">
          {/* Video Section */}
          <VideoPlayer 
            videoUrl={currentLesson.videoUrl} 
            title={currentLesson.title} 
          />
          
          {/* Content and Lesson Materials */}
          <CourseContent 
            title={currentLesson.title} 
            description={currentLesson.description || ""} 
            keyPoints={keyPoints}
            additionalResources={additionalResources}
            nextVideos={nextLessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description || "",
              duration: lesson.duration || 15
            }))}
          />
        </div>
        
        {/* Code Editor Panel */}
        {exercise ? (
          <CodeEditor 
            title={exercise.title}
            language={exercise.language}
            initialCode={exercise.starterCode}
            exerciseId={exercise.id}
          />
        ) : (
          <div className="lg:col-span-2 flex flex-col items-center justify-center h-full bg-gray-100 p-6 text-center">
            <i className="ri-code-box-line text-5xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-medium mb-2">No Practice Exercise</h3>
            <p className="text-gray-600 mb-6">This lesson doesn't have a coding exercise yet.</p>
            <Link href="/practice">
              <a className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Go to Practice Area
              </a>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
