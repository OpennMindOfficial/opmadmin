
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { TaskCard } from '@/components/dashboard/task-card';
import { Sparkles, ChevronDown, Pin, ArrowUpRight, NotebookPen, PlusCircle as PlusCircleIcon, Bug, FileText, ListPlus, BarChart3, FileQuestion, Library, Users, Star, PlugZap, TestTube2, UserCog, BellPlus, Activity as ActivityIconLucide, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { ChangePasswordDialog } from '@/components/auth/ChangePasswordDialog';
import { updateUserLastActive } from '@/app/actions/authActions';
import OpmImage from './opm.png'; 


const homePageTasksData = [
  { id: 'hpTask1', title: 'Finalize Q3 Report', project: 'Project Alpha', dueDate: 'Oct 28', initialCompleted: false },
  { id: 'hpTask2', title: 'User Persona Workshop', project: 'Marketing Campaign', dueDate: 'Nov 05', initialCompleted: false },
  { id: 'hpTask3', title: 'Develop API Endpoint', project: 'Platform Upgrade', dueDate: 'Nov 12', initialCompleted: false },
];


export default function DashboardRedesignPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(true); 
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [currentUserEmailForPasswordChange, setCurrentUserEmailForPasswordChange] = useState('');
  const [currentUserFullName, setCurrentUserFullName] = useState('');
  const [greeting, setGreeting] = useState('Good morning');
  const [userFirstName, setUserFirstName] = useState('');
  const [isCeoLoggedIn, setIsCeoLoggedIn] = useState(false);


  useEffect(() => {
    const storedEmail = localStorage.getItem('currentUserEmail');
    const storedFullName = localStorage.getItem('currentUserFullName');
    const storedIsCeo = localStorage.getItem('isCeoLoggedIn') === 'true';
    const storedUserIdStr = localStorage.getItem('userId'); // Get user ID
    const userId = storedUserIdStr ? parseInt(storedUserIdStr) : null;

    if (storedEmail && userId) {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      setCurrentUserFullName(storedFullName || '');
      setIsCeoLoggedIn(storedIsCeo);

      if (!storedIsCeo) { 
        updateUserLastActive(userId) // Pass userId
          .then(res => {
            if (res.success && res.userName) {
              setCurrentUserFullName(res.userName);
              localStorage.setItem('currentUserFullName', res.userName); 
            }
          })
          .catch(err => console.error("Failed to update last active time on revisit:", err));
      }
    } else {
      if (!isAuthenticated && !showChangePasswordDialog) {
        setShowLoginDialog(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  useEffect(() => {
    if (!isAuthenticated && !showChangePasswordDialog && !localStorage.getItem('currentUserEmail')) {
      setShowLoginDialog(true);
    } else if (isAuthenticated || localStorage.getItem('currentUserEmail')) {
      setShowLoginDialog(false);
    }
  }, [isAuthenticated, showChangePasswordDialog]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    if (currentUserFullName) {
      setUserFirstName(currentUserFullName.split(' ')[0]);
    } else {
        const storedName = localStorage.getItem('currentUserFullName');
        if (storedName) {
            setCurrentUserFullName(storedName);
            setUserFirstName(storedName.split(' ')[0]);
        } else {
            setUserFirstName(''); 
        }
    }
  }, [currentUserFullName, isAuthenticated]);


  const handleLoginSuccess = (email: string, userName: string, userId?: number, userRole?: string, isCeo?: boolean, authMethod?: string) => {
    setIsAuthenticated(true);
    setShowLoginDialog(false); 
    setCurrentUserFullName(userName);
    setIsCeoLoggedIn(!!isCeo);
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
  };

  const handleFirstTimeLogin = (email: string, userName: string, userId?: number, userRole?: string, authMethod?: string) => {
    setCurrentUserEmailForPasswordChange(email);
    setCurrentUserFullName(userName); 
    if (userId) localStorage.setItem('userId', userId.toString()); // Store userId for password change
    if (userRole) localStorage.setItem('userRole', userRole);
    if (authMethod) localStorage.setItem('authMethod', authMethod);
    setShowLoginDialog(false); 
    setShowChangePasswordDialog(true);
  };

  const handlePasswordChangedSuccess = (email: string, userName: string, userId?: number) => {
    setIsAuthenticated(true); 
    setShowChangePasswordDialog(false);
    setCurrentUserFullName(userName);
    setIsCeoLoggedIn(false); 
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('currentUserFullName', userName);
    if (userId) localStorage.setItem('userId', userId.toString());
    localStorage.removeItem('isCeoLoggedIn');
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
    setCurrentUserFullName('');
    setUserFirstName('');
    setIsCeoLoggedIn(false);
  };


  if (showChangePasswordDialog && currentUserEmailForPasswordChange) {
    return ( 
      <ChangePasswordDialog
        isOpen={showChangePasswordDialog}
        onOpenChange={(isOpen) => {
          setShowChangePasswordDialog(isOpen);
          if (!isOpen && !isAuthenticated && !localStorage.getItem('currentUserEmail')) {
            setShowLoginDialog(true); 
          }
        }}
        onPasswordChangedSuccess={handlePasswordChangedSuccess}
        userEmail={currentUserEmailForPasswordChange} // Kept for legacy, though userId is preferred
        userName={currentUserFullName}
      />
    );
  }
  
  if (!isAuthenticated && showLoginDialog) {
     return ( 
      <LoginDialog
        isOpen={showLoginDialog} 
        onOpenChange={(isOpen) => {
          setShowLoginDialog(isOpen); 
          if (!isOpen && !isAuthenticated && !showChangePasswordDialog && !localStorage.getItem('currentUserEmail')) {
            // This condition might need adjustment if closing the dialog is intended to always re-show it
            // setShowLoginDialog(true); // Reconsider this if non-auth closure should lead to a blank page
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
                actionIcon={Users} // Consider UserCog for management
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
                actionIcon={ActivityIconLucide} // Using generic Activity, consider specific analytics icon if available
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

  // Fallback for non-authenticated, non-dialog state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Optionally, add a loading spinner or a minimal message here if needed */}
    </div>
  );
}

    