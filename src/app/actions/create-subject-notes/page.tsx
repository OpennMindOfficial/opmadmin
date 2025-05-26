// src/app/actions/create-subject-notes/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { CourseStatusSection } from '@/components/dashboard/course-status-section';
import { NotebookPen } from 'lucide-react'; // Example icon

export default function CreateSubjectNotesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header Section specific to this page */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <NotebookPen className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Create Subject Notes</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Draft, organize, and manage your comprehensive subject notes here.
            </p>
          </div>
          {/* Optional: Add a relevant small graphic or button here if needed */}
        </section>

        {/* Metrics Overview Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Key Metrics</h2>
          <MetricsOverview />
        </section>

        {/* Progress Overview Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Related Progress</h2>
          <ProgressOverview />
        </section>

        {/* Course Status Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Content Status Overview</h2>
          <CourseStatusSection />
        </section>

      </main>
    </div>
  );
}
