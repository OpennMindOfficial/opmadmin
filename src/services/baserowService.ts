
// src/services/baserowService.ts
'use server';

const BASEROW_API_URL = 'https://api.baserow.io';
const BASEROW_API_KEY = '1GWSYGr6hU9Gv7W3SBk7vNlvmUzWa8Io'; 

// Table ID for team/user login and general user data (now Account Settings table)
const BASEROW_TEAM_TABLE_ID = '552726'; 

// Table ID for CEO specific login
const BASEROW_CEO_TABLE_ID = '552544';

// Table ID for Subject Notes
const BASEROW_SUBJECT_NOTES_TABLE_ID = '552726'; 

// Table IDs for Management Pages
const BASEROW_ADD_SUBJECT_TABLE_ID = '548576';
const BASEROW_BUG_REPORTS_TABLE_ID = '542797';
const BASEROW_ABOUT_US_TABLE_ID = '542795';

// Table IDs for Secure Page Access
const BASEROW_PAGE_PASSWORD_TABLE_ID = '552919';
const BASEROW_ACCESS_LOG_TABLE_ID = '552920';

// Table IDs for Performance Tracking
const BASEROW_PERFORMANCE_USER_MAIN_TABLE_ID = '546405';
const BASEROW_PERFORMANCE_SUBJECT_TABLE_ID = '546409';


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
  DOB?: string; 
  Class?: string; 
  AuthMethod?: string; 
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
  ID?: number | string; 
  [key: string]: any;
}

// Record Interfaces for Management Pages
export interface AddSubjectBaserowRecord {
  id: number;
  order: string;
  Subject: string;
  Topics?: string;
  Chapters?: string;
  'Topics divided'?: string; 
  [key: string]: any;
}

export interface BugReportBaserowRecord {
  id: number;
  order: string;
  Name: string;
  Email: string;
  Report: string;
  Date: string; 
  [key: string]: any;
}

export interface AboutUsBaserowRecord {
  id: number; 
  order: string;
  Mission: string;
  Story: string;
  [key: string]: any;
}

// Interfaces for Secure Page Access
export interface PagePasswordRecord {
    id: number;
    order: string;
    Password?: string; // Stores the bcrypt hash
    Identifier?: string; // Optional: To identify which page this password is for
    [key: string]: any;
}

export interface AccessLogRecord {
    id?: number; // Baserow will assign this
    order?: string; // Baserow will assign this
    Name?: string;
    Email?: string;
    'Date/Time'?: string; // ISO string
    Result?: 'Success' | 'Failure';
    Reason?: string; // e.g., "Incorrect Password", "Account Locked", "NULL" for success
    [key: string]: any;
}

// Interfaces for Performance Tracking
export interface PerformanceUserMainDataRecord {
  id: number;
  order: string;
  Name?: string;
  Email?: string;
  'Total Study Hours'?: number;
  'Goal Completion'?: string;
  'Active days streak'?: number;
  'Lessons Completed'?: number;
  'Avg Study Session'?: string;
  'Completion Rate'?: string;
  'Notes Taken'?: number;
  'Retention Rate'?: string;
  'Daily Study'?: string;
  [key: string]: any;
}

export interface PerformanceSubjectDataRecord {
  id: number;
  order: string;
  Name?: string;
  Email?: string;
  Subjects?: string;
  Hours?: string;
  'Goal Progress'?: string;
  'Last Active'?: string;
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
    cache: 'no-store', // Important for ensuring fresh data, especially after mutations
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  console.log(`[BaserowService] Request: ${method} ${url}`, body && (method === 'POST' || method === 'PATCH') ? `Body: ${JSON.stringify(body)}` : '(No Body or GET/DELETE request)');

