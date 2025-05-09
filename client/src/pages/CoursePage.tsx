import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { DEFAULT_COURSES, DEFAULT_LESSONS, PROGRAMMING_LANGUAGES, DEFAULT_EXERCISE } from "@/lib/constants";
import VideoPlayer from "@/components/VideoPlayer";
import CourseContent from "@/components/CourseContent";
import CodeEditor from "@/components/CodeEditor";
import { useQuery } from "@tanstack/react-query";
import { useLessonProgress } from "@/hooks/use-lesson-progress";
import LessonCompletionButton from "@/components/LessonCompletionButton";

export default function CoursePage() {
  const params = useParams<{ lessonId?: string; courseId?: string }>();
  const [, navigate] = useLocation();
  
  // Handle both routes - either by lessonId or courseId
  let parsedLessonId: number;
  
  if (params.lessonId) {
    // If we're on the /lessons/:lessonId route
    parsedLessonId = parseInt(params.lessonId);
  } else if (params.courseId) {
    // If we're on the /courses/:courseId route, find the first lesson of this course
    const courseId = parseInt(params.courseId);
    const firstLessonForCourse = DEFAULT_LESSONS
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order)[0];
      
    if (firstLessonForCourse) {
      parsedLessonId = firstLessonForCourse.id;
    } else {
      parsedLessonId = 4; // Default fallback
    }
  } else {
    parsedLessonId = 4; // Default to lesson 4 (NumPy Basics) if no params
  }
  // In a real app, this would come from user authentication
  const userId = 1; // Hard-coded for demo purposes
  
  // Get lesson progress tracking
  const { isCompleted, markAsCompleted } = useLessonProgress(userId, parsedLessonId);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the current lesson
  const currentLesson = DEFAULT_LESSONS.find(lesson => lesson.id === parsedLessonId);
  
  // Find the course this lesson belongs to
  const courseId = currentLesson?.courseId || 4; // Default to Python Data Science
  const course = DEFAULT_COURSES.find(course => course.id === courseId);
  
  // Find the language for this course
  const language = PROGRAMMING_LANGUAGES.find(lang => lang.id === course?.languageId);
  
  console.log("Current course:", course?.title, "Language ID:", language?.id, "courseId:", courseId);
  
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
  
  // Define language-specific key concepts and resources based on the language
  const getLanguageSpecificContent = (languageId: number = 1) => {
    console.log("Getting content for language ID:", languageId);
    
    // JavaScript (languageId: 1)
    if (languageId === 1) {
      return {
        keyPoints: [
          "JavaScript variables and data types",
          "Functions and arrow functions",
          "Working with arrays and objects",
          "Asynchronous JavaScript with Promises",
          "Modern ES6+ features and best practices"
        ],
        additionalResources: [
          { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
          { title: "JavaScript.info", url: "https://javascript.info/" },
          { title: "Eloquent JavaScript eBook", url: "https://eloquentjavascript.net/" }
        ]
      };
    }
    
    // Python (languageId: 2)
    else if (languageId === 2) {
      return {
        keyPoints: [
          "Creating NumPy arrays from Python lists",
          "Array indexing and slicing",
          "Basic mathematical operations on arrays",
          "Broadcasting rules for operations on arrays of different shapes",
          "Universal functions (ufuncs) for efficient element-wise operations"
        ],
        additionalResources: [
          { title: "NumPy Documentation", url: "https://numpy.org/doc/stable/" },
          { title: "Cheat Sheet: NumPy Arrays", url: "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/Numpy_Python_Cheat_Sheet.pdf" },
          { title: "Data Science with Python eBook", url: "https://jakevdp.github.io/PythonDataScienceHandbook/" }
        ]
      };
    }
    
    // React (languageId: 3)
    else if (languageId === 3) {
      return {
        keyPoints: [
          "React component lifecycle and hooks",
          "State management with useState and useReducer",
          "Side effects with useEffect",
          "Context API for state sharing",
          "Performance optimization with useMemo and useCallback"
        ],
        additionalResources: [
          { title: "React Official Documentation", url: "https://react.dev/" },
          { title: "React Hooks Cheatsheet", url: "https://usehooks.com/" },
          { title: "Thinking in React", url: "https://react.dev/learn/thinking-in-react" }
        ]
      };
    }
    
    // SQL (languageId: 4)
    else if (languageId === 4) {
      return {
        keyPoints: [
          "SQL query structure and syntax",
          "Filtering data with WHERE clauses",
          "Joining tables with INNER, LEFT, and RIGHT joins",
          "Aggregating data with GROUP BY",
          "Optimizing queries with indexes and execution plans"
        ],
        additionalResources: [
          { title: "SQL Tutorial - W3Schools", url: "https://www.w3schools.com/sql/" },
          { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" },
          { title: "SQL Performance Explained", url: "https://use-the-index-luke.com/" }
        ]
      };
    }
    
    // HTML/CSS (languageId: 5)
    else if (languageId === 5) {
      return {
        keyPoints: [
          "HTML5 semantic elements and best practices",
          "CSS selectors and specificity",
          "Flexbox and Grid layout systems",
          "Responsive design with media queries",
          "CSS animations and transitions"
        ],
        additionalResources: [
          { title: "MDN HTML Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
          { title: "CSS-Tricks Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
          { title: "Web.dev Learn CSS", url: "https://web.dev/learn/css/" }
        ]
      };
    }
    
    // Default content (fallback)
    return {
      keyPoints: [
        "Programming fundamentals",
        "Data structures and algorithms",
        "Problem-solving techniques",
        "Debugging and testing",
        "Best practices and code organization"
      ],
      additionalResources: [
        { title: "Learn to Code Resources", url: "https://www.freecodecamp.org/" },
        { title: "Programming Tutorials", url: "https://www.w3schools.com/" },
        { title: "Computer Science Basics", url: "https://www.khanacademy.org/computing/computer-science" }
      ]
    };
  };
  
  // Make sure we're getting the correct language ID
  console.log("Current language:", language?.name, "ID:", language?.id);
  
  // Get content based on the current language
  const { keyPoints, additionalResources } = getLanguageSpecificContent(language?.id);
  
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
        <div 
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
          onClick={() => navigate('/')}
        >
          Back to Home
        </div>
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
            <div 
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/lessons/${prevLessonId}`)}
            >
              <i className="ri-arrow-left-line"></i>
              <span className="hidden sm:inline ml-1">Previous</span>
            </div>
          )}
          {nextLessonId && (
            <div 
              className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={() => navigate(`/lessons/${nextLessonId}`)}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <i className="ri-arrow-right-line"></i>
            </div>
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
          
          {/* Lesson Completion Button */}
          <div className="p-6 border-t">
            <LessonCompletionButton 
              userId={userId}
              lessonId={parsedLessonId}
              isCompleted={isCompleted}
              onComplete={() => {
                // Optional: Show a success message or handle completion event
                if (nextLessonId) {
                  setTimeout(() => {
                    navigate(`/lessons/${nextLessonId}`);
                  }, 2000);
                }
              }}
            />
          </div>
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
            <div 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={() => navigate('/practice')}
            >
              Go to Practice Area
            </div>
          </div>
        )}
      </div>
    </main>
  );
}