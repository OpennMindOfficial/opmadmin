
// src/app/actions/taskActions.ts
'use server';

import { fetchTasksForUser, updateTask, type TaskRecord } from '@/services/baserowService';
import { revalidatePath } from 'next/cache';
import { formatISO } from 'date-fns';

interface GetTasksResult {
  success: boolean;
  tasks?: TaskRecord[];
  error?: string;
}

export async function getTasksForUserAction(userEmail: string): Promise<GetTasksResult> {
  if (!userEmail) {
    return { success: false, error: 'User email is required to fetch tasks.' };
  }
  try {
    const tasks = await fetchTasksForUser(userEmail);
    return { success: true, tasks };
  } catch (error: any) {
    console.error('Error in getTasksForUserAction:', error);
    return { success: false, error: error.message || 'Failed to fetch tasks.' };
  }
}

interface MarkTaskCompleteResult {
  success: boolean;
  updatedTask?: TaskRecord;
  error?: string;
}

export async function markTaskCompleteAction(taskId: number, userEmail: string): Promise<MarkTaskCompleteResult> {
  try {
    if (!taskId || !userEmail) {
      return { success: false, error: 'Task ID and User Email are required.' };
    }

    const currentDate = formatISO(new Date());
    const completionEntry = `${userEmail}:${currentDate}`;

    // In a more complex scenario with multiple assignees needing individual completion status,
    // you might fetch the task first to append to existing 'Date_of_completion' if it's a comma-separated list.
    // For now, we overwrite 'Date_of_completion' with the current completer's info,
    // and set 'Completed' to 'Yes'.
    // Ensure your Baserow 'Date_of_completion' field is Text or Long Text.
    // Ensure your Baserow 'Completed' field is Text or Single Select ("Yes", "No").
    
    const updates: Partial<TaskRecord> = {
      Completed: "Yes",
      // Field name "Date_of_completion" must match Baserow's API field name
      Date_of_completion: completionEntry 
    };

    const updatedTask = await updateTask(taskId, updates);

    if (!updatedTask) {
      throw new Error('Failed to update task in Baserow or received no response.');
    }

    revalidatePath('/');
    revalidatePath('/tasks');
    return { success: true, updatedTask };
  } catch (error: any) {
    console.error('Error in markTaskCompleteAction:', error);
    return { success: false, error: error.message || 'Failed to mark task as complete.' };
  }
}
