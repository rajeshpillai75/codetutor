import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Code } from 'lucide-react';
import SimplifiedPracticeArea from '@/pages/SimplifiedPracticeArea';

export default function PracticeAreaApp() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="container mx-auto flex items-center">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                CodeTutor AI - Practice Area
              </h1>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <SimplifiedPracticeArea />
        </main>
      </div>
    </TooltipProvider>
  );
}