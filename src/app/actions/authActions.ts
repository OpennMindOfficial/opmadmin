
// src/app/actions/authActions.ts
'use server';

import bcrypt from 'bcryptjs';
import { getUserByEmail, updateUser, getAllUsers, type UserRecord } from '@/services/baserowService';

interface LoginResult {
  success: boolean;
  error?: string;
  firstTimeLogin?: boolean;
  userEmail?: string;
  userName?: string;
  userRole?: string;
}

export async function verifyLogin(email: string, plainPassword_providedByUser: string): Promise<LoginResult> {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (!user.Password) {
      console.error(`User ${email} found but has no password set in Baserow.`);
      return { success: false, error: 'Authentication error. Please contact support.' };
    }
    
    const passwordMatches = await bcrypt.compare(plainPassword_providedByUser, user.Password);

    if (!passwordMatches) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isFirstTime = user['First time'] === 'YES';
    const nowISO = new Date().toISOString();
    const userName = user.Name || '';
    const userRole = user.Role || 'Member'; // Default role if not set

    if (!isFirstTime) {
      await updateUser(user.id, { 'Last active': nowISO });
      return { success: true, firstTimeLogin: false, userEmail: user.Email, userName, userRole };
    } else {
      return { success: true, firstTimeLogin: true, userEmail: user.Email, userName, userRole };
    }
  } catch (error: any) {
    console.error('Login verification error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during login.' };
  }
}

interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

export async function changePassword(email: string, newPassword_plaintext: string): Promise<ChangePasswordResult> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword_plaintext, 10);
    const nowISO = new Date().toISOString();

    const updatedUser = await updateUser(user.id, {
      Password: hashedNewPassword,
      'First time': 'NO',
      'First signin': nowISO,
      'Last active': nowISO, 
    });

    // updateUser might return null on success if response is 204 No Content
    // For this specific operation, we consider it success if no error was thrown
    if (updatedUser === undefined && !user) { // Baserow sometimes returns undefined, if it does and we don't have a user object means we failed
        return { success: false, error: 'Failed to update password. Please try again.' };
    }


    return { success: true };
  } catch (error: any) {
    console.error('Password change error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while changing password.' };
  }
}

export async function updateUserLastActive(email: string): Promise<{ success: boolean; error?: string, userName?: string, userRole?: string }> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      console.warn(`updateUserLastActive: User not found for email ${email}.`);
      return { success: false, error: 'User not found for last active update.' };
    }

    const nowISO = new Date().toISOString();
    await updateUser(user.id, { 'Last active': nowISO });
    
    // Similar to changePassword, we check for existence of user if updateUser returns undefined
    if (user === undefined) {
         return { success: false, error: 'Failed to update last active time.' };
    }

    return { success: true, userName: user.Name || '', userRole: user.Role || 'Member' };
  } catch (error: any) {
    console.error(`Error updating last active time for ${email}:`, error);
    return { success: false, error: 'An unexpected error occurred while updating last active time.' };
  }
}

interface AccountDetails extends Omit<UserRecord, 'Password' | 'order' | 'id'> {
  // We don't want to send password hash to client
}

interface FetchAccountDetailsResult {
  success: boolean;
  error?: string;
  details?: AccountDetails;
}

export async function fetchAccountDetails(email: string): Promise<FetchAccountDetailsResult> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }
    const { Password, order, id, ...details } = user;
    return { success: true, details };
  } catch (error: any) {
    console.error(`Error fetching account details for ${email}:`, error);
    return { success: false, error: 'Failed to fetch account details.' };
  }
}

interface UpdateNameResult {
  success: boolean;
  error?: string;
  updatedName?: string;
}

export async function updateUserName(email: string, newName: string): Promise<UpdateNameResult> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }
    if (!newName.trim()) {
      return { success: false, error: 'Name cannot be empty.' };
    }
    const updatedUser = await updateUser(user.id, { Name: newName });
    
    if (updatedUser === undefined && !user) {
        return { success: false, error: 'Failed to update name.' };
    }
    
    return { success: true, updatedName: newName };
  } catch (error: any) {
    console.error(`Error updating name for ${email}:`, error);
    return { success: false, error: 'Failed to update name.' };
  }
}

export interface TeamMemberInfo {
  id: number;
  name: string;
  role: string;
  email: string; // Will be obfuscated on client
}

interface FetchTeamInfoResult {
  success: boolean;
  error?: string;
  teamMembers?: TeamMemberInfo[];
}

export async function fetchTeamInfo(): Promise<FetchTeamInfoResult> {
  try {
    const users = await getAllUsers();
    const teamMembers: TeamMemberInfo[] = users.map(user => ({
      id: user.id,
      name: user.Name || 'N/A',
      role: user.Role || 'Member',
      email: user.Email,
    }));
    return { success: true, teamMembers };
  } catch (error: any) {
    console.error('Error fetching team info:', error);
    return { success: false, error: 'Failed to fetch team information.' };
  }
}
