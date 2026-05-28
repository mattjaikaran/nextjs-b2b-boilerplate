'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Copy, Key, Plus } from 'lucide-react';

const apiKeys = [
  { name: 'Production', key: 'sk_live_••••••••••••••••••••', created: 'Jan 15, 2025' },
  { name: 'Development', key: 'sk_test_••••••••••••••••••••', created: 'Feb 1, 2025' },
];

export function ApiKeysTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="size-5" />
          API Keys
        </CardTitle>
        <CardDescription>
          Manage API keys for programmatic access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {apiKeys.map(apiKey => (
            <div
              key={apiKey.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{apiKey.name}</p>
                <p className="font-mono text-sm text-muted-foreground">{apiKey.key}</p>
                <p className="text-xs text-muted-foreground">Created {apiKey.created}</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <Copy className="size-4" />
                Copy
              </Button>
            </div>
          ))}
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create API Key
        </Button>
      </CardContent>
    </Card>
  );
}
