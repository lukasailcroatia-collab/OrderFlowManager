import { useState, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Package,
  FileText,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type POStatus =
  | "draft"
  | "awaiting_delivery"
  | "partially_received"
  | "complete";

type PaymentStatus = "none" | "unpaid" | "paid" | "part_paid";

// todo: remove mock functionality
const mockSuppliers = [
  { id: "1", name: "Snack Corp" },
  { id: "2", name: "Beverage Inc" },
  { id: "3", name: "Candy World" },
  { id: "4", name: "Fresh Foods" },
];

// todo: remove mock functionality
const mockProducts = [
  {
    id: "1",
    name: "Lay's Classic Chips",
    sku: "SNK-012",
    supplierId: "1",
    price: 2.0,
  },
  {
    id: "2",
    name: "Doritos Nacho Cheese",
    sku: "SNK-015",
    supplierId: "1",
    price: 2.25,
  },
  {
    id: "3",
    name: "Cheetos Crunchy",
    sku: "SNK-018",
    supplierId: "1",
    price: 2.0,
  },
  {
    id: "4",
    name: "Coca-Cola 12oz",
    sku: "BEV-001",
    supplierId: "2",
    price: 1.5,
  },
  { id: "5", name: "Pepsi 12oz", sku: "BEV-002", supplierId: "2", price: 1.5 },
  { id: "6", name: "Sprite 12oz", sku: "BEV-003", supplierId: "2", price: 1.5 },
  {
    id: "7",
    name: "Snickers Bar",
    sku: "CND-005",
    supplierId: "3",
    price: 1.75,
  },
  {
    id: "8",
    name: "M&M's Peanut",
    sku: "CND-008",
    supplierId: "3",
    price: 1.5,
  },
  { id: "9", name: "Twix Bar", sku: "CND-010", supplierId: "3", price: 1.75 },
  {
    id: "10",
    name: "Fresh Apple",
    sku: "FRH-001",
    supplierId: "4",
    price: 0.75,
  },
  {
    id: "11",
    name: "Fresh Orange",
    sku: "FRH-002",
    supplierId: "4",
    price: 0.8,
  },
];

// todo: remove mock functionality
const mockPurchaseOrders: Record<
  string,
  {
    id: string;
    supplierId: string;
    status: POStatus;
    paymentStatus: PaymentStatus;
    createdDate: string;
    expectedDate: string;
    lineItems: {
      id: string;
      productId: string;
      quantity: number;
      unitPrice: number;
      quantityReceived: number;
    }[];
  }
> = {
  "PO-001": {
    id: "PO-001",
    supplierId: "1",
    status: "awaiting_delivery",
    paymentStatus: "unpaid",
    createdDate: "2024-01-15",
    expectedDate: "2024-01-22",
    lineItems: [
      {
        id: "1",
        productId: "1",
        quantity: 50,
        unitPrice: 2.0,
        quantityReceived: 0,
      },
      {
        id: "2",
        productId: "2",
        quantity: 30,
        unitPrice: 2.25,
        quantityReceived: 0,
      },
      {
        id: "3",
        productId: "3",
        quantity: 40,
        unitPrice: 2.0,
        quantityReceived: 0,
      },
    ],
  },
  "PO-002": {
    id: "PO-002",
    supplierId: "2",
    status: "complete",
    paymentStatus: "paid",
    createdDate: "2024-01-14",
    expectedDate: "2024-01-18",
    lineItems: [
      {
        id: "1",
        productId: "4",
        quantity: 100,
        unitPrice: 1.5,
        quantityReceived: 100,
      },
      {
        id: "2",
        productId: "5",
        quantity: 80,
        unitPrice: 1.5,
        quantityReceived: 80,
      },
    ],
  },
  "PO-003": {
    id: "PO-003",
    supplierId: "3",
    status: "partially_received",
    paymentStatus: "part_paid",
    createdDate: "2024-01-12",
    expectedDate: "2024-01-19",
    lineItems: [
      {
        id: "1",
        productId: "7",
        quantity: 60,
        unitPrice: 1.75,
        quantityReceived: 40,
      },
      {
        id: "2",
        productId: "8",
        quantity: 50,
        unitPrice: 1.5,
        quantityReceived: 50,
      },
    ],
  },
  "PO-004": {
    id: "PO-004",
    supplierId: "4",
    status: "draft",
    paymentStatus: "none",
    createdDate: "2024-01-11",
    expectedDate: "2024-01-20",
    lineItems: [
      {
        id: "1",
        productId: "10",
        quantity: 200,
        unitPrice: 0.75,
        quantityReceived: 0,
      },
      {
        id: "2",
        productId: "11",
        quantity: 150,
        unitPrice: 0.8,
        quantityReceived: 0,
      },
    ],
  },
};

const statusConfig: Record<
  POStatus,
  { label: string; icon: typeof FileText; bgClass: string; textClass: string }
> = {
  draft: {
    label: "Draft",
    icon: FileText,
    bgClass: "bg-slate-100 dark:bg-slate-800",
    textClass: "text-slate-700 dark:text-slate-300",
  },
  awaiting_delivery: {
    label: "Awaiting Delivery",
    icon: Truck,
    bgClass: "bg-blue-500",
    textClass: "text-white",
  },
  partially_received: {
    label: "Partially Received",
    icon: Clock,
    bgClass: "bg-amber-500",
    textClass: "text-white",
  },
  complete: {
    label: "Complete",
    icon: CheckCircle,
    bgClass: "bg-green-500",
    textClass: "text-white",
  },
};

interface LineItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  quantityReceived: number;
}

