import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="draft" />
      <StatusBadge status="awaiting_delivery" />
      <StatusBadge status="partially_received" />
      <StatusBadge status="complete" />
    </div>
  );
}
