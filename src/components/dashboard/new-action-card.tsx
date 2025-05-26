
// src/components/dashboard/new-action-card.tsx
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, type LucideIcon } from 'lucide-react';

interface NewActionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageHint: string;
  actionIcon?: LucideIcon; // For the small icon on the "Create a Thread" card image
}

export function NewActionCard({ title, description, imageSrc, imageAlt, imageHint, actionIcon: ActionIcon }: NewActionCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden flex flex-col bg-card">
      <div className="relative h-36 grid-background flex items-center justify-center p-4">
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          width={150} // Adjusted size for better fit with grid
          height={75}  // Adjusted size for better fit with grid
          className="object-contain"
          data-ai-hint={imageHint} 
        />
        {ActionIcon && (
          <div className="absolute top-3 right-3 bg-primary/80 p-1.5 rounded-md text-primary-foreground">
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
