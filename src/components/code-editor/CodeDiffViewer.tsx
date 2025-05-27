
// src/components/code-editor/CodeDiffViewer.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiffLine {
  type: 'context' | 'addition' | 'deletion' | 'hunk';
  content: string;
  oldLineNum?: number | null;
  newLineNum?: number | null;
}

interface CodeDiffViewerProps {
  diff: DiffLine[];
  fileName: string;
  additions: number;
  deletions: number;
}

export function CodeDiffViewer({ diff, fileName, additions, deletions }: CodeDiffViewerProps) {
  return (
    <Card className="shadow-sm rounded-lg border border-border overflow-hidden">
      <CardHeader className="bg-muted/50 px-4 py-2 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm font-medium text-foreground">{fileName}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-green-600">+{additions}</span>
          <span className="text-xs font-mono text-red-600">-{deletions}</span>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <pre className="text-xs leading-relaxed font-mono bg-background">
          {diff.map((line, index) => {
            let lineClass = "px-4 py-0.5 flex";
            let prefix = " ";
            let content = line.content;

            if (line.type === 'hunk') {
              lineClass = cn(lineClass, "bg-blue-50 text-blue-700");
              content = line.content;
            } else if (line.type === 'addition') {
              lineClass = cn(lineClass, "bg-green-50 text-green-800");
              prefix = "+";
              content = line.content.substring(1); // Remove the leading '+' from mock data
            } else if (line.type === 'deletion') {
              lineClass = cn(lineClass, "bg-red-50 text-red-800");
              prefix = "-";
              content = line.content.substring(1); // Remove the leading '-' from mock data
            } else { // context
              lineClass = cn(lineClass, "hover:bg-muted/30");
            }

            return (
              <div key={index} className={lineClass}>
                <span className="w-10 pr-2 text-right text-muted-foreground select-none">
                  {line.type !== 'addition' ? line.oldLineNum || '' : ''}
                </span>
                <span className="w-10 pr-2 text-right text-muted-foreground select-none">
                  {line.type !== 'deletion' ? line.newLineNum || '' : ''}
                </span>
                <span className={cn(
                  "w-4 text-center select-none",
                  line.type === 'addition' && "text-green-600",
                  line.type === 'deletion' && "text-red-600",
                  line.type === 'hunk' && "text-blue-700"
                )}>
                  {line.type !== 'hunk' ? prefix : ' '}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">
                  {content}
                </span>
              </div>
            );
          })}
        </pre>
      </CardContent>
    </Card>
  );
}

// Remove the old CodeEditorPane content or rename/delete the file if it's no longer used
// For this change, we are creating a new component CodeDiffViewer.tsx
// If CodeEditorPane.tsx was the target for diff view, its content would be replaced.
// Since the prompt asks to *change the UI for code changes page*, implying using existing structures,
// let's assume CodeEditorPane.tsx is what should be displaying the diff.
// However, for clarity and avoiding large CData, I created CodeDiffViewer.
// If the instruction was to modify CodeEditorPane.tsx directly, its content would be:
// export function CodeEditorPane() { /* ... content of CodeDiffViewer ... */ }
// and then update the import in page.tsx.
// For now, I'm providing CodeDiffViewer as a new component.
// If CodeEditorPane.tsx is still referenced elsewhere, this is safer. If not, it can be removed.
// Given the previous structure, I'll also provide an empty CodeEditorPane.tsx to avoid breaking other potential imports,
// or it should be deleted.
// For this task, since `CodeChangesPage` previously used `CodeEditorPane`, I will repurpose `CodeEditorPane.tsx`.

    