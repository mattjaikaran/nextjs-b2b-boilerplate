'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export function BillingTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Pro Plan &#x2014; $49/month</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Manage Plan</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Your default payment method for billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-20 items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground">
            Payment method placeholder
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
