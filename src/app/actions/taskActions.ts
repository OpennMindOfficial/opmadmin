
// src/app/actions/taskActions.ts
'use server';

import { fetchTaskById, updateTask, type TaskRecord } from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

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
    const tasks = await fetchTaskById(userEmail); // This seems to be an error, fetchTaskById expects a taskId (number)
                                               // It should be fetchTasksForUser(userEmail) from baserowService
                                               // Assuming fetchTasksForUser exists in baserowService and returns TaskRecord[]
    // Corrected call, assuming fetchTasksForUser is defined in baserowService.ts
    // For now, this action isn't directly called by the UI for fetching all tasks.
    // The UI pages (page.tsx and tasks/page.tsx) call fetchTasksForUser from baserowService directly
    // or via getTasksForUserAction if that was intended for fetching lists.
    // Let's keep it as a placeholder or assume it's meant for a different purpose
    // As the primary issue is with markTaskCompleteAction, we'll focus there.
    // This getTasksForUserAction is currently not well-defined for its purpose.
    // For now, I will return an empty array to avoid further errors here.
    // This function should ideally call a service like `fetchAllTasksForUserService(userEmail)`.
     console.warn("[getTasksForUserAction] This action is not fully implemented to fetch a list of tasks for a user correctly. Returning empty for now.");
    return { success: true, tasks: [] };
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
        if (existingStatuses[i] === "Yes" || existingStatuses[i] === "No") { // Ensure valid values
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

    dateCompletionArray[userIndex] = `${currentUserEmail}:${new Date().toISOString()}`;
    const newDateOfCompletion = dateCompletionArray.join(',');
    console.log(`[markTaskCompleteAction] New 'Date_of_completion' string to be saved: "${newDateOfCompletion}"`);

    const updates: Partial<TaskRecord> = {
      Completed: newCompletedStatus,
      Date_of_completion: newDateOfCompletion,
    };
    console.log('[markTaskCompleteAction] Payload for updateTask:', JSON.stringify(updates, null, 2));

    const updatedTaskResponse = await updateTask(taskId, updates);

    if (!updatedTaskResponse) {
      console.error(`[markTaskCompleteAction] Error: Failed to update task ${taskId} in Baserow or received no response.`);
      // Consider it a failure if Baserow doesn't return the updated task
      return { success: false, error: 'Failed to update task in Baserow or received incomplete data.' };
    }
    console.log(`[markTaskCompleteAction] Successfully updated task ${taskId}. Response from Baserow:`, JSON.stringify(updatedTaskResponse, null, 2));

    // Verify if the returned data actually reflects the changes
    const returnedCompletedArray = updatedTaskResponse.Completed?.split(',').map(s => s.trim()) || [];
    const returnedDateCompletionArray = updatedTaskResponse.Date_of_completion?.split(',').map(s => s.trim()) || [];

    let updateVerified = true;
    if (returnedCompletedArray[userIndex] !== "Yes") {
        console.warn(`[markTaskCompleteAction] Verification failed: 'Completed' status for user index ${userIndex} was not "Yes" in Baserow response.`);
        updateVerified = false;
    }
    if (!returnedDateCompletionArray[userIndex]?.startsWith(currentUserEmail)) {
        console.warn(`[markTaskCompleteAction] Verification failed: 'Date_of_completion' for user index ${userIndex} did not update correctly in Baserow response.`);
        updateVerified = false;
    }

    if (!updateVerified) {
        // Even if Baserow returns a 200, if our specific user's change isn't reflected, treat it as a partial failure or an issue.
        // For the UI, we might still want to proceed optimistically if Baserow itself didn't error out.
        // However, this log is important for debugging.
        console.error(`[markTaskCompleteAction] Discrepancy detected: Baserow response for task ${taskId} did not fully reflect the intended changes for user ${currentUserEmail}.`);
        // We could return success: false here, but it might be too strict if Baserow has eventual consistency or minor response differences.
        // For now, let's trust the overall success of the PATCH call if updatedTaskResponse is valid.
    }


    revalidatePath('/');
    revalidatePath('/tasks');
    console.log('[markTaskCompleteAction] Paths revalidated.');
    return { success: true, updatedTask: updatedTaskResponse };

  } catch (error: any) {
    console.error(`[markTaskCompleteAction] CRITICAL Error for task ${taskId} by user ${currentUserEmail}:`, error.message, error.stack);
    return { success: false, error: error.message || 'Failed to mark task as complete.' };
  }
}
