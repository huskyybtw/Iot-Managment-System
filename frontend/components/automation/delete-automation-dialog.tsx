"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AutomationResponseSchema } from "@/lib/api/model";
import {
  useDeleteAutomationIdDelete,
  getAutomationsAutomationGetQueryKey,
} from "@/lib/api/automations/automations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automation: AutomationResponseSchema | null;
}

export function DeleteAutomationDialog({
  open,
  onOpenChange,
  automation,
}: DeleteAutomationDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteAutomation, isPending } = useDeleteAutomationIdDelete({
    mutation: {
      onSuccess: () => {
        toast.success("Automation deleted successfully");
        queryClient.invalidateQueries({
          queryKey: getAutomationsAutomationGetQueryKey(),
        });
        onOpenChange(false);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.detail || "Failed to delete automation";
        toast.error(
          typeof message === "string" ? message : JSON.stringify(message)
        );
      },
    },
  });

  const handleDelete = () => {
    if (!automation) return;
    deleteAutomation({ id: automation.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Automation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;
            {automation?.name || "this automation"}&quot;? This will also delete
            all associated actions and triggers. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="sm:mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
