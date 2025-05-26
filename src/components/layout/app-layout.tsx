import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";
import { BrainCircuit, LayoutDashboard, BookOpen, Users, BarChart3, Settings as SettingsIcon, UserCircle } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

const settingsNavItems: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true} onOpenChange={() => {}}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4 flex flex-col items-center group-data-[collapsible=icon]:items-center">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">OpennMind</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex-grow">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarMenu>
            {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                    >
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild
                    tooltip={{children: "User Profile", className: "group-data-[collapsible=icon]:block hidden"}}
                >
                    <Link href="/profile"> {/* Placeholder profile link */}
                        <UserCircle />
                        <span>User Profile</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
            <div className="md:hidden"> {/* Only show on mobile as per sidebar design */}
                 <SidebarTrigger />
            </div>
            <div className="flex-1">
                {/* Optional: Breadcrumbs or Page Title can go here */}
            </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
