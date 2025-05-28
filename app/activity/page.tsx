
// src/app/activity/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users as PageIcon, CheckCircle, FileText, MessageSquare, Edit3, Loader2, AlertTriangle, RefreshCw, type LucideIcon } from 'lucide-react';
import { getActivityLogsAction, type ActivityLogClientEntry } from '@/app/actions/activityLogActions';
import { formatTimeAgo } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const getActionIcon = (action: string): LucideIcon => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('completed task')) return CheckCircle;
  if (lowerAction.includes('added') && lowerAction.includes('subject')) return FileText; 
  if (lowerAction.includes('added') && lowerAction.includes('note')) return Edit3; 
  if (lowerAction.includes('updated') && lowerAction.includes('profile')) return Users; 
  if (lowerAction.includes('commented')) return MessageSquare;
  return PageIcon; 
};

const getIconColor = (action: string): string => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('completed task')) return 'text-green-500';
  if (lowerAction.includes('added')) return 'text-blue-500';
  if (lowerAction.includes('updated')) return 'text-yellow-500';
  if (lowerAction.includes('commented')) return 'text-purple-500';
  if (lowerAction.includes('reported bug')) return 'text-red-500';
  return 'text-muted-foreground';
};


export default function ActivityPage() {
  const [activityLog, setActivityLog] = useState<ActivityLogClientEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getActivityLogsAction(); 
      if (result.success && result.logs) {
        setActivityLog(result.logs);
      } else {
        setError(result.error || "Failed to load activity logs.");
        toast({ title: "Error", description: result.error || "Failed to load logs.", variant: "destructive" });
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      toast({ title: "Error", description: e.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ y: [0, -2, 0, 2, 0], scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              >
                <PageIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" /> 
              </motion.div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Platform Activity</h1>
            </div>
            <p className="text-md md:text-lg text-muted-foreground md:ml-13">
              Track recent changes, updates, and completed tasks across the platform.
            </p>
          </div>
          <Button onClick={fetchActivities} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Activity
          </Button>
        </section>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">Activity Feed</CardTitle>
            <CardDescription>Recent actions performed by your team members.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading activity...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-destructive">
                <AlertTriangle className="mx-auto h-8 w-8" />
                <p className="mt-2 font-semibold">Could not load activity</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : activityLog.length === 0 ? (
               <p className="text-muted-foreground text-center py-10">No recent platform activity found.</p>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {activityLog.map(activity => {
                    const ActionIcon = getActionIcon(activity.action);
                    const iconColor = getIconColor(activity.action);
                    return (
                      <motion.div 
                        key={activity.id} 
                        className="flex items-start space-x-3 md:space-x-4 p-3 hover:bg-accent rounded-lg transition-colors duration-150"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar className="h-8 w-8 md:h-10 md:w-10 border">
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${activity.name.charAt(0)}`} alt={activity.name} data-ai-hint="person user"/>
                          <AvatarFallback>{activity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">{activity.name}</span>
                            <span className="text-muted-foreground"> {activity.action}: </span>
                            <span className="font-medium text-primary break-all">{activity.subject}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                        <ActionIcon className={`h-5 w-5 ${iconColor} self-center flex-shrink-0`} />
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
    