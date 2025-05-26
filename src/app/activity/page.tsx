
// src/app/activity/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, CheckCircle, FileText, MessageSquare, Edit3 } from 'lucide-react';

// Mock activity data
const activityLog = [
  { id: '1', user: 'Alice Wonderland', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman face', action: 'completed task', subject: 'Finalize Q3 Report', time: '2 hours ago', icon: CheckCircle, iconColor: 'text-green-500' },
  { id: '2', user: 'Bob The Builder', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'man face', action: 'added a new subject', subject: 'Quantum Physics 101', time: '5 hours ago', icon: FileText, iconColor: 'text-blue-500' },
  { id: '3', user: 'Carol Danvers', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman superhero', action: 'commented on thread', subject: 'Marketing Campaign Brainstorm', time: '1 day ago', icon: MessageSquare, iconColor: 'text-purple-500' },
  { id: '4', user: 'David Copperfield', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'man illusionist', action: 'updated user profile', subject: 'His own profile', time: '2 days ago', icon: Edit3, iconColor: 'text-yellow-500' },
  { id: '5', user: 'Eve Moneypenny', avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman secretary', action: 'reported a bug', subject: 'Login button unresponsive on Safari', time: '3 days ago', icon: Users, iconColor: 'text-red-500' },
];


export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Users className="h-10 w-10 text-primary" /> {/* Using Users icon for general activity */}
              <h1 className="text-4xl font-bold tracking-tight">Platform Activity</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Track recent changes, updates, and completed tasks across the platform.
            </p>
          </div>
        </section>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Recent actions performed by your team members.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {activityLog.map(activity => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-accent rounded-lg transition-colors duration-150">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={activity.avatar} alt={activity.user} data-ai-hint={activity.dataAiHint} />
                        <AvatarFallback>{activity.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{activity.user}</span>
                          <span className="text-muted-foreground"> {activity.action}: </span>
                          <span className="font-medium text-primary">{activity.subject}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <ActivityIcon className={`h-5 w-5 ${activity.iconColor} self-center`} />
                    </div>
                  );
                })}
                {activityLog.length === 0 && (
                  <p className="text-muted-foreground text-center py-10">No recent activity.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
