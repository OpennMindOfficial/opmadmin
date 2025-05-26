import type { CourseProgress } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function ProgressCard({ courseName, progressPercentage, imageUrl, dataAiHint }: CourseProgress) {
  return (
    <Card className="shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {imageUrl && (
         <div className="relative w-full h-40">
            <Image
                src={imageUrl}
                alt={courseName}
                layout="fill"
                objectFit="cover"
                data-ai-hint={dataAiHint || "course education"}
            />
         </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{courseName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-sm font-semibold text-primary">{progressPercentage}%</p>
        </div>
        <Progress value={progressPercentage} aria-label={`${courseName} progress ${progressPercentage}%`} className="h-3 rounded-full" />
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">View Course</Button>
      </CardFooter>
    </Card>
  );
}
