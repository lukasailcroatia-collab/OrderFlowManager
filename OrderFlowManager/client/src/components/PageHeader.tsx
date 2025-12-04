import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="page-title">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && (
        <Button onClick={action.onClick} data-testid="page-action-button">
          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
