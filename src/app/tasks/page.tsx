
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { TaskCard } from '@/components/dashboard/task-card';
import { LayoutGrid } from 'lucide-react'; // Using LayoutGrid for tasks icon

// Mock data for all tasks - in a real app, this would come from an API
const allTasksData = [
  { id: 'task1', title: 'Finalize Q3 Report', project: 'Project Alpha', dueDate: 'Oct 28', initialCompleted: false },
  { id: 'task2', title: 'User Persona Workshop', project: 'Marketing Campaign', dueDate: 'Nov 05', initialCompleted: true },
  { id: 'task3', title: 'Develop API Endpoint', project: 'Platform Upgrade', dueDate: 'Nov 12', initialCompleted: false },
  { id: 'task4', title: 'Client Presentation Prep', project: 'Project Beta', dueDate: 'Nov 15', initialCompleted: false },
  { id: 'task5', title: 'Bug Fixes - Sprint 2.3', project: 'Mobile App', dueDate: 'Nov 18', initialCompleted: false },
  { id: 'task6', title: 'Documentation Review', project: 'Knowledge Base', dueDate: 'Nov 22', initialCompleted: true },
  { id: 'task7', title: 'Onboarding New Intern', project: 'HR Department', dueDate: 'Nov 25', initialCompleted: false },
  { id: 'task8', title: 'Security Audit Follow-up', project: 'Infrastructure Team', dueDate: 'Nov 30', initialCompleted: false },
];

export default function AllTasksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <LayoutGrid className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">All Tasks</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Manage and track all your assigned tasks in one place.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allTasksData.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              project={task.project}
              dueDate={task.dueDate}
              initialCompleted={task.initialCompleted}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
