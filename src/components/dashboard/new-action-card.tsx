
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
  cardVariant: 'page' | 'task' | 'thread';
}

export function NewActionCard({ title, description, imageHint, actionIcon: ActionIcon, cardVariant }: NewActionCardProps) {
  
  const PageVariantVisuals = () => (
    <>
      {/* Bottom-most page */}
      <div 
        className={cn(
          "absolute w-[72px] h-[44px] rounded border p-1.5 shadow-sm transform -rotate-[10deg] translate-x-[2px] translate-y-[10px] opacity-50",
          "bg-card/40 border-border/30 right-[30px] top-[15px]" 
        )}
      >
        <div className="h-1 w-3/4 bg-muted-foreground/20 mb-1 rounded-sm"></div>
        <div className="h-1 w-1/2 bg-muted-foreground/20 mb-1 rounded-sm"></div>
        <div className="h-1 w-5/6 bg-muted-foreground/20 rounded-sm"></div>
      </div>
      {/* Middle page */}
      <div 
        className={cn(
          "absolute w-[72px] h-[44px] rounded border p-1.5 shadow-md transform rotate-[4deg] -translate-x-[5px] translate-y-[5px] z-10 opacity-70",
          "bg-card/50 border-border/40 right-[25px] top-[12px]"
        )}
      >
        <div className="h-1 w-full bg-muted-foreground/25 mb-1 rounded-sm"></div>
        <div className="h-1 w-2/3 bg-muted-foreground/25 rounded-sm"></div>
      </div>
      {/* Top-most page */}
      <div 
        className={cn(
          "absolute w-[72px] h-[44px] rounded border p-1.5 shadow-lg transform -rotate-[3deg] translate-x-[0px] -translate-y-[0px] z-20 opacity-90",
          "bg-card/60 border-border/50 right-[20px] top-[10px]" 
        )}
      >
        <div className="h-1.5 w-1/3 bg-primary/20 mb-1 rounded-sm"></div>
        <div className="h-1 w-3/4 bg-muted-foreground/30 mb-1 rounded-sm"></div>
        <div className="h-1 w-1/2 bg-muted-foreground/30 rounded-sm"></div>
      </div>
    </>
  );

  const TaskVariantVisuals = () => (
    <>
       {/* Bottom-most task */}
      <div 
        className={cn(
          "absolute w-[72px] h-[44px] rounded border p-1.5 shadow-sm transform rotate-[10deg] -translate-x-[2px] translate-y-[10px] opacity-50",
           "bg-card/40 border-border/30 right-[30px] top-[15px]" 
        )}
      >
        <div className="flex items-center mb-1">
          <div className="h-2.5 w-2.5 border border-muted-foreground/30 rounded-sm mr-1.5"></div>
          <div className="h-1 w-3/4 bg-muted-foreground/20 rounded-sm"></div>
        </div>
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 border border-muted-foreground/30 rounded-sm mr-1.5"></div>
          <div className="h-1 w-1/2 bg-muted-foreground/20 rounded-sm"></div>
        </div>
      </div>
      {/* Middle task */}
      <div 
        className={cn(
          "absolute w-[72px] h-[44px] rounded border p-1.5 shadow-md transform -rotate-[5deg] translate-x-[5px] translate-y-[5px] z-10 opacity-70",
          "bg-card/50 border-border/40 right-[25px] top-[12px]"
        )}
      >
        <div className="flex items-center mb-1">
          <div className="h-2.5 w-2.5 border border-primary/40 rounded-sm mr-1.5 bg-primary/10"></div>
          <div className="h-1 w-full bg-muted-foreground/25 rounded-sm"></div>
        </div>
         <div className="flex items-center">
          <div className="h-2.5 w-2.5 border border-muted-foreground/40 rounded-sm mr-1.5"></div>
          <div className="h-1 w-2/3 bg-muted-foreground/25 rounded-sm"></div>
        </div>
      </div>
      {/* Top-most task */}
      <div 
        className={cn(
          "absolute w-[72px] h-[44px] rounded border p-1.5 shadow-lg transform rotate-[2deg] -translate-x-[0px] -translate-y-[0px] z-20 opacity-90",
          "bg-card/60 border-border/50 right-[20px] top-[10px]"
        )}
      >
        <div className="flex items-center mb-1">
           <div className="h-2.5 w-2.5 border border-primary/50 rounded-sm mr-1.5 bg-primary/20 flex items-center justify-center">
            <div className="h-1 w-1 bg-primary/60 rounded-sm"></div> {/* Checkmark-like */}
          </div>
          <div className="h-1 w-3/4 bg-muted-foreground/30 rounded-sm line-through"></div>
        </div>
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 border border-muted-foreground/50 rounded-sm mr-1.5"></div>
          <div className="h-1 w-1/2 bg-muted-foreground/30 rounded-sm"></div>
        </div>
      </div>
    </>
  );

  const ThreadVariantVisuals = () => (
    <>
      {/* Bottom-most thread card */}
      <div 
        className={cn(
          "absolute w-[72px] h-[40px] rounded-md border p-1.5 shadow-sm transform -rotate-[10deg] translate-x-[2px] translate-y-[8px] opacity-50",
          "bg-card/40 border-border/30 right-[30px] top-[15px]"
        )}
      >
        <div className="flex items-center mb-1">
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20 mr-1.5"></div>
          <div className="h-1 w-3/5 bg-muted-foreground/20 rounded-sm"></div>
        </div>
        <div className="h-1 w-4/5 bg-muted-foreground/20 ml-[15px] rounded-sm"></div>
      </div>
       {/* Middle thread card */}
      <div 
        className={cn(
          "absolute w-[72px] h-[40px] rounded-md border p-1.5 shadow-md transform rotate-[4deg] -translate-x-[5px] translate-y-[4px] z-10 opacity-70",
          "bg-card/50 border-border/40 right-[25px] top-[12px]"
        )}
      >
        <div className="flex items-center mb-1">
          <div className="h-2.5 w-2.5 rounded-full bg-accent/60 mr-1.5"></div>
          <div className="h-1 w-1/2 bg-muted-foreground/25 rounded-sm"></div>
        </div>
        <div className="h-1 w-3/5 bg-muted-foreground/25 ml-[15px] rounded-sm"></div>
      </div>
      {/* Top-most thread card */}
      <div 
        className={cn(
          "absolute w-[72px] h-[40px] rounded-lg border p-1.5 shadow-lg transform -rotate-[3deg] translate-x-[0px] -translate-y-[0px] z-20 opacity-90",
          "bg-card/60 border-border/50 right-[20px] top-[10px]"
        )}
      >
        <div className="flex items-center mb-1">
          <div className="h-2.5 w-2.5 rounded-full bg-primary/30 mr-1.5"></div>
          <div className="h-1 w-3/5 bg-muted-foreground/30 rounded-sm"></div>
        </div>
        <div className="h-1 w-1/2 bg-muted-foreground/30 ml-[15px] rounded-sm"></div>
      </div>
    </>
  );

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden flex flex-col bg-card">
      <div className="relative h-36 grid-background flex items-center justify-center p-4 overflow-hidden" data-ai-hint={imageHint}>
        
        {cardVariant === 'page' && <PageVariantVisuals />}
        {cardVariant === 'task' && <TaskVariantVisuals />}
        {cardVariant === 'thread' && <ThreadVariantVisuals />}

        {ActionIcon && (
          <div className="absolute top-3 right-3 bg-primary/80 p-1.5 rounded-md text-primary-foreground z-30 shadow-lg">
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
        <Button variant="ghost" className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
          <RefreshCw className="mr-2 h-3 w-3" /> Generate example
        </Button>
      </CardFooter>
    </Card>
  );
}
