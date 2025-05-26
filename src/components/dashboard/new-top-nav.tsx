
// src/components/dashboard/new-top-nav.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  count?: number;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Overview', exact: true },
  { href: '/tasks', label: 'Tasks', count: 1, exact: true },
  { href: '/activity', label: 'Activity', exact: true },
  { href: '/functioning', label: 'Functioning', exact: true },
];

export function NewTopNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== '/';
              
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
                    {item.count !== undefined && (
                      <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none bg-muted-foreground/20 text-muted-foreground rounded-full">
                        {item.count}
                      </span>
                    )}
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
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuItem>Team Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
