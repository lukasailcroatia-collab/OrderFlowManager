import { useState } from "react";
import { useLocation } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface Product {
  id: string;
  name: string;
  sku: string;
  supplierId: string;
  price: number;
  category: string;
}

export default function Products() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [products] = useState<Product[]>(mockProducts);
  const [filterSupplier, setFilterSupplier] = useState<string>("all");

  const filteredProducts = filterSupplier === "all"
    ? products
    : products.filter((p) => p.supplierId === filterSupplier);

  const getSupplierName = (id: string) => mockSuppliers.find((s) => s.id === id)?.name || "Unknown";

  const handleRowClick = (productId: string) => {
    setLocation(`/products/${productId}`);
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={{
          label: "Add Product",
          icon: Plus,
          onClick: () => setLocation("/products/new"),
        }}
      />

      <div className="flex items-center gap-4">
        <Select value={filterSupplier} onValueChange={setFilterSupplier}>
          <SelectTrigger className="w-[200px]" data-testid="filter-supplier">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="hover-elevate cursor-pointer" 
                  onClick={() => handleRowClick(product.id)}
                  data-testid={`row-product-${product.id}`}
                >
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{getSupplierName(product.supplierId)}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No products found
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
