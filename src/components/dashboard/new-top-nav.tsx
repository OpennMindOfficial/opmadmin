
// src/components/dashboard/new-top-nav.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Overview', exact: true },
  { href: '/tasks', label: 'Tasks', exact: true },
  { href: '/activity', label: 'Activity', exact: true },
  { href: '/functioning', label: 'Functioning', exact: true },
  { href: '/code-changes', label: 'Code Changes', exact: true },
];

interface NewTopNavProps {
  onLogout?: () => void;
  isCeoLoggedIn?: boolean;
}

export function NewTopNav({ onLogout, isCeoLoggedIn }: NewTopNavProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  asChild
                  className={cn(
                    "text-sm font-medium px-3 py-2 rounded-md",
                    isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-secondary hover:bg-accent text-secondary-foreground text-sm">
                Manage
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href="/about-build">About This App</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isCeoLoggedIn && ( // Only show these for team members
                <>
                  <DropdownMenuItem asChild><Link href="/account-settings">Account Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/team-info">Team Info</Link></DropdownMenuItem>
                </>
              )}
              {isCeoLoggedIn && (
                <DropdownMenuItem asChild><Link href="#">Extra Options</Link></DropdownMenuItem> 
              )}
              {onLogout && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive focus:!bg-destructive/10 focus:!text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
