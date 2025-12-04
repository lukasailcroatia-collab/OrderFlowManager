import { Badge } from "@/components/ui/badge";

type POStatus = "draft" | "awaiting_delivery" | "partially_received" | "complete";

interface StatusBadgeProps {
  status: POStatus;
}

const statusConfig: Record<POStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  awaiting_delivery: {
    label: "Awaiting Delivery",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  partially_received: {
    label: "Partially Received",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  complete: {
    label: "Complete",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="secondary"
      className={`${config.className} font-medium`}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </Badge>
  );
}