  try {
    const response = await fetch(url, options);
    
    console.log(`[BaserowService] Response Status for ${method} ${url}: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
         console.error('[BaserowService] API Error Data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        errorData = { detail: `Failed to parse error JSON. Status: ${response.status} ${response.statusText}` };
        console.error('[BaserowService] Failed to parse error JSON from Baserow.');
      }
      const errorMessage = errorData?.detail || errorData?.error?.detail || `Baserow API request failed: ${response.status} ${response.statusText}`;
      console.error('[BaserowService] Full API Error:', { status: response.status, statusText: response.statusText, errorDetail: errorMessage, url, method, requestBody: body ? JSON.stringify(body) : 'No Body' });
      throw new Error(errorMessage);
    }

    if (method === 'DELETE' || response.status === 204) { 
      console.log(`[BaserowService] Response: ${response.status} ${response.statusText} (No Content for ${method} ${url})`);
      return null; 
    }
    
    const responseData = await response.json();
    // console.log(`[BaserowService] Response Data for ${method} ${url}:`, JSON.stringify(responseData, null, 2).substring(0, 500) + '...'); 
    return responseData;

  } catch (error: any) {
    console.error(`[BaserowService] CRITICAL Error in makeBaserowRequest to ${url} with method ${method}:`, error.message, error.stack);
    throw error; 
  }
}

// Team User Functions (now primary user functions)
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/?user_field_names=true&filter__Email__equal=${encodeURIComponent(email)}`;
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    if (data && data.results && data.results.length > 0) {
      return data.results[0] as UserRecord;
    }
    return null;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch user by email ${email} from table ${BASEROW_TEAM_TABLE_ID}:`, error);
    return null;
  }
}

export async function getUserById(rowId: number): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/${rowId}/?user_field_names=true`;
   try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return data as UserRecord;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch user by ID ${rowId} from table ${BASEROW_TEAM_TABLE_ID}:`, error);
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
  console.log(`[BaserowService] updateUser: Attempting to update user ${rowId} in table ${BASEROW_TEAM_TABLE_ID} with fields:`, JSON.stringify(fieldsToUpdate));

  try {
    const updatedUser = await makeBaserowRequest(endpoint, 'PATCH', fieldsToUpdate);
    console.log('[BaserowService] updateUser: Update user response:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error(`[BaserowService] updateUser: Failed to update user ${rowId} in table ${BASEROW_TEAM_TABLE_ID}:`, error);
    throw error; 
  }
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/?user_field_names=true&size=200`; 
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return (data?.results || []) as UserRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch all users from table ${BASEROW_TEAM_TABLE_ID}:`, error);
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
    console.error(`[BaserowService] Failed to fetch CEO by email ${email} from CEO table ${BASEROW_CEO_TABLE_ID}:`, error);
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
    console.error(`[BaserowService] Failed to update CEO record ${rowId} in CEO table ${BASEROW_CEO_TABLE_ID}:`, error);
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
    console.error(`[BaserowService] Failed to fetch subject notes from table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, error);
    return [];
  }
}

export async function createSubjectNote(noteData: { Subject?: string; Chapter?: string; Notes?: string }): Promise<SubjectNoteRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'POST', noteData);
  } catch (error) {
    console.error(`[BaserowService] Failed to create subject note in table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, error);
    return null;
  }
}

export async function updateSubjectNote(
  rowId: number, 
  updates: Partial<Omit<SubjectNoteRecord, 'id' | 'order' | 'ID'>> 
): Promise<SubjectNoteRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/${rowId}/?user_field_names=true`;
  console.log(`--- Service: updateSubjectNote (Table ID: ${BASEROW_SUBJECT_NOTES_TABLE_ID}) ---`);
  console.log(`[BaserowService] Attempting to PATCH URL: ${BASEROW_API_URL}${endpoint}`);
  console.log(`[BaserowService] With payload:`, JSON.stringify(updates, null, 2));
  try {
    const result = await makeBaserowRequest(endpoint, 'PATCH', updates);
    console.log(`[BaserowService] Baserow PATCH response for row ${rowId} in table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, result ? JSON.stringify(result, null, 2) : "null/undefined");
    return result; 
  } catch (error) {
    console.error(`[BaserowService] Failed to update subject note ${rowId} in table ${BASEROW_SUBJECT_NOTES_TABLE_ID} (service level):`, error);
    throw error; 
  }
}

export async function deleteSubjectNote(rowId: number): Promise<boolean> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/${rowId}/`;
  try {
    await makeBaserowRequest(endpoint, 'DELETE');
    return true; 
  } catch (error) {
    console.error(`[BaserowService] Failed to delete subject note ${rowId} from table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, error);
    return false;
  }
}

// --- Service Functions for Management Pages ---

// Add Subject Service Functions
export async function fetchAllSubjects(): Promise<AddSubjectBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_ADD_SUBJECT_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as AddSubjectBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch subjects from table ${BASEROW_ADD_SUBJECT_TABLE_ID}:`, error);
    return [];
  }
}

export async function createNewSubject(subjectData: Omit<AddSubjectBaserowRecord, 'id' | 'order'>): Promise<AddSubjectBaserowRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_ADD_SUBJECT_TABLE_ID}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'POST', subjectData);
  } catch (error) {
    console.error(`[BaserowService] Failed to create subject in table ${BASEROW_ADD_SUBJECT_TABLE_ID}:`, error);
    return null;
  }
}

