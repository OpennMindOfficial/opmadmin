import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { CourseStatusSection } from '@/components/dashboard/course-status-section';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard Overview</h1>
        <MetricsOverview />
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Your Course Progress</h2>
        <ProgressOverview />
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">All Courses Status</h2>
        <CourseStatusSection />
      </div>
    </div>
  );
}
