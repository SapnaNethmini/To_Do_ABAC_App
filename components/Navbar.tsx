// src/components/Navbar.tsx
'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Todo ABAC
          </Link>
          {session && (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{session.user.email}</span>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  await signOut();
                  window.location.href = '/';
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}