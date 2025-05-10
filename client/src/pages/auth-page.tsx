import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, User, Lock, BookOpen, Code, Brain } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, setLocation] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // If the user is already logged in, redirect to the home page
  if (user) {
    setLocation("/");
    return null;
  }

  // Create forms with zod validation
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  // Handle registration form submission
  function onRegisterSubmit(values: RegisterFormValues) {
    const { username, password } = values;
    registerMutation.mutate({ username, password });
  }

  // Render loading state if authentication state is being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col justify-center pb-12 pt-16 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary mb-6">
          <Brain className="h-12 w-12" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          CodeTutor AI
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Your personal AI coding mentor. Learn programming with interactive lessons and personalized guidance.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Login/Register Forms */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Login or create an account to track your progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    
                    {/* Login Tab */}
                    <TabsContent value="login">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <div className="flex items-center border rounded-md">
                                    <User className="ml-2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="username" className="border-0" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="flex items-center border rounded-md">
                                    <Lock className="ml-2 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" placeholder="••••••" className="border-0" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Sign In
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    {/* Register Tab */}
                    <TabsContent value="register">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <div className="flex items-center border rounded-md">
                                    <User className="ml-2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Create a username" className="border-0" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="flex items-center border rounded-md">
                                    <Lock className="ml-2 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" placeholder="••••••" className="border-0" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="flex items-center border rounded-md">
                                    <Lock className="ml-2 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" placeholder="••••••" className="border-0" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Create Account
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Hero Section */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Accelerate your coding journey with AI-powered learning
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  CodeTutor AI combines curated learning content with interactive practice and personalized 
                  AI mentoring to create the most effective coding education experience.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <div className="flex items-center mb-2 gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Curated Lessons</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Follow structured learning paths tailored to your experience level
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <div className="flex items-center mb-2 gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Interactive Practice</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Test your skills with hands-on exercises and real-time feedback
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <div className="flex items-center mb-2 gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">AI Mentor</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get personalized help from our AI mentors with different teaching styles
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <div className="flex items-center mb-2 gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Progress Tracking</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track your learning journey and see how far you've come
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}