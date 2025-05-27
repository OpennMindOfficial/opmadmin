
// src/app/actions/create-subject-notes/page.tsx
"use client";

import { useState } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { Button } from '@/components/ui/button';
import { NotebookPen, PlusCircle } from 'lucide-react';
import { SubjectNotesTable } from '@/components/dashboard/subject-notes-table';
import { AddEditNoteDialog } from '@/components/dialogs/add-edit-note-dialog'; // Import the AddEditNoteDialog
import type { SubjectNoteRecord } from '@/services/baserowService';


export default function CreateSubjectNotesPage() {
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  // This state is to potentially trigger a re-fetch in SubjectNotesTable if needed,
  // though SubjectNotesTable currently fetches on its own mount.
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNoteAdded = (newNote: SubjectNoteRecord) => {
    // Optionally, trigger a refresh of the notes table if it doesn't auto-refresh
    setRefreshKey(prev => prev + 1); 
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
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
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Key Metrics</h2>
          <MetricsOverview />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Notes</h2>
            <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Note
            </Button>
          </div>
          <SubjectNotesTable key={refreshKey} />
        </section>
      </main>
      
      <AddEditNoteDialog
        isOpen={isAddNoteDialogOpen}
        onOpenChange={setIsAddNoteDialogOpen}
        onNoteAdded={handleNoteAdded}
      />
    </div>
  );
}
