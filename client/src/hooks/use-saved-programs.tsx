import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { SavedProgram, InsertSavedProgram } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Types for our mutation inputs
type CreateProgramInput = Omit<InsertSavedProgram, 'createdAt' | 'updatedAt'>;
type UpdateProgramInput = { id: number; data: Partial<InsertSavedProgram> };

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
  const createSavedProgramMutation: UseMutationResult<SavedProgram, Error, CreateProgramInput> = useMutation({
    mutationFn: async (program) => {
      if (!user) throw new Error("User not authenticated");
      
      const res = await fetch("/api/saved-programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...program,
          userId: user.id
        }),
        credentials: "include"
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || res.statusText}`);
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs'] });
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
  const updateSavedProgramMutation: UseMutationResult<SavedProgram, Error, UpdateProgramInput> = useMutation({
    mutationFn: async ({ id, data }) => {
      if (!user) throw new Error("User not authenticated");
      
      const res = await fetch(`/api/saved-programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || res.statusText}`);
      }
      
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs', variables.id.toString()] });
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
  const deleteSavedProgramMutation: UseMutationResult<void, Error, number> = useMutation({
    mutationFn: async (id) => {
      if (!user) throw new Error("User not authenticated");
      
      const res = await fetch(`/api/saved-programs/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || res.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-programs'] });
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