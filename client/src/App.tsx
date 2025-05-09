import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CoursePage from "@/pages/CoursePage";
import PracticeArea from "@/pages/PracticeArea";
import ChatMentor from "@/pages/ChatMentor";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";

function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-dark text-white p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <i className="ri-code-box-line text-2xl text-primary"></i>
          <h1 className="text-xl font-bold">CodeTutor AI</h1>
        </div>
        <button className="p-1" onClick={() => setMobileMenuOpen(true)}>
          <i className="ri-menu-line text-2xl"></i>
        </button>
      </div>
      
      {children}
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/lessons/:lessonId" component={CoursePage} />
        <Route path="/courses/:courseId" component={CoursePage} />
        <Route path="/practice" component={PracticeArea} />
        <Route path="/mentor" component={ChatMentor} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
