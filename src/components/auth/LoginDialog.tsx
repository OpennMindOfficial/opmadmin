
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
import { RefreshCw } from 'lucide-react'; // Icon for refresh captcha

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLoginSuccess: () => void;
}

const generateCaptcha = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function LoginDialog({ isOpen, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCaptchaCode(generateCaptcha());
      setCaptchaInput('');
      setCaptchaError('');
    }
  }, [isOpen]);

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
    setCaptchaError('');
  };

  const handleSignIn = () => {
    if (captchaInput !== captchaCode) {
      setCaptchaError('Captcha does not match. Please try again.');
      handleRefreshCaptcha(); // Refresh captcha on error
      return;
    }
    setCaptchaError('');
    // In a real app, you'd perform authentication here
    console.log('Attempting login with:', email, password);
    onLoginSuccess();
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
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="captcha" className="text-right whitespace-nowrap">
              Captcha
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <div className="flex-shrink-0 bg-muted px-3 py-2 rounded-md border border-input select-none">
                <span className="font-mono tracking-widest text-lg text-foreground">
                  {captchaCode}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRefreshCaptcha} aria-label="Refresh captcha">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="captcha-input" className="text-right sr-only"> 
              Enter Captcha
            </Label>
            <Input
              id="captcha-input"
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="col-span-3 col-start-2" // Align with other inputs
              placeholder="Enter code above"
            />
          </div>
          {captchaError && (
            <div className="col-span-4 text-center text-sm text-destructive">
              {captchaError}
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:gap-2">
          <Button type="submit" onClick={handleSignIn} className="w-full">Sign In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
