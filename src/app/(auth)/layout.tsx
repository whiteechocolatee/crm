'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  const href = pathname === '/sign-in' ? '/sign-up' : '/sign-in';
  const label = pathname === '/sign-in' ? 'Sign Up' : 'Sign In';

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl">
        <nav className="flex items-center justify-between p-4">
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href={href}>{label}</Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center p-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
