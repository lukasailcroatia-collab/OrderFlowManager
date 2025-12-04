import { useState } from "react";
import { useLocation } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Mail, Phone } from "lucide-react";

// todo: remove mock functionality
const mockSuppliers = [
  { id: "1", name: "Snack Corp", email: "orders@snackcorp.com", phone: "(555) 123-4567", address: "123 Snack Lane, Food City, FC 12345", productCount: 24 },
  { id: "2", name: "Beverage Inc", email: "supply@beverageinc.com", phone: "(555) 234-5678", address: "456 Drink Ave, Beverage Town, BT 23456", productCount: 18 },
  { id: "3", name: "Candy World", email: "wholesale@candyworld.com", phone: "(555) 345-6789", address: "789 Sweet St, Candy City, CC 34567", productCount: 32 },
  { id: "4", name: "Fresh Foods", email: "orders@freshfoods.com", phone: "(555) 456-7890", address: "321 Fresh Blvd, Organic Valley, OV 45678", productCount: 15 },
];

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  productCount: number;
}

export default function Suppliers() {
  const [, setLocation] = useLocation();
  const [suppliers] = useState<Supplier[]>(mockSuppliers);

  const handleRowClick = (supplierId: string) => {
    setLocation(`/suppliers/${supplierId}`);
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier network"
        action={{
          label: "Add Supplier",
          icon: Plus,
          onClick: () => setLocation("/suppliers/new"),
        }}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => handleRowClick(supplier.id)}
                  data-testid={`row-supplier-${supplier.id}`}
                >
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{supplier.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {supplier.address}
                  </TableCell>
                  <TableCell className="text-right">{supplier.productCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
