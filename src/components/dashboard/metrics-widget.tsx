import type { Metric } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function MetricsWidget({ title, value, icon: Icon, trend, trendDirection }: Metric) {
  const TrendIcon = trendDirection === 'up' ? ArrowUpRight : trendDirection === 'down' ? ArrowDownRight : Minus;
  const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-muted-foreground';

  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1 flex items-center", trendColor)}>
            <TrendIcon className="h-4 w-4 mr-1" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
