
// src/app/actions/websiteTrafficActions.ts
'use server';

import {
  fetchWebsiteTrafficData,
  type WebsiteTrafficBaserowRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

interface GetWebsiteTrafficDataResult {
  success: boolean;
  trafficData?: WebsiteTrafficBaserowRecord[];
  error?: string;
}

export async function getWebsiteTrafficDataAction(): Promise<GetWebsiteTrafficDataResult> {
  try {
    const trafficData = await fetchWebsiteTrafficData();
    // Optional: Revalidate the path if this data is frequently updated and needs to be fresh
    // revalidatePath('/actions/website-traffic'); 
    return { success: true, trafficData };
  } catch (error: any) {
    console.error('Error in getWebsiteTrafficDataAction:', error);
    return { success: false, error: error.message || 'Failed to fetch website traffic data.' };
  }
}
