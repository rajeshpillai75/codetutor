import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSavedPrograms } from "@/hooks/use-saved-programs";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SaveProgramDialogProps {
  code: string;
  language: string;
  onSaved?: () => void;
  existingProgram?: {
    id: number;
    name: string;
    description?: string;
    tags?: string[];
  };
  triggerProps?: {
    id?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    title?: string;
    className?: string;
  };
}

export function SaveProgramDialog({
  code,
  language,
  onSaved,
  existingProgram,
  triggerProps,
}: SaveProgramDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const {
    createSavedProgramMutation,
    updateSavedProgramMutation,
  } = useSavedPrograms();

  const isEditing = !!existingProgram;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingProgram?.name || "",
      description: existingProgram?.description || "",
      tags: existingProgram?.tags?.join(", ") || "",
    },
  });

  const handleSave = async (values: FormValues) => {
    if (!user) return;

    const tagsArray = values.tags
      ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      : undefined;

    if (isEditing && existingProgram) {
      await updateSavedProgramMutation.mutateAsync({
        id: existingProgram.id,
        data: {
          name: values.name,
          description: values.description,
          tags: tagsArray,
          code,
        },
      });
    } else {
      await createSavedProgramMutation.mutateAsync({
        userId: user.id,
        name: values.name,
        description: values.description,
        tags: tagsArray,
        language,
        code,
      });
    }

    form.reset();
    setOpen(false);
    onSaved?.();
  };

  const isSubmitting = 
    createSavedProgramMutation.isPending || 
    updateSavedProgramMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerProps ? (
          <Button
            id={triggerProps.id}
            variant={triggerProps.variant || "outline"}
            size={triggerProps.size || "sm"}
            title={triggerProps.title}
            className={triggerProps.className || "gap-2"}
          >
            <Save className="h-4 w-4" />
            {triggerProps.size !== "icon" && (isEditing ? "Update Program" : "Save Program")}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isEditing ? "Update Program" : "Save Program"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Program" : "Save Your Program"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your saved program details"
              : "Save your code to access it later"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My awesome program" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your program a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of what your program does"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="beginner, game, algorithm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of tags
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}