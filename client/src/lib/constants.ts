// Programming languages with their icons and colors
export const PROGRAMMING_LANGUAGES = [
  {
    id: 1,
    name: "JavaScript",
    icon: "ri-javascript-line",
    color: "#f7df1e"
  },
  {
    id: 2,
    name: "Python",
    icon: "ri-python-line",
    color: "#3776ab"
  },
  {
    id: 3,
    name: "React",
    icon: "ri-reactjs-line",
    color: "#61dafb"
  },
  {
    id: 4,
    name: "SQL",
    icon: "ri-database-2-line",
    color: "#4db33d"
  },
  {
    id: 5,
    name: "HTML & CSS",
    icon: "ri-html5-line",
    color: "#e34c26"
  },
  {
    id: 6,
    name: "Java",
    icon: "ri-code-box-line",
    color: "#f89820"
  },
  {
    id: 7,
    name: "C++",
    icon: "ri-code-s-slash-line",
    color: "#00599c"
  }
];

// Default courses for each language
export const DEFAULT_COURSES = [
  // JavaScript Courses
  {
    id: 1,
    languageId: 1,
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming language, including variables, data types, functions, and control flow.",
    level: "Beginner"
  },
  {
    id: 2,
    languageId: 1,
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts and techniques including closures, promises, async/await, and ES6+ features.",
    level: "Advanced"
  },
  {
    id: 10,
    languageId: 1,
    title: "JavaScript DOM Manipulation",
    description: "Learn how to interact with and manipulate the Document Object Model (DOM) using JavaScript.",
    level: "Intermediate"
  },
  
  // Python Courses
  {
    id: 3,
    languageId: 2,
    title: "Python Basics",
    description: "Introduction to Python programming language covering fundamental concepts and syntax.",
    level: "Beginner"
  },
  {
    id: 4,
    languageId: 2,
    title: "Python for Data Science",
    description: "Learn Python for data analysis and visualization using NumPy, Pandas, and Matplotlib.",
    level: "Intermediate"
  },
  
  // React Courses
  {
    id: 5,
    languageId: 3,
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, state, and the component lifecycle.",
    level: "Beginner"
  },
  {
    id: 6,
    languageId: 3,
    title: "Advanced React Patterns",
    description: "Master advanced React patterns, hooks, context API, and state management with Redux.",
    level: "Advanced"
  },
  {
    id: 11,
    languageId: 3,
    title: "React Hooks In Depth",
    description: "A deep dive into React hooks, including custom hooks and real-world applications.",
    level: "Intermediate"
  },
  
  // SQL Courses
  {
    id: 7,
    languageId: 4,
    title: "SQL Basics",
    description: "Learn the fundamentals of SQL for database querying, including SELECT, INSERT, UPDATE, and DELETE statements.",
    level: "Beginner"
  },
  {
    id: 8,
    languageId: 4,
    title: "Advanced SQL Techniques",
    description: "Master advanced SQL concepts including joins, subqueries, indexing, and optimization.",
    level: "Advanced"
  },
  
  // HTML & CSS Courses
  {
    id: 9,
    languageId: 5,
    title: "Web Development Fundamentals",
    description: "Introduction to HTML and CSS for creating responsive and modern websites.",
    level: "Beginner"
  },
  {
    id: 12,
    languageId: 5,
    title: "Advanced CSS Techniques",
    description: "Master CSS Grid, Flexbox, animations, transitions, and modern CSS frameworks.",
    level: "Intermediate"
  }
];

