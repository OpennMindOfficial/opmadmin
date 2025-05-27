
// src/services/baserowService.ts
'use server';

const BASEROW_API_URL = 'https://api.baserow.io';
const BASEROW_API_KEY = '1GWSYGr6hU9Gv7W3SBk7vNlvmUzWa8Io'; 
const BASEROW_TEAM_TABLE_ID = '551777'; 
const BASEROW_CEO_TABLE_ID = '552544';
const BASEROW_SUBJECT_NOTES_TABLE_ID = '551284';

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
  id: number;
  order: string;
  Subject?: string;
  Chapter?: string;
  Notes?: string;
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
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Baserow API Error:', { status: response.status, errorData, url, method, body });
      throw new Error(errorData.detail || `Baserow API request failed: ${response.statusText}`);
    }
    if (method === 'GET' || method === 'PATCH' || method === 'POST') {
      if (response.status === 204) return null; 
      return await response.json();
    }
    return null; 
  } catch (error) {
    console.error('Error in makeBaserowRequest:', error);
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
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/?user_field_names=true&size=200`; // Adjust size as needed
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

export async function updateSubjectNote(rowId: number, updates: Partial<Omit<SubjectNoteRecord, 'id' | 'order'>>): Promise<SubjectNoteRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/${rowId}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'PATCH', updates);
  } catch (error) {
    console.error(`Failed to update subject note ${rowId}:`, error);
    return null;
  }
}