export default function PurchaseOrderDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const isNew = !params.id;

  const existingPO = params.id ? mockPurchaseOrders[params.id] : null;

  const [supplierId, setSupplierId] = useState<string>(
    existingPO?.supplierId || "",
  );
  const [expectedDate, setExpectedDate] = useState<string>(
    existingPO?.expectedDate || "",
  );
  const [status, setStatus] = useState<POStatus>(existingPO?.status || "draft");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    existingPO?.paymentStatus || "none",
  );
  const [createdDate] = useState<string>(
    existingPO?.createdDate || new Date().toISOString().split("T")[0],
  );
  const [lineItems, setLineItems] = useState<LineItem[]>(
    existingPO?.lineItems || [],
  );

  const isEditable = status === "draft";
  const canReceive =
    status === "awaiting_delivery" || status === "partially_received";
  const isPartiallyReceived = status === "partially_received";

  const supplierProducts = useMemo(() => {
    if (!supplierId) return [];
    return mockProducts.filter((p) => p.supplierId === supplierId);
  }, [supplierId]);

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      productId: "",
      quantity: 1,
      unitPrice: 0,
      quantityReceived: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;

        if (field === "productId") {
          const product = mockProducts.find((p) => p.id === value);
          return {
            ...item,
            productId: value as string,
            unitPrice: product?.price || 0,
          };
        }

        return { ...item, [field]: value };
      }),
    );
  };

  const updateReceivingQuantity = (id: string, value: number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;
        const max = item.quantity;
        return { ...item, quantityReceived: Math.min(Math.max(0, value), max) };
      }),
    );
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const getProductName = (productId: string) => {
    return mockProducts.find((p) => p.id === productId)?.name || "";
  };

  const getProductSku = (productId: string) => {
    return mockProducts.find((p) => p.id === productId)?.sku || "";
  };

  const getSupplierName = (id: string) =>
    mockSuppliers.find((s) => s.id === id)?.name || "";

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your purchase order has been saved as a draft.",
    });
    setLocation("/purchase-orders");
  };

  const handleSubmit = () => {
    if (!supplierId) {
      toast({
        title: "Supplier required",
        description: "Please select a supplier before submitting.",
        variant: "destructive",
      });
      return;
    }
    if (lineItems.length === 0) {
      toast({
        title: "Line items required",
        description: "Please add at least one line item.",
        variant: "destructive",
      });
      return;
    }
    setStatus("awaiting_delivery");
    toast({
      title: "Purchase order submitted",
      description: "Your purchase order has been submitted for delivery.",
    });
    setLocation("/purchase-orders");
  };

  const handleReceive = () => {
    const allReceived = lineItems.every(
      (item) => item.quantityReceived >= item.quantity,
    );
    const someReceived = lineItems.some((item) => item.quantityReceived > 0);

    if (allReceived) {
      setStatus("complete");
      toast({
        title: "Order Complete",
        description: "All items have been received. Order marked as complete.",
      });
    } else if (someReceived) {
      setStatus("partially_received");
      toast({
        title: "Items Received",
        description: "Partial shipment recorded. Order updated.",
      });
    }
    setLocation("/purchase-orders");
  };

  const handleUpdateExpectedDate = () => {
    toast({
      title: "Expected date updated",
      description: "The expected delivery date has been updated.",
    });
  };

  const handleCancel = () => {
    setLocation("/purchase-orders");
  };

  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-full">
      <div className={`${statusInfo.bgClass} ${statusInfo.textClass}`}>
        <div className="px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/purchase-orders")}
              className={`${statusInfo.textClass} hover:bg-white/20`}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <StatusIcon className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold" data-testid="page-title">
                  {isNew ? "New Purchase Order" : params.id}
                </h1>
                <p className="text-sm opacity-90">{statusInfo.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier {isEditable && "*"}</Label>
                {isEditable ? (
                  <Select
                    value={supplierId}
                    onValueChange={(value) => {
                      setSupplierId(value);
                      setLineItems([]);
                    }}
                  >
                    <SelectTrigger data-testid="select-po-supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center font-medium">
                    {getSupplierName(supplierId)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={(value) => setPaymentStatus(value as PaymentStatus)}>
                  <SelectTrigger data-testid="select-payment-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="part_paid">Part Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Created Date</Label>
                <p className="h-10 flex items-center text-muted-foreground">
                  {createdDate}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDate">Expected Delivery</Label>
                {isEditable || isPartiallyReceived ? (
                  <Input
                    id="expectedDate"
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    data-testid="input-expected-date"
                  />
                ) : (
                  <p className="h-10 flex items-center">
                    {expectedDate || "Not set"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Total</Label>
                <p className="h-10 flex items-center text-xl font-semibold">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex items-center justify-between gap-4">
              <h2 className="font-semibold">Line Items</h2>
              {isEditable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  disabled={!supplierId}
                  data-testid="button-add-line-item"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Line Item
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isEditable ? "w-[35%]" : "w-[30%]"}>
                    Product
                  </TableHead>
                  {!isEditable && (
                    <TableHead className="w-[15%]">SKU</TableHead>
                  )}
                  <TableHead className="w-[12%] text-right">Quantity</TableHead>
                  <TableHead className="w-[15%] text-right">
                    Unit Price
                  </TableHead>
                  <TableHead className="w-[12%] text-right">Total</TableHead>
                  {canReceive && (
                    <TableHead className="w-[15%] text-right">
                      Received
                    </TableHead>
                  )}
                  {isEditable && <TableHead className="w-[8%]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow
                    key={item.id}
                    data-testid={`row-line-item-${item.id}`}
                  >
                    <TableCell>
                      {isEditable ? (
                        <Select
                          value={item.productId}
                          onValueChange={(value) =>
                            updateLineItem(item.id, "productId", value)
                          }
                        >
                          <SelectTrigger
                            data-testid={`select-product-${item.id}`}
                          >
                            <SelectValue placeholder="Select product">
                              {getProductName(item.productId) ||
                                "Select product"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {supplierProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} ({product.sku})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="font-medium">
                          {getProductName(item.productId)}
                        </span>
                      )}
                    </TableCell>
                    {!isEditable && (
                      <TableCell className="text-muted-foreground">
                        {getProductSku(item.productId)}
                      </TableCell>
                    )}
                    <TableCell>
                      {isEditable ? (
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="text-right"
                          data-testid={`input-quantity-${item.id}`}
                        />
                      ) : (
                        <span className="block text-right">
                          {item.quantity}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditable ? (
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="text-right"
                          data-testid={`input-price-${item.id}`}
                        />
                      ) : (
                        <span className="block text-right">
                          ${item.unitPrice.toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </TableCell>
                    {canReceive && (
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={item.quantityReceived || item.quantity}
                            onChange={(e) =>
                              updateReceivingQuantity(
                                item.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-20 text-right"
                            data-testid={`input-received-${item.id}`}
                          />
                          <span className="text-muted-foreground text-sm">
                            / {item.quantity}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {isEditable && (
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeLineItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {lineItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={isEditable ? 6 : canReceive ? 6 : 5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {isEditable
                        ? supplierId
                          ? 'No line items added yet. Click "Add Line Item" to start.'
                          : "Select a supplier first to add products."
                        : "No line items in this order."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {lineItems.length > 0 && (
              <div className="border-t border-border p-4">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex justify-between w-48">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span data-testid="text-subtotal">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between w-48">
                    <span className="text-muted-foreground">Tax (8%):</span>
                    <span data-testid="text-tax">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-48 pt-2 border-t border-border">
                    <span className="font-semibold">Total:</span>
                    <span
                      className="font-semibold text-lg"
                      data-testid="text-total"
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          {isEditable && (
            <>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                data-testid="button-save-draft"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit} data-testid="button-submit-po">
                <Send className="w-4 h-4 mr-2" />
                Submit Purchase Order
              </Button>
            </>
          )}
          {canReceive && (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReceive}
                size="lg"
                data-testid="button-receive-items"
              >
                <Package className="w-4 h-4 mr-2" />
                Receive Items
              </Button>
              {isPartiallyReceived && (
                <Button
                  onClick={handleUpdateExpectedDate}
                  size="lg"
                  variant="secondary"
                  data-testid="button-update-expected-date"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
