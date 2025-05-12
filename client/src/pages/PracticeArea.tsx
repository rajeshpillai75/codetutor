import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import AIFeedback from "@/components/AIFeedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { PROGRAMMING_LANGUAGES, EDITOR_LANGUAGE_MODES } from "@/lib/constants";
import { 
  JAVASCRIPT_EXERCISE, 
  REACT_EXERCISE, 
  SQL_EXERCISE, 
  HTML_CSS_EXERCISE 
} from "@/lib/additional-lessons";

// Type definition for exercise
interface Exercise {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  prompt: string;
  code: string;
}

export default function PracticeArea() {
  const [language, setLanguage] = useState<string>("javascript");
  const [difficulty, setDifficulty] = useState<string>("beginner");
  const [exerciseType, setExerciseType] = useState<string>("dataStructures");
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>("");
  
  // Code feedback state
  const [feedback, setFeedback] = useState<{
    feedback: string;
    suggestions: string[];
    bestPractices: string[];
    errorDetection?: { line: number; message: string }[];
  } | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  
  // Handle feedback query
  const handleSendFeedbackQuery = async (query: string) => {
    if (!currentCode) return;
    
    setFeedbackLoading(true);
    try {
      const res = await apiRequest("POST", "/api/ai/code-feedback", {
        body: {
          code: currentCode,
          language: language === "html-css" ? "html" : language === "react" ? "javascript" : language,
          exerciseId: selectedExercise?.id,
          query
        }
      });
      
      const data = await res.json();
      setFeedback(data);
    } catch (error) {
      console.error("Error getting code feedback:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };
  
  // Language-specific exercises
  const languageExercises = {
    javascript: [
      {
        id: "js_vars",
        title: "Variables and Data Types",
        type: "general",
        difficulty: "beginner",
        prompt: "Practice working with JavaScript variables, primitive types, and type conversion.",
        code: JAVASCRIPT_EXERCISE.starterCode
      },
      {
        id: "js_functions",
        title: "Functions and Scope",
        type: "general",
        difficulty: "beginner",
        prompt: "Create functions using different syntaxes and understand variable scope.",
        code: `// JavaScript Functions Practice

// Function Declaration
function add(a, b) {
  return a + b;
}

// Function Expression
const subtract = function(a, b) {
  return a - b;
};

// Arrow Function
const multiply = (a, b) => a * b;

// Test your functions
console.log("2 + 3 =", add(2, 3));
console.log("5 - 2 =", subtract(5, 2));
console.log("4 * 6 =", multiply(4, 6));

// Practice creating a function that calculates the area of a circle
// formula: area = π * radius^2

// Your code here:
function calculateCircleArea(radius) {
  // Write your implementation
}

console.log("Area of circle with radius 5:", calculateCircleArea(5));
`
      },
      {
        id: "js_arrays",
        title: "Arrays and Objects",
        type: "dataStructures",
        difficulty: "beginner",
        prompt: "Work with arrays and objects, practice array methods and object manipulation.",
        code: `// JavaScript Arrays and Objects Practice

// Sample array
let fruits = ['apple', 'banana', 'orange', 'grape'];
console.log("Original fruits array:", fruits);

// Array methods
console.log("Array length:", fruits.length);
console.log("Index of 'orange':", fruits.indexOf('orange'));

// Add and remove elements
fruits.push('kiwi');
console.log("After push:", fruits);

fruits.pop();
console.log("After pop:", fruits);

// For-of loop
console.log("Iterating with for-of:");
for (let fruit of fruits) {
  console.log("- " + fruit);
}

// Sample object
let person = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  email: 'john@example.com'
};
console.log("Person object:", person);

// Accessing object properties
console.log("First name:", person.firstName);
console.log("Age:", person['age']);

// Practice: Create an array of objects and filter it
// Create an array of student objects with properties: name, grade, subject
// Then filter to find all students with grade > 80

// Your code here:
let students = [];

// Filter students with grade > 80
let highGradeStudents = [];

console.log("High grade students:", highGradeStudents);
`
      },
      {
        id: "js_algo_sort",
        title: "Sorting Algorithms",
        type: "algorithms",
        difficulty: "intermediate",
        prompt: "Implement and understand sorting algorithms like bubble sort.",
        code: `// JavaScript Sorting Algorithms Practice

// Sample array to sort
let numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);

// Built-in sort
let sorted = [...numbers].sort((a, b) => a - b);
console.log("Using built-in sort:", sorted);

// Implement Bubble Sort
function bubbleSort(arr) {
  // Make a copy to avoid modifying the original
  let result = [...arr];
  
  // Your implementation here
  
  return result;
}

console.log("Using bubble sort:", bubbleSort(numbers));

// Implement Selection Sort (challenge)
function selectionSort(arr) {
  // Your implementation here
}

console.log("Using selection sort:", selectionSort(numbers));
`
      }
    ],
    python: [
      {
        id: "py_basics",
        title: "Python Basics",
        type: "general",
        difficulty: "beginner",
        prompt: "Practice Python syntax, variables, and basic operations.",
        code: `# Python Basics Practice

# Variables and data types
name = "Python Learner"
age = 25
is_student = True
height = 1.75

print(f"Name: {name}, Type: {type(name)}")
print(f"Age: {age}, Type: {type(age)}")
print(f"Is Student: {is_student}, Type: {type(is_student)}")
print(f"Height: {height}, Type: {type(height)}")

# Basic operations
x = 10
y = 3

print(f"{x} + {y} = {x + y}")
print(f"{x} - {y} = {x - y}")
print(f"{x} * {y} = {x * y}")
print(f"{x} / {y} = {x / y}")  # Float division
print(f"{x} // {y} = {x // y}")  # Integer division
print(f"{x} % {y} = {x % y}")  # Modulus
print(f"{x} ** {y} = {x ** y}")  # Exponentiation

# Strings
greeting = "Hello, World!"
print(greeting.upper())
print(greeting.lower())
print(greeting.replace("Hello", "Hi"))
print(greeting[0:5])  # Slicing

# Write a function that calculates the area of a rectangle
# Your code here:

def calculate_rectangle_area(length, width):
    # Implement this function
    pass

# Test your function
print(f"Rectangle area (5x3): {calculate_rectangle_area(5, 3)}")
`
      },
      {
        id: "py_data_structures",
        title: "Python Data Structures",
        type: "dataStructures",
        difficulty: "beginner",
        prompt: "Work with Python lists, dictionaries, tuples, and sets.",
        code: `# Python Data Structures Practice

# Lists
fruits = ["apple", "banana", "orange", "grape"]
print("Original list:", fruits)

# List operations
fruits.append("kiwi")
print("After append:", fruits)

fruits.insert(1, "mango")
print("After insert:", fruits)

fruits.remove("orange")
print("After remove:", fruits)

# List comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print("Original numbers:", numbers)
print("Squared numbers:", squares)

# Dictionary
student = {
    "name": "Alex",
    "age": 22,
    "courses": ["Math", "Computer Science", "Physics"],
    "grades": {"Math": 95, "Computer Science": 90, "Physics": 85}
}

print("Student:", student)
print("Name:", student["name"])
print("Courses:", student["courses"])
print("Math grade:", student["grades"]["Math"])

# Add a new key-value pair
student["year"] = "Senior"
print("Updated student:", student)

# Tuples and Sets
coordinates = (10, 20)  # Tuple - immutable
unique_numbers = {1, 2, 3, 4, 4, 5, 5}  # Set - unique values
print("Coordinates (tuple):", coordinates)
print("Unique numbers (set):", unique_numbers)

# Practice: Create a function that counts the frequency of each word in a text
# Your code here:

def word_frequency(text):
    # Implement this function
    pass

sample_text = "the quick brown fox jumps over the lazy dog"
print("Word frequency:", word_frequency(sample_text))
`
      },
      {
        id: "py_numpy",
        title: "NumPy Basics",
        type: "dataStructures",
        difficulty: "intermediate",
        prompt: "Learn to work with NumPy arrays and operations.",
        code: `# NumPy Practice
import numpy as np

# Creating arrays
array1 = np.array([1, 2, 3, 4, 5])
array2 = np.array([[1, 2, 3], [4, 5, 6]])

print("1D Array:", array1)
print("2D Array:\n", array2)

# Array attributes
print("Shape of array2:", array2.shape)
print("Dimensions:", array2.ndim)
print("Data type:", array2.dtype)

# Array operations
print("Array1 + 5:", array1 + 5)
print("Array1 * 2:", array1 * 2)
print("Array1 squared:", array1 ** 2)

# Math functions
print("Mean of array1:", np.mean(array1))
print("Sum of array1:", np.sum(array1))
print("Max of array1:", np.max(array1))

# Reshaping
reshaped = array1.reshape(1, 5)
print("Reshaped array1:\n", reshaped)

# Create a 3x3 identity matrix
identity = np.eye(3)
print("Identity matrix:\n", identity)

# Create an array of random numbers
random_array = np.random.rand(3, 3)
print("Random array:\n", random_array)

# Practice: Create a function that calculates the dot product of two vectors
# Your code here:

def dot_product(vector1, vector2):
    # Implement this function
    pass

v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])
print("Dot product:", dot_product(v1, v2))
`
      }
    ],
    react: [
      {
        id: "react_components",
        title: "React Components",
        type: "general",
        difficulty: "beginner",
        prompt: "Practice creating React components and understanding props.",
        code: REACT_EXERCISE.starterCode
      },
      {
        id: "react_hooks",
        title: "React Hooks",
        type: "general",
        difficulty: "intermediate",
        prompt: "Learn to use React hooks like useState and useEffect.",
        code: `// React Hooks Practice
// This is a simplified React environment for practice

// Component using useState hook
function Counter() {
  // useState hook (simulated)
  let count = 0;
  const setCount = (newCount) => {
    count = newCount;
    console.log(\`Count updated to: \${count}\`);
    return count;
  };

  // Simulating button click handlers
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  console.log("Counter rendered with count:", count);
  
  // Simulate JSX
  return \`
    <div>
      <h2>Count: \${count}</h2>
      <button onClick=\${increment}>+</button>
      <button onClick=\${decrement}>-</button>
      <button onClick=\${reset}>Reset</button>
    </div>
  \`;
}

// Component with multiple state variables
function UserForm() {
  // Multiple state hooks (simulated)
  let firstName = "";
  let lastName = "";
  let email = "";
  
  const setFirstName = (value) => {
    firstName = value;
    console.log(\`First name updated to: \${firstName}\`);
  };
  
  const setLastName = (value) => {
    lastName = value;
    console.log(\`Last name updated to: \${lastName}\`);
  };
  
  const setEmail = (value) => {
    email = value;
    console.log(\`Email updated to: \${email}\`);
  };
  
  // Simulate handling form submission
  const handleSubmit = () => {
    console.log("Form submitted with:", { firstName, lastName, email });
  };
  
  // Simulate JSX
  return \`
    <form onSubmit=\${handleSubmit}>
      <div>
        <label>First Name:</label>
        <input 
          value="\${firstName}"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input 
          value="\${lastName}"
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input 
          value="\${email}"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  \`;
}

// Simulate component rendering
console.log("--- Counter Component ---");
console.log(Counter());

console.log("\\n--- UserForm Component ---");
console.log(UserForm());

// Practice: Create a component that uses the useEffect hook
// Your code here:
function Timer() {
  // Implement your component with useEffect
}

console.log("\\n--- Timer Component ---");
console.log(Timer ? Timer() : "Timer component not implemented");
`
      }
    ],
    sql: [
      {
        id: "sql_basics",
        title: "SQL Basics",
        type: "general",
        difficulty: "beginner",
        prompt: "Practice basic SQL queries including SELECT, INSERT, UPDATE, and DELETE.",
        code: SQL_EXERCISE.starterCode
      },
      {
        id: "sql_joins",
        title: "SQL Joins",
        type: "general",
        difficulty: "intermediate",
        prompt: "Practice SQL joins to combine data from multiple tables.",
        code: `-- SQL Joins Practice

-- Create tables
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    city VARCHAR(50)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(10, 2),
    status VARCHAR(20)
);

-- Insert sample data into customers
INSERT INTO customers VALUES (1, 'John', 'Doe', 'john@example.com', 'New York');
INSERT INTO customers VALUES (2, 'Jane', 'Smith', 'jane@example.com', 'Los Angeles');
INSERT INTO customers VALUES (3, 'Robert', 'Johnson', 'robert@example.com', 'Chicago');
INSERT INTO customers VALUES (4, 'Emily', 'Williams', 'emily@example.com', 'Houston');
INSERT INTO customers VALUES (5, 'Michael', 'Brown', 'michael@example.com', 'Phoenix');

-- Insert sample data into orders
INSERT INTO orders VALUES (101, 1, '2023-01-15', 150.75, 'Completed');
INSERT INTO orders VALUES (102, 3, '2023-01-16', 89.99, 'Completed');
INSERT INTO orders VALUES (103, 1, '2023-01-20', 45.50, 'Processing');
INSERT INTO orders VALUES (104, 2, '2023-01-25', 210.25, 'Completed');
INSERT INTO orders VALUES (105, 5, '2023-01-29', 75.00, 'Processing');

-- INNER JOIN: Get all orders with customer information
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.order_date, o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;

-- LEFT JOIN: Get all customers and their orders (if any)
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.order_date, o.total_amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- Practice: Write a query to find customers who haven't placed any orders
-- Your code here:


-- Practice: Write a query to find the total amount spent by each customer
-- Your code here:

`
      }
    ],
    html: [
      {
        id: "html_basics",
        title: "HTML & CSS Basics",
        type: "general",
        difficulty: "beginner",
        prompt: "Practice HTML structure and CSS styling.",
        code: HTML_CSS_EXERCISE.starterCode
      },
      {
        id: "html_layout",
        title: "CSS Layout",
        type: "general",
        difficulty: "intermediate",
        prompt: "Practice CSS Flexbox and Grid for page layouts.",
        code: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* Reset styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    
    /* Container for the page */
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    /* Header styles */
    header {
      background-color: #f8f9fa;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    /* Flexbox layout for navbar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: bold;
    }
    
    .nav-links {
      display: flex;
      gap: 20px;
      list-style: none;
    }
    
    /* Main content area with Grid layout */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .card {
      background-color: #f8f9fa;
      border-radius: 5px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* PRACTICE: Complete the footer styles using Flexbox */
    footer {
      /* Add your footer styles here using Flexbox */
    }
    
    /* PRACTICE: Add responsive styles for mobile devices */
    @media (max-width: 768px) {
      /* Make the grid single column on mobile */
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <nav class="navbar">
        <div class="logo">MyWebsite</div>
        <ul class="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
    
    <main>
      <div class="content-grid">
        <div class="card">
          <h3>Card 1</h3>
          <p>This card uses CSS Grid layout for positioning.</p>
        </div>
        <div class="card">
          <h3>Card 2</h3>
          <p>Responsive design ensures proper display on all devices.</p>
        </div>
        <div class="card">
          <h3>Card 3</h3>
          <p>Flexbox and Grid are powerful CSS layout systems.</p>
        </div>
      </div>
    </main>
    
    <footer>
      <div class="footer-content">
        <div class="footer-logo">MyWebsite</div>
        <div class="footer-copyright">© 2023 MyWebsite. All rights reserved.</div>
        <div class="footer-social">
          <span>Facebook</span>
          <span>Twitter</span>
          <span>Instagram</span>
        </div>
      </div>
    </footer>
  </div>
</body>
</html>
`
      }
    ]
  };

  // Helper function to format language name for display
  const formatLanguageName = (lang: string): string => {
    if (lang === "html-css") return "HTML & CSS";
    if (lang === "react") return "React";
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  // Remove the duplicate interface definition

  // Filter exercises based on current selections
  useEffect(() => {
    // Map language value to object property
    let langKey = language;
    if (language === "html-css") langKey = "html";
    
    // Get exercises for the selected language
    const exercises = languageExercises[langKey as keyof typeof languageExercises] || [];
    
    // Filter based on difficulty and type
    const filtered = exercises.filter((ex: Exercise) => {
      const difficultyMatch = ex.difficulty === difficulty;
      const typeMatch = exerciseType === "all" || ex.type === exerciseType;
      return difficultyMatch && (exerciseType === "all" || typeMatch);
    });
    
    setAvailableExercises(filtered);
    
    // Set a default selected exercise if available
    if (filtered.length > 0) {
      setSelectedExercise(filtered[0]);
    } else {
      setSelectedExercise(null);
    }
  }, [language, difficulty, exerciseType]);
  
  // Get default code or selected exercise code
  // Execute the code and show the output
  const executeCode = (code: string) => {
    setIsRunning(true);
    setCodeOutput("");
    setCurrentCode(code);
    
    // Create a safe way to capture console.log output
    let output = "";
    const originalConsoleLog = console.log;
    
    const appendOutput = (...args: any[]) => {
      const formatted = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      output += formatted + '\n';
    };
    
    // We need to replace the global console.log before executing
    console.log = appendOutput;
    
    setTimeout(() => {
      try {
        // Execute the code differently based on language
        if (language === 'javascript') {
          // Create a function from the code and execute it
          const executeFunction = new Function(code);
          executeFunction();
        } else {
          // For non-JavaScript languages, we'll simulate execution
          output += `[Code execution for ${language} is simulated in this environment]\n\n`;
          
          // Extract console.log or print statements for display
          if (language === 'python') {
            // More robust regex to capture Python print statements with different argument types
            const printRegex = /print\s*\((.*?)\)/g;
            const printMatches = Array.from(code.matchAll(printRegex));
            
            // Extract variable assignments to simulate basic variable execution
            const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/gm;
            const variableMatches = Array.from(code.matchAll(variableRegex));
            const variables: Record<string, string> = {};
            
            // Store variable values for reference
            variableMatches.forEach(match => {
              if (match[1] && match[2]) {
                const varName = match[1].trim();
                const varValue = match[2].trim();
                variables[varName] = varValue;
              }
            });
            
            output += "Python Output:\n";
            
            if (printMatches && printMatches.length > 0) {
              printMatches.forEach(match => {
                if (match[1]) {
                  // Handle different Python argument types
                  let content = match[1].trim();
                  
                  // Check if it's a string (with quotes)
                  if ((content.startsWith('"') && content.endsWith('"')) || 
                      (content.startsWith("'") && content.endsWith("'"))) {
                    // Remove the quotes for display
                    content = content.substring(1, content.length - 1);
                  } 
                  // Check if it's a variable reference
                  else if (variables[content]) {
                    // For variables, show the variable name and its value
                    let value = variables[content];
                    
                    // If the value is a string literal, clean it
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                      value = value.substring(1, value.length - 1);
                    }
                    
                    content = `${content} (${value})`;
                  }
                  // Try to evaluate simple math expressions
                  else if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(content)) {
                    try {
                      // Replace Python-specific math operators with JavaScript equivalents
                      const jsExpression = content.replace(/\/\//g, '/');
                      
                      // Only evaluate if it's a safe mathematical expression
                      const result = eval(jsExpression);
                      if (typeof result === 'number') {
                        content = `${content} = ${result}`;
                      }
                    } catch (e) {
                      // If evaluation fails, just use the original content
                    }
                  }
                  
                  // Variables and expressions would just show as is
                  output += `>>> ${content}\n`;
                }
              });
            } else {
              output += "No print statements found in the code.\n";
            }
            
            // Show variable assignments
            if (Object.keys(variables).length > 0) {
              output += "\nVariables defined:\n";
              Object.entries(variables).forEach(([name, value]) => {
                output += `${name} = ${value}\n`;
              });
            }
          } else if (language === 'react') {
            const logLines = code.match(/console\.log\((.*)\)/g);
            if (logLines) {
              logLines.forEach(line => {
                const content = line.substring(12, line.length - 1);
                output += `> ${content}\n`;
              });
            }
          }
        }
        
        if (output.trim() === '') {
          output = '[No output generated]';
        }
        
      } catch (err) {
        if (err instanceof Error) {
          output += `Error: ${err.message}`;
        } else {
          output += `Error: ${String(err)}`;
        }
      } finally {
        // Restore the original console.log
        console.log = originalConsoleLog;
        setCodeOutput(output);
        setIsRunning(false);
      }
    }, 100); // Adding a short timeout to allow state updates to render
  };

  const getCode = (): string => {
    if (selectedExercise) {
      return selectedExercise.code;
    }
    
    // Fallback to generic starter code
    const genericCode: Record<string, string> = {
      python: `# Python Practice Area\n# No specific exercise selected\n\n# Write your code here\nprint("Hello, Python world!")`,
      javascript: `// JavaScript Practice Area\n// No specific exercise selected\n\n// Write your code here\nconsole.log("Hello, JavaScript world!");`,
      java: `// Java Practice Area\n// No specific exercise selected\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java world!");\n    }\n}`,
      sql: `-- SQL Practice Area\n-- No specific exercise selected\n\n-- Write your queries here\nSELECT 'Hello, SQL world!' AS greeting;`,
      react: `// React Practice Area\n// No specific exercise selected\n\n// Write your code here\nconsole.log("Hello, React world!");`,
      "html-css": `<!-- HTML & CSS Practice Area -->\n<!-- No specific exercise selected -->\n\n<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* Your CSS here */\n  </style>\n</head>\n<body>\n  <h1>Hello, HTML & CSS world!</h1>\n</body>\n</html>`
    };
    
    return genericCode[language] || `// Write your code here`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Practice Area</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Programming Language</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={language} 
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
                <SelectItem value="html-css">HTML & CSS</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Difficulty Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={difficulty} 
              onValueChange={setDifficulty}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Exercise Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={exerciseType} 
              onValueChange={setExerciseType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Exercise Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General Coding</SelectItem>
                <SelectItem value="dataStructures">Data Structures</SelectItem>
                <SelectItem value="algorithms">Algorithms</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      {/* Available Exercises Selector */}
      {availableExercises.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Available Exercises</h2>
            <p className="text-gray-600 mt-1">
              Select an exercise based on your chosen language and difficulty level
            </p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableExercises.map(exercise => (
              <Card 
                key={exercise.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedExercise?.id === exercise.id ? 'border-primary border-2' : ''}`}
                onClick={() => setSelectedExercise(exercise)}
              >
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg">{exercise.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{exercise.prompt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Exercises Available</h2>
          <p className="text-gray-600">
            No exercises match your current selection. Try changing the language, difficulty, or exercise type.
          </p>
        </div>
      )}
      
      {/* Code Editor */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">
            {selectedExercise ? selectedExercise.title : `${formatLanguageName(language)} Practice`}
          </h2>
          <p className="text-gray-600 mt-1">
            {selectedExercise ? selectedExercise.prompt : "Practice coding in this environment."}
          </p>
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <div className="h-[500px]">
            <CodeEditor 
              title={selectedExercise ? selectedExercise.title : `${formatLanguageName(language)} Practice`}
              language={language === "html-css" ? "html" : language === "react" ? "javascript" : language}
              initialCode={getCode()}
              onExecute={executeCode}
            />
          </div>
          
          {/* Direct Output Panel */}
          {codeOutput && (
            <div className="border-t border-gray-200 bg-gray-900 text-white p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm flex items-center">
                  <Terminal className="h-4 w-4 mr-2" />
                  Execution Output
                </h4>
                {!isRunning && (
                  <Badge variant="outline" className="bg-green-600 text-white text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Execution Complete
                  </Badge>
                )}
              </div>
              <ScrollArea className="h-[150px]">
                <pre className="font-mono text-sm whitespace-pre-wrap p-2">
                  {codeOutput}
                </pre>
              </ScrollArea>
            </div>
          )}

          {/* Code Tutor AI Feedback Panel */}
          <AIFeedback 
            feedback={feedback}
            loading={feedbackLoading}
            onSendQuery={handleSendFeedbackQuery}
          />
        </div>
      </div>
      
      {/* Learning Resources - temporarily hidden as requested */}
    </div>
  );
}
