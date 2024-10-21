import UserButton from '@/features/auth/components/user-button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

function StandaloneLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex h-[73px] items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={152} height={87} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}

export default StandaloneLayout;
