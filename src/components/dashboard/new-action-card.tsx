
// src/components/dashboard/new-action-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewActionCardProps {
  title: string;
  description: string;
  imageHint: string; // Keep for data-ai-hint on the background div
  actionIcon: LucideIcon; // Icon to be displayed on the top fanned element
  cardVariant: 'page' | 'task' | 'thread';
}

export function NewActionCard({ title, description, imageHint, actionIcon: ActionIcon, cardVariant }: NewActionCardProps) {
  
  const FannedElement = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("absolute w-[70px] h-[42px] rounded-md border bg-card shadow-sm p-1.5", className)}>
      {children}
    </div>
  );

  const IconOnFannedElement = ({ Icon }: { Icon: LucideIcon }) => (
    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-muted-foreground/80 rounded-[4px] flex items-center justify-center shadow">
      <Icon size={12} className="text-background" />
    </div>
  );

  const PageVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => (
    <>
      <FannedElement className="transform -rotate-[12deg] translate-x-[5px] translate-y-[12px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="h-1 w-3/4 bg-muted-foreground/10 mb-1 rounded-sm"></div>
        <div className="h-1 w-1/2 bg-muted-foreground/10 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform rotate-[6deg] -translate-x-[3px] translate-y-[6px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="h-1 w-full bg-muted-foreground/15 mb-1 rounded-sm"></div>
        <div className="h-1 w-2/3 bg-muted-foreground/15 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform -rotate-[4deg] z-20 right-[20px] top-[12px]">
        <div className="space-y-1 w-[calc(100%-22px)]">
            <div className="h-1.5 w-1/3 bg-primary/20 rounded-sm"></div>
            <div className="h-1 w-3/4 bg-muted-foreground/20 rounded-sm"></div>
            <div className="h-1 w-1/2 bg-muted-foreground/20 rounded-sm"></div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );

  const TaskVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => (
    <>
      <FannedElement className="transform rotate-[12deg] -translate-x-[5px] translate-y-[12px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="flex items-center mb-1">
          <div className="h-2 w-2 border border-muted-foreground/20 rounded-sm mr-1"></div>
          <div className="h-1 w-3/4 bg-muted-foreground/10 rounded-sm"></div>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 border border-muted-foreground/20 rounded-sm mr-1"></div>
          <div className="h-1 w-1/2 bg-muted-foreground/10 rounded-sm"></div>
        </div>
      </FannedElement>
      <FannedElement className="transform -rotate-[7deg] translate-x-[3px] translate-y-[6px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="flex items-center mb-1">
          <div className="h-2 w-2 border border-muted-foreground/30 rounded-sm mr-1 bg-muted-foreground/5"></div>
          <div className="h-1 w-full bg-muted-foreground/15 rounded-sm"></div>
        </div>
         <div className="flex items-center">
          <div className="h-2 w-2 border border-muted-foreground/30 rounded-sm mr-1"></div>
          <div className="h-1 w-2/3 bg-muted-foreground/15 rounded-sm"></div>
        </div>
      </FannedElement>
      <FannedElement className="transform rotate-[3deg] z-20 right-[20px] top-[12px]">
        <div className="space-y-1 w-[calc(100%-22px)]">
            <div className="flex items-center">
                <div className="h-2.5 w-2.5 border border-primary/40 rounded-sm mr-1.5 bg-primary/10 flex items-center justify-center">
                    <div className="h-1 w-1 bg-primary/50 rounded-sm"></div>
                </div>
                <div className="h-1 w-3/4 bg-muted-foreground/20 rounded-sm line-through"></div>
            </div>
            <div className="flex items-center">
                <div className="h-2.5 w-2.5 border border-muted-foreground/40 rounded-sm mr-1.5"></div>
                <div className="h-1 w-1/2 bg-muted-foreground/20 rounded-sm"></div>
            </div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );

  const ThreadVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => (
    <>
      <FannedElement className="transform -rotate-[12deg] translate-x-[5px] translate-y-[10px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="flex items-center mb-1">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/10 mr-1"></div>
          <div className="h-1 w-3/5 bg-muted-foreground/10 rounded-sm"></div>
        </div>
        <div className="h-1 w-4/5 bg-muted-foreground/10 ml-[12px] rounded-sm"></div>
      </FannedElement>
       <FannedElement className="transform rotate-[8deg] -translate-x-[3px] translate-y-[5px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="flex items-center mb-1">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20 mr-1"></div>
          <div className="h-1 w-1/2 bg-muted-foreground/15 rounded-sm"></div>
        </div>
        <div className="h-1 w-3/5 bg-muted-foreground/15 ml-[12px] rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform -rotate-[2deg] z-20 right-[20px] top-[12px]">
         <div className="space-y-1 w-[calc(100%-22px)]">
            <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary/20 mr-1.5"></div>
                <div className="h-1 w-3/5 bg-muted-foreground/20 rounded-sm"></div>
            </div>
            <div className="h-1 w-1/2 bg-muted-foreground/20 ml-[15px] rounded-sm"></div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden flex flex-col bg-card">
      <div className="relative h-36 grid-background flex items-center justify-center p-4 overflow-hidden" data-ai-hint={imageHint}>
        
        {cardVariant === 'page' && <PageVariantVisuals Icon={ActionIcon} />}
        {cardVariant === 'task' && <TaskVariantVisuals Icon={ActionIcon} />}
        {cardVariant === 'thread' && <ThreadVariantVisuals Icon={ActionIcon} />}

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
