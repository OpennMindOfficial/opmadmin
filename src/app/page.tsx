
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { TaskCard } from '@/components/dashboard/task-card';
import { Sparkles, ChevronDown, Pin, Plus, ArrowUpRight, NotebookPen, PlusCircle as PlusCircleIcon, Bug, FileText, ListPlus, BarChart3, FileQuestion, Library, Users, Star, PlugZap, TestTube2, UserCog, BellPlus, Activity, BrainCircuit } from 'lucide-react'; // Renamed PlusCircle to PlusCircleIcon
import Link from 'next/link';
import { LoginDialog } from '@/components/auth/LoginDialog';

// Mock data for "Tasks assigned to you" on the homepage
const homePageTasksData = [
  { id: 'hpTask1', title: 'Finalize Q3 Report', project: 'Project Alpha', dueDate: 'Oct 28', initialCompleted: false },
  { id: 'hpTask2', title: 'User Persona Workshop', project: 'Marketing Campaign', dueDate: 'Nov 05', initialCompleted: false },
  { id: 'hpTask3', title: 'Develop API Endpoint', project: 'Platform Upgrade', dueDate: 'Nov 12', initialCompleted: false },
];


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
                href="/actions/create-subject-notes" 
              />
              <NewActionCard
                title="Add Subject"
                description="Introduce a new subject area or course to the learning platform."
                imageHint="subject plus"
                actionIcon={PlusCircleIcon}
                cardVariant="task"
                primaryActionLabel="Add"
                href="/actions/add-subject"
              />
              <NewActionCard
                title="View Reported Bugs"
                description="Track, review, and manage software bugs reported by users."
                imageHint="bug report"
                actionIcon={Bug}
                cardVariant="data"
                primaryActionLabel="View"
                href="/actions/view-bugs"
              />
              <NewActionCard
                title="Edit About Us"
                description="Update the 'About Us' page content for the platform."
                imageHint="content edit"
                actionIcon={FileText}
                cardVariant="content"
                primaryActionLabel="Edit"
                href="/actions/edit-about-us"
              />
               <NewActionCard
                title="Add Facts"
                description="Contribute interesting and relevant facts to the platform's knowledge base."
                imageHint="fact list"
                actionIcon={ListPlus}
                cardVariant="task"
                primaryActionLabel="Add"
                href="/actions/add-facts"
              />
              <NewActionCard
                title="Performance Tracking"
                description="Analyze user performance metrics and engagement statistics."
                imageHint="analytics chart"
                actionIcon={BarChart3}
                cardVariant="data"
                primaryActionLabel="Analyze"
                href="/actions/performance-tracking"
              />
              <NewActionCard
                title="Add Questions to QB"
                description="Expand the question bank by adding new questions and answers."
                imageHint="question bank"
                actionIcon={FileQuestion}
                cardVariant="page"
                primaryActionLabel="Add"
                href="/actions/add-questions"
              />
              <NewActionCard
                title="NCERT Sources"
                description="Manage and reference NCERT educational materials and resources."
                imageHint="education book"
                actionIcon={Library}
                cardVariant="content"
                primaryActionLabel="Manage"
                href="/actions/ncert-sources"
              />
              <NewActionCard
                title="User's Account Data"
                description="Access and manage individual user account details and settings."
                imageHint="user profile"
                actionIcon={Users}
                cardVariant="account"
                primaryActionLabel="Manage"
                href="/actions/user-accounts"
              />
              <NewActionCard
                title="Pro Users"
                description="View and manage premium 'Pro' user accounts and subscriptions."
                imageHint="premium star"
                actionIcon={Star}
                cardVariant="account"
                primaryActionLabel="Manage"
                href="/actions/pro-users"
              />
               <NewActionCard
                title="API in Use"
                description="Monitor the status and usage of currently active APIs."
                imageHint="api connection"
                actionIcon={PlugZap}
                cardVariant="server"
                primaryActionLabel="Monitor"
                href="/actions/api-status"
              />
              <NewActionCard
                title="API Testing"
                description="Perform tests and diagnostics on various API endpoints for stability."
                imageHint="test development"
                actionIcon={TestTube2}
                cardVariant="server"
                primaryActionLabel="Test"
                href="/actions/api-testing"
              />
              <NewActionCard
                title="Account Changes (User)"
                description="Review recent modifications and updates to user accounts."
                imageHint="user settings"
                actionIcon={UserCog}
                cardVariant="account"
                primaryActionLabel="Review"
                href="/actions/account-changes"
              />
              <NewActionCard
                title="Add Notifications"
                description="Create and dispatch platform-wide notifications to users."
                imageHint="alert message"
                actionIcon={BellPlus}
                cardVariant="communication"
                primaryActionLabel="Create"
                href="/actions/add-notifications"
              />
              <NewActionCard
                title="Website Traffic"
                description="Analyze data on website visits, user flow, and engagement patterns."
                imageHint="analytics traffic"
                actionIcon={Activity}
                cardVariant="data"
                primaryActionLabel="Analyze"
                href="/actions/website-traffic"
              />
              <NewActionCard
                title="AI Usage"
                description="Track metrics and patterns related to AI feature utilization."
                imageHint="ai brain"
                actionIcon={BrainCircuit}
                cardVariant="data"
                primaryActionLabel="Track"
                href="/actions/ai-usage"
              />
            </div>
          </section>

          {/* Tasks Assigned to You Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pin className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Tasks assigned to you</h2>
                <ChevronDown className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm text-muted-foreground hover:text-foreground">
                <Link href="/tasks">
                  View all
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {homePageTasksData.map(task => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  project={task.project}
                  dueDate={task.dueDate}
                  initialCompleted={task.initialCompleted}
                />
              ))}
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
