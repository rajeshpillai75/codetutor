import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROGRAMMING_LANGUAGES, EDITOR_LANGUAGE_MODES } from "@/lib/constants";

export default function PracticeArea() {
  const [language, setLanguage] = useState("python");
  const [difficulty, setDifficulty] = useState("beginner");
  const [exerciseType, setExerciseType] = useState("dataStructures");
  
  // Default starter code for different languages
  const starterCode = {
    python: `# Python Practice Area
# Try writing some code below

def greet(name):
    return f"Hello, {name}!"

# Test your function
print(greet("Learner"))

# Try creating a list and iterating through it
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(num * 2)
`,
    javascript: `// JavaScript Practice Area
// Try writing some code below

function greet(name) {
    return \`Hello, \${name}!\`;
}

// Test your function
console.log(greet("Learner"));

// Try creating an array and mapping through it
const numbers = [1, 2, 3, 4, 5];
numbers.map(num => console.log(num * 2));
`,
    java: `// Java Practice Area
// Try writing some code below

public class Main {
    public static void main(String[] args) {
        System.out.println(greet("Learner"));
        
        // Try creating an array and iterating through it
        int[] numbers = {1, 2, 3, 4, 5};
        for (int num : numbers) {
            System.out.println(num * 2);
        }
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}
`,
    sql: `-- SQL Practice Area
-- Try writing some SQL queries below

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER
);

-- Insert some data
INSERT INTO users (id, name, email, age) VALUES (1, 'John Doe', 'john@example.com', 28);
INSERT INTO users (id, name, email, age) VALUES (2, 'Jane Smith', 'jane@example.com', 32);

-- Query the data
SELECT * FROM users WHERE age > 25;
`
  };
  
  // Template exercises based on type and difficulty
  const getExercisePrompt = () => {
    if (exerciseType === "dataStructures") {
      if (difficulty === "beginner") {
        return "Practice creating and manipulating basic data structures.";
      } else if (difficulty === "intermediate") {
        return "Implement more complex data structure operations like sorting and searching.";
      } else {
        return "Create advanced data structures and algorithms for efficiency.";
      }
    } else if (exerciseType === "algorithms") {
      if (difficulty === "beginner") {
        return "Practice implementing simple algorithms like linear search or bubble sort.";
      } else if (difficulty === "intermediate") {
        return "Implement more efficient algorithms like binary search or merge sort.";
      } else {
        return "Tackle complex algorithmic challenges and optimization problems.";
      }
    } else {
      if (difficulty === "beginner") {
        return "Practice basic functions and control flow.";
      } else if (difficulty === "intermediate") {
        return "Implement classes and object-oriented programming concepts.";
      } else {
        return "Create complex applications with advanced language features.";
      }
    }
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
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
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
                <SelectItem value="dataStructures">Data Structures</SelectItem>
                <SelectItem value="algorithms">Algorithms</SelectItem>
                <SelectItem value="general">General Coding</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Exercise: {language.charAt(0).toUpperCase() + language.slice(1)} {exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)}</h2>
          <p className="text-gray-600 mt-1">{getExercisePrompt()}</p>
        </div>
        
        <div className="h-[600px]">
          <CodeEditor 
            title={`${language.toUpperCase()} Practice`}
            language={language}
            initialCode={starterCode[language] || "// Start coding here"}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Learning Resources</h2>
        </div>
        
        <Tabs defaultValue="docs" className="p-4">
          <TabsList className="mb-4">
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="docs" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Official Documentation</h3>
              <ul className="space-y-2">
                {language === "python" && (
                  <>
                    <li><a href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Python Documentation</a></li>
                    <li><a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NumPy Documentation</a></li>
                    <li><a href="https://pandas.pydata.org/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pandas Documentation</a></li>
                  </>
                )}
                {language === "javascript" && (
                  <>
                    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MDN JavaScript Documentation</a></li>
                    <li><a href="https://nodejs.org/en/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Node.js Documentation</a></li>
                  </>
                )}
                {language === "java" && (
                  <>
                    <li><a href="https://docs.oracle.com/en/java/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Java Documentation</a></li>
                    <li><a href="https://docs.oracle.com/javase/tutorial/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Oracle Java Tutorials</a></li>
                  </>
                )}
                {language === "sql" && (
                  <>
                    <li><a href="https://dev.mysql.com/doc/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MySQL Documentation</a></li>
                    <li><a href="https://www.postgresql.org/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PostgreSQL Documentation</a></li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="tutorials" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Recommended Tutorials</h3>
              <ul className="space-y-2">
                {language === "python" && (
                  <>
                    <li><a href="https://www.youtube.com/watch?v=_uQrJ0TkZlc" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Python for Beginners (YouTube)</a></li>
                    <li><a href="https://www.youtube.com/watch?v=QUT1VHiLmmI" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NumPy Tutorial (YouTube)</a></li>
                  </>
                )}
                {language === "javascript" && (
                  <>
                    <li><a href="https://www.youtube.com/watch?v=PkZNo7MFNFg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JavaScript Crash Course (YouTube)</a></li>
                    <li><a href="https://www.youtube.com/watch?v=W6NZfCO5SIk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JavaScript for Beginners (YouTube)</a></li>
                  </>
                )}
                {language === "java" && (
                  <>
                    <li><a href="https://www.youtube.com/watch?v=eIrMbAQSU34" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Java Tutorial for Beginners (YouTube)</a></li>
                  </>
                )}
                {language === "sql" && (
                  <>
                    <li><a href="https://www.youtube.com/watch?v=HXV3zeQKqGY" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SQL Tutorial (YouTube)</a></li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Code Examples</h3>
              <ul className="space-y-2">
                {language === "python" && (
                  <>
                    <li><a href="https://github.com/geekcomputers/Python" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Python Examples Repository (GitHub)</a></li>
                    <li><a href="https://github.com/rougier/numpy-100" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">100 NumPy Exercises (GitHub)</a></li>
                  </>
                )}
                {language === "javascript" && (
                  <>
                    <li><a href="https://github.com/30-seconds/30-seconds-of-code" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">30 Seconds of Code (GitHub)</a></li>
                  </>
                )}
                {language === "java" && (
                  <>
                    <li><a href="https://github.com/iluwatar/java-design-patterns" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Java Design Patterns (GitHub)</a></li>
                  </>
                )}
                {language === "sql" && (
                  <>
                    <li><a href="https://github.com/WebDevSimplified/Learn-SQL" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SQL Examples (GitHub)</a></li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