// Default lessons for all courses
export const DEFAULT_LESSONS = [
  // JavaScript Fundamentals course
  {
    id: 101,
    courseId: 1,
    title: "JavaScript Basics",
    description: "Introduction to JavaScript syntax, variables, and data types",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    order: 1,
    duration: 15
  },
  {
    id: 102,
    courseId: 1,
    title: "JavaScript Functions",
    description: "Learn how to create and use functions in JavaScript",
    videoUrl: "https://www.youtube.com/watch?v=xUI5Tsl2JpY",
    order: 2,
    duration: 12
  },
  {
    id: 103,
    courseId: 1,
    title: "Objects and Arrays in JavaScript",
    description: "Working with complex data structures in JavaScript",
    videoUrl: "https://www.youtube.com/watch?v=oigfaZ5ApsM",
    order: 3,
    duration: 18
  },
  
  // JavaScript Advanced course
  {
    id: 201,
    courseId: 2,
    title: "Advanced JavaScript Concepts",
    description: "Closures, prototypes, and the this keyword",
    videoUrl: "https://www.youtube.com/watch?v=Mus_vwhTCq0",
    order: 1,
    duration: 20
  },
  {
    id: 202,
    courseId: 2,
    title: "ES6+ Features",
    description: "Modern JavaScript features including arrow functions, destructuring, and template literals",
    videoUrl: "https://www.youtube.com/watch?v=nZ1DMMsyVyI",
    order: 2,
    duration: 15
  },
  
  // JavaScript DOM course
  {
    id: 301,
    courseId: 10,
    title: "DOM Manipulation Basics",
    description: "Learn how to interact with the Document Object Model",
    videoUrl: "https://www.youtube.com/watch?v=y17RuWkWdn8",
    order: 1,
    duration: 14
  },
  
  // React Fundamentals course
  {
    id: 401,
    courseId: 5,
    title: "React Fundamentals",
    description: "Introduction to React, components, and JSX",
    videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    order: 1,
    duration: 16
  },
  {
    id: 402,
    courseId: 5,
    title: "React State and Props",
    description: "Managing component state and props in React",
    videoUrl: "https://www.youtube.com/watch?v=4ORZ1GmjaMc",
    order: 2,
    duration: 14
  },
  
  // React Advanced course
  {
    id: 501,
    courseId: 6,
    title: "React Advanced Patterns",
    description: "Higher-order components, render props, and context API",
    videoUrl: "https://www.youtube.com/watch?v=3BT_No8o2NA",
    order: 1,
    duration: 18
  },
  
  // React Hooks course
  {
    id: 601,
    courseId: 11,
    title: "React Hooks Introduction",
    description: "Learn how to use useState, useEffect, and other basic hooks",
    videoUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
    order: 1,
    duration: 15
  },
  
  // Python Data Science course
  {
    id: 1,
    courseId: 4,
    title: "Introduction to Data Science",
    description: "Overview of data science and its applications",
    videoUrl: "https://www.youtube.com/watch?v=ua-CiDNNj30",
    order: 1,
    duration: 12
  },
  {
    id: 2,
    courseId: 4,
    title: "Python Libraries for Data Science",
    description: "Introduction to NumPy, Pandas, and Matplotlib",
    videoUrl: "https://www.youtube.com/watch?v=r-uOLxNrNk8",
    order: 2,
    duration: 15
  },
  {
    id: 3,
    courseId: 4,
    title: "Data Cleaning with Pandas",
    description: "Learn how to clean and preprocess data with Pandas",
    videoUrl: "https://www.youtube.com/watch?v=ZyhVh-qRZPA",
    order: 3,
    duration: 18
  },
  {
    id: 4,
    courseId: 4,
    title: "NumPy Basics: Arrays and Operations",
    description: "Learn the fundamentals of NumPy arrays and operations",
    videoUrl: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
    order: 4,
    duration: 14
  },
  {
    id: 5,
    courseId: 4,
    title: "NumPy Advanced Indexing and Filtering",
    description: "Advanced techniques for working with NumPy arrays",
    videoUrl: "https://www.youtube.com/watch?v=1I1iJ1L-_cM",
    order: 5,
    duration: 12
  },
  {
    id: 6,
    courseId: 4,
    title: "NumPy for Data Analysis: Practical Applications",
    description: "Real-world applications of NumPy in data analysis",
    videoUrl: "https://www.youtube.com/watch?v=ZB7BZMhfPgk",
    order: 6,
    duration: 16
  },
  {
    id: 7,
    courseId: 4,
    title: "Integration: NumPy with Pandas",
    description: "How to use NumPy and Pandas together effectively",
    videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
    order: 7,
    duration: 15
  },
  
  // SQL Basics course
  {
    id: 701,
    courseId: 7,
    title: "Introduction to SQL",
    description: "Learn the basics of SQL syntax and database concepts",
    videoUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
    order: 1,
    duration: 16
  },
  {
    id: 702,
    courseId: 7,
    title: "SQL SELECT Statements",
    description: "Master the basic SQL query for retrieving data",
    videoUrl: "https://www.youtube.com/watch?v=9ylj9NR0Lcg",
    order: 2,
    duration: 12
  },
  
  // SQL Advanced Techniques course
  {
    id: 801,
    courseId: 8,
    title: "Advanced SQL Joins",
    description: "Learn how to use INNER, LEFT, RIGHT and FULL OUTER joins",
    videoUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
    order: 1,
    duration: 14
  },
  
  // HTML & CSS Web Fundamentals course
  {
    id: 901,
    courseId: 9,
    title: "HTML Fundamentals",
    description: "Learn the basic structure and elements of HTML",
    videoUrl: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
    order: 1,
    duration: 15
  },
  {
    id: 902,
    courseId: 9,
    title: "CSS Basics",
    description: "Introduction to styling web pages with CSS",
    videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI",
    order: 2,
    duration: 18
  },
  
  // Advanced CSS course
  {
    id: 1001,
    courseId: 12,
    title: "CSS Flexbox Layout",
    description: "Master modern layouts with CSS Flexbox",
    videoUrl: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
    order: 1,
    duration: 13
  },
  {
    id: 1002,
    courseId: 12,
    title: "CSS Grid Layout",
    description: "Create powerful grid-based layouts with CSS Grid",
    videoUrl: "https://www.youtube.com/watch?v=jV8B24rSN5o",
    order: 2,
    duration: 16
  }
];

