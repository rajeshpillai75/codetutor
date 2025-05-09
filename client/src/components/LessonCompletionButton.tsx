import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/queryClient";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProgress } from "@shared/schema";

interface LessonCompletionButtonProps {
  userId: number;
  lessonId: number;
  isCompleted?: boolean;
  onComplete?: (progress: UserProgress) => void;
}

export default function LessonCompletionButton({
  userId,
  lessonId,
  isCompleted = false,
  onComplete
}: LessonCompletionButtonProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleMarkAsComplete = async () => {
    if (loading || completed) return;
    
    setLoading(true);
    try {
      // First check if there's an existing progress record
      const progressRes = await fetch(`/api/user-progress?userId=${userId}&lessonId=${lessonId}`);
      const progressData = await progressRes.json();
      
      let progress: UserProgress;
      
      if (progressData && progressData.length > 0) {
        // Update existing progress
        progress = await apiPost<UserProgress>(`/api/user-progress/${progressData[0].id}/complete`, {
          completed: true
        });
      } else {
        // Create new progress
        const now = new Date().toISOString();
        progress = await apiPost<UserProgress>('/api/user-progress', {
          userId,
          lessonId,
          completed: true,
          lastAccessedAt: now
        });
      }
      
      setCompleted(true);
      toast({
        title: "Lesson Completed!",
        description: "Your progress has been saved.",
        duration: 3000,
      });
      
      if (onComplete) {
        onComplete(progress);
      }
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
        disabled
      >
        <CheckCircle className="h-5 w-5" />
        <span>Lesson Completed!</span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleMarkAsComplete}
      className="w-full"
      disabled={loading}
    >
      {loading ? "Saving..." : "Mark as Complete"}
    </Button>
  );
}