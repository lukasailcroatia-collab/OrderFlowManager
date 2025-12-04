import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
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
import { Plus, Trash2, ArrowLeft, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockSuppliers = [
  { id: "1", name: "Snack Corp" },
  { id: "2", name: "Beverage Inc" },
  { id: "3", name: "Candy World" },
  { id: "4", name: "Fresh Foods" },
];

// todo: remove mock functionality
const mockProducts = [
  { id: "1", name: "Lay's Classic Chips", sku: "SNK-012", supplierId: "1", price: 2.00 },
  { id: "2", name: "Doritos Nacho Cheese", sku: "SNK-015", supplierId: "1", price: 2.25 },
  { id: "3", name: "Cheetos Crunchy", sku: "SNK-018", supplierId: "1", price: 2.00 },
  { id: "4", name: "Coca-Cola 12oz", sku: "BEV-001", supplierId: "2", price: 1.50 },
  { id: "5", name: "Pepsi 12oz", sku: "BEV-002", supplierId: "2", price: 1.50 },
  { id: "6", name: "Sprite 12oz", sku: "BEV-003", supplierId: "2", price: 1.50 },
  { id: "7", name: "Snickers Bar", sku: "CND-005", supplierId: "3", price: 1.75 },
  { id: "8", name: "M&M's Peanut", sku: "CND-008", supplierId: "3", price: 1.50 },
  { id: "9", name: "Twix Bar", sku: "CND-010", supplierId: "3", price: 1.75 },
  { id: "10", name: "Fresh Apple", sku: "FRH-001", supplierId: "4", price: 0.75 },
  { id: "11", name: "Fresh Orange", sku: "FRH-002", supplierId: "4", price: 0.80 },
];

interface LineItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export default function NewPurchaseOrder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [supplierId, setSupplierId] = useState<string>("");
  const [expectedDate, setExpectedDate] = useState<string>("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

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
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => {
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
    }));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const getProductName = (productId: string) => {
    return mockProducts.find((p) => p.id === productId)?.name || "";
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
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
    toast({
      title: "Purchase order submitted",
      description: "Your purchase order has been submitted for delivery.",
    });
    setLocation("/purchase-orders");
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
            title="New Purchase Order"
            description="Create a new purchase order with line items"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={supplierId} onValueChange={(value) => {
                setSupplierId(value);
                setLineItems([]);
              }}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDate">Expected Delivery Date</Label>
              <Input
                id="expectedDate"
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                data-testid="input-expected-date"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="h-10 flex items-center">
                <StatusBadge status="draft" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4">
            <h2 className="font-semibold">Line Items</h2>
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Product</TableHead>
                <TableHead className="w-[15%] text-right">Quantity</TableHead>
                <TableHead className="w-[20%] text-right">Unit Price</TableHead>
                <TableHead className="w-[15%] text-right">Total</TableHead>
                <TableHead className="w-[10%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => (
                <TableRow key={item.id} data-testid={`row-line-item-${item.id}`}>
                  <TableCell>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => updateLineItem(item.id, "productId", value)}
                    >
                      <SelectTrigger data-testid={`select-product-${item.id}`}>
                        <SelectValue placeholder="Select product">
                          {getProductName(item.productId) || "Select product"}
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
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      className="text-right"
                      data-testid={`input-quantity-${item.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="text-right"
                      data-testid={`input-price-${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </TableCell>
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
                </TableRow>
              ))}
              {lineItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {supplierId
                      ? "No line items added yet. Click \"Add Line Item\" to start."
                      : "Select a supplier first to add products."}
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
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48">
                  <span className="text-muted-foreground">Tax (8%):</span>
                  <span data-testid="text-tax">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 pt-2 border-t border-border">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold text-lg" data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleSaveDraft} data-testid="button-save-draft">
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={handleSubmit} data-testid="button-submit-po">
          <Send className="w-4 h-4 mr-2" />
          Submit Purchase Order
        </Button>
      </div>
    </div>
  );
}
