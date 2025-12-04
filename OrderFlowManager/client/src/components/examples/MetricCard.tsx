import { MetricCard } from "../MetricCard";
import { Package } from "lucide-react";

export default function MetricCardExample() {
  return (
    <MetricCard
      title="Total Products"
      value={156}
      icon={Package}
      trend={{ value: 12, isPositive: true }}
    />
  );
}
