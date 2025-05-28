
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskRecord } from '@/services/baserowService'; 
import { markTaskCompleteAction } from '@/app/actions/taskActions';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: TaskRecord;
  currentUserEmail: string | null;
  onTaskUpdated?: () => void; 
}

export function TaskCard({ task, currentUserEmail, onTaskUpdated }: TaskCardProps) {
  const [isCurrentUserCompleted, setIsCurrentUserCompleted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUserEmail && task['assigned to'] && typeof task.Completed === 'string') {
      const assignees = task['assigned to'].split(',').map(e => e.trim().toLowerCase());
      const completedStatuses = task.Completed.split(',');
      const userIndex = assignees.indexOf(currentUserEmail.toLowerCase());
      
      if (userIndex !== -1 && completedStatuses[userIndex]?.trim().toLowerCase() === 'yes') {
        setIsCurrentUserCompleted(true);
      } else {
        setIsCurrentUserCompleted(false);
      }
    } else if (currentUserEmail && task['assigned to'] && !task.Completed) {
        // If task.Completed is null/undefined, assume not completed by current user
        setIsCurrentUserCompleted(false);
    }
  }, [task, currentUserEmail]);

  const handleMarkComplete = async () => {
    if (!currentUserEmail) {
      toast({ title: "Error", description: "User not identified.", variant: "destructive" });
      setShowConfirmDialog(false);
      return;
    }
    setIsCompleting(true);
    try {
      const result = await markTaskCompleteAction(task.id, currentUserEmail);
      if (result.success && result.updatedTask) {
        toast({ title: "Task Updated", description: `"${task.Task}" marked as complete by you.`});
        setIsCurrentUserCompleted(true); // Update local state immediately
        onTaskUpdated?.(); 
      } else {
        toast({ title: "Error", description: result.error || "Failed to update task.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsCompleting(false);
      setShowConfirmDialog(false);
    }
  };

  const taskTitle = task.Task || "Untitled Task";
  const taskInfo = task.Info || "No additional info";
  const dueDate = task.Due || "N/A";

  return (
    <>
      <Card
        className={cn(
          "h-40 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between",
          isCurrentUserCompleted ? "bg-green-100 border-green-300 text-green-900 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300" : "bg-card"
        )}
      >
        <div>
          <CardTitle className={cn("text-md font-semibold", isCurrentUserCompleted && "line-through")}>{taskTitle}</CardTitle>
          <p className={cn("text-sm mt-1 truncate", isCurrentUserCompleted ? "text-green-700 dark:text-green-400" : "text-muted-foreground")}>{taskInfo}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs", isCurrentUserCompleted ? "text-green-700 dark:text-green-400" : "text-muted-foreground")}>
            Due: {dueDate}
          </span>
          {!isCurrentUserCompleted && (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-800/50 h-8 w-8"
              onClick={() => setShowConfirmDialog(true)}
              aria-label="Mark task as complete"
              disabled={isCompleting}
            >
              {isCompleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you completed your part of the task: "{taskTitle}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCompleting}>No, cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkComplete}
              className="bg-primary hover:bg-primary/90"
              disabled={isCompleting}
            >
              {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, completed"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
