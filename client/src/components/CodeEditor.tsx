import { useEffect, useRef, useState } from "react";
import { EDITOR_THEMES, EDITOR_LANGUAGE_MODES } from "@/lib/constants";
import AIFeedback from "./AIFeedback";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Terminal, Play, RefreshCw, Save, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeEditorProps {
  title: string;
  language: string;
  initialCode: string;
  exerciseId?: number;
  onExecute?: (code: string) => void;
}

declare global {
  interface Window {
    ace: any;
  }
}

export default function CodeEditor({ title, language, initialCode, exerciseId, onExecute }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [code, setCode] = useState(initialCode);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedback, setFeedback] = useState<{
    feedback: string;
    suggestions: string[];
    bestPractices: string[];
    errorDetection?: { line: number; message: string }[];
  } | null>(null);
  const [feedbackQuery, setFeedbackQuery] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    // Load Ace Editor from CDN if it's not already loaded
    if (typeof window.ace === "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.4/ace.js";
      script.async = true;
      script.onload = initializeEditor;
      document.body.appendChild(script);
    } else {
      initializeEditor();
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editorRef, language]);

  const initializeEditor = () => {
    if (!editorRef.current || !window.ace) return;

    const newEditor = window.ace.edit(editorRef.current);
    newEditor.setTheme("ace/theme/monokai");
    
    // Get language mode safely
    const lang = language.toLowerCase();
    const mode = EDITOR_LANGUAGE_MODES[lang as keyof typeof EDITOR_LANGUAGE_MODES] || 'text';
    newEditor.session.setMode(`ace/mode/${mode}`);
    
    newEditor.setValue(initialCode, -1);
    newEditor.setOptions({
      fontSize: "14px",
      showPrintMargin: false,
      highlightActiveLine: true,
      showLineNumbers: true,
      tabSize: 4,
      useSoftTabs: true
    });

    newEditor.session.on("change", () => {
      setCode(newEditor.getValue());
    });

    setEditor(newEditor);
  };

  const handleReset = () => {
    if (editor) {
      editor.setValue(initialCode, -1);
    }
  };

  const handleSettingsToggle = () => {
    // Open a settings dropdown or modal
    const themeIndex = Math.floor(Math.random() * EDITOR_THEMES.length);
    if (editor) {
      editor.setTheme(`ace/theme/${EDITOR_THEMES[themeIndex]}`);
    }
  };

  // Execute code and show output
  const handleRunCode = () => {
    setIsExecuting(true);
    setShowOutput(true);
    setOutput("Executing code...");
    
    if (onExecute) {
      // Pass the code to the parent component's handler
      onExecute(code);
      
      // We need to rely on the parent to update state
      // Since we don't have direct access to the output here,
      // we'll reset our executing state after a timeout
      setTimeout(() => {
        setIsExecuting(false);
      }, 1500);
      return;
    }
    
    // Fallback execution if no onExecute prop is provided
    setTimeout(() => {
      try {
        // Simple execution for JavaScript only
        if (language.toLowerCase() === 'javascript') {
          const originalConsoleLog = console.log;
          let output = "";
          
          // Capture console.log output
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
            
            output += formatted + '\n';
          };
          
          // Execute the code in a try-catch block
          try {
            // Create a function from the code and execute it
            const executeFunction = new Function(code);
            executeFunction();
            
            if (output.trim() === '') {
              output = '[No output generated]';
            }
          } catch (err) {
            if (err instanceof Error) {
              output = `Error: ${err.message}`;
            } else {
              output = `Error: ${String(err)}`;
            }
          }
          
          // Restore the original console.log
          console.log = originalConsoleLog;
          setOutput(output);
        } else {
          // For non-JavaScript languages - provide more detailed simulation
          if (language.toLowerCase() === 'python') {
            // Parse Python print statements for a better simulation
            const printRegex = /print\s*\((.*?)\)/g;
            const printMatches = Array.from(code.matchAll(printRegex));
            
            // Track variable assignments to provide more realistic output
            const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/gm;
            const variableMatches = Array.from(code.matchAll(variableRegex));
            const variables: Record<string, string> = {};
            
            // Build simple variable tracking
            variableMatches.forEach(match => {
              if (match[1] && match[2]) {
                const varName = match[1].trim();
                const varValue = match[2].trim();
                variables[varName] = varValue;
              }
            });
            
            let simulatedOutput = `[Python code execution is simulated]\n\n`;
            
            // Handle print statements with variables
            if (printMatches && printMatches.length > 0) {
              simulatedOutput += "Output:\n";
              printMatches.forEach(match => {
                if (match[1]) {
                  let content = match[1].trim();
                  
                  // Simple handling of string literals
                  if ((content.startsWith('"') && content.endsWith('"')) || 
                      (content.startsWith("'") && content.endsWith("'"))) {
                    content = content.substring(1, content.length - 1);
                  }
                  // Check if it's a variable reference
                  else if (variables[content]) {
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
                  
                  simulatedOutput += `>>> ${content}\n`;
                }
              });
            } else {
              simulatedOutput += "No print statements found to execute.\n";
            }
            
            // Show variable assignments for better understanding
            if (Object.keys(variables).length > 0) {
              simulatedOutput += "\nVariables defined:\n";
              Object.entries(variables).forEach(([name, value]) => {
                simulatedOutput += `${name} = ${value}\n`;
              });
            }
            
            setOutput(simulatedOutput);
          } else {
            // For other languages
            setOutput(`[Code execution for ${language} is simulated in this environment]`);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setOutput(`Error: ${err.message}`);
        } else {
          setOutput(`Error: ${String(err)}`);
        }
      } finally {
        setIsExecuting(false);
      }
    }, 500);
  };

  const getFeedback = async () => {
    if (!code) return;

    setFeedbackLoading(true);
    try {
      const response = await apiRequest<any>('/api/code-feedback', {
        method: 'POST',
        data: {
          code,
          language,
          exerciseId
        }
      });
      setFeedback(response);
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSendFeedbackQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && feedbackQuery.trim()) {
      getFeedback();
      setFeedbackQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            title="Run Code"
            onClick={handleRunCode}
            disabled={isExecuting}
            className="h-8 text-white"
          >
            {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span className="ml-2">Run</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            title="Reset Code"
            onClick={handleReset}
            className="h-8 text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            title="Settings"
            onClick={handleSettingsToggle}
            className="h-8 text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Split view for editor and output */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 min-h-[300px]">
          <div ref={editorRef} className="h-full w-full"></div>
        </div>
        
        {/* Output Panel (conditionally rendered) */}
        {showOutput && (
          <div className="border-t md:border-t-0 md:border-l border-gray-200 w-full md:w-1/2 bg-gray-900 text-white">
            <div className="flex items-center justify-between p-2 border-b border-gray-700">
              <h4 className="font-medium text-sm">Output</h4>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 text-xs text-gray-300 hover:text-white"
                onClick={() => setShowOutput(false)}
              >
                Hide
              </Button>
            </div>
            <ScrollArea className="h-[200px] md:h-full p-2">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {output}
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
      
      {/* AI Feedback Panel */}
      <AIFeedback 
        feedback={feedback}
        loading={feedbackLoading}
        onSendQuery={(query) => {
          setFeedbackQuery(query);
          getFeedback();
        }}
      />
    </div>
  );
}
