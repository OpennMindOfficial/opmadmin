
// src/components/code-editor/CodeEditorPane.tsx
"use client";

// This file is repurposed to be the CodeDiffViewer.
// The previous tabbed code editor UI is replaced by the diff view UI on the Code Changes page.

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

export function CodeEditorPane({ diff, fileName, additions, deletions }: CodeDiffViewerProps) {
  // In the actual page, this component might be named CodeDiffViewer and imported as such.
  // For this exercise, I'm directly replacing CodeEditorPane's content.
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
            let displayContent = line.content;

            if (line.type === 'hunk') {
              lineClass = cn(lineClass, "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400");
            } else if (line.type === 'addition') {
              lineClass = cn(lineClass, "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300");
              prefix = "+";
              // Ensure we don't slice if content doesn't start with + (e.g. from direct mock data)
              displayContent = line.content.startsWith('+') ? line.content.substring(1) : line.content;
            } else if (line.type === 'deletion') {
              lineClass = cn(lineClass, "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300");
              prefix = "-";
              displayContent = line.content.startsWith('-') ? line.content.substring(1) : line.content;
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
                  "w-4 text-center select-none font-semibold",
                  line.type === 'addition' && "text-green-600",
                  line.type === 'deletion' && "text-red-600",
                  line.type === 'hunk' && "text-blue-700 dark:text-blue-400"
                )}>
                  {line.type !== 'hunk' ? prefix : ' '}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">
                  {displayContent}
                </span>
              </div>
            );
          })}
        </pre>
      </CardContent>
    </Card>
  );
}

    