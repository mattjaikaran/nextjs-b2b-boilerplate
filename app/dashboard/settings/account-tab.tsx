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
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import type { ProfileForm } from './settings-types';

interface AccountTabProps {
  profileForm: ProfileForm;
  onProfileFormChange: (form: ProfileForm) => void;
  onProfileSubmit: (e: React.FormEvent) => void;
  isProfilePending: boolean;
}

export function AccountTab({
  profileForm,
  onProfileFormChange,
  onProfileSubmit,
  isProfilePending,
}: AccountTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onProfileSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileForm.firstName}
                onChange={e =>
                  onProfileFormChange({ ...profileForm, firstName: e.target.value })
                }
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={e =>
                  onProfileFormChange({ ...profileForm, lastName: e.target.value })
                }
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileForm.email}
              onChange={e =>
                onProfileFormChange({ ...profileForm, email: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>
          <Button
            type="submit"
            disabled={isProfilePending}
            className="gap-2"
          >
            {isProfilePending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
