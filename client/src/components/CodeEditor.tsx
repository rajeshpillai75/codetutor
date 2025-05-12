import { useEffect, useRef, useState } from "react";
import { EDITOR_THEMES, EDITOR_LANGUAGE_MODES } from "@/lib/constants";
import AIFeedback from "./AIFeedback";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Terminal, Play, RefreshCw, Save, Settings, ChevronDown, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
  const [currentTheme, setCurrentTheme] = useState("monokai");
  const [fontSize, setFontSize] = useState(14);
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
      // Load Ace and required extensions
      const loadAce = async () => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.4/ace.js";
        script.async = true;
        document.body.appendChild(script);
        
        script.onload = () => {
          // Load language tools for autocompletion
          const langTools = document.createElement("script");
          langTools.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.4/ext-language_tools.js";
          langTools.async = true;
          document.body.appendChild(langTools);
          
          // Load error markers
          const errorMarker = document.createElement("script");
          errorMarker.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.4/ext-error_marker.js";
          errorMarker.async = true;
          document.body.appendChild(errorMarker);
          
          langTools.onload = initializeEditor;
        };
      };
      
      loadAce();
    } else {
      initializeEditor();
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editorRef, language]);

  // Handle language change
  useEffect(() => {
    if (editor) {
      const lang = language.toLowerCase();
      const mode = EDITOR_LANGUAGE_MODES[lang as keyof typeof EDITOR_LANGUAGE_MODES] || 'text';
      editor.session.setMode(`ace/mode/${mode}`);
    }
  }, [language, editor]);

  const initializeEditor = () => {
    if (!editorRef.current || !window.ace) return;

    // Enable languages tools if loaded
    if (window.ace.require) {
      try {
        const langTools = window.ace.require("ace/ext/language_tools");
        window.ace.require("ace/ext/error_marker");
      } catch (e) {
        console.log("Optional Ace extensions not loaded:", e);
      }
    }

    const newEditor = window.ace.edit(editorRef.current);
    newEditor.setTheme(`ace/theme/${currentTheme}`);
    
    // Get language mode safely
    const lang = language.toLowerCase();
    const mode = EDITOR_LANGUAGE_MODES[lang as keyof typeof EDITOR_LANGUAGE_MODES] || 'text';
    newEditor.session.setMode(`ace/mode/${mode}`);
    
    newEditor.setValue(initialCode, -1);
    newEditor.setOptions({
      fontSize: `${fontSize}px`,
      showPrintMargin: false,
      highlightActiveLine: true,
      highlightGutterLine: true,
      showLineNumbers: true,
      tabSize: 2,
      useSoftTabs: true,
      wrap: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      showInvisibles: false,
      fadeFoldWidgets: true,
      showFoldWidgets: true
    });

    newEditor.session.on("change", () => {
      setCode(newEditor.getValue());
    });

    // Focus editor after initialization
    newEditor.focus();
    
    // Create keyboard shortcuts
    newEditor.commands.addCommand({
      name: 'run',
      bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
      exec: () => handleRunCode()
    });
    
    newEditor.commands.addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
      exec: () => console.log('Save operation')
    });

    setEditor(newEditor);
  };

  const handleReset = () => {
    if (editor) {
      editor.setValue(initialCode, -1);
      setCode(initialCode);
    }
  };
  
  const handleThemeChange = (theme: string) => {
    if (editor) {
      editor.setTheme(`ace/theme/${theme}`);
      setCurrentTheme(theme);
    }
  };
  
  const handleFontSizeChange = (size: number) => {
    if (editor) {
      editor.setFontSize(`${size}px`);
      setFontSize(size);
    }
  };

  // Execute code and show output
  const handleRunCode = () => {
    setIsExecuting(true);
    setShowOutput(true);
    setOutput("Executing code...");
    
    if (onExecute) {
      try {
        // Pass the code to the parent component's handler
        onExecute(code);
        
        // Set a timeout to allow the parent component to process the code
        setTimeout(() => {
          setOutput("Execution complete");
        }, 500);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // We'll reset our executing state after a timeout
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
      const response = await apiRequest<any>('/api/ai/code-feedback', {
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

  const handleSendFeedbackQuery = (query: string) => {
    if (query.trim()) {
      setFeedbackQuery(query);
      getFeedback();
    }
  };
  
  const getAnnotations = () => {
    if (!editor || !feedback?.errorDetection) return;
    
    // Set annotations for error markers
    const annotations = feedback.errorDetection.map(error => ({
      row: error.line - 1,
      column: 0,
      text: error.message,
      type: "error"
    }));
    
    editor.session.setAnnotations(annotations);
  };

  // Apply error annotations when feedback changes
  useEffect(() => {
    if (feedback?.errorDetection) {
      getAnnotations();
    }
  }, [feedback]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          <h3 className="font-medium">{title}</h3>
          <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            title="Run Code (Ctrl+Enter)"
            onClick={handleRunCode}
            disabled={isExecuting}
            className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
          >
            {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            Run
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            title="Reset Code"
            onClick={handleReset}
            className="h-8 text-white hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-white hover:bg-gray-700 flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <div className="p-2">
                <h4 className="mb-2 text-sm font-medium">Theme</h4>
                <div className="grid grid-cols-2 gap-1">
                  {EDITOR_THEMES.slice(0, 8).map((theme) => (
                    <Button
                      key={theme}
                      variant="ghost"
                      size="sm"
                      className={`justify-start h-8 px-2 ${currentTheme === theme ? 'bg-accent' : ''}`}
                      onClick={() => handleThemeChange(theme)}
                    >
                      {theme}
                    </Button>
                  ))}
                </div>
                
                <h4 className="mt-4 mb-2 text-sm font-medium">Font Size</h4>
                <div className="flex gap-1">
                  {[12, 14, 16, 18].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      className={`${fontSize === size ? 'bg-accent' : ''}`}
                      onClick={() => handleFontSizeChange(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <h4 className="font-medium text-sm flex items-center">
                <Terminal className="h-4 w-4 mr-2" />
                Output
              </h4>
              <div className="flex items-center gap-2">
                {!isExecuting && output && output.trim() !== '' && (
                  <Badge variant="outline" className="bg-green-600 text-white text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Execution Complete
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 text-xs text-gray-300 hover:text-white"
                  onClick={() => setShowOutput(false)}
                >
                  Hide
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[200px] md:h-full p-2">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {output}
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
      
      {/* AI Feedback Panel has been moved to the PracticeArea component */}
    </div>
  );
}
