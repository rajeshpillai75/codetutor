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
    name: "Java",
    icon: "ri-code-box-line",
    color: "#f89820"
  },
  {
    id: 6,
    name: "C++",
    icon: "ri-code-s-slash-line",
    color: "#00599c"
  }
];

// Default courses for each language
export const DEFAULT_COURSES = [
  {
    id: 1,
    languageId: 1,
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming language",
    level: "Beginner"
  },
  {
    id: 2,
    languageId: 1,
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts and techniques",
    level: "Advanced"
  },
  {
    id: 3,
    languageId: 2,
    title: "Python Basics",
    description: "Introduction to Python programming language",
    level: "Beginner"
  },
  {
    id: 4,
    languageId: 2,
    title: "Python for Data Science",
    description: "Learn Python for data analysis and visualization",
    level: "Intermediate"
  }
];

// Default lessons for Python Data Science course
export const DEFAULT_LESSONS = [
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
