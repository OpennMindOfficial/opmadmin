// src/app/actions/taskActions.ts
'use server';

import { fetchTaskById, updateTask, type TaskRecord, fetchTasksForUser } from '@/services/baserowService';
import { revalidatePath } from 'next/cache';
import { formatISO } from 'date-fns';
import { logActivityAction } from './activityLogActions';

interface GetTasksResult {
  success: boolean;
  tasks?: TaskRecord[];
  error?: string;
}

// This is the function that gets called by the UI pages to fetch tasks
export async function getTasksForUserAction(userEmail: string): Promise<GetTasksResult> {
  console.log(`--- getTasksForUserAction: Initiated for user ${userEmail} ---`);
  if (!userEmail) {
    console.error('[getTasksForUserAction] Error: User email is required.');
    return { success: false, error: 'User email is required to fetch tasks.' };
  }
  try {
    // Ensure we are calling fetchTasksForUser for listing tasks by user email
    const tasks = await fetchTasksForUser(userEmail); 
    console.log(`[getTasksForUserAction] Fetched ${tasks?.length || 0} tasks for user ${userEmail}.`);
    return { success: true, tasks: tasks || [] };
  } catch (error: any) {
    let detailedErrorMessage = 'Failed to fetch tasks.';
    if (error.message) {
      detailedErrorMessage = error.message;
    }
    // If the error object has a url property (as our makeBaserowRequest might add), include it.
    // This helps confirm which URL caused the error.
    if (error.url) {
      detailedErrorMessage = `API request to ${error.url} failed: ${detailedErrorMessage}`;
    }
    console.error(`[getTasksForUserAction] CRITICAL Error for user ${userEmail}:`, detailedErrorMessage, error.stack);
    return { success: false, error: detailedErrorMessage };
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
      console.error('[markTaskCompleteAction] Error: Task ID and User Email are required.');
      return { success: false, error: 'Task ID and User Email are required.' };
    }

    const task = await fetchTaskById(taskId);
    if (!task) {
      console.error(`[markTaskCompleteAction] Error: Task with ID ${taskId} not found.`);
      return { success: false, error: `Task with ID ${taskId} not found.` };
    }
    console.log('[markTaskCompleteAction] Fetched task details:', JSON.stringify(task, null, 2));

    const assigneesString = task['assigned to'];
    if (!assigneesString || typeof assigneesString !== 'string') {
      console.error('[markTaskCompleteAction] Error: Task has no assignees or assignee field is malformed. Value:', assigneesString);
      return { success: false, error: 'Task has no assignees or assignee field is malformed.' };
    }
    const assigneesArray = assigneesString.split(',').map(email => email.trim().toLowerCase());
    console.log('[markTaskCompleteAction] Assignees array:', assigneesArray);

    const userIndex = assigneesArray.indexOf(currentUserEmail.toLowerCase());
    if (userIndex === -1) {
      console.error(`[markTaskCompleteAction] Error: User ${currentUserEmail} is not assigned to this task.`);
      return { success: false, error: `User ${currentUserEmail} is not assigned to this task.` };
    }
    console.log(`[markTaskCompleteAction] User ${currentUserEmail} found at index ${userIndex} of assignees.`);

    // Handle 'Completed' field
    let completedArray: string[] = new Array(assigneesArray.length).fill("No");
    if (task.Completed && typeof task.Completed === 'string' && task.Completed.trim() !== '') {
      const existingStatuses = task.Completed.split(',').map(s => s.trim());
      console.log('[markTaskCompleteAction] Existing statuses from task.Completed:', existingStatuses);
      for (let i = 0; i < Math.min(assigneesArray.length, existingStatuses.length); i++) {
        if (existingStatuses[i] === "Yes" || existingStatuses[i] === "No") {
            completedArray[i] = existingStatuses[i];
        }
      }
    }
    console.log('[markTaskCompleteAction] Initialized/Populated completedArray:', completedArray, 'Original task.Completed:', task.Completed);
    
    completedArray[userIndex] = "Yes";
    const newCompletedStatus = completedArray.join(',');
    console.log(`[markTaskCompleteAction] New 'Completed' status string to be saved: "${newCompletedStatus}"`);

    // Handle 'Date_of_completion' field
    let dateCompletionArray: string[] = new Array(assigneesArray.length).fill("");
    if (task.Date_of_completion && typeof task.Date_of_completion === 'string' && task.Date_of_completion.trim() !== '') {
      const existingDates = task.Date_of_completion.split(',').map(s => s.trim());
      console.log('[markTaskCompleteAction] Existing dates from task.Date_of_completion:', existingDates);
      for (let i = 0; i < Math.min(assigneesArray.length, existingDates.length); i++) {
        dateCompletionArray[i] = existingDates[i];
      }
    }
    console.log('[markTaskCompleteAction] Initialized/Populated dateCompletionArray:', dateCompletionArray, 'Original task.Date_of_completion:', task.Date_of_completion);

    dateCompletionArray[userIndex] = `${currentUserEmail}:${formatISO(new Date())}`;
    const newDateOfCompletion = dateCompletionArray.join(',');
    console.log(`[markTaskCompleteAction] New 'Date_of_completion' string to be saved: "${newDateOfCompletion}"`);

    const updates: Partial<TaskRecord> = {
      Completed: newCompletedStatus,
      Date_of_completion: newDateOfCompletion,
    };
    console.log('[markTaskCompleteAction] Payload for updateTask:', JSON.stringify(updates, null, 2));

    const updatedTaskResponse = await updateTask(taskId, updates);

    if (!updatedTaskResponse || typeof updatedTaskResponse.id !== 'number') {
      console.error(`[markTaskCompleteAction] Error: Failed to update task ${taskId} in Baserow or received invalid response.`);
      return { success: false, error: 'Failed to update task in Baserow or received incomplete data.' };
    }
    console.log(`[markTaskCompleteAction] Successfully updated task ${taskId}. Response from Baserow:`, JSON.stringify(updatedTaskResponse, null, 2));

    // Verification Log (Optional but helpful for debugging)
    const returnedCompletedArray = updatedTaskResponse.Completed?.split(',').map(s => s.trim()) || [];
    const returnedDateCompletionArray = updatedTaskResponse.Date_of_completion?.split(',').map(s => s.trim()) || [];

    if (returnedCompletedArray[userIndex] !== "Yes" || !returnedDateCompletionArray[userIndex]?.startsWith(currentUserEmail)) {
        console.warn(`[markTaskCompleteAction] POTENTIAL DATA MISMATCH for task ${taskId}, user ${currentUserEmail}. Baserow response might not fully reflect intended changes for this user's slot. Sent Completed: "${newCompletedStatus}", Received: "${updatedTaskResponse.Completed}". Sent Date: "${newDateOfCompletion}", Received: "${updatedTaskResponse.Date_of_completion}"`);
    }

    // Log activity
    await logActivityAction({
      Name: currentUserEmail, // Using email as user identifier
      Did: 'completed task',
      Task: task.Task || 'Untitled Task',
    });

    revalidatePath('/');
    revalidatePath('/tasks');
    console.log('[markTaskCompleteAction] Paths revalidated.');
    return { success: true, updatedTask: updatedTaskResponse };

  } catch (error: any) {
    let detailedErrorMessage = 'Failed to mark task as complete.';
    if (error.message) {
      detailedErrorMessage = error.message;
    }
    if (error.url) {
      detailedErrorMessage = `API request to ${error.url} failed: ${detailedErrorMessage}`;
    }
    console.error(`[markTaskCompleteAction] CRITICAL Error for task ${taskId} by user ${currentUserEmail}:`, detailedErrorMessage, error.stack);
    return { success: false, error: detailedErrorMessage };
  }
}

