import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Cpu, Book, Lightbulb, MessageSquare, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Types of mentor personalities
export type MentorPersonalityType = "FRIENDLY" | "EXPERT" | "ENCOURAGING" | "SOCRATIC" | "BRIEF";

// Personality details
interface PersonalityDetail {
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  style: string;
  badges: string[];
}

// Map of personality types to their details
export const personalityDetails: Record<MentorPersonalityType, PersonalityDetail> = {
  FRIENDLY: {
    name: "Cody",
    title: "The Friendly Guide",
    description: "Approachable and supportive, Cody makes learning fun with casual language and relatable examples.",
    icon: <Bot className="h-10 w-10" />,
    color: "bg-blue-100 text-blue-600",
    style: "border-blue-200 hover:border-blue-400",
    badges: ["Supportive", "Relatable", "Patient"]
  },
  EXPERT: {
    name: "Dr. Code",
    title: "The Technical Expert",
    description: "A distinguished professor with deep technical knowledge, providing precise explanations and best practices.",
    icon: <Book className="h-10 w-10" />,
    color: "bg-purple-100 text-purple-600",
    style: "border-purple-200 hover:border-purple-400",
    badges: ["Detailed", "Technical", "Professional"]
  },
  ENCOURAGING: {
    name: "Spark",
    title: "The Motivator",
    description: "Enthusiastic and energetic, Spark builds confidence by celebrating wins and encouraging persistence.",
    icon: <Zap className="h-10 w-10" />,
    color: "bg-yellow-100 text-yellow-600",
    style: "border-yellow-200 hover:border-yellow-400",
    badges: ["Positive", "Motivational", "Energetic"]
  },
  SOCRATIC: {
    name: "Prof. Query",
    title: "The Thoughtful Teacher",
    description: "Guides through questioning, helping you discover solutions and develop problem-solving skills.",
    icon: <Lightbulb className="h-10 w-10" />,
    color: "bg-green-100 text-green-600",
    style: "border-green-200 hover:border-green-400",
    badges: ["Thought-provoking", "Methodical", "Deep"]
  },
  BRIEF: {
    name: "Bit",
    title: "The Efficient Coach",
    description: "Concise and to the point, Bit provides efficient guidance without unnecessary details.",
    icon: <MessageSquare className="h-10 w-10" />,
    color: "bg-red-100 text-red-600",
    style: "border-red-200 hover:border-red-400",
    badges: ["Concise", "Efficient", "Direct"]
  }
};

interface MentorPersonalityCardProps {
  personality: MentorPersonalityType;
  isSelected: boolean;
  onClick: () => void;
  aiModel?: "openai" | "anthropic";
}

export default function MentorPersonalityCard({ 
  personality, 
  isSelected, 
  onClick,
  aiModel = "openai"
}: MentorPersonalityCardProps) {
  const details = personalityDetails[personality];
  
  return (
    <Card 
      className={`border-2 transition-all cursor-pointer ${details.style} ${isSelected ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${details.color}`}>
            {details.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{details.name}</h3>
                <p className="text-sm text-gray-500">{details.title}</p>
              </div>
              <Badge 
                variant={aiModel === "openai" ? "secondary" : "destructive"} 
                className="ml-auto"
              >
                <Cpu className="h-3 w-3 mr-1" />
                {aiModel === "openai" ? "GPT" : "Claude"}
              </Badge>
            </div>
            
            <p className="text-sm my-2">{details.description}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {details.badges.map(badge => (
                <Badge variant="outline" key={badge} className={details.color}>
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}