// View Reported Bugs Service Functions
export async function fetchAllBugReports(): Promise<BugReportBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_BUG_REPORTS_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as BugReportBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch bug reports from table ${BASEROW_BUG_REPORTS_TABLE_ID}:`, error);
    return [];
  }
}

// Edit About Us Service Functions
export async function fetchAboutUsData(rowId: number = 1): Promise<AboutUsBaserowRecord | null> { 
  const endpoint = `/api/database/rows/table/${BASEROW_ABOUT_US_TABLE_ID}/${rowId}/?user_field_names=true`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return data as AboutUsBaserowRecord;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch About Us data from table ${BASEROW_ABOUT_US_TABLE_ID}, row ${rowId}:`, error);
    return null;
  }
}

export async function updateAboutUsData(rowId: number = 1, contentData: Pick<AboutUsBaserowRecord, 'Mission' | 'Story'>): Promise<AboutUsBaserowRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_ABOUT_US_TABLE_ID}/${rowId}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'PATCH', contentData);
  } catch (error) {
    console.error(`[BaserowService] Failed to update About Us data in table ${BASEROW_ABOUT_US_TABLE_ID}, row ${rowId}:`, error);
    return null;
  }
}

// --- Service Functions for Secure Page Access ---
export async function fetchFirstPagePassword(identifier?: string): Promise<PagePasswordRecord | null> {
  let endpoint = `/api/database/rows/table/${BASEROW_PAGE_PASSWORD_TABLE_ID}/?user_field_names=true&size=1`;
  try {
    const data = await makeBaserowRequest(endpoint);
    if (data && data.results && data.results.length > 0) {
      return data.results[0] as PagePasswordRecord;
    }
    console.warn(`[BaserowService] No password record found in table ${BASEROW_PAGE_PASSWORD_TABLE_ID}. Endpoint: ${endpoint}`);
    return null;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch page password from table ${BASEROW_PAGE_PASSWORD_TABLE_ID}:`, error);
    return null;
  }
}

export async function createAccessLogEntry(logData: Partial<AccessLogRecord>): Promise<AccessLogRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_ACCESS_LOG_TABLE_ID}/?user_field_names=true`;
  try {
    const payload = {
        Name: logData.Name || 'N/A',
        Email: logData.Email || 'N/A',
        'Date/Time': logData['Date/Time'] || new Date().toISOString(),
        Result: logData.Result || 'Failure',
        Reason: logData.Reason || 'Unknown',
    };
    return await makeBaserowRequest(endpoint, 'POST', payload);
  } catch (error) {
    console.error(`[BaserowService] Failed to create access log entry in table ${BASEROW_ACCESS_LOG_TABLE_ID}:`, error);
    return null;
  }
}

// --- Service Functions for Protected Data (User Accounts, Pro Users) ---
const BASEROW_USER_ACCOUNTS_DATA_TABLE_ID = '542785';
export async function fetchUserAccountData(): Promise<UserRecord[]> {
    const endpoint = `/api/database/rows/table/${BASEROW_USER_ACCOUNTS_DATA_TABLE_ID}/?user_field_names=true&size=200`;
    try {
        const data = await makeBaserowRequest(endpoint);
        return (data?.results || []) as UserRecord[];
    } catch (error) {
        console.error(`[BaserowService] Failed to fetch user account data from table ${BASEROW_USER_ACCOUNTS_DATA_TABLE_ID}:`, error);
        return [];
    }
}

const BASEROW_PRO_USERS_DATA_TABLE_ID = '552928';
export interface ProUserSpecificRecord extends UserRecord { 
    DatePurchased?: string;
    DateExpiring?: string;
    Cost?: number;
    'Monthly/Yearly'?: 'Monthly' | 'Yearly';
}
export async function fetchProUsersData(): Promise<ProUserSpecificRecord[]> {
    const endpoint = `/api/database/rows/table/${BASEROW_PRO_USERS_DATA_TABLE_ID}/?user_field_names=true&size=200`;
    try {
        const data = await makeBaserowRequest(endpoint);
        return (data?.results || []) as ProUserSpecificRecord[];
    } catch (error) {
        console.error(`[BaserowService] Failed to fetch pro users data from table ${BASEROW_PRO_USERS_DATA_TABLE_ID}:`, error);
        return [];
    }
}

// --- Service Function for Performance Tracking Data ---
export async function fetchPerformanceTableData(tableId: string): Promise<Array<PerformanceUserMainDataRecord | PerformanceSubjectDataRecord>> {
  const endpoint = `/api/database/rows/table/${tableId}/?user_field_names=true&size=200`; // size=200 is a Baserow default max per page
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as Array<PerformanceUserMainDataRecord | PerformanceSubjectDataRecord>;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch performance data from table ${tableId}:`, error);
    return [];
  }
}
