import { getCurrent } from '@/features/auth/actions';
import MemberList from '@/features/workspaces/components/members-list';
import { redirect } from 'next/navigation';
import React from 'react';

async function WorkspaceIdPage() {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="w-full lg:max-w-xl">
      <MemberList />
    </div>
  );
}

export default WorkspaceIdPage;
