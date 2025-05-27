
// src/app/extra-options/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { 
    Settings as PageIcon, // Main page icon
    Users, 
    Edit3, 
    UserCheck, 
    Star, 
    GanttChartSquare, 
    DatabaseZap 
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ExtraOptionsPage() {
  const [isCeo, setIsCeo] = useState(false);

  useEffect(() => {
    // In a real app, you'd get this from context or a more robust auth check
    const ceoStatus = localStorage.getItem('isCeoLoggedIn') === 'true';
    setIsCeo(ceoStatus);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Pass isCeoLoggedIn to NewTopNav if it's needed for its internal logic, e.g., to show correct dropdowns */}
      <NewTopNav isCeoLoggedIn={isCeo} onLogout={() => {
          localStorage.removeItem('currentUserEmail');
          localStorage.removeItem('currentUserFullName');
          localStorage.removeItem('isCeoLoggedIn');
          window.location.href = '/'; // Redirect to home for re-login
      }} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">CEO Control Panel</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Manage platform settings, user data, and advanced operational features.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Management Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <NewActionCard
              title="Assign Tasks"
              description="Delegate tasks and manage team assignments across various projects and initiatives."
              imageHint="task board kanban"
              actionIcon={GanttChartSquare}
              cardVariant="task"
              primaryActionLabel="Assign"
              href="/ceo-actions/assign-tasks" // Placeholder href
            />
            <NewActionCard
              title="View & Edit Platform Data"
              description="Access and modify core platform data, content entries, and system configurations."
              imageHint="database admin panel"
              actionIcon={DatabaseZap}
              cardVariant="data"
              primaryActionLabel="Manage Data"
              href="/ceo-actions/edit-platform-data" // Placeholder href
            />
            <NewActionCard
              title="View/Edit Team Data"
              description="Review and manage team member profiles, roles, permissions, and group structures."
              imageHint="team directory organization"
              actionIcon={Users}
              cardVariant="account"
              primaryActionLabel="Manage Team"
              href="/ceo-actions/manage-team" // Placeholder href
            />
            <NewActionCard
              title="View/Edit User's Data"
              description="Access and modify individual user account details, activity logs, and preferences."
              imageHint="user profile management"
              actionIcon={Edit3}
              cardVariant="account"
              primaryActionLabel="Manage Users"
              href="/ceo-actions/manage-users" // Placeholder href
            />
            <NewActionCard
              title="View Login/Signup Requests"
              description="Monitor and approve new user signup requests, manage access, or address login issues."
              imageHint="access control security"
              actionIcon={UserCheck}
              cardVariant="system"
              primaryActionLabel="Review Requests"
              href="/ceo-actions/review-requests" // Placeholder href
            />
            <NewActionCard
              title="Edit Pro Users"
              description="Manage premium 'Pro' user subscriptions, feature access levels, and billing information."
              imageHint="premium subscription management"
              actionIcon={Star}
              cardVariant="account" // Or perhaps 'billing' or 'subscription' if you add such a variant
              primaryActionLabel="Manage Pro Users"
              href="/ceo-actions/manage-pro-users" // Placeholder href
            />
          </div>
        </section>
      </main>
    </div>
  );
}
