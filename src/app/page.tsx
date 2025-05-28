
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { TaskCard } from '@/components/dashboard/task-card';
import { Sparkles, ChevronDown, Pin, ArrowUpRight, NotebookPen, PlusCircle as PlusCircleIcon, Bug, FileText, ListPlus, BarChart3, FileQuestion, Library, Users, Star, PlugZap, TestTube2, UserCog, BellPlus, Activity as ActivityIconLucide, BrainCircuit, Loader2, GanttChartSquare, DatabaseZap, Edit3, UserCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { ChangePasswordDialog } from '@/components/auth/ChangePasswordDialog';
import { updateUserLastActive } from '@/app/actions/authActions';
import { getTasksForUserAction } from '@/app/actions/taskActions'; // New import
import type { TaskRecord } from '@/services/baserowService'; // New import
import OpmImage from './opm.png';
import { useToast } from '@/hooks/use-toast';


export default function DashboardRedesignPage() {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [currentUserEmailForPasswordChange, setCurrentUserEmailForPasswordChange] = useState('');
  const [currentUserIdForPasswordChange, setCurrentUserIdForPasswordChange] = useState<number | null>(null);
  const [currentUserFullName, setCurrentUserFullName] = useState('');
  const [greeting, setGreeting] = useState('Good morning');
  const [userFirstName, setUserFirstName] = useState('');
  const [isCeoLoggedIn, setIsCeoLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [assignedTasks, setAssignedTasks] = useState<TaskRecord[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserTasks = async (email: string) => {
    setIsLoadingTasks(true);
    setTasksError(null);
    try {
      const result = await getTasksForUserAction(email);
      if (result.success && result.tasks) {
        // Sort by Due date (ascending, assuming date strings are comparable or convert them)
        // For simplicity, this example assumes string comparison works or they are already sorted.
        // A more robust sort would parse dates.
        const sortedTasks = result.tasks.sort((a, b) => (a.Due || "").localeCompare(b.Due || ""));
        setAssignedTasks(sortedTasks.slice(0, 3)); // Show max 3 tasks
      } else {
        setTasksError(result.error || "Failed to load tasks.");
      }
    } catch (e: any) {
      setTasksError(e.message || "An unexpected error occurred while fetching tasks.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    setIsClient(true); 

    const storedEmail = localStorage.getItem('currentUserEmail');
    const storedFullName = localStorage.getItem('currentUserFullName');
    const storedIsCeo = localStorage.getItem('isCeoLoggedIn') === 'true';
    const storedUserIdStr = localStorage.getItem('userId');
    const userId = storedUserIdStr ? parseInt(storedUserIdStr) : null;

    if (storedEmail && userId) {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      setCurrentUserFullName(storedFullName || '');
      setIsCeoLoggedIn(storedIsCeo);
      setCurrentUserEmail(storedEmail);
      fetchUserTasks(storedEmail); // Fetch tasks for logged-in user

      if (!storedIsCeo) {
        updateUserLastActive(userId) 
          .then(res => {
            if (res.success && res.userName) {
              setCurrentUserFullName(res.userName);
              localStorage.setItem('currentUserFullName', res.userName);
              if (res.userRole) localStorage.setItem('userRole', res.userRole);
            }
          })
          .catch(err => console.error("Failed to update last active time on revisit:", err));
      }
    } else {
      setIsAuthenticated(false); 
      setShowLoginDialog(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!isClient) return; 

    if (!isAuthenticated && !showChangePasswordDialog) {
      setShowLoginDialog(true);
    } else if (isAuthenticated) {
      setShowLoginDialog(false);
    }
  }, [isAuthenticated, showChangePasswordDialog, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    const nameToUse = currentUserFullName || localStorage.getItem('currentUserFullName');
    if (nameToUse) {
      setUserFirstName(nameToUse.split(' ')[0]);
    } else {
      setUserFirstName('');
    }
  }, [currentUserFullName, isAuthenticated, isClient]);


  const handleLoginSuccess = (email: string, userName: string, userId?: number, userRole?: string, isCeo?: boolean, authMethod?: string) => {
    setIsAuthenticated(true);
    setShowLoginDialog(false);
    setCurrentUserFullName(userName);
    setIsCeoLoggedIn(!!isCeo);
    setCurrentUserEmail(email);
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('currentUserFullName', userName);
    if (userId) localStorage.setItem('userId', userId.toString());
    if (userRole) localStorage.setItem('userRole', userRole);
    if (authMethod) localStorage.setItem('authMethod', authMethod);

    if (isCeo) {
        localStorage.setItem('isCeoLoggedIn', 'true');
    } else {
        localStorage.removeItem('isCeoLoggedIn');
    }
    fetchUserTasks(email); // Fetch tasks on login
  };

  const handleFirstTimeLogin = (email: string, userName: string, userId?: number, userRole?: string, authMethod?: string) => {
    setCurrentUserEmailForPasswordChange(email);
    setCurrentUserFullName(userName);
    if(userId) setCurrentUserIdForPasswordChange(userId);
    if (userRole) localStorage.setItem('userRole', userRole);
    if (authMethod) localStorage.setItem('authMethod', authMethod);
    setShowLoginDialog(false);
    setShowChangePasswordDialog(true);
  };

  const handlePasswordChangedSuccess = (email: string, userName: string, userId?: number) => {
    setIsAuthenticated(true);
    setShowChangePasswordDialog(false);
    setCurrentUserFullName(userName);
    setIsCeoLoggedIn(false); // Assuming first time login is never CEO for password change flow
    setCurrentUserEmail(email);
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('currentUserFullName', userName);
    if (userId) localStorage.setItem('userId', userId.toString());
    localStorage.removeItem('isCeoLoggedIn');
    fetchUserTasks(email); // Fetch tasks after password change & login
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUserFullName');
    localStorage.removeItem('isCeoLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authMethod');
    setIsAuthenticated(false);
    setShowLoginDialog(true); 
    setShowChangePasswordDialog(false);
    setCurrentUserEmailForPasswordChange('');
    setCurrentUserIdForPasswordChange(null);
    setCurrentUserFullName('');
    setUserFirstName('');
    setIsCeoLoggedIn(false);
    setCurrentUserEmail(null);
    setAssignedTasks([]);
  };

  const handleTaskUpdate = () => {
    if (currentUserEmail) {
      fetchUserTasks(currentUserEmail); // Re-fetch tasks when one is updated
    }
  };


  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (showChangePasswordDialog && (currentUserIdForPasswordChange)) {
    return (
      <ChangePasswordDialog
        isOpen={showChangePasswordDialog}
        onOpenChange={(isOpen) => {
          setShowChangePasswordDialog(isOpen);
          if (!isOpen && !isAuthenticated) {
            setShowLoginDialog(true);
          }
        }}
        onPasswordChangedSuccess={handlePasswordChangedSuccess}
        userId={currentUserIdForPasswordChange}
        userEmail={currentUserEmailForPasswordChange} 
        userName={currentUserFullName}
      />
    );
  }

  if (!isAuthenticated && showLoginDialog) {
     return (
      <LoginDialog
        isOpen={showLoginDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isAuthenticated) {
            setShowLoginDialog(true); 
          } else {
            setShowLoginDialog(isOpen);
          }
        }}
        onLoginSuccess={handleLoginSuccess}
        onFirstTimeLogin={handleFirstTimeLogin}
      />
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav onLogout={handleLogout} isCeoLoggedIn={isCeoLoggedIn} />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                 {greeting}, {userFirstName || (isCeoLoggedIn ? 'CEO' : 'User')}!
              </h1>
              <p className="text-lg text-muted-foreground">
                 {isCeoLoggedIn
                    ? "Welcome, CEO. Oversee your OpennMind platform's strategy and operations."
                    : "Fuel your day with an OpennMind. Let's organize and achieve!"}
              </p>
            </div>
            <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
              <Image
                src={OpmImage}
                alt="OpennMind Application Logo"
                width={600}
                height={400}
                className="rounded-lg object-cover"
                data-ai-hint="application logo"
                priority
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
                description="Introduce a new subject area, topics, and chapters to the learning platform."
                imageHint="subject plus"
                actionIcon={PlusCircleIcon}
                cardVariant="task"
                primaryActionLabel="Add"
                href="/actions/add-subject"
              />
              <NewActionCard
                title="View Reported Bugs"
                description="Track, review, and manage software bugs reported by users and team members."
                imageHint="bug report"
                actionIcon={Bug}
                cardVariant="data"
                primaryActionLabel="View"
                href="/actions/view-bugs"
              />
              <NewActionCard
                title="Edit About Us"
                description="Update the 'Mission' and 'Story' sections of the platform's About Us page."
                imageHint="content edit"
                actionIcon={FileText}
                cardVariant="content"
                primaryActionLabel="Edit"
                href="/actions/edit-about-us"
              />
               <NewActionCard
                title="Add Facts"
                description="Contribute interesting facts with categories, sources, and images."
                imageHint="fact list"
                actionIcon={ListPlus}
                cardVariant="task"
                primaryActionLabel="Add"
                href="/actions/add-facts"
              />
              <NewActionCard
                title="Performance Tracking"
                description="Analyze user study habits, goal progress, and subject performance metrics."
                imageHint="analytics chart"
                actionIcon={BarChart3}
                cardVariant="data"
                primaryActionLabel="Analyze"
                href="/actions/performance-tracking"
              />
              <NewActionCard
                title="Add Questions to QB"
                description="Expand the question bank by adding new questions and solutions, individually or in bulk."
                imageHint="question bank"
                actionIcon={FileQuestion}
                cardVariant="page"
                primaryActionLabel="Add"
                href="/actions/add-questions"
              />
              <NewActionCard
                title="NCERT Sources"
                description="Manage and reference NCERT educational materials, including audio resources."
                imageHint="education book"
                actionIcon={Library}
                cardVariant="content"
                primaryActionLabel="Manage"
                href="/actions/ncert-sources"
              />
              <NewActionCard
                title="User's Account Data"
                description="Access and manage individual user account details and settings (secure access)."
                imageHint="user profile"
                actionIcon={Users}
                cardVariant="account"
                primaryActionLabel="Manage"
                href="/actions/user-accounts"
              />
              <NewActionCard
                title="Pro Users"
                description="Manage premium 'Pro' user subscriptions and details (secure access)."
                imageHint="premium star"
                actionIcon={Star}
                cardVariant="account"
                primaryActionLabel="Manage"
                href="/actions/pro-users"
              />
               <NewActionCard
                title="API in Use"
                description="Monitor the status and usage of currently active internal and external APIs."
                imageHint="api connection"
                actionIcon={PlugZap}
                cardVariant="server"
                primaryActionLabel="Monitor"
                href="/actions/api-status"
              />
              <NewActionCard
                title="API Testing"
                description="Perform tests and diagnostics on various API endpoints for stability and performance."
                imageHint="test development"
                actionIcon={TestTube2}
                cardVariant="server"
                primaryActionLabel="Test"
                href="/actions/api-testing"
              />
              <NewActionCard
                title="Account Changes (User)"
                description="Review recent modifications and updates to user accounts and profiles."
                imageHint="user settings"
                actionIcon={UserCog}
                cardVariant="account"
                primaryActionLabel="Review"
                href="/actions/account-changes"
              />
              <NewActionCard
                title="Add Notifications"
                description="Create and dispatch platform-wide or targeted notifications to users."
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
                actionIcon={ActivityIconLucide}
                cardVariant="data"
                primaryActionLabel="Analyze"
                href="/actions/website-traffic"
              />
              <NewActionCard
                title="AI Usage"
                description="Track metrics and patterns related to AI feature utilization and performance."
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
            {isLoadingTasks ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-2 text-muted-foreground">Loading your tasks...</p>
              </div>
            ) : tasksError ? (
                <div className="text-center py-10 text-destructive bg-destructive/10 p-4 rounded-md">
                    <AlertTriangle className="mx-auto h-8 w-8" />
                    <p className="mt-2 font-semibold">Could not load tasks</p>
                    <p className="text-sm">{tasksError}</p>
                </div>
            ) : assignedTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No tasks assigned to you at the moment. Enjoy your free time!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"> 
                {assignedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    currentUserEmail={currentUserEmail}
                    onTaskUpdated={handleTaskUpdate} 
                  />
                ))}
              </div>
            )}
          </section>

          {/* Latest Activity Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-semibold">Latest activity</h2>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm text-muted-foreground hover:text-foreground">
                <Link href="/activity">
                  View all
                </Link>
              </Button>
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
    <div className="min-h-screen flex items-center justify-center bg-background">
       <p className="text-muted-foreground">Initializing OpennMind...</p>
       <Loader2 className="h-8 w-8 animate-spin text-primary ml-2" />
    </div>
  );
}
