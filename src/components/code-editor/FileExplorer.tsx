
// src/components/code-editor/FileExplorer.tsx
"use client";

// This component is not used in the new Code Changes UI.
// It can be deleted if not used elsewhere in the application.
// For now, leaving its content to avoid breaking potential other usages,
// but it's not part of the redesigned Code Changes page.

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, File, ChevronDown, ChevronRight, FileText as FileTextIcon, FileJson, FileCode2, FileImage, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon?: React.ElementType;
  children?: FileSystemNode[];
  extension?: string;
}

const initialFileSystem: FileSystemNode[] = [
  { 
    id: 'fintech_webapp', 
    name: 'fintech_webapp', 
    type: 'folder', 
    children: [
      { 
        id: '.app', 
        name: '.app', 
        type: 'folder', 
        children: [
          { id: 'app_index.tsx', name: 'index.tsx', type: 'file', icon: FileCode2, extension: 'tsx' },
        ]
      },
      { id: '.github', name: '.github', type: 'folder', children: [] },
      { id: 'node_modules', name: 'node_modules', type: 'folder', children: [] },
      { 
        id: 'src', 
        name: 'src', 
        type: 'folder', 
        children: [
          { id: '.gitignore_src', name: '.gitignore', type: 'file', icon: Settings2 },
          { id: 'index.tsx', name: 'index.tsx', type: 'file', icon: FileCode2, extension: 'tsx' },
          { id: 'app.tsx', name: 'app.tsx', type: 'file', icon: FileCode2, extension: 'tsx' },
          { id: 'database.tsx', name: 'database.tsx', type: 'file', icon: FileCode2, extension: 'tsx' },
          { id: 'README.md', name: 'README.md', type: 'file', icon: FileTextIcon, extension: 'md' },
        ]
      },
      { id: 'env', name: 'env', type: 'folder', children: [] },
      { id: 'secret', name: '.secret', type: 'folder', children: [] }, // Corrected id
      { id: 'package.json', name: 'package.json', type: 'file', icon: FileJson, extension: 'json'},
      { id: 'logo.png', name: 'logo.png', type: 'file', icon: FileImage, extension: 'png'},
    ]
  },
];

const FileTypeIcon = ({ type, name, icon, isOpen }: { type: 'file' | 'folder', name: string, icon?: React.ElementType, isOpen?: boolean }) => {
  const SpecificIcon = icon;
  if (SpecificIcon) return <SpecificIcon className="h-4 w-4 mr-2 text-muted-foreground" />;
  if (type === 'folder') return isOpen ? <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />;
  
  return <File className="h-4 w-4 mr-2 text-muted-foreground" />;
};

const FileSystemItem: React.FC<{ node: FileSystemNode; level: number; onSelectFile: (id: string, name: string, type: 'file' | 'folder') => void; selectedFileId: string | null }> = ({ node, level, onSelectFile, selectedFileId }) => {
  const [isOpen, setIsOpen] = useState(node.name === 'src' || node.name === 'fintech_webapp');

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
    onSelectFile(node.id, node.name, node.type);
  };

  const isSelected = selectedFileId === node.id;

  return (
    <div>
      <div
        className={cn(
            "flex items-center py-1.5 px-2 cursor-pointer hover:bg-accent rounded-md text-sm",
            isSelected && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${level * 1 + 0.5}rem` }}
        onClick={handleToggle}
      >
        <FileTypeIcon type={node.type} name={node.name} icon={node.icon} isOpen={node.type === 'folder' ? isOpen : undefined} />
        <span className={cn(isSelected ? "font-medium" : "text-muted-foreground")}>{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <FileSystemItem key={child.id} node={child} level={level + 1} onSelectFile={onSelectFile} selectedFileId={selectedFileId} />
          ))}
        </div>
      )}
    </div>
  );
};

export function FileExplorer() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>('index.tsx'); 

  const handleSelectFile = (id: string, name: string, type: 'file' | 'folder') => {
    setSelectedFileId(id);
    console.log(`Selected: ${name} (type: ${type}, id: ${id})`);
  };
  
  return (
    <div className="w-full h-full bg-card flex flex-col">
      <div className="p-3 border-b border-border">
        <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Explorer</h2>
      </div>
      <ScrollArea className="flex-1 p-1.5">
        {initialFileSystem.map(node => (
          <FileSystemItem key={node.id} node={node} level={0} onSelectFile={handleSelectFile} selectedFileId={selectedFileId}/>
        ))}
      </ScrollArea>
    </div>
  );
}

    