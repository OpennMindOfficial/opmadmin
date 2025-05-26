
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
import { Github, Chrome } from 'lucide-react'; // Example icons

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLoginSuccess: () => void;
}

export function LoginDialog({ isOpen, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
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
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:gap-2">
          <Button type="submit" onClick={handleSignIn} className="w-full">Sign In</Button>
          <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <Chrome className="mr-2 h-4 w-4" /> Sign In with Google
          </Button>
           <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <Github className="mr-2 h-4 w-4" /> Sign In with GitHub
          </Button>
        </DialogFooter>
         <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
      </DialogContent>
    </Dialog>
  );
}
