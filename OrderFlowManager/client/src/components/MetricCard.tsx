import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="hover-elevate">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
              {value}
            </p>
            {trend && (
              <p className={`text-sm ${trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {trend.isPositive ? "+" : ""}{trend.value}% from last month
              </p>
            )}
          </div>
          <div className="p-3 rounded-md bg-muted">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
