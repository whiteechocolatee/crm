'use client';

import PageLoader from '@/components/page-loader';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import EditWorkspaceForm from '@/features/workspaces/components/edit-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import React from 'react';

function WorkspaceIdSettingsClient() {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isInitialValuesLoading } =
    useGetWorkspace({
      workspaceId,
    });

  if (isInitialValuesLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    throw new Error('Workspace not found');
  }

  console.log({ initialValues });

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
}

export default WorkspaceIdSettingsClient;
