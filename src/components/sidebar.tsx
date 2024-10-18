import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import DottedSeparator from './dotted-separator';
import Navigation from './navigation';

type Props = {};

function Sidebar({}: Props) {
  return (
    <aside className="h-full w-full bg-neutral-100 p-4">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={164} height={54} />
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
}

export default Sidebar;
