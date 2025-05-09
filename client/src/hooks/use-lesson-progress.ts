import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProgress } from "@shared/schema";
import { apiRequest, apiPost } from "@/lib/queryClient";

export function useLessonProgress(userId?: number, lessonId?: number) {
  const queryClient = useQueryClient();
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Query to fetch the current progress
  const progressQuery = useQuery<UserProgress | null>({
    queryKey: ['/api/user-progress', userId, lessonId],
    queryFn: async () => {
      if (!userId || !lessonId) return null;
      
      try {
        // First check if there's an existing progress record
        const response = await apiRequest<UserProgress[]>(`/api/user-progress?userId=${userId}&lessonId=${lessonId}`);
        
        if (response && response.length > 0) {
          return response[0];
        }
        
        return null;
      } catch (error) {
        console.error("Failed to fetch lesson progress:", error);
        return null;
      }
    },
    enabled: !!userId && !!lessonId,
  });
  
  // Update local state when the query data changes
  useEffect(() => {
    if (progressQuery.data) {
      setIsCompleted(!!progressQuery.data.completed);
    } else {
      setIsCompleted(false);
    }
  }, [progressQuery.data]);
  
  // Create progress mutation
  const createProgressMutation = useMutation({
    mutationFn: async (data: { completed: boolean }) => {
      if (!userId || !lessonId) throw new Error("User ID and Lesson ID are required");
      
      const now = new Date().toISOString();
      return apiPost<UserProgress>('/api/user-progress', {
        userId,
        lessonId,
        completed: data.completed,
        lastAccessedAt: now
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommended-lessons'] });
    }
  });
  
  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return apiPost<UserProgress>(`/api/user-progress/${id}/complete`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommended-lessons'] });
    }
  });
  
  // Function to mark lesson as completed or not
  const updateProgress = async (completed: boolean) => {
    try {
      if (progressQuery.data) {
        // Update existing progress
        await updateProgressMutation.mutateAsync({ 
          id: progressQuery.data.id, 
          completed 
        });
      } else {
        // Create new progress
        await createProgressMutation.mutateAsync({ completed });
      }
      
      setIsCompleted(completed);
      return true;
    } catch (error) {
      console.error("Failed to update lesson progress:", error);
      return false;
    }
  };
  
  return {
    isLoading: progressQuery.isLoading || createProgressMutation.isPending || updateProgressMutation.isPending,
    isCompleted,
    progress: progressQuery.data,
    updateProgress,
    markAsCompleted: () => updateProgress(true),
    markAsIncomplete: () => updateProgress(false),
  };
}