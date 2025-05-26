import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { Sparkles, ChevronDown, Pin, Plus, ArrowUpRight, MessageSquare, FileText, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';


export default function DashboardRedesignPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Morning Team!</h1>
            <p className="text-lg text-muted-foreground">
              Collaborate with your team and organize your work here!
            </p>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Abstract team collaboration graphic"
              width={600}
              height={400}
              className="rounded-lg object-cover"
              data-ai-hint="abstract network play button"
            />
          </div>
        </section>

        {/* Actions Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewActionCard
              title="Create a Page"
              description="Create your first Client to start building your Clients knowledge base."
              imageSrc="https://placehold.co/200x100.png"
              imageAlt="Create a Page illustration"
              imageHint="document interface"
            />
            <NewActionCard
              title="Create a Task"
              description="Create your first Case to start building your Cases knowledge base."
              imageSrc="https://placehold.co/200x100.png"
              imageAlt="Create a Task illustration"
              imageHint="task list interface"
            />
            <NewActionCard
              title="Create a Thread"
              description="Create your first Client to start building your Clients knowledge base."
              imageSrc="https://placehold.co/200x100.png"
              imageAlt="Create a Thread illustration"
              imageHint="chat interface"
              actionIcon={MessageSquare} 
            />
          </div>
        </section>

        {/* Pinned Items Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pin className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">Pinned Items</h2>
              <ChevronDown className="h-5 w-5 text-muted-foreground cursor-pointer" />
            </div>
            <Button variant="ghost" size="sm" asChild className="text-sm text-muted-foreground hover:text-foreground">
              <Link href="#">
                Pin a new item
                <Plus className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="h-40 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow rounded-lg bg-card">
              <CardContent className="flex flex-col items-center justify-center text-center p-4">
                <Pin className="h-8 w-8 text-muted-foreground mb-2" />
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                  <Plus className="mr-2 h-4 w-4" /> Pin an item
                </Button>
              </CardContent>
            </Card>
            {/* Add more pinned item cards here if needed, or a map over data */}
             <Card className="h-40 rounded-lg bg-muted/50"></Card>
             <Card className="h-40 rounded-lg bg-muted/50"></Card>
          </div>
        </section>

        {/* Latest Activity Section */}
        <section className="space-y-4">
           <div className="flex items-center space-x-2">
             <h2 className="text-2xl font-semibold">Latest activity</h2>
             <ArrowUpRight className="h-5 w-5 text-muted-foreground cursor-pointer" />
           </div>
           <div className="p-6 bg-card rounded-lg shadow-sm">
             <p className="text-muted-foreground">Your latest activity will appear here...</p>
           </div>
        </section>
      </main>
    </div>
  );
}
