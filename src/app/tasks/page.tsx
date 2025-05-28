
"use client";

import { useEffect, useState } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { TaskCard } from '@/components/dashboard/task-card';
import { LayoutGrid, Loader2, AlertTriangle } from 'lucide-react'; 
import type { TaskRecord } from '@/services/baserowService';
import { getTasksForUserAction } from '@/app/actions/taskActions';
import { useToast } from '@/hooks/use-toast';

export default function AllTasksPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTasksForUserAction(email);
      if (result.success && result.tasks) {
        setTasks(result.tasks);
      } else {
        setError(result.error || "Failed to load tasks.");
        toast({ title: "Error", description: result.error || "Failed to load tasks.", variant: "destructive"});
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      toast({ title: "Error", description: e.message || "An unexpected error occurred.", variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const emailFromStorage = localStorage.getItem('currentUserEmail');
    if (emailFromStorage) {
      setCurrentUserEmail(emailFromStorage);
      fetchTasks(emailFromStorage);
    } else {
      setError("User email not found. Please log in again.");
      setIsLoading(false);
      toast({ title: "Authentication Error", description: "User email not found.", variant: "destructive"});
      // Optionally redirect to login: router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleTaskUpdate = () => {
    if (currentUserEmail) {
      fetchTasks(currentUserEmail); // Re-fetch tasks when one is updated
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <LayoutGrid className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">All Your Tasks</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Manage and track all your assigned tasks in one place.
            </p>
          </div>
        </section>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 text-destructive">{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">You have no tasks assigned to you.</p>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                currentUserEmail={currentUserEmail}
                onTaskUpdated={handleTaskUpdate} 
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
