import { useState } from "react";

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
}

export default function AIFeedback({ feedback, loading, onSendQuery }: AIFeedbackProps) {
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
    <div className="bg-gray-100 border-t p-4 space-y-4 overflow-y-auto max-h-52">
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Analyzing your code...</span>
        </div>
      ) : feedback ? (
        <>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-white p-1 rounded-full">
              <i className="ri-robot-line"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Code Tutor AI Feedback</h4>
              <div className="mt-1 text-sm">
                <p>{feedback.feedback}</p>
                {feedback.suggestions.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index}>
                        {suggestion.includes("`") ? (
                          <>
                            {suggestion.split("`").map((part, i) => 
                              i % 2 === 0 ? (
                                <span key={i}>{part}</span>
                              ) : (
                                <code key={i} className="bg-gray-200 px-1 rounded">{part}</code>
                              )
                            )}
                          </>
                        ) : (
                          suggestion
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {feedback.bestPractices.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white p-1 rounded-full">
                <i className="ri-check-line"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Best Practice</h4>
                <div className="mt-1 text-sm">
                  {feedback.bestPractices.map((practice, index) => (
                    <p key={index} className="mb-1">
                      {practice.includes("`") ? (
                        <>
                          {practice.split("`").map((part, i) => 
                            i % 2 === 0 ? (
                              <span key={i}>{part}</span>
                            ) : (
                              <code key={i} className="bg-gray-200 px-1 rounded">{part}</code>
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
              <div className="bg-red-500 text-white p-1 rounded-full">
                <i className="ri-error-warning-line"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Errors Detected</h4>
                <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                  {feedback.errorDetection.map((error, index) => (
                    <li key={index}>
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
          <div className="bg-primary text-white p-1 rounded-full">
            <i className="ri-robot-line"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Code Tutor AI</h4>
            <p className="mt-1 text-sm">
              Run your code or ask a question to get feedback from the AI tutor.
            </p>
          </div>
        </div>
      )}

      <div className="flex">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full pl-3 pr-10 py-2 border rounded-lg focus:ring focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-all outline-none"
            placeholder="Ask about your code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
            onClick={handleSubmit}
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
