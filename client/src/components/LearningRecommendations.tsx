import React from 'react';
import { useRecommendations } from '@/hooks/use-recommendations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Calendar, PlayCircle, Sparkles, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PROGRAMMING_LANGUAGES } from '@/lib/constants';

interface LearningRecommendationsProps {
  userId?: number;
}

export default function LearningRecommendations({ userId }: LearningRecommendationsProps) {
  const { recommendations, isLoading, isError } = useRecommendations(userId);
  const [_, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading your recommendations...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          We couldn't load your recommendations. Please try again later.
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Welcome to CodeTutor AI</CardTitle>
          <CardDescription>Get started with our programming courses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Explore our courses to start learning, or check out the practice area to test your skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROGRAMMING_LANGUAGES.slice(0, 3).map((language) => (
              <Card key={language.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/courses/${language.id*2-1}`)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${language.color}20` }}>
                      <i className={language.icon} style={{ color: language.color }}></i>
                    </div>
                    <CardTitle className="text-base">{language.name} Fundamentals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn the basics of {language.name} programming.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => navigate('/practice')}>
            <BookOpen className="mr-2 h-4 w-4" />
            Go to Practice Area
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {recommendations.map((rec, index) => {
        const languageInfo = PROGRAMMING_LANGUAGES.find(l => l.id === rec.course.languageId) || PROGRAMMING_LANGUAGES[0];
        
        return (
          <Card key={`${rec.lesson.id}-${index}`} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8" style={{ backgroundColor: `${languageInfo.color}20` }}>
                    <AvatarFallback style={{ color: languageInfo.color }}>
                      <i className={languageInfo.icon}></i>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{rec.lesson.title}</CardTitle>
                    <CardDescription className="text-xs">{rec.course.title}</CardDescription>
                  </div>
                </div>
                <Badge variant={rec.type === 'in_progress' ? 'default' : 'outline'}>
                  {rec.type === 'in_progress' ? 'In Progress' : 'New'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {rec.lesson.description || "Continue your learning journey with this lesson."}
              </p>
              {rec.type === 'in_progress' && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round(rec.progress * 100)}%</span>
                  </div>
                  <Progress value={rec.progress * 100} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex gap-1 text-xs"
                onClick={() => navigate(`/lessons/${rec.lesson.id}`)}
              >
                <PlayCircle className="h-3.5 w-3.5" />
                {rec.type === 'in_progress' ? 'Continue' : 'Start Learning'}
              </Button>
              {rec.type === 'not_started' && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {rec.lesson.duration} min
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}