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
import { Building2, Plus } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  memberCount: number;
  plan: string;
  createdAt: string;
}

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corp',
    memberCount: 12,
    plan: 'Pro',
    createdAt: 'Jan 15, 2025',
  },
  {
    id: '2',
    name: 'Startup Inc',
    memberCount: 5,
    plan: 'Free',
    createdAt: 'Feb 1, 2025',
  },
];

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your organizations and switch between them.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Organization
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockOrganizations.map(org => (
          <Card key={org.id} className="transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">{org.plan}</Badge>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{org.name}</CardTitle>
              <CardDescription className="mt-2">
                {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
              </CardDescription>
              <p className="mt-2 text-xs text-muted-foreground">
                Created {org.createdAt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
