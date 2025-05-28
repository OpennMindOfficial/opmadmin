
// src/app/actions/notificationActions.ts
'use server';

import {
  fetchNotifications,
  createNotification,
  type NotificationBaserowRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

interface GetNotificationsResult {
  success: boolean;
  notifications?: NotificationBaserowRecord[];
  error?: string;
}

export async function getNotificationsAction(): Promise<GetNotificationsResult> {
  try {
    const notifications = await fetchNotifications();
    return { success: true, notifications };
  } catch (error: any) {
    console.error('Error in getNotificationsAction:', error);
    return { success: false, error: error.message || 'Failed to fetch notifications.' };
  }
}

interface SendNotificationResult {
  success: boolean;
  notification?: NotificationBaserowRecord;
  error?: string;
}

// This interface matches the form data structure
export interface NotificationFormData {
  Title: string;
  Message: string; // Maps to Desc
  Target: 'All Users' | 'Specific Group' | 'Specific User';
  TargetIdentifier?: string;
  PageToTakeTo?: string;
  ShownFrom?: string;
  ShownTill?: string;
}

export async function sendNotificationAction(data: NotificationFormData): Promise<SendNotificationResult> {
  try {
    let shownToValue = data.Target;
    if (data.Target === 'Specific Group' && data.TargetIdentifier) {
      shownToValue = `Group:${data.TargetIdentifier}`;
    } else if (data.Target === 'Specific User' && data.TargetIdentifier) {
      shownToValue = `User:${data.TargetIdentifier}`;
    }

    // Prepare payload for Baserow, excluding fields not directly mapped or handled by Baserow (like id, order, created_on, etc.)
    const payload: Omit<NotificationBaserowRecord, 'id' | 'order' | 'created_on' | 'updated_on' | 'Views' | 'Clicks'> = {
      Title: data.Title,
      Desc: data.Message,
      PageToTakeTo: data.PageToTakeTo || undefined, // Send undefined if empty string
      ShownTo: shownToValue,
      ShownFrom: data.ShownFrom || undefined, 
      ShownTill: data.ShownTill || undefined,
      // Views and Clicks are defaulted to 0 by the createNotification service function
    };
    
    console.log("Payload for sendNotificationAction:", payload);

    const newNotification = await createNotification(payload);
    if (!newNotification) {
      throw new Error('Failed to create notification in Baserow.');
    }
    revalidatePath('/actions/add-notifications');
    return { success: true, notification: newNotification };
  } catch (error: any) {
    console.error('Error in sendNotificationAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while sending the notification.' };
  }
}
