
"use client";

import { useState } from 'react';
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
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  initialCompleted?: boolean;
}

export function TaskCard({ id, title, project, dueDate, initialCompleted = false }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Card
        className={cn(
          "h-40 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between",
          isCompleted ? "bg-green-100 border-green-300 text-green-900" : "bg-card"
        )}
      >
        <div>
          <CardTitle className={cn("text-md font-semibold", isCompleted && "line-through")}>{title}</CardTitle>
          <p className={cn("text-sm mt-1", isCompleted ? "text-green-700" : "text-muted-foreground")}>{project}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs", isCompleted ? "text-green-700" : "text-muted-foreground")}>
            Due: {dueDate}
          </span>
          {!isCompleted && (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8"
              onClick={() => setShowConfirmDialog(true)}
              aria-label="Mark task as complete"
            >
              <CheckCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you completed the task: "{title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkComplete}
              className="bg-primary hover:bg-primary/90"
            >
              Yes, completed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
