'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, UserPlus } from 'lucide-react';
import { useState } from 'react';

type Role = 'owner' | 'admin' | 'member' | 'viewer';
type Status = 'active' | 'invited' | 'disabled';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastActive: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'owner',
    status: 'active',
    lastActive: '2 min ago',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: '3',
    name: 'Mike Williams',
    email: 'mike@example.com',
    role: 'member',
    status: 'active',
    lastActive: '3 hours ago',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'member',
    status: 'invited',
    lastActive: '—',
  },
  {
    id: '5',
    name: 'James Brown',
    email: 'james@example.com',
    role: 'viewer',
    status: 'disabled',
    lastActive: '2 days ago',
  },
];

const roleBadgeClass: Record<Role, string> = {
  owner: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  admin: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  member: 'bg-green-500/10 text-green-600 dark:text-green-400',
  viewer: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
};

const statusBadgeClass: Record<Status, string> = {
  active: 'bg-green-500/10 text-green-600 dark:text-green-400',
  invited: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  disabled: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export default function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team and invite new members.
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite team member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization. They will receive
                an email with a link to accept.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Invite form placeholder
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setInviteOpen(false)}>Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTeamMembers.map(member => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={roleBadgeClass[member.role]}
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusBadgeClass[member.status]}
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.lastActive}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
