import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal, CheckCircle, Cpu } from "lucide-react";
import { apiPost } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import the AceEditor component
import AceEditor from "react-ace";

// Import ace builds 
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";

type FeedbackType = {
  feedback: string;
  suggestions: string[];
  bestPractices: string[];
  errorDetection?: { line: number; message: string }[];
};

const SAMPLE_EXERCISES = {
  javascript: [
    {
      title: "Array Sum",
      description: "Write a function that calculates the sum of all elements in an array.",
      initialCode: `function arraySum(arr) {
  // Your code here
}

// Test your function
const numbers = [1, 2, 3, 4, 5];
console.log(arraySum(numbers)); // Should output 15`
    },
    {
      title: "Find Maximum",
      description: "Write a function that finds the maximum value in an array of numbers.",
      initialCode: `function findMax(arr) {
  // Your code here
}

// Test your function
const numbers = [3, 7, 2, 9, 5];
console.log(findMax(numbers)); // Should output 9`
    }
  ],
  python: [
    {
      title: "String Reversal",
      description: "Write a function that reverses a string.",
      initialCode: `def reverse_string(s):
    # Your code here
    pass

# Test your function
print(reverse_string("hello")) # Should output "olleh"`
    },
    {
      title: "Count Vowels",
      description: "Write a function that counts the number of vowels in a string.",
      initialCode: `def count_vowels(s):
    # Your code here
    pass

# Test your function
print(count_vowels("hello world")) # Should output 3`
    }
  ],
  java: [
    {
      title: "Factorial",
      description: "Write a function to calculate the factorial of a number.",
      initialCode: `public class Factorial {
    public static int factorial(int n) {
        // Your code here
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(factorial(5)); // Should output 120
    }
}`
    }
  ],
  "html-css": [
    {
      title: "Basic HTML Structure",
      description: "Create a simple HTML page with a heading, paragraph, and image.",
      initialCode: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <!-- Your code here -->
    
</body>
</html>`
    }
  ]
};

export default function SimplifiedPracticeArea() {
  const [language, setLanguage] = useState<string>("javascript");
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>("");
  const [editorTheme, setEditorTheme] = useState<string>("monokai");
  const [selectedModel, setSelectedModel] = useState<"openai" | "llama3">("openai");
  
  // Code feedback state
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackQuery, setFeedbackQuery] = useState("");
  
  // Set the initial exercise based on language
  useEffect(() => {
    if (language && SAMPLE_EXERCISES[language as keyof typeof SAMPLE_EXERCISES] && 
        SAMPLE_EXERCISES[language as keyof typeof SAMPLE_EXERCISES].length > 0) {
      const firstExercise = SAMPLE_EXERCISES[language as keyof typeof SAMPLE_EXERCISES][0];
      setSelectedExercise(firstExercise);
      setCurrentCode(firstExercise.initialCode);
    } else {
      setSelectedExercise(null);
      setCurrentCode("");
    }
  }, [language]);
  
  // Execute code function
  const executeCode = (code: string) => {
    setIsRunning(true);
    setCodeOutput("");
    setCurrentCode(code);
    // Clear previous feedback and query when running new code
    setFeedback(null);
    setFeedbackQuery("");
    
    // Create a safe way to capture console.log output
    let output = "";
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const formatted = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      ).join(' ');
      output += formatted + '\\n';
      originalConsoleLog.apply(console, args);
    };
    
    try {
      // Use different execution strategies based on language
      if (language === "javascript") {
        // For JavaScript, directly evaluate in the browser (with safety measures)
        const result = new Function(code + '; return "";')();
        setCodeOutput(output);
      } else if (language === "python") {
        // For Python, we'd need a backend service like Pyodide or API
        setCodeOutput("Python execution requires backend integration.\nOutput would appear here.");
      } else if (language === "java") {
        // For Java, we'd need a backend compilation service
        setCodeOutput("Java execution requires backend integration.\nOutput would appear here.");
      } else if (language === "html-css") {
        // For HTML/CSS, create a preview
        setCodeOutput("HTML preview would be shown here.");
      } else {
        setCodeOutput(`Execution for ${language} is not supported in this demo.`);
      }
    } catch (error: unknown) {
      // Safe way to log unknown errors
      if (error instanceof Error) {
        console.error("Code execution error:", error.message);
      } else {
        console.error("Code execution error: Unknown error type");
      }
      
      if (error instanceof Error) {
        setCodeOutput(`Error: ${error.message}`);
      } else {
        setCodeOutput(`Error: An unexpected error occurred`);
      }
    } finally {
      console.log = originalConsoleLog;
      setIsRunning(false);
    }
  };
  
  // Handle feedback query
  const handleSendFeedbackQuery = async () => {
    if (!currentCode || !feedbackQuery.trim()) return;
    
    setFeedbackLoading(true);
    try {
      const data = await apiPost("/api/ai/code-feedback", {
        code: currentCode,
        language: language === "html-css" ? "html" : language === "react" ? "javascript" : language,
        query: feedbackQuery,
        model: selectedModel
      });
      
      setFeedback(data);
    } catch (error) {
      console.error("Error getting code feedback:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };
  
  // Map language names to Ace editor modes
  const getEditorMode = () => {
    const modeMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      java: "java",
      "html-css": "html",
    };
    return language && modeMap[language as keyof typeof modeMap] 
      ? modeMap[language as keyof typeof modeMap] 
      : "javascript";
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        {/* Left Side: Exercise Selection & Editor */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          {/* Language Selection */}
          <div className="flex justify-between items-center">
            <Tabs 
              defaultValue={language} 
              onValueChange={value => setLanguage(value)}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="java">Java</TabsTrigger>
                <TabsTrigger value="html-css">HTML/CSS</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Editor Theme Selection */}
            <select 
              className="bg-background border rounded-md px-2 py-1 text-sm"
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
            >
              <option value="monokai">Monokai</option>
              <option value="github">GitHub</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="twilight">Twilight</option>
            </select>
          </div>
          
          {/* Exercise Selection */}
          <div className="flex flex-wrap gap-2">
            {language && SAMPLE_EXERCISES[language as keyof typeof SAMPLE_EXERCISES]?.map((exercise: { title: string; description: string; initialCode: string }, index: number) => (
              <button
                key={index}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedExercise === exercise 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => {
                  setSelectedExercise(exercise);
                  setCurrentCode(exercise.initialCode);
                  setCodeOutput("");
                  // Clear feedback and query when changing exercises
                  setFeedback(null);
                  setFeedbackQuery("");
                }}
              >
                {exercise.title}
              </button>
            ))}
          </div>
          
          {/* Exercise Details */}
          {selectedExercise && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className="font-normal">{language}</Badge>
                  {selectedExercise.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm">{selectedExercise.description}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Code Editor */}
          <Card className="flex-1 flex flex-col min-h-[400px]">
            <CardContent className="p-0 flex-1">
              <AceEditor
                mode={getEditorMode()}
                theme={editorTheme}
                value={currentCode}
                onChange={setCurrentCode}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                width="100%"
                height="100%"
                fontSize={14}
              />
            </CardContent>
          </Card>
          
          {/* Run Button */}
          <Button 
            onClick={() => executeCode(currentCode)}
            disabled={isRunning}
            className="w-full"
          >
            <Terminal className="mr-2 h-4 w-4" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
          
          {/* Output Area */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-md">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[150px] w-full rounded border p-4 bg-black text-white font-mono">
                {codeOutput ? (
                  <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                ) : (
                  <div className="text-gray-400 italic">Run your code to see output here</div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side: AI Feedback */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="py-3">
              <CardTitle className="text-md">Code Tutor AI</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 flex-1 flex flex-col">
              {/* Input for asking about code */}
              <div className="space-y-2">
                <Textarea 
                  placeholder="Ask about your code..."
                  value={feedbackQuery}
                  onChange={(e) => setFeedbackQuery(e.target.value)}
                  className="resize-none h-20"
                />
                <Button 
                  onClick={handleSendFeedbackQuery} 
                  disabled={feedbackLoading || !feedbackQuery.trim()}
                  className="w-full"
                >
                  {feedbackLoading ? "Getting Feedback..." : "Get AI Feedback"}
                </Button>
              </div>
              
              <ScrollArea className="flex-1">
                {feedback ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Overall Feedback</h3>
                      <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
                    </div>
                    
                    {feedback.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Suggestions</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {feedback.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feedback.bestPractices.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Best Practices</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {feedback.bestPractices.map((practice, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feedback.errorDetection && feedback.errorDetection.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Error Detection</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {feedback.errorDetection.map((error, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              Line {error.line}: {error.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-center">
                      Ask for feedback about your code to get personalized suggestions and advice.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}