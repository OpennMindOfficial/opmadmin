import type { CourseProgress } from '@/types';
import { ProgressCard } from './progress-card';

const progressData: CourseProgress[] = [
  { id: '1', courseName: 'Advanced JavaScript', progressPercentage: 75, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'javascript course' },
  { id: '2', courseName: 'Introduction to AI', progressPercentage: 45, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'ai concepts' },
  { id: '3', courseName: 'Data Structures & Algorithms', progressPercentage: 90, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'algorithms book' },
];

export function ProgressOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {progressData.map((course) => (
        <ProgressCard key={course.id} {...course} />
      ))}
    </div>
  );
}
