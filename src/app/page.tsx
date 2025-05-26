
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { Sparkles, ChevronDown, Pin, Plus, ArrowUpRight, NotebookPen, PlusCircle, Bug, FileText, ListPlus, BarChart3, FileQuestion, Library, Users, Star, PlugZap, TestTube2, UserCog, BellPlus, Activity, BrainCircuit, Settings2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LoginDialog } from '@/components/auth/LoginDialog';

export default function DashboardRedesignPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(true);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLoginDialog(false);
  };

  useEffect(() => {
    // This effect can be used to manage dialog visibility based on auth state if needed
  }, [isAuthenticated, showLoginDialog]);


  if (!isAuthenticated && showLoginDialog) {
    return (
      <LoginDialog
        isOpen={showLoginDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isAuthenticated) {
            // User tried to close dialog without logging in.
            // Keep dialog mandatory by not setting showLoginDialog to false.
          } else {
            setShowLoginDialog(isOpen);
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

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
              <h2 className="text-2xl font-semibold">Quick Actions & Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <NewActionCard
                title="Create Subject Notes"
                description="Draft and organize comprehensive notes for various academic subjects."
                imageHint="notes education"
                actionIcon={NotebookPen}
                cardVariant="page"
                primaryActionLabel="Create"
              />
              <NewActionCard
                title="Add Subject"
                description="Introduce a new subject area or course to the learning platform."
                imageHint="subject plus"
                actionIcon={PlusCircle}
                cardVariant="task"
                primaryActionLabel="Add"
              />
              <NewActionCard
                title="View Reported Bugs"
                description="Track, review, and manage software bugs reported by users."
                imageHint="bug report"
                actionIcon={Bug}
                cardVariant="data"
                primaryActionLabel="View"
              />
              <NewActionCard
                title="Edit About Us"
                description="Update the 'About Us' page content for the platform."
                imageHint="content edit"
                actionIcon={FileText}
                cardVariant="content"
                primaryActionLabel="Edit"
              />
               <NewActionCard
                title="Add Facts"
                description="Contribute interesting and relevant facts to the platform's knowledge base."
                imageHint="fact list"
                actionIcon={ListPlus}
                cardVariant="task"
                primaryActionLabel="Add"
              />
              <NewActionCard
                title="Performance Tracking"
                description="Analyze user performance metrics and engagement statistics."
                imageHint="analytics chart"
                actionIcon={BarChart3}
                cardVariant="data"
                primaryActionLabel="Analyze"
              />
              <NewActionCard
                title="Add Questions to QB"
                description="Expand the question bank by adding new questions and answers."
                imageHint="question bank"
                actionIcon={FileQuestion}
                cardVariant="page"
                primaryActionLabel="Add"
              />
              <NewActionCard
                title="NCERT Sources"
                description="Manage and reference NCERT educational materials and resources."
                imageHint="education book"
                actionIcon={Library}
                cardVariant="content"
                primaryActionLabel="Manage"
              />
              <NewActionCard
                title="User's Account Data"
                description="Access and manage individual user account details and settings."
                imageHint="user profile"
                actionIcon={Users}
                cardVariant="account"
                primaryActionLabel="Manage"
              />
              <NewActionCard
                title="Pro Users"
                description="View and manage premium 'Pro' user accounts and subscriptions."
                imageHint="premium star"
                actionIcon={Star}
                cardVariant="account"
                primaryActionLabel="Manage"
              />
               <NewActionCard
                title="API in Use"
                description="Monitor the status and usage of currently active APIs."
                imageHint="api connection"
                actionIcon={PlugZap}
                cardVariant="server"
                primaryActionLabel="Monitor"
              />
              <NewActionCard
                title="API Testing"
                description="Perform tests and diagnostics on various API endpoints for stability."
                imageHint="test development"
                actionIcon={TestTube2}
                cardVariant="server"
                primaryActionLabel="Test"
              />
              <NewActionCard
                title="Account Changes (User)"
                description="Review recent modifications and updates to user accounts."
                imageHint="user settings"
                actionIcon={UserCog}
                cardVariant="account"
                primaryActionLabel="Review"
              />
              <NewActionCard
                title="Add Notifications"
                description="Create and dispatch platform-wide notifications to users."
                imageHint="alert message"
                actionIcon={BellPlus}
                cardVariant="communication"
                primaryActionLabel="Create"
              />
              <NewActionCard
                title="Website Traffic"
                description="Analyze data on website visits, user flow, and engagement patterns."
                imageHint="analytics traffic"
                actionIcon={Activity}
                cardVariant="data"
                primaryActionLabel="Analyze"
              />
              <NewActionCard
                title="AI Usage"
                description="Track metrics and patterns related to AI feature utilization."
                imageHint="ai brain"
                actionIcon={BrainCircuit}
                cardVariant="data"
                primaryActionLabel="Track"
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

  return (
     <LoginDialog
        isOpen={!isAuthenticated}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isAuthenticated) {
            // User trying to close unauthenticated dialog
            // Potentially add a small shake animation or visual cue here if desired
            return;
          }
          setShowLoginDialog(isOpen);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
  );
}

