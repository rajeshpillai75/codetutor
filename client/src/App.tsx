import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import PracticeArea from "@/pages/PracticeArea";
import ChatMentor from "@/pages/ChatMentor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, MessageSquare } from "lucide-react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              CodeTutor AI
            </h1>
          </div>
          <nav>
            <Tabs defaultValue="practice" className="w-full">
              <TabsList>
                <TabsTrigger value="practice" className="flex items-center gap-1" asChild>
                  <a href="/">
                    <Code className="h-4 w-4" />
                    <span className="hidden md:inline">Practice</span>
                  </a>
                </TabsTrigger>
                <TabsTrigger value="mentor" className="flex items-center gap-1" asChild>
                  <a href="/mentor">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden md:inline">AI Mentor</span>
                  </a>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={PracticeArea} />
        <Route path="/mentor" component={ChatMentor} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
