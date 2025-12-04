import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockPODetails = {
  id: "PO-001",
  supplier: "Snack Corp",
  status: "awaiting_delivery" as const,
  orderedDate: "2024-01-15",
  expectedDate: "2024-01-22",
  lineItems: [
    { id: "1", productName: "Lay's Classic Chips", sku: "SNK-012", quantityOrdered: 50, quantityReceived: 0, unitPrice: 2.00 },
    { id: "2", productName: "Doritos Nacho Cheese", sku: "SNK-015", quantityOrdered: 30, quantityReceived: 0, unitPrice: 2.25 },
    { id: "3", productName: "Cheetos Crunchy", sku: "SNK-018", quantityOrdered: 40, quantityReceived: 0, unitPrice: 2.00 },
    { id: "4", productName: "Ruffles Original", sku: "SNK-020", quantityOrdered: 25, quantityReceived: 0, unitPrice: 2.00 },
    { id: "5", productName: "Tostitos Scoops", sku: "SNK-025", quantityOrdered: 20, quantityReceived: 0, unitPrice: 3.50 },
  ],
};

interface LineItemReceive {
  id: string;
  productName: string;
  sku: string;
  quantityOrdered: number;
  quantityReceived: number;
  receivingNow: number;
  unitPrice: number;
}

export default function ReceivePurchaseOrder() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();

  const [lineItems, setLineItems] = useState<LineItemReceive[]>(
    mockPODetails.lineItems.map((item) => ({
      ...item,
      receivingNow: 0,
    }))
  );

  const updateReceivingQuantity = (id: string, value: number) => {
    setLineItems(lineItems.map((item) => {
      if (item.id !== id) return item;
      const remaining = item.quantityOrdered - item.quantityReceived;
      const clampedValue = Math.min(Math.max(0, value), remaining);
      return { ...item, receivingNow: clampedValue };
    }));
  };

  const totalOrdered = lineItems.reduce((sum, item) => sum + item.quantityOrdered, 0);
  const totalReceived = lineItems.reduce((sum, item) => sum + item.quantityReceived, 0);
  const totalReceivingNow = lineItems.reduce((sum, item) => sum + item.receivingNow, 0);

  const handleReceive = () => {
    const updatedItems = lineItems.map((item) => ({
      ...item,
      quantityReceived: item.quantityReceived + item.receivingNow,
      receivingNow: 0,
    }));
    
    setLineItems(updatedItems);
    
    const allReceived = updatedItems.every((item) => item.quantityReceived >= item.quantityOrdered);
    const someReceived = updatedItems.some((item) => item.quantityReceived > 0);

    if (allReceived) {
      toast({
        title: "Order Complete",
        description: "All items have been received. Order marked as complete.",
      });
    } else if (someReceived) {
      toast({
        title: "Items Received",
        description: "Partial shipment recorded. Order updated.",
      });
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/purchase-orders")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <PageHeader
            title={`Receive ${params.id || mockPODetails.id}`}
            description="Record received quantities for this purchase order"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Supplier</p>
              <p className="font-medium">{mockPODetails.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{mockPODetails.orderedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Date</p>
              <p className="font-medium">{mockPODetails.expectedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">
                <StatusBadge status={mockPODetails.status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Receive Items</h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Ordered</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="w-[150px] text-right">Receiving Now</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => {
                const remaining = item.quantityOrdered - item.quantityReceived;
                return (
                  <TableRow key={item.id} data-testid={`row-receive-${item.id}`}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell className="text-right">{item.quantityOrdered}</TableCell>
                    <TableCell className="text-right">
                      <span className={item.quantityReceived > 0 ? "text-green-600 dark:text-green-400" : ""}>
                        {item.quantityReceived}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={remaining > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : "text-green-600 dark:text-green-400"}>
                        {remaining}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={remaining}
                        value={item.receivingNow}
                        onChange={(e) => updateReceivingQuantity(item.id, parseInt(e.target.value) || 0)}
                        disabled={remaining === 0}
                        className="text-right"
                        data-testid={`input-receiving-${item.id}`}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="border-t border-border p-4">
            <div className="flex flex-col items-end gap-2">
              <div className="flex justify-between w-56">
                <span className="text-muted-foreground">Total Ordered:</span>
                <span>{totalOrdered} units</span>
              </div>
              <div className="flex justify-between w-56">
                <span className="text-muted-foreground">Previously Received:</span>
                <span className="text-green-600 dark:text-green-400">{totalReceived} units</span>
              </div>
              <div className="flex justify-between w-56 pt-2 border-t border-border">
                <span className="font-semibold">Receiving Now:</span>
                <span className="font-semibold text-lg" data-testid="text-receiving-total">
                  {totalReceivingNow} units
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleReceive}
          disabled={totalReceivingNow === 0}
          size="lg"
          data-testid="button-receive-items"
        >
          <Package className="w-4 h-4 mr-2" />
          Receive Items
        </Button>
      </div>
    </div>
  );
}
