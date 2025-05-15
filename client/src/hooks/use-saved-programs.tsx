import { useQuery, useMutation } from "@tanstack/react-query";
import { SavedProgram, InsertSavedProgram } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function useSavedPrograms() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get all saved programs for the current user
  const { 
    data: savedPrograms,
    isLoading: isLoadingSavedPrograms,
    error: savedProgramsError
  } = useQuery<SavedProgram[]>({
    queryKey: ['/api/saved-programs'],
    enabled: !!user,
  });

  // Get saved programs by language
  const getSavedProgramsByLanguage = (language: string) => {
    return useQuery<SavedProgram[]>({
      queryKey: ['/api/saved-programs/language', language],
      enabled: !!user && !!language,
    });
  };

  // Create a new saved program
  const createSavedProgramMutation = useMutation({
    mutationFn: async (program: Omit<InsertSavedProgram, 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error("User not authenticated");
      
      const res = await apiRequest("POST", "/api/saved-programs", {
        ...program,
        userId: user.id,
      });
      
      return await res.json() as SavedProgram;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs/language'] });
      toast({
        title: "Program saved",
        description: "Your program has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save program",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update an existing saved program
  const updateSavedProgramMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertSavedProgram> }) => {
      if (!user) throw new Error("User not authenticated");
      
      const res = await apiRequest("PUT", `/api/saved-programs/${id}`, data);
      return await res.json() as SavedProgram;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs/language'] });
      toast({
        title: "Program updated",
        description: "Your program has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update program",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a saved program
  const deleteSavedProgramMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error("User not authenticated");
      
      await apiRequest("DELETE", `/api/saved-programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs/language'] });
      toast({
        title: "Program deleted",
        description: "Your program has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete program",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    savedPrograms,
    isLoadingSavedPrograms,
    savedProgramsError,
    getSavedProgramsByLanguage,
    createSavedProgramMutation,
    updateSavedProgramMutation,
    deleteSavedProgramMutation,
  };
}