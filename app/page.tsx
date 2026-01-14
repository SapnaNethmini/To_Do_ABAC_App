'use client';

import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (isPending) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (session) {
    return null; 
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Todo App with ABAC</h1>
        <p className="text-lg text-gray-600">
          Attribute-Based Access Control Demo
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>User Role</CardTitle>
            <CardDescription>Standard user permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ View own todos</li>
              <li>✅ Create todos</li>
              <li>✅ Update own todos</li>
              <li>⚠️ Delete own draft todos</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Role</CardTitle>
            <CardDescription>Read-only oversight</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ View all todos</li>
              <li>❌ Cannot create</li>
              <li>❌ Cannot update</li>
              <li>❌ Cannot delete</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Role</CardTitle>
            <CardDescription>Full management access</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ View all todos</li>
              <li>❌ Cannot create</li>
              <li>❌ Cannot update</li>
              <li>✅ Delete any todo</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Link href="/signup">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
