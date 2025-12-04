import { useState } from "react";
import { useLocation } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Settings2, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockLocations = [
  { id: "1", name: "Main Stock" },
  { id: "2", name: "Local Stock" },
  { id: "3", name: "Vending machine 1" },
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
  { id: "8", productName: "Twix Bar", sku: "CND-010", locationId: "2", quantity: 65, minQuantity: 30, maxQuantity: 150 },
];

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  locationId: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
}

export default function Inventory() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterProduct, setFilterProduct] = useState<string>("");
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState<string>("");
  const [adjustmentReason, setAdjustmentReason] = useState<string>("");

  const filteredInventory = inventory.filter((item) => {
    const matchesLocation = filterLocation === "all" || item.locationId === filterLocation;
    const matchesProduct = !filterProduct || 
      item.productName.toLowerCase().includes(filterProduct.toLowerCase()) ||
      item.sku.toLowerCase().includes(filterProduct.toLowerCase());
    return matchesLocation && matchesProduct;
  });

  const getLocationName = (id: string) => mockLocations.find((l) => l.id === id)?.name || "Unknown";

  const getStockStatus = (item: InventoryItem) => {
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

  const openAdjustDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentValue("");
    setAdjustmentReason("");
    setAdjustDialogOpen(true);
  };

  const handleAdjust = () => {
    if (!selectedItem || !adjustmentValue) return;

    const adjustment = parseInt(adjustmentValue);
    const newQuantity = selectedItem.quantity + adjustment;

    if (newQuantity < 0) {
      toast({
        title: "Invalid adjustment",
        description: "Quantity cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    setInventory(inventory.map((item) =>
      item.id === selectedItem.id
        ? { ...item, quantity: newQuantity }
        : item
    ));

    toast({
      title: "Stock adjusted",
      description: `${selectedItem.productName} quantity updated by ${adjustment > 0 ? "+" : ""}${adjustment}.`,
    });

    setAdjustDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Inventory"
        description="Monitor and manage your stock levels"
      />

      <div className="space-y-4">
        <Input
          placeholder="Search by product or SKU..."
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="w-[250px]"
          data-testid="input-search-inventory"
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterLocation("all")}
            data-testid="button-filter-all-locations"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterLocation === "all"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Locations
          </button>
          {mockLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => setFilterLocation(location.id)}
              data-testid={`button-filter-location-${location.id}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterLocation === location.id
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-black"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Min / Max</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
                const stockPercentage = Math.min((item.quantity / item.maxQuantity) * 100, 100);
                
                return (
                  <TableRow key={item.id} className="hover-elevate cursor-pointer" onClick={() => setLocation(`/inventory/${item.id}`)} data-testid={`row-inventory-${item.id}`}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell>{getLocationName(item.locationId)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-medium">{item.quantity}</span>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.quantity <= item.minQuantity * 0.5
                                ? "bg-red-500"
                                : item.quantity <= item.minQuantity
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.minQuantity} / {item.maxQuantity}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={status.className}>
                        {status.label === "OK" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : status.label === "Critical" || status.label === "Low" ? (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        ) : null}
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAdjustDialog(item)}
                        data-testid={`button-adjust-${item.id}`}
                      >
                        <Settings2 className="w-4 h-4 mr-1" />
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No inventory items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{selectedItem.productName}</p>
                <p className="text-sm text-muted-foreground">Current quantity: {selectedItem.quantity}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustment">Adjustment (+/-)</Label>
                <Input
                  id="adjustment"
                  type="number"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(e.target.value)}
                  placeholder="e.g., +10 or -5"
                  data-testid="input-adjustment-value"
                />
                <p className="text-xs text-muted-foreground">
                  Use positive numbers to add stock, negative to remove.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g., Damaged goods, Count correction"
                  rows={2}
                  data-testid="input-adjustment-reason"
                />
              </div>

              {adjustmentValue && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    New quantity will be:{" "}
                    <span className="font-semibold">
                      {selectedItem.quantity + (parseInt(adjustmentValue) || 0)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjust} disabled={!adjustmentValue} data-testid="button-confirm-adjust">
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
