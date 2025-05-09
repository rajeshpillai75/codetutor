import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function CodeExecutionDemo() {
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  
  // Demo code examples
  const demoCode = {
    javascript: `// JavaScript Code Execution Demo
// This file contains sample code to demonstrate the output feature

// Simple variable declarations and operations
const greeting = "Hello, World!";
console.log(greeting);

// Working with arrays
const numbers = [1, 2, 3, 4, 5];
console.log("Original array:", numbers);

// Array methods
const doubled = numbers.map(num => num * 2);
console.log("Doubled array:", doubled);

// Object manipulation
const user = {
  name: "John Doe",
  age: 30,
  occupation: "Developer",
  skills: ["JavaScript", "React", "Node.js"]
};
console.log("User object:", user);

// Conditional logic
if (user.age > 25) {
  console.log(\`\${user.name} is over 25 years old\`);
} else {
  console.log(\`\${user.name} is 25 or younger\`);
}

// Function definition and execution
function calculateArea(width, height) {
  return width * height;
}

const rectangleArea = calculateArea(5, 3);
console.log(\`Rectangle area: \${rectangleArea} square units\`);

// Error handling example
try {
  // This will cause an error
  const result = undefinedVariable + 10;
  console.log(result);
} catch (error) {
  console.log("Error caught:", error.message);
}

console.log("End of demo script");`,
    python: `# Python Code Execution Demo
# This file contains sample code to demonstrate the output feature

# Simple variable declarations and operations
greeting = "Hello, World!"
print(greeting)

# Working with lists
numbers = [1, 2, 3, 4, 5]
print("Original list:", numbers)

# List comprehension
doubled = [num * 2 for num in numbers]
print("Doubled list:", doubled)

# Dictionary manipulation
user = {
  "name": "John Doe",
  "age": 30,
  "occupation": "Developer",
  "skills": ["Python", "Django", "Flask"]
}
print("User dictionary:", user)

# Conditional logic
if user["age"] > 25:
  print(f"{user['name']} is over 25 years old")
else:
  print(f"{user['name']} is 25 or younger")

# Function definition and execution
def calculate_area(width, height):
  return width * height

rectangle_area = calculate_area(5, 3)
print(f"Rectangle area: {rectangle_area} square units")

# Error handling example
try:
  # This will cause an error
  result = undefined_variable + 10
  print(result)
except Exception as error:
  print("Error caught:", str(error))

# List operations
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
print("Fruits list after append:", fruits)

print("End of demo script")`,
    sql: `-- SQL Code Execution Demo
-- This file contains sample SQL queries

-- Simple SELECT query
SELECT 'Hello, World!' AS greeting;

-- Creating a temporary table
CREATE TABLE IF NOT EXISTS temp_users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  age INTEGER,
  occupation TEXT
);

-- Inserting data
INSERT INTO temp_users (id, name, age, occupation)
VALUES 
  (1, 'John Doe', 30, 'Developer'),
  (2, 'Jane Smith', 28, 'Designer'),
  (3, 'Bob Johnson', 35, 'Manager');

-- Selecting all users
SELECT * FROM temp_users;

-- Filtering with WHERE
SELECT name, age FROM temp_users
WHERE age > 29;

-- Using aggregate functions
SELECT 
  occupation,
  COUNT(*) as count,
  AVG(age) as average_age
FROM temp_users
GROUP BY occupation;`,
    html: `<!-- HTML & CSS Code Demo -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .card-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }
    
    .card-content {
      color: #666;
    }
    
    .btn {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <h1>HTML & CSS Demo</h1>
  
  <div class="card">
    <div class="card-title">User Profile</div>
    <div class="card-content">
      <p>Name: John Doe</p>
      <p>Age: 30</p>
      <p>Occupation: Developer</p>
    </div>
    <button class="btn">View Details</button>
  </div>
  
  <div class="card">
    <div class="card-title">Product Info</div>
    <div class="card-content">
      <p>Product: Example Product</p>
      <p>Price: $99.99</p>
      <p>In Stock: Yes</p>
    </div>
    <button class="btn">Add to Cart</button>
  </div>
</body>
</html>`,
  };

  const handleExecuteCode = (code: string) => {
    setOutput(`Executing ${language} code...\n`);
    // Since the web browser can only execute JavaScript in this environment,
    // we'll simulate the execution for non-JS languages
    if (language === 'javascript') {
      try {
        // Capture console.log output
        const originalConsoleLog = console.log;
        let capturedOutput = "";
        
        console.log = (...args) => {
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
          
          capturedOutput += formatted + '\n';
        };
        
        // Execute the code
        const executeFunction = new Function(code);
        executeFunction();
        
        // Restore console.log
        console.log = originalConsoleLog;
        
        setOutput(capturedOutput || "[No output generated]");
      } catch (err) {
        if (err instanceof Error) {
          setOutput(`Error: ${err.message}`);
        } else {
          setOutput(`Error: ${String(err)}`);
        }
      }
    } else {
      // For non-JavaScript languages, simulate output based on print/log statements
      let simulatedOutput = `[Code execution for ${language} is simulated in this environment]\n\n`;
      
      if (language === 'python') {
        // Extract print statements from Python code
        const printPattern = /print\((.*)\)/g;
        const matches = code.match(printPattern);
        
        if (matches) {
          matches.forEach(match => {
            try {
              // Simple simulation of python print
              const content = match.substring(6, match.length - 1);
              simulatedOutput += `>>> ${content}\n`;
            } catch (e) {
              // Ignore parsing errors
            }
          });
        }
      } else if (language === 'sql') {
        // Simulate SQL results
        simulatedOutput += "Query executed successfully\n\n";
        
        if (code.includes("SELECT")) {
          simulatedOutput += "Results:\n";
          simulatedOutput += "--------\n";
          
          if (code.includes("'Hello, World!'")) {
            simulatedOutput += "greeting\n--------\nHello, World!\n\n";
          }
          
          if (code.includes("SELECT * FROM temp_users")) {
            simulatedOutput += "id | name        | age | occupation\n";
            simulatedOutput += "----------------------------\n";
            simulatedOutput += "1  | John Doe    | 30  | Developer\n";
            simulatedOutput += "2  | Jane Smith  | 28  | Designer\n";
            simulatedOutput += "3  | Bob Johnson | 35  | Manager\n\n";
          }
          
          if (code.includes("WHERE age > 29")) {
            simulatedOutput += "name        | age\n";
            simulatedOutput += "----------------\n";
            simulatedOutput += "John Doe    | 30\n";
            simulatedOutput += "Bob Johnson | 35\n\n";
          }
          
          if (code.includes("GROUP BY")) {
            simulatedOutput += "occupation | count | average_age\n";
            simulatedOutput += "-------------------------------\n";
            simulatedOutput += "Developer  | 1     | 30.0\n";
            simulatedOutput += "Designer   | 1     | 28.0\n";
            simulatedOutput += "Manager    | 1     | 35.0\n\n";
          }
        }
        
        if (code.includes("CREATE TABLE")) {
          simulatedOutput += "Table created successfully\n\n";
        }
        
        if (code.includes("INSERT INTO")) {
          simulatedOutput += "3 rows inserted successfully\n\n";
        }
      } else if (language === 'html') {
        simulatedOutput = "HTML and CSS code would be rendered in a browser environment.\n\n";
        simulatedOutput += "This would create:\n";
        simulatedOutput += "- A page with a heading 'HTML & CSS Demo'\n";
        simulatedOutput += "- Two styled cards with user and product information\n";
        simulatedOutput += "- Each card has a button with hover effects\n";
      }
      
      setOutput(simulatedOutput);
    }
  };

  // Get the correct initial code based on language
  const getInitialCode = () => {
    return demoCode[language as keyof typeof demoCode] || "// No demo code available for this language";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Code Execution Demo</h1>
      <p className="text-gray-600 mb-8">
        This demo shows how the code execution feature works in the Practice Area.
        Select a language and run the code to see the output.
      </p>
      
      <div className="mb-8">
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
                <SelectItem value="sql">SQL</SelectItem>
                <SelectItem value="html">HTML & CSS</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">
            {language.charAt(0).toUpperCase() + language.slice(1)} Code Execution Demo
          </h2>
          <p className="text-gray-600 mt-1">
            Run the code to see the execution output. Only JavaScript can truly execute in the browser, other languages are simulated.
          </p>
        </div>
        
        <div className="h-[600px] overflow-auto">
          <CodeEditor 
            title={`${language.charAt(0).toUpperCase() + language.slice(1)} Demo`}
            language={language === "html" ? "html" : language}
            initialCode={getInitialCode()}
            onExecute={handleExecuteCode}
          />
        </div>
      </div>
    </div>
  );
}