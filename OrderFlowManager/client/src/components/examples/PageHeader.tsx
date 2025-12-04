import { PageHeader } from "../PageHeader";
import { Plus } from "lucide-react";

export default function PageHeaderExample() {
  return (
    <PageHeader
      title="Purchase Orders"
      description="Manage and track all your purchase orders"
      action={{
        label: "New Purchase Order",
        icon: Plus,
        onClick: () => console.log("Create new PO"),
      }}
    />
  );
}
