
// src/components/dashboard/new-action-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewActionCardProps {
  title: string;
  description: string;
  imageHint: string;
  actionIcon?: LucideIcon; 
}

export function NewActionCard({ title, description, imageHint, actionIcon: ActionIcon }: NewActionCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden flex flex-col bg-card">
      <div className="relative h-36 grid-background flex items-center justify-center p-4 overflow-hidden" data-ai-hint={imageHint}>
        {/* Decorative fanned-out cards */}
        <div className="absolute top-3 right-3 flex items-center justify-center">
          <div 
            className={cn(
              "w-16 h-10 rounded border p-1 shadow-sm transform -rotate-12 translate-x-3 translate-y-1 opacity-60",
              "bg-card/50 border-border/30" 
            )}
          >
            <div className="h-1 w-3/4 bg-muted-foreground/20 mb-1 rounded-sm"></div>
            <div className="h-1 w-1/2 bg-muted-foreground/20 rounded-sm"></div>
          </div>
          <div 
            className={cn(
              "w-16 h-10 rounded border p-1 shadow-md transform rotate-6 -translate-x-1 z-10 opacity-75",
              "bg-card/60 border-border/40"
            )}
          >
            <div className="h-1 w-full bg-muted-foreground/25 mb-1 rounded-sm"></div>
            <div className="h-1 w-2/3 bg-muted-foreground/25 rounded-sm"></div>
          </div>
          <div 
            className={cn(
              "w-16 h-10 rounded border p-1 shadow-lg transform -rotate-3 translate-x-1 -translate-y-2 z-20 opacity-90",
              "bg-card/70 border-border/50"
            )}
          >
            <div className="h-1 w-3/4 bg-muted-foreground/30 mb-1 rounded-sm"></div>
            <div className="h-1 w-1/2 bg-muted-foreground/30 rounded-sm"></div>
          </div>
        </div>

        {ActionIcon && (
          <div className="absolute top-3 right-3 bg-primary/80 p-1.5 rounded-md text-primary-foreground z-30">
            <ActionIcon size={16} />
          </div>
        )}
      </div>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-3 pt-0 pb-4 px-4 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Create
        </Button>
        <Button variant="outline" className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
          <RefreshCw className="mr-2 h-3 w-3" /> Generate example
        </Button>
      </CardFooter>
    </Card>
  );
}
