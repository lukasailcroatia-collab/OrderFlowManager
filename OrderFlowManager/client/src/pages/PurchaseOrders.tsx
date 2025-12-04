import { useState } from "react";
import { useLocation } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

// todo: remove mock functionality
const mockSuppliers = [
  { id: "1", name: "Snack Corp" },
  { id: "2", name: "Beverage Inc" },
  { id: "3", name: "Candy World" },
  { id: "4", name: "Fresh Foods" },
];

// todo: remove mock functionality
const mockPurchaseOrders = [
  { id: "PO-001", supplierId: "1", status: "awaiting_delivery" as const, paymentStatus: "unpaid" as const, createdDate: "2024-01-15", expectedDate: "2024-01-22", total: 1250.00, lineItems: 3 },
  { id: "PO-002", supplierId: "2", status: "complete" as const, paymentStatus: "paid" as const, createdDate: "2024-01-14", expectedDate: "2024-01-18", total: 890.50, lineItems: 2 },
  { id: "PO-003", supplierId: "3", status: "partially_received" as const, paymentStatus: "part_paid" as const, createdDate: "2024-01-12", expectedDate: "2024-01-19", total: 445.00, lineItems: 2 },
  { id: "PO-004", supplierId: "4", status: "draft" as const, paymentStatus: "none" as const, createdDate: "2024-01-11", expectedDate: "2024-01-20", total: 2100.00, lineItems: 2 },
  { id: "PO-005", supplierId: "1", status: "awaiting_delivery" as const, paymentStatus: "unpaid" as const, createdDate: "2024-01-10", expectedDate: "2024-01-17", total: 675.25, lineItems: 6 },
  { id: "PO-006", supplierId: "2", status: "complete" as const, paymentStatus: "paid" as const, createdDate: "2024-01-08", expectedDate: "2024-01-12", total: 1520.00, lineItems: 4 },
];

export default function PurchaseOrders() {
  const [, setLocation] = useLocation();
  const [filterSupplier, setFilterSupplier] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders = mockPurchaseOrders.filter((order) => {
    const matchesSupplier = filterSupplier === "all" || order.supplierId === filterSupplier;
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSupplier && matchesStatus;
  });

  const getSupplierName = (id: string) => mockSuppliers.find((s) => s.id === id)?.name || "Unknown";

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "none":
        return { label: "None", className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
      case "unpaid":
        return { label: "Unpaid", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
      case "paid":
        return { label: "Paid", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
      case "part_paid":
        return { label: "Part Paid", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
    }
  };

  const handleRowClick = (orderId: string) => {
    setLocation(`/purchase-orders/${orderId}`);
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Manage and track all your purchase orders"
        action={{
          label: "New Purchase Order",
          icon: Plus,
          onClick: () => setLocation("/purchase-orders/new"),
        }}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Select value={filterSupplier} onValueChange={setFilterSupplier}>
            <SelectTrigger className="w-[180px]" data-testid="filter-po-supplier">
              <SelectValue placeholder="Filter by supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {mockSuppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("draft")}
            data-testid="button-filter-draft"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === "draft"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setFilterStatus("awaiting_delivery")}
            data-testid="button-filter-awaiting"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === "awaiting_delivery"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Awaiting Delivery
          </button>
          <button
            onClick={() => setFilterStatus("partially_received")}
            data-testid="button-filter-partial"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === "partially_received"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Partially Received
          </button>
          <button
            onClick={() => setFilterStatus("complete")}
            data-testid="button-filter-complete"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterStatus === "complete"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Complete
          </button>
          <button
            onClick={() => setFilterStatus("all")}
            data-testid="button-filter-all"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ml-auto ${
              filterStatus === "all"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>PO ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead className="text-right">Line Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const paymentStatus = getPaymentStatusBadge(order.paymentStatus);
                return (
                <TableRow
                  key={order.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => handleRowClick(order.id)}
                  data-testid={`row-po-${order.id}`}
                >
                  <TableCell>{getSupplierName(order.supplierId)}</TableCell>
                  <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={paymentStatus.className}>
                      {paymentStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="text-muted-foreground">{order.createdDate}</TableCell>
                  <TableCell className="text-muted-foreground">{order.expectedDate}</TableCell>
                  <TableCell className="text-right">{order.lineItems}</TableCell>
                </TableRow>
              );
              })}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No purchase orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
