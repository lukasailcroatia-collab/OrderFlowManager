import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Suppliers from "@/pages/Suppliers";
import SupplierDetail from "@/pages/SupplierDetail";
import PurchaseOrders from "@/pages/PurchaseOrders";
import PurchaseOrderDetail from "@/pages/PurchaseOrderDetail";
import Inventory from "@/pages/Inventory";
import InventoryDetail from "@/pages/InventoryDetail";
import RefillJobs from "@/pages/RefillJobs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/products" component={Products} />
      <Route path="/products/new" component={ProductDetail} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/suppliers/new" component={SupplierDetail} />
      <Route path="/suppliers/:id" component={SupplierDetail} />
      <Route path="/purchase-orders" component={PurchaseOrders} />
      <Route path="/purchase-orders/new" component={PurchaseOrderDetail} />
      <Route path="/purchase-orders/:id" component={PurchaseOrderDetail} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/inventory/:id" component={InventoryDetail} />
      <Route path="/refill-jobs" component={RefillJobs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "15rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between gap-4 px-4 h-14 border-b border-border bg-background sticky top-0 z-50">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto bg-background">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
