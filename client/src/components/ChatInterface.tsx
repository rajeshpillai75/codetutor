import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

// UI components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Bot,
  Cpu,
  RefreshCw,
  Send,
  Settings,
  User,
  X,
} from "lucide-react";

// Types
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

interface ChatbotResponse {
  message: string;
  code?: string;
  language?: string;
  resources?: {
    title: string;
    url: string;
  }[];
}

// Types for mentor personality
type MentorPersonality = "FRIENDLY" | "EXPERT" | "ENCOURAGING" | "SOCRATIC" | "BRIEF";

// Helper function to map personality to readable name
const personalityName: Record<MentorPersonality, string> = {
  FRIENDLY: "Cody (Friendly)",
  EXPERT: "Dr. Code (Expert)",
  ENCOURAGING: "Spark (Encouraging)",
  SOCRATIC: "Prof. Query (Socratic)",
  BRIEF: "Bit (Brief)"
};

// Form validation schema
const messageSchema = z.object({
  message: z.string().min(1, "Please enter a message"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface ChatInterfaceProps {
  userId?: number;
  currentLanguage?: string;
  currentTopic?: string;
  initialModel?: "openai" | "anthropic";
  initialPersonality?: MentorPersonality;
}

export default function ChatInterface({ 
  userId, 
  currentLanguage, 
  currentTopic,
  initialModel = "openai",
  initialPersonality = "FRIENDLY"
}: ChatInterfaceProps) {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [personality, setPersonality] = useState<MentorPersonality>(initialPersonality);
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [model, setModel] = useState<"openai" | "anthropic">(initialModel);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Setup form with zod validation
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialize chat with a greeting
  useEffect(() => {
    if (!isInitialized && !messages.length) {
      initializeChat();
    }
  }, [isInitialized, messages.length]);

  // Effect to update personality when initialPersonality changes
  useEffect(() => {
    if (personality !== initialPersonality) {
      setPersonality(initialPersonality);
      if (isInitialized) {
        // Reset chat to show new personality introduction
        setMessages([]);
        setIsInitialized(false);
      }
    }
  }, [initialPersonality]);

  // Effect to update model when initialModel changes
  useEffect(() => {
    if (model !== initialModel) {
      setModel(initialModel);
      if (isInitialized) {
        // Reset chat to show new model introduction
        setMessages([]);
        setIsInitialized(false);
      }
    }
  }, [initialModel]);

  // Initialize chat with welcome message from mentor
  const initializeChat = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initial system message to set up the chat
      const personalityInfo = personalityName[personality]?.split(" ")[0] || "Mentor";
      const initialMessages: ChatMessage[] = [
        {
          role: "user",
          content: `Hello ${personalityInfo}! I'm ready to learn about programming. Can you introduce yourself and tell me about your teaching style?`,
          timestamp: new Date()
        }
      ];
      
      // Create context for API request
      const context = {
        language: currentLanguage || "JavaScript",
        currentTopic: currentTopic || "Programming Basics",
        userSkillLevel: skillLevel
      };
      
      console.log("Initializing chat with:", { personality, model, context });
      
      // Get response from server
      const response = await apiRequest<ChatbotResponse>('/api/chatbot/message', {
        method: 'POST',
        data: {
          messages: initialMessages,
          personality: personality,
          context: context,
          model: model
        }
      });
      
      console.log("Chat response received:", response);
      
      if (!response || !response.message) {
        throw new Error("Invalid response from server");
      }
      
      // Format response to include code blocks if present
      let formattedContent = response.message;
      if (response.code && response.language) {
        formattedContent += `\n\n\`\`\`${response.language}\n${response.code}\n\`\`\``;
      }
      
      // Add resources if present
      if (response.resources && response.resources.length > 0) {
        formattedContent += "\n\n**Helpful Resources:**\n";
        response.resources.forEach(resource => {
          formattedContent += `\n- [${resource.title}](${resource.url})`;
        });
      }
      
      // Update messages with response
      setMessages([
        ...initialMessages,
        {
          role: "assistant",
          content: formattedContent,
          timestamp: new Date()
        }
      ]);
      
      setIsInitialized(true);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error initializing chat:", err);
      // Add more specific error message
      if (err?.message && err.message.includes("API key")) {
        setError("AI service API key is missing or invalid. Please contact the administrator.");
      } else {
        setError("Failed to connect to the coding mentor. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset chat
  const resetChat = () => {
    setMessages([]);
    setIsInitialized(false);
    initializeChat();
  };

  // Submit message
  const onSubmit = async (values: MessageFormValues) => {
    // Don't submit empty messages or while loading
    if (!values.message.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    // Create user message
    const userMessage: ChatMessage = {
      role: "user",
      content: values.message,
      timestamp: new Date()
    };
    
    // Add user message to chat
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Reset form
    form.reset();
    
    try {
      // Create context for API request
      const context = {
        language: currentLanguage || "JavaScript",
        currentTopic: currentTopic || "Programming Basics",
        userSkillLevel: skillLevel
      };
      
      console.log("Sending message with:", { personality, model, context });
      
      // Get response from server (only send the last 10 messages to prevent token limit issues)
      const recentMessages = updatedMessages.slice(-10);
      const response = await apiRequest<ChatbotResponse>('/api/chatbot/message', {
        method: 'POST',
        data: {
          messages: recentMessages,
          personality: personality,
          context: context,
          model: model
        }
      });
      
      console.log("Message response received:", response);
      
      if (!response || !response.message) {
        throw new Error("Invalid response from server");
      }
      
      // Format response to include code blocks if present
      let formattedContent = response.message;
      if (response.code && response.language) {
        formattedContent += `\n\n\`\`\`${response.language}\n${response.code}\n\`\`\``;
      }
      
      // Add resources if present
      if (response.resources && response.resources.length > 0) {
        formattedContent += "\n\n**Helpful Resources:**\n";
        response.resources.forEach(resource => {
          formattedContent += `\n- [${resource.title}](${resource.url})`;
        });
      }
      
      // Add assistant response to chat
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: formattedContent,
          timestamp: new Date()
        }
      ]);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error sending message:", err);
      
      // Add more specific error message
      if (err?.message && err.message.includes("API key")) {
        setError("AI service API key is missing or invalid. Please contact the administrator.");
      } else {
        setError("Failed to get a response. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format timestamp
  const formatTime = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render code blocks within markdown
  const MarkdownWithCode = ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                className="rounded-md my-4"
                // @ts-ignore - Known type issue with SyntaxHighlighter style prop
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...rest}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with settings and info */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">Coding Mentor</h2>
          <Badge variant="outline">{personalityName[personality]}</Badge>
          <Badge variant={model === "openai" ? "secondary" : "destructive"} className="ml-1">
            <Cpu className="h-3 w-3 mr-1" />
            {model === "openai" ? "GPT-4" : "Claude"}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost" 
            size="sm" 
            onClick={resetChat}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Mentor Personality</h3>
                <Select
                  value={personality}
                  onValueChange={(value) => setPersonality(value as MentorPersonality)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FRIENDLY">Cody (Friendly)</SelectItem>
                    <SelectItem value="EXPERT">Dr. Code (Expert)</SelectItem>
                    <SelectItem value="ENCOURAGING">Spark (Encouraging)</SelectItem>
                    <SelectItem value="SOCRATIC">Prof. Query (Socratic)</SelectItem>
                    <SelectItem value="BRIEF">Bit (Brief)</SelectItem>
                  </SelectContent>
                </Select>
                
                <h3 className="text-sm font-medium">Your Skill Level</h3>
                <Select
                  value={skillLevel}
                  onValueChange={(value) => setSkillLevel(value as "beginner" | "intermediate" | "advanced")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                
                <h3 className="text-sm font-medium">AI Model</h3>
                <Select
                  value={model}
                  onValueChange={(value) => setModel(value as "openai" | "anthropic")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">
                      <div className="flex items-center">
                        <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                        OpenAI (GPT-4)
                      </div>
                    </SelectItem>
                    <SelectItem value="anthropic">
                      <div className="flex items-center">
                        <Cpu className="h-4 w-4 mr-2 text-purple-500" />
                        Anthropic (Claude)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      resetChat();
                    }}
                  >
                    Apply & Reset
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } rounded-lg p-3`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {message.role === "user" ? (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">You</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">{personalityName[personality].split(" ")[0]}</span>
                    </div>
                  )}
                  <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                </div>
                
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <MarkdownWithCode content={message.content} />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-muted rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">{personalityName[personality].split(" ")[0]}</span>
                  <span className="text-xs opacity-70">{formatTime(new Date())}</span>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <X className="h-4 w-4 mr-2 text-destructive" />
                    <span className="text-sm">{error}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Invisible div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Ask the coding mentor a question..."
                      className="min-h-[40px] resize-none"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </Form>
      </div>
    </div>
  );
}