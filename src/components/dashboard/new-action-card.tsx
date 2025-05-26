
// src/components/dashboard/new-action-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CardVariant = 'page' | 'task' | 'thread' | 'data' | 'content' | 'account' | 'server' | 'communication' | 'system';


interface NewActionCardProps {
  title: string;
  description: string;
  imageHint: string; 
  actionIcon: LucideIcon; 
  cardVariant: CardVariant;
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

  const PageVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // e.g. Create Subject Notes, Add Questions to QB
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

  const TaskVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // e.g. Add Subject, Add Facts
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

  const ThreadVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // Generic communication or misc
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

  const DataVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // e.g. View Reported Bugs, Performance Tracking, Website traffic, AI Usage
    <>
      <FannedElement className="transform -rotate-[10deg] translate-x-[4px] translate-y-[11px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="h-1 w-1/3 bg-muted-foreground/10 rounded-sm mb-0.5"></div>
        <div className="h-2 w-full border border-muted-foreground/10 rounded-sm flex items-end p-0.5 space-x-0.5">
            <div className="w-1 h-1 bg-muted-foreground/10"></div>
            <div className="w-1 h-1.5 bg-muted-foreground/10"></div>
            <div className="w-1 h-0.5 bg-muted-foreground/10"></div>
        </div>
      </FannedElement>
      <FannedElement className="transform rotate-[5deg] -translate-x-[2px] translate-y-[5px] opacity-70 z-10 right-[24px] top-[15px]">
      <div className="h-1 w-1/2 bg-muted-foreground/15 rounded-sm mb-0.5"></div>
        <div className="h-2 w-full border border-muted-foreground/15 rounded-sm flex items-end p-0.5 space-x-0.5">
            <div className="w-1 h-1.5 bg-muted-foreground/15"></div>
            <div className="w-1 h-0.5 bg-muted-foreground/15"></div>
            <div className="w-1 h-1 bg-muted-foreground/15"></div>
        </div>
      </FannedElement>
      <FannedElement className="transform -rotate-[3deg] z-20 right-[20px] top-[12px]">
        <div className="space-y-0.5 w-[calc(100%-22px)]">
            <div className="h-1.5 w-1/4 bg-primary/20 rounded-sm"></div>
            <div className="h-2.5 w-full border border-primary/20 rounded-sm flex items-end p-0.5 space-x-0.5">
                <div className="w-1.5 h-full bg-primary/10"></div>
                <div className="w-1.5 h-1/2 bg-primary/20"></div>
                <div className="w-1.5 h-3/4 bg-primary/15"></div>
            </div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );

  const ContentVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // e.g. Edit About US, NCERT Sources
    <>
      <FannedElement className="transform -rotate-[11deg] translate-x-[5px] translate-y-[12px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="h-1 w-1/2 bg-muted-foreground/10 mb-1 rounded-sm"></div>
        <div className="h-0.5 w-full bg-muted-foreground/10 mb-0.5 rounded-sm"></div>
        <div className="h-0.5 w-3/4 bg-muted-foreground/10 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform rotate-[4deg] -translate-x-[3px] translate-y-[6px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="h-1 w-1/3 bg-muted-foreground/15 mb-1 rounded-sm"></div>
        <div className="h-0.5 w-full bg-muted-foreground/15 mb-0.5 rounded-sm"></div>
        <div className="h-0.5 w-2/3 bg-muted-foreground/15 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform -rotate-[5deg] z-20 right-[20px] top-[12px]">
        <div className="space-y-0.5 w-[calc(100%-22px)]">
            <div className="h-1.5 w-1/4 bg-primary/20 rounded-sm"></div>
            <div className="h-0.5 w-full bg-muted-foreground/20 rounded-sm"></div>
            <div className="h-0.5 w-5/6 bg-muted-foreground/20 rounded-sm"></div>
            <div className="h-0.5 w-1/2 bg-muted-foreground/20 rounded-sm"></div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );

  const AccountVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // e.g. User's account data, Pro users, Account Changes(user)
    <>
      <FannedElement className="transform rotate-[10deg] -translate-x-[4px] translate-y-[11px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="flex items-center mb-1">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/10 mr-1"></div>
            <div className="h-1 w-3/4 bg-muted-foreground/10 rounded-sm"></div>
        </div>
        <div className="h-0.5 w-full bg-muted-foreground/10 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform -rotate-[6deg] translate-x-[2px] translate-y-[5px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="flex items-center mb-1">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/15 mr-1"></div>
            <div className="h-1 w-2/3 bg-muted-foreground/15 rounded-sm"></div>
        </div>
        <div className="h-0.5 w-4/5 bg-muted-foreground/15 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform rotate-[3deg] z-20 right-[20px] top-[12px]">
        <div className="space-y-1 w-[calc(100%-22px)]">
           <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary/20 mr-1.5"></div>
                <div className="h-1 w-3/4 bg-muted-foreground/20 rounded-sm"></div>
            </div>
            <div className="h-0.5 w-full bg-muted-foreground/20 rounded-sm"></div>
            <div className="h-0.5 w-1/2 bg-muted-foreground/20 rounded-sm"></div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );
  
  const ServerVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // e.g. API in use, API Testing
    <>
      <FannedElement className="transform -rotate-[9deg] translate-x-[5px] translate-y-[12px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="w-full h-1.5 bg-muted-foreground/10 rounded-sm mb-1 flex items-center space-x-1 px-0.5">
            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/20"></div>
            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/20"></div>
        </div>
        <div className="h-0.5 w-3/4 bg-muted-foreground/10 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform rotate-[6deg] -translate-x-[3px] translate-y-[6px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="w-full h-1.5 bg-muted-foreground/15 rounded-sm mb-1 flex items-center space-x-1 px-0.5">
            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30"></div>
            <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30"></div>
        </div>
        <div className="h-0.5 w-2/3 bg-muted-foreground/15 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform -rotate-[2deg] z-20 right-[20px] top-[12px]">
        <div className="space-y-1 w-[calc(100%-22px)]">
            <div className="w-full h-2 bg-primary/10 rounded-sm mb-1 flex items-center justify-between px-1">
                <div className="h-1 w-1 rounded-full bg-primary/30"></div>
                <div className="h-1 w-1 rounded-full bg-primary/30"></div>
                <div className="h-1 w-1 rounded-full bg-primary/30"></div>
            </div>
            <div className="h-1 w-full bg-muted-foreground/20 rounded-sm"></div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );

  const CommunicationVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => ( // e.g. Add Notifications
    <>
       <FannedElement className="transform -rotate-[12deg] translate-x-[5px] translate-y-[10px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="flex items-start mb-0.5">
          <div className="h-1.5 w-1.5 border border-muted-foreground/10 rounded-sm mr-1 mt-px"></div>
          <div className="h-1 w-3/5 bg-muted-foreground/10 rounded-sm"></div>
        </div>
        <div className="h-0.5 w-4/5 bg-muted-foreground/10 ml-[10px] rounded-sm"></div>
      </FannedElement>
       <FannedElement className="transform rotate-[8deg] -translate-x-[3px] translate-y-[5px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="flex items-start mb-0.5">
          <div className="h-1.5 w-1.5 border border-muted-foreground/20 rounded-sm mr-1 mt-px"></div>
          <div className="h-1 w-1/2 bg-muted-foreground/15 rounded-sm"></div>
        </div>
        <div className="h-0.5 w-3/5 bg-muted-foreground/15 ml-[10px] rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform -rotate-[2deg] z-20 right-[20px] top-[12px]">
         <div className="space-y-0.5 w-[calc(100%-22px)]">
            <div className="flex items-start">
                <div className="h-2 w-2 border-2 border-primary/20 rounded-sm mr-1.5 mt-px flex items-center justify-center">
                    <div className="h-0.5 w-0.5 bg-primary/30 rounded-full"></div>
                </div>
                <div className="h-1 w-3/5 bg-muted-foreground/20 rounded-sm"></div>
            </div>
            <div className="h-0.5 w-1/2 bg-muted-foreground/20 ml-[14px] rounded-sm"></div>
            <div className="h-0.5 w-1/3 bg-muted-foreground/20 ml-[14px] rounded-sm"></div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );

  // Default/System Visuals (can be similar to 'page' or simpler)
  const SystemVariantVisuals = ({ Icon }: { Icon: LucideIcon }) => (
    <>
      <FannedElement className="transform -rotate-[12deg] translate-x-[5px] translate-y-[12px] opacity-50 z-0 right-[28px] top-[18px]">
        <div className="h-1.5 w-1.5 bg-muted-foreground/10 rounded-sm mb-0.5"></div>
        <div className="h-0.5 w-3/4 bg-muted-foreground/10 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform rotate-[6deg] -translate-x-[3px] translate-y-[6px] opacity-70 z-10 right-[24px] top-[15px]">
        <div className="h-1.5 w-1.5 bg-muted-foreground/15 rounded-sm mb-0.5"></div>
        <div className="h-0.5 w-2/3 bg-muted-foreground/15 rounded-sm"></div>
      </FannedElement>
      <FannedElement className="transform -rotate-[4deg] z-20 right-[20px] top-[12px]">
        <div className="space-y-1 w-[calc(100%-22px)]">
            <div className="h-2 w-2 bg-primary/20 rounded-sm"></div>
            <div className="h-1 w-full bg-muted-foreground/20 rounded-sm"></div>
        </div>
        <IconOnFannedElement Icon={Icon} />
      </FannedElement>
    </>
  );


  const renderVisuals = () => {
    switch (cardVariant) {
      case 'page':
        return <PageVariantVisuals Icon={ActionIcon} />;
      case 'task':
        return <TaskVariantVisuals Icon={ActionIcon} />;
      case 'thread':
        return <ThreadVariantVisuals Icon={ActionIcon} />;
      case 'data':
        return <DataVariantVisuals Icon={ActionIcon} />;
      case 'content':
        return <ContentVariantVisuals Icon={ActionIcon} />;
      case 'account':
        return <AccountVariantVisuals Icon={ActionIcon} />;
      case 'server':
        return <ServerVariantVisuals Icon={ActionIcon} />;
      case 'communication':
        return <CommunicationVariantVisuals Icon={ActionIcon} />;
      case 'system':
      default:
        return <SystemVariantVisuals Icon={ActionIcon} />;
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden flex flex-col bg-card">
      <div className="relative h-36 grid-background flex items-center justify-center p-4 overflow-hidden" data-ai-hint={imageHint}>
        {renderVisuals()}
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
