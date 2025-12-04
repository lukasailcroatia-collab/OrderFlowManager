import { useState } from "react";
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
import { ArrowLeft, Save, Edit3, Package } from "lucide-react";
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
  { id: "1", name: "Coca-Cola 12oz", sku: "BEV-001", supplierId: "2", price: 1.50, category: "Beverages" },
  { id: "2", name: "Pepsi 12oz", sku: "BEV-002", supplierId: "2", price: 1.50, category: "Beverages" },
  { id: "3", name: "Lay's Classic Chips", sku: "SNK-012", supplierId: "1", price: 2.00, category: "Snacks" },
  { id: "4", name: "Doritos Nacho Cheese", sku: "SNK-015", supplierId: "1", price: 2.25, category: "Snacks" },
  { id: "5", name: "Snickers Bar", sku: "CND-005", supplierId: "3", price: 1.75, category: "Candy" },
  { id: "6", name: "M&M's Peanut", sku: "CND-008", supplierId: "3", price: 1.50, category: "Candy" },
];

// Mock purchase orders for related orders display
const mockPurchaseOrders = [
  { id: "PO-001", supplierId: "1", status: "awaiting_delivery" as const, paymentStatus: "unpaid" as const, createdDate: "2024-01-15", expectedDate: "2024-01-22", total: 1250.00, lineItems: [
    { productId: "1", quantity: 50, unitPrice: 2.0, quantityReceived: 0 },
    { productId: "3", quantity: 30, unitPrice: 2.25, quantityReceived: 0 }
  ] },
  { id: "PO-002", supplierId: "2", status: "complete" as const, paymentStatus: "paid" as const, createdDate: "2024-01-14", expectedDate: "2024-01-18", total: 890.50, lineItems: [
    { productId: "1", quantity: 100, unitPrice: 1.5, quantityReceived: 100 },
    { productId: "2", quantity: 80, unitPrice: 1.5, quantityReceived: 80 }
  ] },
  { id: "PO-003", supplierId: "3", status: "partially_received" as const, paymentStatus: "part_paid" as const, createdDate: "2024-01-12", expectedDate: "2024-01-19", total: 445.00, lineItems: [
    { productId: "5", quantity: 60, unitPrice: 1.75, quantityReceived: 40 }
  ] },
  { id: "PO-004", supplierId: "4", status: "draft" as const, paymentStatus: "none" as const, createdDate: "2024-01-11", expectedDate: "2024-01-20", total: 2100.00, lineItems: [] },
  { id: "PO-005", supplierId: "1", status: "awaiting_delivery" as const, paymentStatus: "unpaid" as const, createdDate: "2024-01-10", expectedDate: "2024-01-17", total: 675.25, lineItems: [
    { productId: "3", quantity: 40, unitPrice: 2.0, quantityReceived: 0 }
  ] },
];

interface Product {
  id: string;
  name: string;
  sku: string;
  supplierId: string;
  price: number;
  category: string;
}

export default function ProductDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const isNew = !params.id;

  const existingProduct = params.id ? mockProducts.find((p) => p.id === params.id) : null;

  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState({
    name: existingProduct?.name || "",
    sku: existingProduct?.sku || "",
    supplierId: existingProduct?.supplierId || "",
    price: existingProduct?.price.toString() || "",
    category: existingProduct?.category || "",
  });

  const getSupplierName = (id: string) => mockSuppliers.find((s) => s.id === id)?.name || "Unknown";

  const getRelatedPurchaseOrders = () => {
    if (!params.id) return [];
    return mockPurchaseOrders
      .filter((po) => po.lineItems.some((item) => item.productId === params.id))
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  };

  const relatedPOs = getRelatedPurchaseOrders();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.sku || !formData.supplierId || !formData.price || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isNew ? "Product created" : "Product updated",
      description: isNew ? "The new product has been added." : "The product has been updated successfully.",
    });
    setIsEditing(false);
    if (isNew) {
      setLocation("/products");
    }
  };

  const handleCancel = () => {
    if (isNew) {
      setLocation("/products");
    } else {
      setFormData({
        name: existingProduct?.name || "",
        sku: existingProduct?.sku || "",
        supplierId: existingProduct?.supplierId || "",
        price: existingProduct?.price.toString() || "",
        category: existingProduct?.category || "",
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-full">
      <div className="bg-slate-100 dark:bg-slate-800">
        <div className="px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/products")}
              className="text-slate-700 dark:text-slate-300 hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <div>
                <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-300" data-testid="page-title">
                  {isNew ? "New Product" : formData.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    data-testid="input-product-name"
                  />
                ) : (
                  <p className="h-10 flex items-center font-medium">{formData.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  {isEditing ? (
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g., BEV-001"
                      data-testid="input-product-sku"
                    />
                  ) : (
                    <p className="h-10 flex items-center text-muted-foreground">{formData.sku}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  {isEditing ? (
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Beverages"
                      data-testid="input-product-category"
                    />
                  ) : (
                    <p className="h-10 flex items-center">{formData.category}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  {isEditing ? (
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
                    >
                      <SelectTrigger data-testid="select-product-supplier">
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
                    <p className="h-10 flex items-center">{getSupplierName(formData.supplierId)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Unit Price</Label>
                  {isEditing ? (
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      data-testid="input-product-price"
                    />
                  ) : (
                    <p className="h-10 flex items-center">${parseFloat(formData.price).toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!isEditing && !isNew && (
                  <Button onClick={handleEdit} data-testid="button-edit-product">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button onClick={handleSave} data-testid="button-save-product">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
                      Cancel
                    </Button>
                  </>
                )}
                {isNew && !isEditing && (
                  <Button onClick={() => setLocation("/products")} data-testid="button-back-list">
                    Back to Products
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {!isNew && relatedPOs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4" data-testid="text-related-pos">Related Purchase Orders</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedPOs.map((po) => (
                      <TableRow key={po.id} data-testid={`row-related-po-${po.id}`}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.status.replace(/_/g, " ")}</TableCell>
                        <TableCell>{po.paymentStatus.replace(/_/g, " ")}</TableCell>
                        <TableCell>{po.createdDate}</TableCell>
                        <TableCell className="text-right">${po.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
