import type { Metric } from '@/types';
import { MetricsWidget } from './metrics-widget';
import { Users, BookOpenText, CheckCircle, TrendingUp } from 'lucide-react';

const metricsData: Metric[] = [
  { id: '1', title: 'Active Students', value: '1,250', icon: Users, trend: '+120 this month', trendDirection: 'up' },
  { id: '2', title: 'Courses Offered', value: '85', icon: BookOpenText, trend: '+5 new courses', trendDirection: 'up' },
  { id: '3', title: 'Completion Rate', value: '78%', icon: CheckCircle, trend: '-2% vs last quarter', trendDirection: 'down' },
  { id: '4', title: 'Overall Engagement', value: 'High', icon: TrendingUp, trend: 'Stable', trendDirection: 'neutral' },
];

export function MetricsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric) => (
        <MetricsWidget key={metric.id} {...metric} />
      ))}
    </div>
  );
}
