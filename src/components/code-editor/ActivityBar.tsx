
// src/components/code-editor/ActivityBar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, FileText, Search, GitFork, Puzzle, PlayCircle, TestTube, UserCircle, Settings, LucideProps } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ActivityBarIconProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ActivityBarIcon: React.FC<ActivityBarIconProps> = ({ icon: Icon, label, href, isActive, onClick }) => {
  const content = (
    <div
      className={cn(
        "p-2.5 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors relative",
        isActive && "bg-accent text-accent-foreground"
      )}
      onClick={onClick}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-0.5 bg-primary rounded-r-sm"></div>}
      <Icon className="h-6 w-6" />
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? <Link href={href}>{content}</Link> : content}
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function ActivityBar() {
  return (
    <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 space-y-3">
      <Link href="/" passHref>
        <Avatar className="h-8 w-8 mb-4 cursor-pointer ring-2 ring-primary hover:ring-primary/70 transition-all">
          <AvatarImage src="https://placehold.co/40x40.png" alt="Logo" data-ai-hint="letter S logo"/>
          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">S</AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="flex flex-col space-y-1.5 flex-grow">
        <ActivityBarIcon icon={Home} label="Home" href="/" />
        <ActivityBarIcon icon={FileText} label="Explorer" isActive /> {/* Assuming Explorer is active */}
        <ActivityBarIcon icon={Search} label="Search" />
        <ActivityBarIcon icon={GitFork} label="Source Control" />
        <ActivityBarIcon icon={Puzzle} label="Extensions" />
        <ActivityBarIcon icon={PlayCircle} label="Run and Debug" />
        <ActivityBarIcon icon={TestTube} label="Testing" />
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <ActivityBarIcon icon={UserCircle} label="Account" />
        <ActivityBarIcon icon={Settings} label="Manage" />
      </div>
    </div>
  );
}
