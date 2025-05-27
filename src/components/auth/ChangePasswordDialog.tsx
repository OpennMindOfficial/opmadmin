
// src/components/auth/ChangePasswordDialog.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from '@/app/actions/authActions';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, KeyRound } from 'lucide-react';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPasswordChangedSuccess: (email: string, userName: string, userId?: number) => void; // Pass email, name, and userId up
  userId: number | null; // Receive Baserow user ID
  userEmail: string; // Keep for display/logging if needed, but userId is primary
  userName: string; // Receive user's full name
}

export function ChangePasswordDialog({
  isOpen,
  onOpenChange,
  onPasswordChangedSuccess,
  userId,
  userEmail, // Retained for context, but userId is used for the action
  userName
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setError('');
    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('Please confirm your new password.');
      return;
    }
    if (newPassword.length < 6) { // Keep consistent with account settings page if needed, or update there
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!userId) {
      setError('User identifier is missing. Cannot change password.');
      console.error("ChangePasswordDialog: userId is null or undefined.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword(userId, newPassword); // Use userId
      if (result.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been successfully updated.",
          variant: "default",
        });
        localStorage.setItem('currentUserEmail', userEmail); // Persist email
        localStorage.setItem('currentUserFullName', userName); // Persist name
        if(userId) localStorage.setItem('userId', userId.toString()); // Persist userId
        onPasswordChangedSuccess(userEmail, userName, userId); // Pass userId back
        onOpenChange(false);
      } else {
        setError(result.error || 'Failed to change password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Set Your New Password
          </DialogTitle>
          <DialogDescription>
            This is your first sign-in. Please set a new password for your account.
            This password can be changed later via Account Settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="new-password-initial">New Password</Label>
            <Input
              id="new-password-initial"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="bg-background dark:bg-muted/30"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm-password-initial">Confirm Password</Label>
            <Input
              id="confirm-password-initial"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="bg-background dark:bg-muted/30"
            />
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/30 text-center">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              'Set New Password'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    