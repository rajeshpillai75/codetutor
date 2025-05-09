import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import ChatInterface from "@/components/ChatInterface";
import { User } from "@shared/schema";

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
import { Brain, Code, Cpu, MessageSquare, BookOpen } from "lucide-react";

export default function ChatMentor() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [selectedTopic, setSelectedTopic] = useState<string>("basics");
  const [location, setLocation] = useLocation();
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic">("openai");

  // For demo/testing purposes, using a fixed userId - in production, this would come from auth
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiRequest<User>("/api/users/1");
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    
    fetchUser();
  }, []);

  const topics = {
    javascript: ["Basics", "Functions", "Arrays and Objects", "Async/Await", "ES6 Features"],
    python: ["Basics", "Functions", "Data Structures", "File I/O", "Libraries"],
    react: ["Components", "Hooks", "State Management", "Routing", "Server Components"],
    sql: ["SELECT Queries", "JOIN Operations", "Database Design", "Indexes", "Transactions"],
    "html-css": ["HTML Structure", "CSS Selectors", "Flexbox", "Grid Layout", "Responsive Design"]
  };

  const getCurrentTopics = () => {
    return topics[selectedLanguage as keyof typeof topics] || topics.javascript;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">AI Coding Mentor</h1>
      <p className="text-gray-600 mb-6">
        Ask questions, get code examples, and receive personalized programming guidance
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar with context selectors */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Learning Context
              </CardTitle>
              <CardDescription>
                Help your mentor understand what you're working on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Programming Language</label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="html-css">HTML & CSS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Topic</label>
                <Select
                  value={selectedTopic}
                  onValueChange={setSelectedTopic}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentTopics().map((topic, index) => (
                      <SelectItem key={index} value={topic.toLowerCase().replace(/\s+/g, '-')}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={selectedModel === "openai" ? "default" : "outline"} 
                    className={`w-full justify-start h-auto py-3 ${selectedModel === "openai" ? "" : "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"}`}
                    onClick={() => setSelectedModel("openai")}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Cpu className="mr-2 h-5 w-5 text-blue-500" />
                        <span className="font-medium">OpenAI</span>
                      </div>
                      <span className={`text-xs mt-1 ${selectedModel === "openai" ? "text-primary-foreground/70" : "text-gray-500"}`}>GPT-4o with code expertise</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant={selectedModel === "anthropic" ? "destructive" : "outline"} 
                    className={`w-full justify-start h-auto py-3 ${selectedModel === "anthropic" ? "" : "hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950"}`}
                    onClick={() => setSelectedModel("anthropic")}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Cpu className="mr-2 h-5 w-5 text-purple-500" />
                        <span className="font-medium">Anthropic</span>
                      </div>
                      <span className={`text-xs mt-1 ${selectedModel === "anthropic" ? "text-primary-foreground/70" : "text-gray-500"}`}>Claude with detailed explanations</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Learning Resources
              </CardTitle>
              <CardDescription>
                Explore other learning options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/practice")}
              >
                <Cpu className="mr-2 h-5 w-5" />
                Practice Coding
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/")}
              >
                <Brain className="mr-2 h-5 w-5" />
                Video Lessons
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main chat area */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <ChatInterface 
              userId={user?.id} 
              currentLanguage={selectedLanguage}
              currentTopic={selectedTopic}
              initialModel={selectedModel}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}