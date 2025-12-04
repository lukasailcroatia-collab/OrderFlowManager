import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Users, ClipboardList, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

// todo: remove mock functionality
const mockMetrics = {
  totalProducts: 156,
  activeSuppliers: 24,
  pendingOrders: 8,
  lowStockItems: 12,
};

// todo: remove mock functionality
const mockRecentOrders = [
  { id: "PO-001", supplier: "Snack Corp", status: "awaiting_delivery" as const, total: 1250.00, date: "2024-01-15" },
  { id: "PO-002", supplier: "Beverage Inc", status: "complete" as const, total: 890.50, date: "2024-01-14" },
  { id: "PO-003", supplier: "Candy World", status: "partially_received" as const, total: 445.00, date: "2024-01-12" },
  { id: "PO-004", supplier: "Fresh Foods", status: "draft" as const, total: 2100.00, date: "2024-01-11" },
];

// todo: remove mock functionality
const mockLowStockItems = [
  { name: "Coca-Cola 12oz", sku: "BEV-001", current: 15, minimum: 50 },
  { name: "Lay's Classic Chips", sku: "SNK-012", current: 8, minimum: 30 },
  { name: "Snickers Bar", sku: "CND-005", current: 22, minimum: 40 },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory and purchase orders"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products"
          value={mockMetrics.totalProducts}
          icon={Package}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Active Suppliers"
          value={mockMetrics.activeSuppliers}
          icon={Users}
          trend={{ value: 2, isPositive: true }}
        />
        <MetricCard
          title="Pending Orders"
          value={mockMetrics.pendingOrders}
          icon={ClipboardList}
        />
        <MetricCard
          title="Low Stock Items"
          value={mockMetrics.lowStockItems}
          icon={AlertTriangle}
          trend={{ value: 4, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg font-semibold">Recent Purchase Orders</CardTitle>
            <Link href="/purchase-orders" className="text-sm text-primary hover:underline" data-testid="link-view-all-orders">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>PO ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentOrders.map((order) => (
                  <TableRow key={order.id} className="hover-elevate" data-testid={`row-order-${order.id}`}>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg font-semibold">Low Stock Alerts</CardTitle>
            <Link href="/inventory" className="text-sm text-primary hover:underline" data-testid="link-view-inventory">
              View inventory
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Minimum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLowStockItems.map((item) => (
                  <TableRow key={item.sku} className="hover-elevate" data-testid={`row-stock-${item.sku}`}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell className="text-right text-red-600 dark:text-red-400 font-medium">
                      {item.current}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.minimum}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
