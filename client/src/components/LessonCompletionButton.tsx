import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { UserProgress } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface LessonCompletionButtonProps {
  lessonId: number;
  onComplete?: (progress: UserProgress) => void;
}

export default function LessonCompletionButton({
  lessonId,
  onComplete,
}: LessonCompletionButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Skip if not authenticated
  if (!user) {
    return null;
  }

  // Get existing progress (if any)
  const {
    data: progress,
    isLoading,
    isError
  } = useQuery<UserProgress | null>({
    queryKey: ["/api/user-progress", user.id, lessonId],
    queryFn: async () => {
      try {
        return await apiRequest(`/api/user-progress/${user.id}/${lessonId}`);
      } catch (error) {
        // If 404, means no progress record yet
        if (error instanceof Error && error.message.includes("404")) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!user
  });

  // Create mutation
  const createProgressMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/user-progress", {
        method: "POST",
        data: {
          userId: user.id,
          lessonId,
          completed: true,
          lastAccessedAt: new Date().toISOString(),
        }
      });
    },
    onSuccess: (newProgress: UserProgress) => {
      toast({
        title: "Lesson completed!",
        description: "Your progress has been saved.",
      });
      
      // Invalidate the progress query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress", user.id, lessonId] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress", user.id] });
      
      // Call the callback if provided
      if (onComplete) {
        onComplete(newProgress);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save progress",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      return await apiRequest(`/api/user-progress/${progress?.id}`, {
        method: "PUT",
        data: {
          completed,
          lastAccessedAt: new Date().toISOString(),
        }
      });
    },
    onSuccess: (updatedProgress: UserProgress) => {
      toast({
        title: updatedProgress.completed ? "Lesson completed!" : "Progress updated",
        description: "Your progress has been saved.",
      });
      
      // Invalidate the progress query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress", user.id, lessonId] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress", user.id] });
      
      // Call the callback if provided
      if (onComplete) {
        onComplete(updatedProgress);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle the button click
  const handleProgressUpdate = () => {
    if (progress) {
      // Toggle completion status
      updateProgressMutation.mutate(!progress.completed);
    } else {
      // Create a new progress record
      createProgressMutation.mutate();
    }
  };

  // Determine button state
  const isPending = isLoading || createProgressMutation.isPending || updateProgressMutation.isPending;
  const isCompleted = progress?.completed || false;

  return (
    <Button
      onClick={handleProgressUpdate}
      disabled={isPending}
      variant={isCompleted ? "secondary" : "outline"}
      className="flex items-center gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {isCompleted ? "Completed" : "Mark as Complete"}
    </Button>
  );
}