import type { CourseStatus } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const courseStatusData: CourseStatus[] = [
  { id: '1', courseName: 'Web Development Bootcamp', instructor: 'Dr. Alice Wonderland', status: 'In Progress', enrolledDate: '2024-03-15', thumbnailUrl: 'https://placehold.co/100x60.png', dataAiHint: 'web development' },
  { id: '2', courseName: 'Machine Learning Fundamentals', instructor: 'Prof. Bob The Builder', status: 'Completed', enrolledDate: '2024-01-10', thumbnailUrl: 'https://placehold.co/100x60.png', dataAiHint: 'machine learning' },
  { id: '3', courseName: 'UX Design Principles', instructor: 'Ms. Carol Danvers', status: 'Not Started', enrolledDate: '2024-05-01', thumbnailUrl: 'https://placehold.co/100x60.png', dataAiHint: 'ux design' },
  { id: '4', courseName: 'Cybersecurity Essentials', instructor: 'Mr. David Copperfield', status: 'In Progress', enrolledDate: '2024-04-20', thumbnailUrl: 'https://placehold.co/100x60.png', dataAiHint: 'cybersecurity' },
];

export function CourseStatusTable() {
  const getStatusClass = (status: CourseStatus['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="bg-card p-0 rounded-xl shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Thumbnail</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Enrolled Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseStatusData.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                {course.thumbnailUrl && (
                  <Image 
                    src={course.thumbnailUrl} 
                    alt={course.courseName} 
                    width={80} 
                    height={48} 
                    className="rounded-md object-cover"
                    data-ai-hint={course.dataAiHint || "education course"}
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{course.courseName}</TableCell>
              <TableCell className="text-muted-foreground">{course.instructor}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-semibold", getStatusClass(course.status))}>
                  {course.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{course.enrolledDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
