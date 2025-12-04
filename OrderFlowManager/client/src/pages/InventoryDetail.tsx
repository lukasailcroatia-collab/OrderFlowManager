import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockLocations = [
  { id: "1", name: "Warehouse A" },
  { id: "2", name: "Warehouse B" },
  { id: "3", name: "Machine Stock" },
];

// todo: remove mock functionality
const mockInventory = [
  { id: "1", productName: "Coca-Cola 12oz", sku: "BEV-001", locationId: "1", quantity: 150, minQuantity: 50, maxQuantity: 300 },
  { id: "2", productName: "Pepsi 12oz", sku: "BEV-002", locationId: "1", quantity: 42, minQuantity: 50, maxQuantity: 300 },
  { id: "3", productName: "Lay's Classic Chips", sku: "SNK-012", locationId: "1", quantity: 8, minQuantity: 30, maxQuantity: 200 },
  { id: "4", productName: "Doritos Nacho Cheese", sku: "SNK-015", locationId: "2", quantity: 75, minQuantity: 40, maxQuantity: 200 },
  { id: "5", productName: "Snickers Bar", sku: "CND-005", locationId: "2", quantity: 22, minQuantity: 40, maxQuantity: 150 },
  { id: "6", productName: "M&M's Peanut", sku: "CND-008", locationId: "3", quantity: 180, minQuantity: 50, maxQuantity: 250 },
  { id: "7", productName: "Sprite 12oz", sku: "BEV-003", locationId: "3", quantity: 95, minQuantity: 40, maxQuantity: 200 },
  { id: "8", productName: "Twix Bar", sku: "CND-010", locationId: "1", quantity: 65, minQuantity: 30, maxQuantity: 150 },
];

// Mock purchase order history per product SKU
const mockPOHistory: Record<string, Array<{
  poId: string;
  date: string;
  quantity: number;
  received: number;
  status: "draft" | "awaiting_delivery" | "partially_received" | "complete";
  supplier: string;
}>> = {
  "BEV-001": [
    { poId: "PO-001", date: "2024-01-15", quantity: 100, received: 100, status: "complete", supplier: "Beverage Inc" },
    { poId: "PO-005", date: "2024-01-10", quantity: 50, received: 50, status: "complete", supplier: "Beverage Inc" },
  ],
  "BEV-002": [
    { poId: "PO-002", date: "2024-01-14", quantity: 75, received: 75, status: "complete", supplier: "Beverage Inc" },
  ],
  "SNK-012": [
    { poId: "PO-003", date: "2024-01-12", quantity: 50, received: 40, status: "partially_received", supplier: "Snack Corp" },
  ],
  "SNK-015": [
    { poId: "PO-004", date: "2024-01-11", quantity: 100, received: 100, status: "complete", supplier: "Snack Corp" },
  ],
  "CND-005": [
    { poId: "PO-006", date: "2024-01-08", quantity: 60, received: 60, status: "complete", supplier: "Candy World" },
  ],
  "CND-008": [
    { poId: "PO-007", date: "2024-01-07", quantity: 150, received: 150, status: "complete", supplier: "Candy World" },
  ],
  "BEV-003": [
    { poId: "PO-008", date: "2024-01-06", quantity: 80, received: 80, status: "complete", supplier: "Beverage Inc" },
  ],
  "CND-010": [
    { poId: "PO-009", date: "2024-01-05", quantity: 70, received: 70, status: "complete", supplier: "Candy World" },
  ],
};

export default function InventoryDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();

  const item = params.id ? mockInventory.find((i) => i.id === params.id) : null;
  const poHistory = item ? mockPOHistory[item.sku] || [] : [];

  const getLocationName = (id: string) => mockLocations.find((l) => l.id === id)?.name || "Unknown";

  const getStockStatus = () => {
    if (!item) return { label: "Unknown", className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
    if (item.quantity <= item.minQuantity * 0.5) {
      return { label: "Critical", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    }
    if (item.quantity <= item.minQuantity) {
      return { label: "Low", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    }
    if (item.quantity >= item.maxQuantity) {
      return { label: "Overstocked", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    }
    return { label: "OK", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  };

  const getPoStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      case "awaiting_delivery":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "partially_received":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "complete":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getPoStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "awaiting_delivery":
        return "Awaiting Delivery";
      case "partially_received":
        return "Partially Received";
      case "complete":
        return "Complete";
      default:
        return "Unknown";
    }
  };

  if (!item) {
    return (
      <div className="min-h-full">
        <div className="bg-slate-100 dark:bg-slate-800">
          <div className="px-8 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/inventory")}
              className="text-slate-700 dark:text-slate-300 hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="p-8">
          <p className="text-muted-foreground">Inventory item not found</p>
        </div>
      </div>
    );
  }

  const status = getStockStatus();
  const stockPercentage = Math.min((item.quantity / item.maxQuantity) * 100, 100);

  return (
    <div className="min-h-full">
      <div className="bg-slate-100 dark:bg-slate-800">
        <div className="px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/inventory")}
              className="text-slate-700 dark:text-slate-300 hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <div>
                <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-300" data-testid="page-title">
                  {item.productName}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.sku}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-4xl">
        {/* Product Details Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{getLocationName(item.locationId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">SKU</p>
                  <p className="font-medium">{item.sku}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant="secondary" className={status.className}>
                    {status.label === "OK" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : status.label === "Critical" || status.label === "Low" ? (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    ) : null}
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Level Card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Stock Level</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-2xl font-bold">{item.quantity}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(stockPercentage)}% of max capacity
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.quantity <= item.minQuantity * 0.5
                            ? "bg-red-500"
                            : item.quantity <= item.minQuantity
                            ? "bg-amber-500"
                            : item.quantity >= item.maxQuantity
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Minimum Quantity</p>
                  <p className="text-lg font-semibold">{item.minQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maximum Quantity</p>
                  <p className="text-lg font-semibold">{item.maxQuantity}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Order History */}
        {poHistory.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4" data-testid="text-po-history-title">Purchase Order History</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poHistory.map((po) => (
                    <TableRow key={po.poId} data-testid={`row-po-history-${po.poId}`}>
                      <TableCell className="font-medium">{po.poId}</TableCell>
                      <TableCell className="text-muted-foreground">{po.date}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell className="text-right">{po.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{po.received}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPoStatusColor(po.status)}>
                          {getPoStatusLabel(po.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {poHistory.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No purchase order history available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
