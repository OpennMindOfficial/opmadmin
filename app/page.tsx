
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
import { getTasksForUserAction } from '@/app/actions/taskActions'; 
import type { TaskRecord } from '@/services/baserowService'; 
// Removed: import OpmImage from './opm.png';
import { useToast } from '@/hooks/use-toast';
import { getActivityLogsAction, type ActivityLogClientEntry } from '@/app/actions/activityLogActions';
import * as Utils from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, MessageSquare, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const getActionIconDetails = (action: string): { icon: LucideIcon, color: string } => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('completed task')) return { icon: CheckCircle, color: 'text-green-500' };
  if (lowerAction.includes('added') && lowerAction.includes('subject')) return { icon: FileText, color: 'text-blue-500' };
  if (lowerAction.includes('added') && lowerAction.includes('note')) return { icon: Edit3, color: 'text-blue-500' };
  if (lowerAction.includes('updated') && lowerAction.includes('profile')) return { icon: Users, color: 'text-yellow-500' }; 
  if (lowerAction.includes('commented')) return { icon: MessageSquare, color: 'text-purple-500' };
  return { icon: ActivityIconLucide, color: 'text-muted-foreground' }; 
};


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
  const [recentActivities, setRecentActivities] = useState<ActivityLogClientEntry[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserTasks = async (email: string) => {
    setIsLoadingTasks(true);
    setTasksError(null);
    try {
      const result = await getTasksForUserAction(email);
      if (result.success && result.tasks) {
        setAssignedTasks(result.tasks.slice(0, 3)); 
      } else {
        setTasksError(result.error || "Failed to load tasks.");
      }
    } catch (e: any) {
      setTasksError(e.message || "An unexpected error occurred while fetching tasks.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchRecentActivities = async () => {
    setIsLoadingActivities(true);
    setActivitiesError(null);
    try {
      const result = await getActivityLogsAction(3); 
      if (result.success && result.logs) {
        setRecentActivities(result.logs);
      } else {
        setActivitiesError(result.error || "Failed to load recent activities.");
      }
    } catch (e: any) {
      setActivitiesError(e.message || "An unexpected error occurred while fetching activities.");
    } finally {
      setIsLoadingActivities(false);
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
      fetchUserTasks(storedEmail); 
      fetchRecentActivities(); 

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
    fetchUserTasks(email); 
    fetchRecentActivities();
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
    setIsCeoLoggedIn(false); 
    setCurrentUserEmail(email);
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('currentUserFullName', userName);
    if (userId) localStorage.setItem('userId', userId.toString());
    localStorage.removeItem('isCeoLoggedIn');
    fetchUserTasks(email); 
    fetchRecentActivities();
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
    setRecentActivities([]);
  };

  const handleTaskUpdate = () => {
    if (currentUserEmail) {
      fetchUserTasks(currentUserEmail); 
    }
    fetchRecentActivities();
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
          if (!isOpen && !isAuthenticated) {
             setShowLoginDialog(true);
          }
           setShowChangePasswordDialog(isOpen);
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
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-10">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                 {greeting}, {userFirstName || (isCeoLoggedIn ? 'CEO' : 'User')}!
              </h1>
              <p className="text-md md:text-lg text-muted-foreground">
                 {isCeoLoggedIn
                    ? "Welcome, CEO. Oversee your OpennMind platform's strategy and operations."
                    : "Fuel your day with an OpennMind. Let's organize and achieve!"}
              </p>
            </div>
            <motion.div 
              className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            >
              <Image
                src="/opm.png" // Changed to use public directory path
                alt="OpennMind Application Logo"
                width={600}
                height={400}
                className="rounded-lg object-cover shadow-md"
                data-ai-hint="application logo"
                priority
              />
            </motion.div>
          </section>

          {/* Actions Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-semibold">Quick Actions & Management</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                <h2 className="text-xl md:text-2xl font-semibold">Tasks assigned to you</h2>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"> 
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
                <h2 className="text-xl md:text-2xl font-semibold">Latest activity</h2>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground cursor-pointer" />
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm text-muted-foreground hover:text-foreground">
                <Link href="/activity">
                  View all
                </Link>
              </Button>
            </div>
            <div className="p-4 md:p-6 bg-card rounded-lg shadow-sm">
              {isLoadingActivities ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Loading activities...</p>
                </div>
              ) : activitiesError ? (
                <div className="text-center py-6 text-destructive">
                  <AlertTriangle className="mx-auto h-6 w-6" />
                  <p className="mt-2 text-sm">{activitiesError}</p>
                </div>
              ) : recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-center">No recent activity.</p>
              ) : (
                 <ScrollArea className="h-[180px] pr-3"> 
                    <div className="space-y-4">
                      {recentActivities.map(activity => {
                        const { icon: ActionIcon, color: iconColor } = getActionIconDetails(activity.action);
                        return (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8 border">
                               <AvatarImage src={`https://placehold.co/40x40.png?text=${activity.name.charAt(0)}`} alt={activity.name} data-ai-hint="person user"/>
                              <AvatarFallback>{activity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-sm">
                              <p>
                                <span className="font-semibold text-foreground">{activity.name}</span>
                                <span className="text-muted-foreground"> {activity.action}: </span>
                                <span className="font-medium text-primary">{activity.subject}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">{Utils.formatTimeAgo(activity.timestamp)}</p>
                            </div>
                            <ActionIcon className={`h-4 w-4 ${iconColor} self-center`} />
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
              )}
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
    
