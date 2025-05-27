
// src/app/code-changes/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { ActivityBar } from '@/components/code-editor/ActivityBar';
import { FileExplorer } from '@/components/code-editor/FileExplorer';
import { CodeEditorPane } from '@/components/code-editor/CodeEditorPane';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'; // Assuming you have this or similar

export default function CodeChangesPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <NewTopNav />
      <main className="flex flex-1 overflow-hidden border-t border-border">
        <ActivityBar />
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-border w-1.5 hover:bg-primary/20 transition-colors" />
          <ResizablePanel defaultSize={80}>
            <CodeEditorPane />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
