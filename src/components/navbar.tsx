'use client';

import UserButton from '@/features/auth/components/user-button';
import React from 'react';
import MobileSidebar from './mobile-sidebar';
import { usePathname } from 'next/navigation';

const pathnameMap = {
  tasks: {
    title: 'Задачи',
    description: 'Контролируйте все свои проекты и задачи здесь',
  },
  projects: {
    title: 'Проект',
    description: 'Контролируйте все задачи по проекту здесь',
  },
};

const defaultMap = {
  title: 'Главная',
  description: 'Информация по рабочей области и участниках',
};

function Navbar() {
  const pathname = usePathname();
  const pathnamePart = pathname.split('/');
  const pathnameKey = pathnamePart[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
}

export default Navbar;
