import { useState } from "react";
import { Bot, CheckCircle, AlertTriangle, Lightbulb, Send, RefreshCw, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FeedbackType {
  feedback: string;
  suggestions: string[];
  bestPractices: string[];
  errorDetection?: { line: number; message: string }[];
}

interface AIFeedbackProps {
  feedback: FeedbackType | null;
  loading: boolean;
  onSendQuery: (query: string) => void;
  onGetGeneralFeedback?: () => void;
  selectedModel?: "openai" | "llama3";
  onChangeModel?: (model: "openai" | "llama3") => void;
}

export default function AIFeedback({ 
  feedback, 
  loading, 
  onSendQuery, 
  onGetGeneralFeedback, 
  selectedModel = "openai", 
  onChangeModel
}: AIFeedbackProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSendQuery(query);
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-t p-4 flex flex-col space-y-4 shrink-0">
      {/* Header with title and model selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Bot className="h-4 w-4 mr-1" /> Code Tutor AI
        </h3>
        
        {onChangeModel && (
          <Select 
            value={selectedModel} 
            onValueChange={(value: "openai" | "llama3") => onChangeModel(value)}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                  OpenAI
                </div>
              </SelectItem>
              <SelectItem value="llama3">
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2 text-green-500" />
                  Llama 3
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      {/* Input field with buttons */}
      <div className="space-y-2">
        <div className="flex relative">
          <Input
            type="text"
            className="flex-1 pr-10"
            placeholder="Ask about your code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!query.trim() || loading}
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {onGetGeneralFeedback && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onGetGeneralFeedback}
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Lightbulb className="h-4 w-4 mr-2" />}
            Get Code Review
          </Button>
        )}
        
        {selectedModel && (
          <div className="text-xs text-center text-muted-foreground">
            Using {selectedModel === "openai" ? "OpenAI GPT-4" : "Perplexity Llama 3"} for analysis
          </div>
        )}
      </div>
      
      {/* Feedback content below input */}
      <ScrollArea className="h-full max-h-48 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-gray-600 dark:text-gray-300">Analyzing your code...</span>
          </div>
        ) : feedback ? (
          <>
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-primary text-white p-1.5 rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  Code Tutor AI Feedback
                  <Badge variant="outline" className="text-xs">AI Generated</Badge>
                </h4>
                <div className="mt-2 text-sm">
                  <p>{feedback.feedback}</p>
                  {feedback.suggestions.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-sm flex items-center mb-2">
                        <Lightbulb className="h-3.5 w-3.5 mr-1 text-amber-500" />
                        Suggestions
                      </h5>
                      <ul className="list-disc pl-5 space-y-1.5">
                        {feedback.suggestions.map((suggestion, index) => (
                          <li key={index}>
                            {suggestion.includes("`") ? (
                              <>
                                {suggestion.split("`").map((part, i) => 
                                  i % 2 === 0 ? (
                                    <span key={i}>{part}</span>
                                  ) : (
                                    <code key={i} className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs font-mono">{part}</code>
                                  )
                                )}
                              </>
                            ) : (
                              suggestion
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {feedback.bestPractices.length > 0 && (
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-green-500 text-white p-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Best Practices</h4>
                  <div className="mt-2 text-sm">
                    {feedback.bestPractices.map((practice, index) => (
                      <p key={index} className="mb-2">
                        {practice.includes("`") ? (
                          <>
                            {practice.split("`").map((part, i) => 
                              i % 2 === 0 ? (
                                <span key={i}>{part}</span>
                              ) : (
                                <code key={i} className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs font-mono">{part}</code>
                              )
                            )}
                          </>
                        ) : (
                          practice
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {feedback.errorDetection && feedback.errorDetection.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="bg-red-500 text-white p-1.5 rounded-full">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Errors Detected</h4>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-1.5">
                    {feedback.errorDetection.map((error, index) => (
                      <li key={index} className="text-red-600 dark:text-red-400">
                        Line {error.line}: {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-start gap-3">
            <div className="bg-primary text-white p-1.5 rounded-full">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Code Tutor AI</h4>
              <p className="mt-1 text-sm">
                Run your code or ask a question to get AI-powered feedback on your code.
                Examples:
              </p>
              <ul className="mt-2 text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <li>• "What's wrong with my code?"</li>
                <li>• "How can I improve this function?"</li>
                <li>• "Explain how this algorithm works"</li>
              </ul>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
