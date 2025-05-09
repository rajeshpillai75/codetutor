import { useLocation } from "wouter";
import { Skeleton } from "@components/ui/skeleton";
import { Progress } from "@components/ui/progress";
import { Button } from "@components/ui/button";
import { useRecommendations } from "@hooks/use-recommendations";
import { PlayCircle, BookOpen, ArrowRight } from "lucide-react";

interface LearningRecommendationsProps {
  userId?: number;
}

export default function LearningRecommendations({ userId }: LearningRecommendationsProps) {
  const [, navigate] = useLocation();
  const { data, isLoading, error } = useRecommendations(userId);

  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        <h2 className="text-xl font-semibold">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-800">
        <p>Unable to load recommendations. Please try again later.</p>
      </div>
    );
  }

  if (data.recommendations.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-blue-50">
        <h2 className="text-xl font-semibold mb-2">Welcome to Your Learning Journey!</h2>
        <p className="mb-4">Start exploring our courses to get personalized recommendations.</p>
        <Button onClick={() => navigate("/courses")}>
          Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.recommendations.map((recommendation) => (
          <div 
            key={recommendation.lesson.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/lessons/${recommendation.lesson.id}`)}
          >
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
              <span className="font-medium">{recommendation.course.title}</span>
              {recommendation.type === 'in_progress' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                  In Progress
                </span>
              )}
              {recommendation.type === 'not_started' && (
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs">
                  New
                </span>
              )}
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{recommendation.lesson.title}</h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {recommendation.lesson.description || "Learn essential concepts and practical skills."}
            </p>
            
            {recommendation.type === 'in_progress' && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{recommendation.progress}%</span>
                </div>
                <Progress value={recommendation.progress} className="h-2" />
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-xs text-gray-500">
                {recommendation.lesson.duration ? (
                  <span className="flex items-center">
                    <PlayCircle className="h-3 w-3 mr-1" />
                    {Math.floor(recommendation.lesson.duration / 60)}:{(recommendation.lesson.duration % 60).toString().padStart(2, '0')} mins
                  </span>
                ) : (
                  <span className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Lesson {recommendation.lesson.order}
                  </span>
                )}
              </div>
              
              <Button variant="outline" size="sm" className="text-xs">
                {recommendation.type === 'in_progress' ? 'Continue' : 'Start'} 
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}