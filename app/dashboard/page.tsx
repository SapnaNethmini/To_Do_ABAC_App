
'use client';

import { useSession } from '@/lib/auth-client';
import { TodoList } from '@/components/TodoList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!session) {
    return null; 
  }

  const roleInfoMap: Record<'user' | 'manager' | 'admin', { title: string; description: string; permissions: string[] }> = {
    user: {
      title: 'User Dashboard',
      description: 'Create and manage your todos',
      permissions: [
        'View your own todos',
        'Create new todos',
        'Update your todos',
        'Delete draft todos',
      ],
    },
    manager: {
      title: 'Manager Dashboard',
      description: 'View todos from all users',
      permissions: [
        'View all todos from all users',
        'Read-only access',
      ],
    },
    admin: {
      title: 'Admin Dashboard',
      description: 'Manage all todos',
      permissions: [
        'View all todos from all users',
        'Delete any todo regardless of status',
      ],
    },
  };

  const userRole = (session.user as any).role || 'user';
  const roleInfo = roleInfoMap[userRole as 'user' | 'manager' | 'admin'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                {roleInfo.title}
                <Badge variant={
                  userRole === 'admin' ? 'destructive' :
                  userRole === 'manager' ? 'default' :
                  'secondary'
                }>
                  {userRole}
                </Badge>
              </CardTitle>
              <CardDescription>{roleInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Permissions:</h3>
            <ul className="space-y-1">
              {roleInfo.permissions.map((perm, i) => (
                <li key={i} className="text-sm text-gray-700">
                  ✓ {perm}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <TodoList />
    </div>
  );
}