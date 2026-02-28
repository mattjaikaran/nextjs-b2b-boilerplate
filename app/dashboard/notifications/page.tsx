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
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Payment received',
    message: 'Your payment of $49.00 has been processed successfully.',
    timestamp: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'New team member',
    message: 'Sarah Johnson has joined your organization.',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Storage limit approaching',
    message: 'You have used 85% of your storage quota.',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: 'API rate limit exceeded',
    message: 'Your API requests have exceeded the rate limit. Please try again later.',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Scheduled maintenance',
    message: 'Scheduled maintenance will occur on March 1st from 2-4 AM UTC.',
    timestamp: '1 day ago',
    read: true,
  },
];

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; label: string }
> = {
  info: { icon: Info, label: 'Info' },
  success: { icon: CheckCircle2, label: 'Success' },
  warning: { icon: AlertCircle, label: 'Warning' },
  error: { icon: XCircle, label: 'Error' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const filteredNotifications =
    typeFilter === 'all'
      ? notifications
      : notifications.filter(n => n.type === typeFilter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and view your notifications.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Filter by type or mark all as read
          </CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              All
            </Button>
            {(Object.keys(typeConfig) as NotificationType[]).map(type => (
              <Button
                key={type}
                variant={typeFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter(type)}
              >
                {typeConfig[type].label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map(notification => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex gap-4 rounded-lg border p-4 ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