// Exercise for NumPy Basics lesson
export const DEFAULT_EXERCISE = {
  id: 1,
  lessonId: 4,
  title: "Practice: NumPy Arrays",
  instructions: "Create and manipulate NumPy arrays to understand basic operations.",
  starterCode: `import numpy as np

# Create a NumPy array from a Python list
data = [1, 2, 3, 4, 5, 6]
arr = np.array(data)
print("Original array:", arr)

# Reshape the array
reshaped = arr.reshape(2, 3)
print("\\nReshaped array (2x3):")
print(reshaped)

# Basic operations
print("\\nArray multiplied by 2:")
print(reshaped * 2)

# Create another array for demonstration
arr2 = np.array([[1, 0, 1], 
                 [0, 1, 0]])
print("\\nSecond array:")
print(arr2)

# Element-wise multiplication
print("\\nElement-wise multiplication:")
print(reshaped * arr2)

# Try some advanced operations below:

`,
  solution: `import numpy as np

# Create a NumPy array from a Python list
data = [1, 2, 3, 4, 5, 6]
arr = np.array(data)
print("Original array:", arr)

# Reshape the array
reshaped = arr.reshape(2, 3)
print("\\nReshaped array (2x3):")
print(reshaped)

# Basic operations
print("\\nArray multiplied by 2:")
print(reshaped * 2)

# Create another array for demonstration
arr2 = np.array([[1, 0, 1], 
                 [0, 1, 0]])
print("\\nSecond array:")
print(arr2)

# Element-wise multiplication
print("\\nElement-wise multiplication:")
print(reshaped * arr2)

# Advanced operations
print("\\nMatrix multiplication:")
print(np.matmul(reshaped, arr2.T))

# Sum, mean, and standard deviation
print("\\nSum of all elements:", np.sum(reshaped))
print("Mean value:", np.mean(reshaped))
print("Standard deviation:", np.std(reshaped))

# Creating arrays with specific patterns
print("\\nArray with evenly spaced values:")
print(np.linspace(0, 10, 5))

print("\\nIdentity matrix (3x3):")
print(np.eye(3))
`,
  language: "python"
};

// Editor themes
export const EDITOR_THEMES = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal"
];

// ACE editor languages modes mapping
export const EDITOR_LANGUAGE_MODES = {
  "javascript": "javascript",
  "python": "python",
  "java": "java",
  "c++": "c_cpp",
  "sql": "sql",
  "html": "html",
  "css": "css",
  "php": "php",
  "ruby": "ruby",
  "go": "golang",
  "typescript": "typescript",
  "csharp": "csharp",
  "swift": "swift",
  "kotlin": "kotlin",
  "rust": "rust"
};
