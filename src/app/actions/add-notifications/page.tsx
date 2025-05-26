
// src/app/actions/add-notifications/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { CourseStatusSection } from '@/components/dashboard/course-status-section';
import { Button } from '@/components/ui/button';
import { BellPlus as PageIcon, PlusCircle } from 'lucide-react';

export default function AddNotificationsPage() {
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
              Create and dispatch platform-wide notifications to users.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Key Metrics</h2>
          <MetricsOverview />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Content Status Overview</h2>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
          <CourseStatusSection />
        </section>
      </main>
    </div>
  );
}
