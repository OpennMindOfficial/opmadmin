
// src/app/actions/taskActions.ts
'use server';

import { fetchTaskById, updateTask, type TaskRecord, fetchTasksForUser } from '@/services/baserowService';
import { revalidatePath } from 'next/cache';
import { formatISO } from 'date-fns';

interface GetTasksResult {
  success: boolean;
  tasks?: TaskRecord[];
  error?: string;
}

// This action is already defined in page.tsx for its own use, but we keep it here for consistency
// if other parts of the app need to fetch tasks via a server action.
// For now, page.tsx will call the service function directly.
export async function getTasksForUserAction(userEmail: string): Promise<GetTasksResult> {
  if (!userEmail) {
    return { success: false, error: 'User email is required to fetch tasks.' };
  }
  try {
    // Note: page.tsx uses fetchTasksForUser directly, this is an alternative
    // For this complex update, we will need fetchTaskById within markTaskCompleteAction
    const tasks = await fetchTasksForUser(userEmail); // Assuming fetchTasksForUser is exported
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

export async function markTaskCompleteAction(taskId: number, currentUserEmail: string): Promise<MarkTaskCompleteResult> {
  console.log(`--- markTaskCompleteAction: Initiated for task ${taskId} by user ${currentUserEmail} ---`);
  try {
    if (!taskId || !currentUserEmail) {
      return { success: false, error: 'Task ID and User Email are required.' };
    }

    const task = await fetchTaskById(taskId);
    if (!task) {
      return { success: false, error: `Task with ID ${taskId} not found.` };
    }
    console.log('[markTaskCompleteAction] Fetched task:', JSON.stringify(task, null, 2));


    const assigneesString = task['assigned to'];
    if (!assigneesString || typeof assigneesString !== 'string') {
      return { success: false, error: 'Task has no assignees or assignee field is malformed.' };
    }
    const assigneesArray = assigneesString.split(',').map(email => email.trim().toLowerCase());
    const userIndex = assigneesArray.indexOf(currentUserEmail.toLowerCase());

    if (userIndex === -1) {
      return { success: false, error: `User ${currentUserEmail} is not assigned to this task.` };
    }
    console.log(`[markTaskCompleteAction] User ${currentUserEmail} found at index ${userIndex} of assignees.`);


    // Handle 'Completed' field
    let completedArray: string[] = [];
    if (task.Completed && typeof task.Completed === 'string') {
      completedArray = task.Completed.split(',');
    }
    // Ensure completedArray has the same length as assigneesArray, padding with "No" if necessary
    while (completedArray.length < assigneesArray.length) {
      completedArray.push("No");
    }
    if (completedArray.length > assigneesArray.length) {
        // This case indicates a data mismatch, perhaps trim or log an error
        console.warn(`[markTaskCompleteAction] Task ${taskId} has more 'Completed' entries (${completedArray.length}) than assignees (${assigneesArray.length}). Trimming.`);
        completedArray = completedArray.slice(0, assigneesArray.length);
    }
    completedArray[userIndex] = "Yes";
    const newCompletedStatus = completedArray.join(',');
    console.log(`[markTaskCompleteAction] New 'Completed' status string: ${newCompletedStatus}`);


    // Handle 'Date_of_completion' field
    let dateCompletionArray: string[] = [];
    if (task.Date_of_completion && typeof task.Date_of_completion === 'string') {
      dateCompletionArray = task.Date_of_completion.split(',');
    }
    // Ensure dateCompletionArray has the same length as assigneesArray, padding with empty string if necessary
     while (dateCompletionArray.length < assigneesArray.length) {
      dateCompletionArray.push(""); // Use empty string as placeholder
    }
    if (dateCompletionArray.length > assigneesArray.length) {
        console.warn(`[markTaskCompleteAction] Task ${taskId} has more 'Date_of_completion' entries (${dateCompletionArray.length}) than assignees (${assigneesArray.length}). Trimming.`);
        dateCompletionArray = dateCompletionArray.slice(0, assigneesArray.length);
    }
    dateCompletionArray[userIndex] = `${currentUserEmail}:${new Date().toISOString()}`;
    const newDateOfCompletion = dateCompletionArray.join(',');
    console.log(`[markTaskCompleteAction] New 'Date_of_completion' string: ${newDateOfCompletion}`);

    const updates: Partial<TaskRecord> = {
      Completed: newCompletedStatus,
      Date_of_completion: newDateOfCompletion,
    };
    console.log('[markTaskCompleteAction] Payload for updateTask:', JSON.stringify(updates, null, 2));

    const updatedTaskResponse = await updateTask(taskId, updates);

    if (!updatedTaskResponse) {
      console.error(`[markTaskCompleteAction] Failed to update task ${taskId} in Baserow or received no response.`);
      throw new Error('Failed to update task in Baserow or received no response.');
    }
    console.log(`[markTaskCompleteAction] Successfully updated task ${taskId}. Response:`, JSON.stringify(updatedTaskResponse, null, 2));

    revalidatePath('/');
    revalidatePath('/tasks');
    return { success: true, updatedTask: updatedTaskResponse };
  } catch (error: any) {
    console.error(`Error in markTaskCompleteAction for task ${taskId} by user ${currentUserEmail}:`, error.message, error.stack);
    return { success: false, error: error.message || 'Failed to mark task as complete.' };
  }
}
// Need to re-export fetchTasksForUser if page.tsx uses it directly.
// However, actions should generally be self-contained or call other actions/services.
// For now, page.tsx imports from baserowService.ts directly for fetching tasks on initial load.

