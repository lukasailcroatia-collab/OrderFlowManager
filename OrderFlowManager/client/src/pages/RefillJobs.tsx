import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function RefillJobs() {
  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Refill Jobs"
        description="Schedule and manage vending machine refills"
      />

      <Card>
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <Truck className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                The Refill Jobs module is under development. You'll be able to schedule
                machine refills, assign routes, and track completion status.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
