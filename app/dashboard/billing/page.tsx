'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreditCard, Download } from 'lucide-react';

const planFeatures = [
  'Unlimited team members',
  'Advanced analytics',
  'API access',
  'Priority support',
  'Custom integrations',
];

const mockInvoices = [
  { id: 'INV-001', date: 'Feb 1, 2025', amount: '$49.00', status: 'Paid' },
  { id: 'INV-002', date: 'Jan 1, 2025', amount: '$49.00', status: 'Paid' },
  { id: 'INV-003', date: 'Dec 1, 2024', amount: '$49.00', status: 'Paid' },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">Pro Plan</p>
                <p className="text-muted-foreground">$49/mo</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <ul className="space-y-2 text-sm">
              {planFeatures.map(feature => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-2">
              <Button>Upgrade</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment method */}
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
            <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground">
              Payment method placeholder
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="size-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
