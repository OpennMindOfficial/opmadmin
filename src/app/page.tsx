
"use client"; 

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { Sparkles, ChevronDown, Pin, Plus, ArrowUpRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LoginDialog } from '@/components/auth/LoginDialog'; // Import the LoginDialog

export default function DashboardRedesignPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Show login dialog by default if not authenticated.
  // Set to true to initially show the dialog. Set to false to bypass for development.
  const [showLoginDialog, setShowLoginDialog] = useState(true); 

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginDialog(false);
  };

  // Effect to ensure dialog is shown if not authenticated and dialog is not already manually closed
  useEffect(() => {
    if (!isAuthenticated && !showLoginDialog) {
      // This case might happen if showLoginDialog was programmatically set to false
      // but authentication hasn't happened. We ensure it's shown.
      // However, typical flow is that showLoginDialog starts true.
    }
  }, [isAuthenticated, showLoginDialog]);


  if (!isAuthenticated && showLoginDialog) {
    return (
      <LoginDialog 
        isOpen={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }
  
  // If authenticated or login dialog is bypassed (e.g. for dev, if showLoginDialog starts false and isAuthenticated starts true)
  // show the main dashboard content.
  if (isAuthenticated || !showLoginDialog) { 
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Morning Team!</h1>
              <p className="text-lg text-muted-foreground">
                Collaborate with your team and organize your work here!
              </p>
            </div>
            <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Abstract team collaboration graphic"
                width={600}
                height={400}
                className="rounded-lg object-cover"
                data-ai-hint="abstract network play button"
              />
            </div>
          </section>

          {/* Actions Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NewActionCard
                title="Create a Page"
                description="Create your first Client to start building your Clients knowledge base."
                imageSrc="https://placehold.co/200x100.png" // Placeholder, ideally an image with document icons
                imageAlt="Create a Page illustration"
                imageHint="documents ui interface cards" // Updated hint
              />
              <NewActionCard
                title="Create a Task"
                description="Create your first Case to start building your Cases knowledge base."
                imageSrc="https://placehold.co/200x100.png"
                imageAlt="Create a Task illustration"
                imageHint="task list checkbox"
              />
              <NewActionCard
                title="Create a Thread"
                description="Create your first Client to start building your Clients knowledge base."
                imageSrc="https://placehold.co/200x100.png"
                imageAlt="Create a Thread illustration"
                imageHint="chat bubbles conversation"
                actionIcon={MessageSquare} 
              />
            </div>
          </section>

          {/* Pinned Items Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pin className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Pinned Items</h2>
                <ChevronDown className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm text-muted-foreground hover:text-foreground">
                <Link href="#">
                  Pin a new item
                  <Plus className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card className="h-40 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow rounded-lg bg-card">
                <CardContent className="flex flex-col items-center justify-center text-center p-4">
                  <Pin className="h-8 w-8 text-muted-foreground mb-2" />
                  <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Pin an item
                  </Button>
                </CardContent>
              </Card>
              <Card className="h-40 rounded-lg bg-muted/50"></Card>
              <Card className="h-40 rounded-lg bg-muted/50"></Card>
            </div>
          </section>

          {/* Latest Activity Section */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">Latest activity</h2>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground cursor-pointer" />
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <p className="text-muted-foreground">Your latest activity will appear here...</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Fallback, in case isAuthenticated is false and showLoginDialog is also false (e.g. dev override)
  // You might want to render null or a loading spinner, or redirect.
  // For now, this ensures the LoginDialog is the primary gate if not authenticated.
  return (
     <LoginDialog 
        isOpen={!isAuthenticated} 
        onOpenChange={(isOpen) => {
          // If the dialog is closed by means other than login (e.g., pressing Esc),
          // we might want to keep `showLoginDialog` true or handle it based on app logic.
          // For simplicity, if it's closed, we reflect that. User would need to refresh to see it again
          // if they didn't log in, unless `showLoginDialog` is controlled more strictly.
          setShowLoginDialog(isOpen); 
        }} 
        onLoginSuccess={handleLoginSuccess} 
      />
  );
}
