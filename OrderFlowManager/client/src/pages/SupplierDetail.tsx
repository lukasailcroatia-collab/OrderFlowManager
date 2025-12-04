import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Save, Edit3, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockSuppliers = [
  { id: "1", name: "Snack Corp", email: "orders@snackcorp.com", phone: "(555) 123-4567", address: "123 Snack Lane, Food City, FC 12345" },
  { id: "2", name: "Beverage Inc", email: "supply@beverageinc.com", phone: "(555) 234-5678", address: "456 Drink Ave, Beverage Town, BT 23456" },
  { id: "3", name: "Candy World", email: "wholesale@candyworld.com", phone: "(555) 345-6789", address: "789 Sweet St, Candy City, CC 34567" },
  { id: "4", name: "Fresh Foods", email: "orders@freshfoods.com", phone: "(555) 456-7890", address: "321 Fresh Blvd, Organic Valley, OV 45678" },
];

// Mock purchase orders for related orders display
const mockPurchaseOrders = [
  { id: "PO-001", supplierId: "1", status: "awaiting_delivery" as const, paymentStatus: "unpaid" as const, createdDate: "2024-01-15", total: 1250.00 },
  { id: "PO-002", supplierId: "2", status: "complete" as const, paymentStatus: "paid" as const, createdDate: "2024-01-14", total: 890.50 },
  { id: "PO-003", supplierId: "3", status: "partially_received" as const, paymentStatus: "part_paid" as const, createdDate: "2024-01-12", total: 445.00 },
  { id: "PO-004", supplierId: "4", status: "draft" as const, paymentStatus: "none" as const, createdDate: "2024-01-11", total: 2100.00 },
  { id: "PO-005", supplierId: "1", status: "awaiting_delivery" as const, paymentStatus: "unpaid" as const, createdDate: "2024-01-10", total: 675.25 },
  { id: "PO-006", supplierId: "2", status: "complete" as const, paymentStatus: "paid" as const, createdDate: "2024-01-08", total: 1520.00 },
];

export default function SupplierDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const isNew = !params.id;

  const existingSupplier = params.id ? mockSuppliers.find((s) => s.id === params.id) : null;

  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState({
    name: existingSupplier?.name || "",
    email: existingSupplier?.email || "",
    phone: existingSupplier?.phone || "",
    address: existingSupplier?.address || "",
  });

  const getRelatedPurchaseOrders = () => {
    if (!params.id) return [];
    return mockPurchaseOrders
      .filter((po) => po.supplierId === params.id)
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  };

  const relatedPOs = getRelatedPurchaseOrders();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isNew ? "Supplier created" : "Supplier updated",
      description: isNew ? "The new supplier has been added." : "The supplier has been updated successfully.",
    });
    setIsEditing(false);
    if (isNew) {
      setLocation("/suppliers");
    }
  };

  const handleCancel = () => {
    if (isNew) {
      setLocation("/suppliers");
    } else {
      setFormData({
        name: existingSupplier?.name || "",
        email: existingSupplier?.email || "",
        phone: existingSupplier?.phone || "",
        address: existingSupplier?.address || "",
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
              onClick={() => setLocation("/suppliers")}
              className="text-slate-700 dark:text-slate-300 hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <div>
                <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-300" data-testid="page-title">
                  {isNew ? "New Supplier" : formData.name}
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
                <Label htmlFor="name">Supplier Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter supplier name"
                    data-testid="input-supplier-name"
                  />
                ) : (
                  <p className="h-10 flex items-center font-medium">{formData.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="orders@supplier.com"
                      data-testid="input-supplier-email"
                    />
                  ) : (
                    <p className="h-10 flex items-center text-muted-foreground">{formData.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      data-testid="input-supplier-phone"
                    />
                  ) : (
                    <p className="h-10 flex items-center">{formData.phone || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    rows={3}
                    data-testid="input-supplier-address"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{formData.address || "Not provided"}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                {!isEditing && !isNew && (
                  <Button onClick={handleEdit} data-testid="button-edit-supplier">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button onClick={handleSave} data-testid="button-save-supplier">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
                      Cancel
                    </Button>
                  </>
                )}
                {isNew && !isEditing && (
                  <Button onClick={() => setLocation("/suppliers")} data-testid="button-back-list">
                    Back to Suppliers
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {!isNew && relatedPOs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4" data-testid="text-recent-purchases">Recent Purchases</h2>
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
                      <TableRow 
                        key={po.id} 
                        className="hover-elevate cursor-pointer"
                        onClick={() => setLocation(`/purchase-orders/${po.id}`)}
                        data-testid={`row-recent-po-${po.id}`}
                      >
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
