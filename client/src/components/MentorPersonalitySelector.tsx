import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MentorPersonalityCard, { 
  MentorPersonalityType, 
  personalityDetails 
} from "./MentorPersonalityCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Settings } from "lucide-react";

interface MentorPersonalitySelectorProps {
  currentPersonality: MentorPersonalityType;
  currentModel: "openai" | "anthropic" | "llama3";
  onPersonalityChange: (personality: MentorPersonalityType) => void;
  onModelChange: (model: "openai" | "anthropic" | "llama3") => void;
  onClose: () => void;
}

export default function MentorPersonalitySelector({
  currentPersonality,
  currentModel,
  onPersonalityChange,
  onModelChange,
  onClose
}: MentorPersonalitySelectorProps) {
  const [selectedPersonality, setSelectedPersonality] = useState<MentorPersonalityType>(currentPersonality);
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic" | "llama3">(currentModel);

  const handleApply = () => {
    onPersonalityChange(selectedPersonality);
    onModelChange(selectedModel);
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Choose Your AI Mentor
        </CardTitle>
        <CardDescription>
          Choose a mentor personality that matches your learning style. Each mentor has a different teaching approach!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="personalities" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personalities" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Mentor Personalities</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>AI Models</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personalities" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto p-1">
              {(Object.keys(personalityDetails) as MentorPersonalityType[]).map(personality => (
                <MentorPersonalityCard
                  key={personality}
                  personality={personality}
                  isSelected={selectedPersonality === personality}
                  onClick={() => setSelectedPersonality(personality)}
                  aiModel={selectedModel}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto p-1">
              <Card 
                className={`border-2 transition-all cursor-pointer hover:border-blue-400 ${
                  selectedModel === "openai" ? 'ring-2 ring-offset-2 ring-blue-400' : ''
                }`}
                onClick={() => setSelectedModel("openai")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.2 6.25H17.6C17.6 4.45 16.15 3 14.35 3H5.8C4 3 2.55 4.45 2.55 6.25V12.65C2.55 14.45 4 15.9 5.8 15.9H6.4C6.4 17.7 7.85 19.15 9.65 19.15H18.2C20 19.15 21.45 17.7 21.45 15.9V9.5C21.45 7.7 20 6.25 18.2 6.25ZM5.8 14.4C4.87 14.4 4.05 13.68 4.05 12.65V6.25C4.05 5.32 4.77 4.5 5.8 4.5H14.35C15.28 4.5 16.1 5.22 16.1 6.25V12.65C16.1 13.58 15.38 14.4 14.35 14.4H5.8ZM19.95 15.9C19.95 16.83 19.23 17.65 18.2 17.65H9.65C8.72 17.65 7.9 16.93 7.9 15.9V9.5C7.9 8.57 8.62 7.75 9.65 7.75H18.2C19.13 7.75 19.95 8.47 19.95 9.5V15.9Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">OpenAI GPT-4o</h3>
                      <p className="text-sm text-gray-600">Advanced AI with excellent code generation and technical knowledge</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Code-focused</div>
                        <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Technical</div>
                        <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Fast</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`border-2 transition-all cursor-pointer hover:border-purple-400 ${
                  selectedModel === "anthropic" ? 'ring-2 ring-offset-2 ring-purple-400' : ''
                }`}
                onClick={() => setSelectedModel("anthropic")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 10.55 13.78 11.05 13.41 11.41L11.5 13.32C11.19 13.63 11 14.06 11 14.5V16H13V14.5L14.29 13.23C14.92 12.59 15.3 11.83 15.3 11C15.3 8.34 13.66 6 12 6ZM11 17H13V19H11V17Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Anthropic Claude</h3>
                      <p className="text-sm text-gray-600">Nuanced AI with excellent explanations and conversational style</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <div className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Detailed</div>
                        <div className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Nuanced</div>
                        <div className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Contextual</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`border-2 transition-all cursor-pointer hover:border-green-400 ${
                  selectedModel === "llama3" ? 'ring-2 ring-offset-2 ring-green-400' : ''
                }`}
                onClick={() => setSelectedModel("llama3")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 4C8.67 4 8 4.67 8 5.5V18.5C8 19.33 8.67 20 9.5 20H14.5C15.33 20 16 19.33 16 18.5V5.5C16 4.67 15.33 4 14.5 4H9.5ZM10 6H14V10H10V6ZM10 12H14V18H10V12Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Perplexity Llama 3</h3>
                      <p className="text-sm text-gray-600">Open-source AI model with strong reasoning capabilities</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Open-source</div>
                        <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Versatile</div>
                        <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Latest tech</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t py-4 bg-card">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleApply} className="bg-primary font-medium">
          Meet Your New Mentor
        </Button>
      </CardFooter>
    </Card>
  );
}