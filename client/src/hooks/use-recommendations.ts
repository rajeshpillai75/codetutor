import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Course, Lesson } from "@shared/schema";

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
  return useQuery<RecommendationResponse>({
    queryKey: ['/api/recommended-lessons', userId],
    queryFn: async () => {
      if (!userId) return { recommendations: [] };
      return await apiRequest<RecommendationResponse>(`/api/recommended-lessons?userId=${userId}`);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}