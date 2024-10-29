import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import React from 'react';
import WorkspaceIdClient from './client';

async function WorkspaceIdPage() {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  return <WorkspaceIdClient />;
}

export default WorkspaceIdPage;
