
// src/app/actions/aiUsageActions.ts
'use server';

import {
  fetchAiUsageData,
  type AiUsageBaserowRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

interface GetAiUsageDataResult {
  success: boolean;
  usageData?: AiUsageBaserowRecord[];
  error?: string;
}

export async function getAiUsageDataAction(): Promise<GetAiUsageDataResult> {
  try {
    const usageData = await fetchAiUsageData();
    // Optional: Revalidate the path if this data is frequently updated
    // revalidatePath('/actions/ai-usage'); 
    return { success: true, usageData };
  } catch (error: any) {
    console.error('Error in getAiUsageDataAction:', error);
    return { success: false, error: error.message || 'Failed to fetch AI usage data.' };
  }
}
