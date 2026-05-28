'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, UserPlus } from 'lucide-react';

const teamMembers = [
  { name: 'Alex Johnson', email: 'alex@example.com', role: 'Owner' },
  { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Admin' },
];

export function TeamTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5" />
            Invite Members
          </CardTitle>
          <CardDescription>
            Invite team members to your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2">
            <Input placeholder="Email address" type="email" className="flex-1" />
            <Button type="submit" className="gap-2">
              <Plus className="size-4" />
              Invite
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>People in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div
                key={member.email}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <span className="text-sm text-muted-foreground">{member.role}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
