
// src/services/baserowService.ts
'use server';

const BASEROW_API_URL = 'https://api.baserow.io';
const BASEROW_API_KEY = '1GWSYGr6hU9Gv7W3SBk7vNlvmUzWa8Io'; 
const BASEROW_TEAM_TABLE_ID = '551777'; 
const BASEROW_CEO_TABLE_ID = '552544';
const BASEROW_SUBJECT_NOTES_TABLE_ID = '551357'; // Updated table ID

export interface UserRecord {
  id: number;
  order: string;
  Name?: string;
  Email: string;
  Password?: string; 
  'First signin'?: string; 
  'Last active'?: string; 
  'First time'?: 'YES' | 'NO';
  Role?: string; 
  [key: string]: any; 
}

export interface CeoUserRecord {
  id: number;
  order: string;
  Name?: string;
  Email: string;
  Password?: string;
  'Last active'?: string;
  [key: string]: any;
}

export interface SubjectNoteRecord {
  id: number; // System ID
  order: string;
  Subject?: string;
  Chapter?: string;
  Notes?: string;
  ID?: number | string; // The custom ID field the user added for their reference
  [key: string]: any;
}

async function makeBaserowRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
) {
  const url = `${BASEROW_API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Authorization': `Token ${BASEROW_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
    cache: 'no-store', 
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`Baserow Request: ${method} ${url}`, body && method !== 'GET' ? `Body: ${JSON.stringify(body)}` : '(No Body or GET request)');

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error JSON.' }));
      console.error('Baserow API Error:', { status: response.status, statusText: response.statusText, errorData, url, method, requestBody: body ? JSON.stringify(body) : 'No Body' });
      throw new Error(errorData.detail || `Baserow API request failed: ${response.status} ${response.statusText}`);
    }

    if (method === 'DELETE' || response.status === 204) {
      console.log(`Baserow Response: ${response.status} ${response.statusText} (No Content for ${method} ${url})`);
      return null; 
    }
    
    const responseData = await response.json();
    console.log(`Baserow Response Data for ${method} ${url}:`, JSON.stringify(responseData, null, 2));
    return responseData;

  } catch (error: any) {
    console.error('Error in makeBaserowRequest:', { message: error.message, endpoint, method });
    throw error;
  }
}

// Team User Functions
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/?user_field_names=true&filter__Email__equal=${encodeURIComponent(email)}`;
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    if (data && data.results && data.results.length > 0) {
      return data.results[0] as UserRecord;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch user by email ${email} from team table:`, error);
    return null;
  }
}

export async function updateUser(rowId: number, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/${rowId}/?user_field_names=true`;
  const fieldsToUpdate: { [key: string]: any } = {};
  for (const key in updates) {
    if (key !== 'id' && key !== 'order' && Object.prototype.hasOwnProperty.call(updates, key)) {
      fieldsToUpdate[key] = (updates as any)[key];
    }
  }

  try {
    return await makeBaserowRequest(endpoint, 'PATCH', fieldsToUpdate);
  } catch (error) {
    console.error(`Failed to update user ${rowId} in team table:`, error);
    return null;
  }
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/?user_field_names=true&size=200`; 
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return (data?.results || []) as UserRecord[];
  } catch (error) {
    console.error('Failed to fetch all users from team table:', error);
    return [];
  }
}

// CEO User Functions
export async function getCeoByEmail(email: string): Promise<CeoUserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_CEO_TABLE_ID}/?user_field_names=true&filter__Email__equal=${encodeURIComponent(email)}`;
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    if (data && data.results && data.results.length > 0) {
      return data.results[0] as CeoUserRecord;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch CEO by email ${email} from CEO table:`, error);
    return null;
  }
}

export async function updateCeoRecord(rowId: number, updates: Partial<CeoUserRecord>): Promise<CeoUserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_CEO_TABLE_ID}/${rowId}/?user_field_names=true`;
  const fieldsToUpdate: { [key: string]: any } = {};
  for (const key in updates) {
    if (key !== 'id' && key !== 'order' && Object.prototype.hasOwnProperty.call(updates, key)) {
      fieldsToUpdate[key] = (updates as any)[key];
    }
  }
  try {
    return await makeBaserowRequest(endpoint, 'PATCH', fieldsToUpdate);
  } catch (error) {
    console.error(`Failed to update CEO record ${rowId} in CEO table:`, error);
    return null;
  }
}

// Subject Notes Functions
export async function fetchSubjectNotes(): Promise<SubjectNoteRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return (data?.results || []) as SubjectNoteRecord[];
  } catch (error) {
    console.error('Failed to fetch subject notes:', error);
    return [];
  }
}

export async function createSubjectNote(noteData: { Subject?: string; Chapter?: string; Notes?: string }): Promise<SubjectNoteRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'POST', noteData);
  } catch (error) {
    console.error('Failed to create subject note:', error);
    return null;
  }
}

export async function updateSubjectNote(
  rowId: number, // This is the system ID of the row
  updates: Partial<Omit<SubjectNoteRecord, 'id' | 'order' | 'ID'>> // We don't update the system id, order, or the custom ID field via this.
): Promise<SubjectNoteRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/${rowId}/?user_field_names=true`;
  console.log(`--- Service: updateSubjectNote ---`);
  console.log(`Attempting to PATCH URL: ${BASEROW_API_URL}${endpoint}`);
  console.log(`With payload:`, JSON.stringify(updates, null, 2));
  try {
    const result = await makeBaserowRequest(endpoint, 'PATCH', updates);
    console.log(`Baserow PATCH response for row ${rowId} in updateSubjectNote:`, JSON.stringify(result, null, 2));
    return result; 
  } catch (error) {
    console.error(`Failed to update subject note ${rowId} in service:`, error);
    return null;
  }
}

export async function deleteSubjectNote(rowId: number): Promise<boolean> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/${rowId}/`;
  try {
    await makeBaserowRequest(endpoint, 'DELETE');
    return true; 
  } catch (error) {
    console.error(`Failed to delete subject note ${rowId}:`, error);
    return false;
  }
}
