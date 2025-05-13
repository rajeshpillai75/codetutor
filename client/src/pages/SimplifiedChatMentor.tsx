import React, { useState } from "react";
import { apiPost } from "@/lib/queryClient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types
type MentorPersonalityType = "FRIENDLY" | "EXPERT" | "ENCOURAGING" | "SOCRATIC" | "BRIEF";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

interface ChatResponse {
  message: string;
  code?: string;
  language?: string;
  resources?: {
    title: string;
    url: string;
  }[];
}

// Personality details
const personalityDetails = {
  FRIENDLY: {
    name: "Friendly Guide",
    title: "Patient & Supportive Tutor",
    description: "Explains concepts clearly with a warm, encouraging approach. Great for beginners who need supportive guidance.",
    badges: ["Supportive", "Clear", "Patient"],
    color: "bg-blue-100 text-blue-800"
  },
  EXPERT: {
    name: "Technical Expert",
    title: "In-depth Technical Mentor",
    description: "Provides comprehensive, technically precise explanations. Ideal for advanced topics and detailed analysis.",
    badges: ["Technical", "Detailed", "Precise"],
    color: "bg-purple-100 text-purple-800"
  },
  ENCOURAGING: {
    name: "Motivational Coach",
    title: "Confidence-Building Mentor",
    description: "Focuses on building confidence through positive reinforcement and celebrating small victories.",
    badges: ["Motivating", "Positive", "Energetic"],
    color: "bg-green-100 text-green-800"
  },
  SOCRATIC: {
    name: "Socratic Teacher",
    title: "Question-Based Learning Guide",
    description: "Guides learning through thoughtful questions that encourage you to discover solutions yourself.",
    badges: ["Questioning", "Thought-provoking", "Discovery"],
    color: "bg-amber-100 text-amber-800"
  },
  BRIEF: {
    name: "Direct Instructor",
    title: "Concise & Efficient Mentor",
    description: "Provides short, direct answers without unnecessary explanation. Perfect when you need quick solutions.",
    badges: ["Concise", "Efficient", "Direct"],
    color: "bg-red-100 text-red-800"
  }
};

export default function SimplifiedChatMentor() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [selectedTopic, setSelectedTopic] = useState<string>("basics");
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic" | "llama3">("openai");
  const [personalityType, setPersonalityType] = useState<MentorPersonalityType>("FRIENDLY");
  const [isPersonalitySelectorOpen, setIsPersonalitySelectorOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle sending a message to the AI
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    // Add user message to the chat
    const userMessage: ChatMessage = {
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await apiPost<ChatResponse>("/api/ai/chat", {
        messages: [...messages, userMessage],
        currentLanguage: selectedLanguage,
        currentTopic: selectedTopic,
        model: selectedModel,
        personality: personalityType
      });
      
      // Add AI response to the chat
      const aiMessage: ChatMessage = {
        role: "assistant",
        content: response.message + (response.code ? "\n\n```" + (response.language || "") + "\n" + response.code + "\n```" : ""),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I'm sorry, I had trouble processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render code blocks with syntax highlighting
  const formatMessage = (content: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${match.index}`} className="whitespace-pre-wrap">
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add code block
      const language = match[1] || "plaintext";
      const code = match[2];
      parts.push(
        <pre key={`code-${match.index}`} className="p-4 my-2 bg-muted rounded-md overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </span>
      );
    }
    
    return parts.length ? parts : <span className="whitespace-pre-wrap">{content}</span>;
  };

  // Toggle personality selector
  const handlePersonalityClick = (type: MentorPersonalityType) => {
    setPersonalityType(type);
    setIsPersonalitySelectorOpen(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl h-full flex flex-col">
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col h-full space-y-4">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center space-y-0 gap-2 px-4 py-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="h-5 w-5 text-primary" />
                AI Coding Mentor
              </CardTitle>
              
              <div className="ml-auto flex items-center gap-2">
                {/* Model Selector */}
                <Select value={selectedModel} onValueChange={(value: "openai" | "anthropic" | "llama3") => setSelectedModel(value)}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="llama3">Llama 3</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Personality Selector */}
                <Dialog open={isPersonalitySelectorOpen} onOpenChange={setIsPersonalitySelectorOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-8" onClick={() => setIsPersonalitySelectorOpen(true)}>
                      <Settings className="h-4 w-4 mr-2" /> 
                      <span className="hidden md:inline">Personality</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {Object.entries(personalityDetails).map(([key, details]) => (
                        <Card 
                          key={key} 
                          className={`cursor-pointer transition-all hover:shadow-md ${personalityType === key ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handlePersonalityClick(key as MentorPersonalityType)}
                        >
                          <CardHeader>
                            <CardTitle>{details.name}</CardTitle>
                            <CardDescription>{details.title}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm mb-3">{details.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {details.badges.map((badge) => (
                                <Badge key={badge} variant="outline">{badge}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">
                      <MessageSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                      <h3 className="text-lg font-medium mb-1">Start a conversation</h3>
                      <p className="text-sm">
                        Ask me anything about {selectedLanguage} programming, from basics to advanced topics
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {formatMessage(msg.content)}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex items-start">
                      <div className="bg-muted max-w-[80%] px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/30 size-2 rounded-full animate-pulse"></div>
                          <div className="bg-primary/30 size-2 rounded-full animate-pulse delay-100"></div>
                          <div className="bg-primary/30 size-2 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Ask about coding, debugging, or best practices..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-10 resize-none"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !currentMessage.trim()}>
                    Send
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-[150px] h-8">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="swift">Swift</SelectItem>
                      <SelectItem value="golang">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-[150px] h-8">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basics">Basics</SelectItem>
                      <SelectItem value="dataStructures">Data Structures</SelectItem>
                      <SelectItem value="algorithms">Algorithms</SelectItem>
                      <SelectItem value="oop">OOP</SelectItem>
                      <SelectItem value="frameworks">Frameworks</SelectItem>
                      <SelectItem value="bestPractices">Best Practices</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="deployment">Deployment</SelectItem>
                      <SelectItem value="debugging">Debugging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}