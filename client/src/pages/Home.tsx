import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { PROGRAMMING_LANGUAGES, DEFAULT_COURSES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LearningRecommendations from "@/components/LearningRecommendations";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<number | undefined>(1); // Default for demo purposes - would normally come from auth
  
  // In a real app, we'd fetch the user ID from auth context
  useEffect(() => {
    // This would be replaced with actual auth logic
    const checkForUser = async () => {
      try {
        // For demo purposes, assume user 1 exists
        setUserId(1);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserId(undefined);
      }
    };
    
    checkForUser();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Programming with AI Guidance</h1>
            <p className="text-xl opacity-90 mb-8">
              Master coding skills with curated video content and real-time AI feedback on your code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses/4">
                <a className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Start Learning
                </a>
              </Link>
              <Link href="/practice">
                <a className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                  Practice Coding
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Personalized Recommendations Section */}
      {userId && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <LearningRecommendations userId={userId} />
          </div>
        </section>
      )}
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-video-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Video Content</h3>
              <p className="text-gray-600">
                Learn with the best programming tutorials, organized by topic and difficulty level.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-code-box-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Code Editor</h3>
              <p className="text-gray-600">
                Practice coding directly in your browser with syntax highlighting and auto-completion.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-robot-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Feedback</h3>
              <p className="text-gray-600">
                Get intelligent suggestions and best practices to improve your code in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Programming Languages Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Programming Languages</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {PROGRAMMING_LANGUAGES.map(language => (
              <Link key={language.id} href={`/languages/${language.id}`}>
                <a className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <i className={`${language.icon}`} style={{ color: language.color }}></i>
                  <span>{language.name}</span>
                </a>
              </Link>
            ))}
          </div>
          
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 pl-10 rounded-lg border focus:ring focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-all outline-none"
                placeholder="Search for topics or languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          <Tabs defaultValue="popular">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="popular">Popular Courses</TabsTrigger>
                <TabsTrigger value="beginner">For Beginners</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="popular" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_COURSES.map(course => {
                const language = PROGRAMMING_LANGUAGES.find(l => l.id === course.languageId);
                return (
                  <Card key={course.id} className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/courses/${course.id}`}>
                        <a className="block p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {language && (
                              <i className={`${language.icon}`} style={{ color: language.color }}></i>
                            )}
                            <span className="text-sm font-medium text-gray-500">{language?.name}</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                          <p className="text-gray-600 mb-4">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{course.level}</span>
                            <span className="text-primary text-sm font-medium">View Course →</span>
                          </div>
                        </a>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
            
            <TabsContent value="beginner" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_COURSES.filter(c => c.level === "Beginner").map(course => {
                const language = PROGRAMMING_LANGUAGES.find(l => l.id === course.languageId);
                return (
                  <Card key={course.id} className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/courses/${course.id}`}>
                        <a className="block p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {language && (
                              <i className={`${language.icon}`} style={{ color: language.color }}></i>
                            )}
                            <span className="text-sm font-medium text-gray-500">{language?.name}</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                          <p className="text-gray-600 mb-4">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{course.level}</span>
                            <span className="text-primary text-sm font-medium">View Course →</span>
                          </div>
                        </a>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
            
            <TabsContent value="advanced" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_COURSES.filter(c => c.level === "Advanced" || c.level === "Intermediate").map(course => {
                const language = PROGRAMMING_LANGUAGES.find(l => l.id === course.languageId);
                return (
                  <Card key={course.id} className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/courses/${course.id}`}>
                        <a className="block p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {language && (
                              <i className={`${language.icon}`} style={{ color: language.color }}></i>
                            )}
                            <span className="text-sm font-medium text-gray-500">{language?.name}</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                          <p className="text-gray-600 mb-4">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{course.level}</span>
                            <span className="text-primary text-sm font-medium">View Course →</span>
                          </div>
                        </a>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl opacity-80 mb-8 max-w-2xl mx-auto">
            Join thousands of students improving their programming skills with CodeTutor AI.
          </p>
          <Link href="/courses/4">
            <a className="bg-primary hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-block">
              Get Started Now
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
