import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { UserProgress } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export function useLessonProgress(userId?: number, lessonId?: number) {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  
  const enabled = !!effectiveUserId && !!lessonId;
  
  const {
    data: progress,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<UserProgress | null>({
    queryKey: ['/api/user-progress', effectiveUserId, lessonId],
    queryFn: async () => {
      try {
        const response = await apiRequest(`/api/user-progress/${effectiveUserId}/${lessonId}`);
        return response;
      } catch (error) {
        // If 404, means no progress record yet
        if (error instanceof Error && error.message.includes('404')) {
          return null;
        }
        throw error;
      }
    },
    enabled
  });
  
  return {
    progress,
    isLoading,
    isError,
    error,
    refetch,
    isCompleted: progress?.completed || false
  };
}