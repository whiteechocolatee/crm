import { getCurrent } from '@/features/auth/actions';
import { getWorkspaceInfo } from '@/features/workspaces/actions';
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form';
import { redirect } from 'next/navigation';
import React from 'react';

type JoinWorkspacePageProps = {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
};

async function JoinWorkspacePage({ params }: JoinWorkspacePageProps) {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if (!initialValues) {
    redirect('/');
  }

  return (
    <div className="w-full lg:max-w-2xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
}

export default JoinWorkspacePage;
