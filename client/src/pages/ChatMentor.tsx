import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import ChatInterface from "@/components/ChatInterface";
import { User } from "@shared/schema";
import MentorPersonalitySelector from "@/components/MentorPersonalitySelector";
import { MentorPersonalityType, personalityDetails } from "@/components/MentorPersonalityCard";

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
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Brain, Code, Cpu, MessageSquare, BookOpen, Bot, Zap, Lightbulb, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ChatMentor() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [selectedTopic, setSelectedTopic] = useState<string>("basics");
  const [location, setLocation] = useLocation();
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic" | "llama3">("openai");
  const [personalityType, setPersonalityType] = useState<MentorPersonalityType>("FRIENDLY");
  const [isPersonalitySelectorOpen, setIsPersonalitySelectorOpen] = useState(false);

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

  // Get the current mentor personality details
  const currentMentorDetails = personalityDetails[personalityType];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">AI Coding Mentor</h1>
      <p className="text-gray-600 mb-6">
        Ask questions, get code examples, and receive personalized programming guidance
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar with context selectors */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mentor personality card */}
          <Card className="border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                Your AI Mentor
              </CardTitle>
              <CardDescription>
                Currently working with {currentMentorDetails.name}, {currentMentorDetails.title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${currentMentorDetails.color}`}>
                  {currentMentorDetails.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{currentMentorDetails.name}</h3>
                  <p className="text-sm text-gray-500">{currentMentorDetails.title}</p>
                </div>
                <Badge 
                  variant={selectedModel === "openai" ? "secondary" : "destructive"} 
                  className="ml-auto"
                >
                  <Cpu className="h-3 w-3 mr-1" />
                  {selectedModel === "openai" ? "GPT" : "Claude"}
                </Badge>
              </div>
              
              <p className="text-sm mb-4">{currentMentorDetails.description}</p>
              
              <Dialog open={isPersonalitySelectorOpen} onOpenChange={setIsPersonalitySelectorOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Change Mentor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0" aria-describedby="mentor-selector-description">
                  <DialogTitle className="sr-only">Choose Your AI Mentor</DialogTitle>
                  <div id="mentor-selector-description" className="sr-only">
                    Select a mentor personality and AI model that matches your learning style
                  </div>
                  <MentorPersonalitySelector
                    currentPersonality={personalityType}
                    currentModel={selectedModel}
                    onPersonalityChange={setPersonalityType}
                    onModelChange={setSelectedModel}
                    onClose={() => setIsPersonalitySelectorOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
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
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/demo/code-execution")}
              >
                <Code className="mr-2 h-5 w-5" />
                Code Execution Demo
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
              initialPersonality={personalityType}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}