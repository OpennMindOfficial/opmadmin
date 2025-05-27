
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
import { RefreshCw } from 'lucide-react';
import { verifyLogin } from '@/app/actions/authActions';

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLoginSuccess: (email: string, userName: string) => void; // Pass email and name up
  onFirstTimeLogin: (email: string, userName: string) => void; // Pass email and name up
}

const generateCaptcha = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function LoginDialog({ 
  isOpen, 
  onOpenChange, 
  onLoginSuccess,
  onFirstTimeLogin 
}: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCaptchaCode(generateCaptcha());
      setCaptchaInput(''); 
      setError(''); 
    }
  }, [isOpen]); 

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
    setError(''); 
  };

  const handleSignIn = async () => {
    setError(''); 
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (!captchaInput.trim()) {
      setError('Please enter the captcha code.');
      return;
    }
    if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
      setError('Captcha does not match. Please try again.');
      handleRefreshCaptcha(); 
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await verifyLogin(email, password);
      if (result.success && result.userEmail && result.userName !== undefined) {
        if (result.firstTimeLogin) {
          onOpenChange(false); 
          onFirstTimeLogin(result.userEmail, result.userName); 
        } else {
          localStorage.setItem('currentUserEmail', result.userEmail);
          localStorage.setItem('currentUserFullName', result.userName); 
          onOpenChange(false); 
          onLoginSuccess(result.userEmail, result.userName); 
        }
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
        handleRefreshCaptcha(); 
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      handleRefreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
          <DialogDescription>
            Sign in to access your dashboard and manage your tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email-login" className="text-right">
              Email
            </Label>
            <Input
              id="email-login"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password-login" className="text-right">
              Password
            </Label>
            <Input
              id="password-login"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="captcha-display" className="text-right whitespace-nowrap">
              Captcha
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <div className="flex-shrink-0 bg-muted px-3 py-2 rounded-md border border-input select-none">
                <span className="font-mono tracking-widest text-lg text-foreground">
                  {captchaCode}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRefreshCaptcha} aria-label="Refresh captcha" disabled={isLoading}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="captcha-input-login" className="text-right sr-only"> 
              Enter Captcha
            </Label>
            <Input
              id="captcha-input-login"
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="col-span-3 col-start-2" 
              placeholder="Enter code above"
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="col-span-4 text-center text-sm text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/30">
              {error}
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:gap-2">
          <Button type="submit" onClick={handleSignIn} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : 'Sign In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
