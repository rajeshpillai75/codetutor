import { useEffect, useRef, useState } from "react";
import { EDITOR_THEMES, EDITOR_LANGUAGE_MODES } from "@/lib/constants";
import AIFeedback from "./AIFeedback";
import { apiRequest } from "@/lib/queryClient";

interface CodeEditorProps {
  title: string;
  language: string;
  initialCode: string;
  exerciseId?: number;
}

declare global {
  interface Window {
    ace: any;
  }
}

export default function CodeEditor({ title, language, initialCode, exerciseId }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [code, setCode] = useState(initialCode);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    feedback: string;
    suggestions: string[];
    bestPractices: string[];
    errorDetection?: { line: number; message: string }[];
  } | null>(null);
  const [feedbackQuery, setFeedbackQuery] = useState("");

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
    newEditor.session.setMode(`ace/mode/${EDITOR_LANGUAGE_MODES[language.toLowerCase()] || 'text'}`);
    newEditor.setValue(initialCode, -1);
    newEditor.setOptions({
      fontSize: "14px",
      showPrintMargin: false,
      highlightActiveLine: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
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

  const getFeedback = async () => {
    if (!code) return;

    setFeedbackLoading(true);
    try {
      const response = await apiRequest('POST', '/api/code-feedback', {
        code,
        language,
        exerciseId
      });
      const data = await response.json();
      setFeedback(data);
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
    <div className="lg:col-span-2 flex flex-col h-full">
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-terminal-box-line"></i>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="text-gray-300 hover:text-white transition-colors" 
            title="Run Code"
            onClick={getFeedback}
          >
            <i className="ri-play-line"></i>
          </button>
          <button 
            className="text-gray-300 hover:text-white transition-colors" 
            title="Reset Code"
            onClick={handleReset}
          >
            <i className="ri-restart-line"></i>
          </button>
          <button 
            className="text-gray-300 hover:text-white transition-colors" 
            title="Settings"
            onClick={handleSettingsToggle}
          >
            <i className="ri-settings-4-line"></i>
          </button>
        </div>
      </div>
      
      {/* Code Editor */}
      <div ref={editorRef} className="flex-grow" style={{ height: "400px" }}></div>
      
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
