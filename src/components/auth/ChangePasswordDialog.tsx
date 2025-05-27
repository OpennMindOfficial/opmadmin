
// src/components/auth/ChangePasswordDialog.tsx
"use client";

import { useState } from 'react';
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
import { changePassword } from '@/app/actions/authActions'; // Server Action

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPasswordChangedSuccess: () => void;
  userEmail: string;
}

export function ChangePasswordDialog({ 
  isOpen, 
  onOpenChange, 
  onPasswordChangedSuccess,
  userEmail 
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await changePassword(userEmail, newPassword);
      if (result.success) {
        onPasswordChangedSuccess();
        onOpenChange(false); // Close dialog
      } else {
        setError(result.error || 'Failed to change password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form state when dialog is opened/closed
  useState(() => {
    if (!isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setIsLoading(false);
    }
  });


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Your Password</DialogTitle>
          <DialogDescription>
            This is your first sign-in. Please set a new password for your account.
            This password can be changed only once through this initial setup. For future changes, please contact support.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-destructive">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? 'Changing...' : 'Set New Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
