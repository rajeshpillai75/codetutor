import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { SavedProgram } from "@shared/schema";
import { useSavedPrograms } from "@/hooks/use-saved-programs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Code, 
  MoreVertical, 
  Trash, 
  Pencil, 
  ArrowUpRight,
  Search,
  Tag,
  Calendar 
} from "lucide-react";
import { SaveProgramDialog } from "./SaveProgramDialog";

interface SavedProgramsListProps {
  onLoadProgram?: (program: SavedProgram) => void;
  language?: string;
  className?: string;
}

export function SavedProgramsList({
  onLoadProgram,
  language,
  className = "",
}: SavedProgramsListProps) {
  const { 
    savedPrograms, 
    isLoadingSavedPrograms,
    deleteSavedProgramMutation 
  } = useSavedPrograms();
  
  const [programToDelete, setProgramToDelete] = useState<SavedProgram | null>(null);
  const [editingProgram, setEditingProgram] = useState<SavedProgram | null>(null);
  
  // Filter programs by language if specified
  const filteredPrograms = language 
    ? savedPrograms?.filter(program => program.language === language)
    : savedPrograms;
  
  const handleLoadProgram = (program: SavedProgram) => {
    if (onLoadProgram) {
      onLoadProgram(program);
    }
  };
  
  const handleDeleteProgram = async () => {
    if (programToDelete) {
      await deleteSavedProgramMutation.mutateAsync(programToDelete.id);
      setProgramToDelete(null);
    }
  };

  if (isLoadingSavedPrograms) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold">My Saved Programs</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!filteredPrograms?.length) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold">My Saved Programs</h2>
        <Card>
          <CardHeader>
            <CardTitle>No saved programs</CardTitle>
            <CardDescription>
              {language 
                ? `You haven't saved any ${language} programs yet.` 
                : "You haven't saved any programs yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Save your code to access it later. Just click the "Save Program" button in the editor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Saved Programs</h2>
        <Badge variant="outline" className="gap-1">
          <Code className="w-3 h-3" />
          {filteredPrograms.length} saved
        </Badge>
      </div>
      
      <ScrollArea className="h-full pr-4">
        <Accordion type="single" collapsible className="space-y-4">
          {filteredPrograms.map((program) => (
            <AccordionItem 
              key={program.id} 
              value={program.id.toString()}
              className="border rounded-md p-0 overflow-hidden"
            >
              <Card className="border-0">
                <CardHeader className="p-0">
                  <div className="flex justify-between items-start px-4 pt-4">
                    <div>
                      <AccordionTrigger className="p-0 hover:no-underline">
                        <CardTitle className="text-left">{program.name}</CardTitle>
                      </AccordionTrigger>
                      <CardDescription className="mt-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{program.language}</Badge>
                          <span className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3 h-3" />
                            {formatDistanceToNow(new Date(program.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => setProgramToDelete(program)}
                          className="text-destructive gap-2"
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <div className="flex justify-end gap-2 px-4 py-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingProgram(program)}
                    className="gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleLoadProgram(program)}
                    className="gap-1"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Load Program
                  </Button>
                </div>
                <AccordionContent>
                  <CardContent className="pt-0">
                    {program.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {program.description}
                      </p>
                    )}
                    <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto max-h-[200px]">
                      <code>{program.code.slice(0, 1000)}{program.code.length > 1000 ? '...' : ''}</code>
                    </pre>
                    {program.tags && program.tags.length > 0 && (
                      <div className="flex gap-1 mt-3 flex-wrap">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        {program.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!programToDelete} onOpenChange={() => setProgramToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{programToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProgram}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteSavedProgramMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit dialog */}
      {editingProgram && (
        <SaveProgramDialog
          code={editingProgram.code}
          language={editingProgram.language}
          existingProgram={{
            id: editingProgram.id,
            name: editingProgram.name,
            description: editingProgram.description ? editingProgram.description : undefined,
            tags: editingProgram.tags ? editingProgram.tags : undefined,
          }}
          onSaved={() => setEditingProgram(null)}
        />
      )}
    </div>
  );
}