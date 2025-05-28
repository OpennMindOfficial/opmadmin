
// src/app/actions/add-notifications/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellPlus as PageIcon, Send, Loader2, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { getNotificationsAction, sendNotificationAction } from '@/app/actions/notificationActions';
import type { NotificationBaserowRecord } from '@/services/baserowService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO, isValid } from 'date-fns';

const notificationSchema = z.object({
  Title: z.string().min(1, "Title is required.").max(100, "Title too long."),
  Message: z.string().min(1, "Message (description) is required.").max(1000, "Message too long."),
  Target: z.enum(['All Users', 'Specific Group', 'Specific User'], {
    required_error: "Target audience is required.",
  }),
  TargetIdentifier: z.string().optional(),
  PageToTakeTo: z.string().url("Must be a valid URL for redirection.").optional().or(z.literal('')),
  ShownFrom: z.string().optional(), // Can be enhanced with date picker
  ShownTill: z.string().optional(), // Can be enhanced with date picker
}).refine(data => data.Target === 'All Users' || (data.TargetIdentifier && data.TargetIdentifier.trim() !== ''), {
  message: "Target identifier is required if not targeting all users.",
  path: ["TargetIdentifier"],
});

type NotificationFormData = z.infer<typeof notificationSchema>;

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return 'N/A';
  try { 
    const date = parseISO(timestamp); 
    return isValid(date) ? format(date, "MMM dd, yyyy hh:mm a") : 'Invalid Date'; 
  } catch { return 'Invalid Date Format'; }
};

const parseAudience = (shownTo?: string): string => {
    if (!shownTo) return 'N/A';
    if (shownTo.startsWith('Group:')) return `Group (${shownTo.substring(6)})`;
    if (shownTo.startsWith('User:')) return `User (${shownTo.substring(5)})`;
    return shownTo;
};


export default function AddNotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationBaserowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit: handleFormSubmit, reset, watch, control, formState: { errors } } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { Target: 'All Users', Title: '', Message: '', TargetIdentifier: '', PageToTakeTo: '', ShownFrom: '', ShownTill: '' }
  });
  const selectedTarget = watch("Target");

  const fetchNotifications = async () => {
    setIsLoading(true); setError(null);
    try {
      const result = await getNotificationsAction(); 
      if (result.success && result.notifications) {
        setNotifications(result.notifications);
      } else { 
        setError(result.error || "Failed to load notifications."); 
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to load notifications." });
      }
    } catch (err: any) { 
      setError(err.message); 
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchNotifications(); }, []); 

  const onSubmit: SubmitHandler<NotificationFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await sendNotificationAction(data); 
      if (result.success && result.notification) {
        toast({ title: "Notification Sent", description: "The notification has been dispatched." });
        reset(); 
        fetchNotifications(); 
      } else { 
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to send notification." }); 
      }
    } catch (e: any) { 
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Add Notifications</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Create and dispatch platform-wide notifications to users. (Table ID: 542798)
            </p>
          </div>
           <Button onClick={fetchNotifications} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh List
          </Button>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
              <CardDescription>Compose and send notifications to users or groups.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="Title">Title <span className="text-destructive">*</span></Label>
                  <Input id="Title" {...register('Title')} disabled={isSubmitting} />
                  {errors.Title && <p className="text-sm text-destructive mt-1">{errors.Title.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="Message">Message (Desc) <span className="text-destructive">*</span></Label>
                  <Textarea id="Message" {...register('Message')} rows={4} disabled={isSubmitting} />
                  {errors.Message && <p className="text-sm text-destructive mt-1">{errors.Message.message}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="Target">Target Audience <span className="text-destructive">*</span></Label>
                        <Controller
                            name="Target"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    value={field.value} 
                                    onValueChange={field.onChange}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger id="Target"><SelectValue placeholder="Select target" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All Users">All Users</SelectItem>
                                        <SelectItem value="Specific Group">Specific Group</SelectItem>
                                        <SelectItem value="Specific User">Specific User</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.Target && <p className="text-sm text-destructive mt-1">{errors.Target.message}</p>}
                    </div>
                    {selectedTarget && selectedTarget !== 'All Users' && (
                        <div>
                            <Label htmlFor="TargetIdentifier">Target Identifier <span className="text-destructive">*</span></Label>
                            <Input 
                                id="TargetIdentifier" 
                                {...register('TargetIdentifier')} 
                                placeholder={selectedTarget === 'Specific Group' ? "Enter Group Name/ID" : "Enter User Email/ID"} 
                                disabled={isSubmitting} 
                            />
                            {errors.TargetIdentifier && <p className="text-sm text-destructive mt-1">{errors.TargetIdentifier.message}</p>}
                        </div>
                    )}
                </div>
                <div>
                    <Label htmlFor="PageToTakeTo">Redirect URL (Optional)</Label>
                    <Input id="PageToTakeTo" type="url" {...register('PageToTakeTo')} placeholder="https://example.com/target-page" disabled={isSubmitting} />
                    {errors.PageToTakeTo && <p className="text-sm text-destructive mt-1">{errors.PageToTakeTo.message}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="ShownFrom">Show From (YYYY-MM-DD, Optional)</Label>
                        <Input id="ShownFrom" type="text" {...register('ShownFrom')} placeholder="e.g., 2024-06-01" disabled={isSubmitting} />
                        {errors.ShownFrom && <p className="text-sm text-destructive mt-1">{errors.ShownFrom.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="ShownTill">Show Until (YYYY-MM-DD, Optional)</Label>
                        <Input id="ShownTill" type="text" {...register('ShownTill')} placeholder="e.g., 2024-06-15" disabled={isSubmitting} />
                        {errors.ShownTill && <p className="text-sm text-destructive mt-1">{errors.ShownTill.message}</p>}
                    </div>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send Notification
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Sent Notifications</h2>
           {isLoading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading notifications...</p></div>
          ) : error ? (
            <div className="text-destructive text-center py-10"><AlertTriangle className="h-8 w-8 mx-auto mb-2" /><p>{error}</p></div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-1/3">Message</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {notifications.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No notifications sent yet.</TableCell></TableRow>
                        ) : (
                        notifications.map((notif) => (
                            <TableRow key={notif.id}>
                            <TableCell className="font-medium">{notif.Title || 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{notif.Desc || 'N/A'}</TableCell>
                            <TableCell className="text-sm">{parseAudience(notif.ShownTo)}</TableCell>
                            <TableCell>
                                {notif.PageToTakeTo ? (
                                <a href={notif.PageToTakeTo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center text-sm">
                                    Link <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                                ) : (
                                <span className="text-xs text-muted-foreground">N/A</span>
                                )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatTimestamp(notif.created_on)}</TableCell>
                            <TableCell className="text-right">{notif.Views ?? 0}</TableCell>
                            <TableCell className="text-right">{notif.Clicks ?? 0}</TableCell>
                            </TableRow>
                        ))
                        )}
                    </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
