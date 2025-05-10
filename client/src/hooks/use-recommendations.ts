import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { Course, Lesson, UserProgress } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export interface RecommendedLesson {
  type: 'in_progress' | 'not_started';
  lesson: Lesson;
  course: Course;
  progress: number;
}

export interface RecommendationResponse {
  recommendations: RecommendedLesson[];
}

export function useRecommendations(userId?: number) {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<RecommendationResponse>({
    queryKey: ['/api/recommended-lessons', effectiveUserId],
    queryFn: async () => {
      try {
        return await apiRequest(`/api/recommended-lessons?userId=${effectiveUserId}`);
      } catch (error) {
        // Handle specific errors if needed
        throw error;
      }
    },
    enabled: !!effectiveUserId,
    // Use stale time to prevent too frequent refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return {
    recommendations: data?.recommendations || [],
    isLoading,
    isError,
    error,
    refetch
  };
}