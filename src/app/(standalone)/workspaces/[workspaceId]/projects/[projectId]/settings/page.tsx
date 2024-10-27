import { getCurrent } from '@/features/auth/actions';
import { getProject } from '@/features/projects/actions';
import EditProjectForm from '@/features/projects/components/edit-project-form';
import { redirect } from 'next/navigation';
import React from 'react';

type ProjectIdSettingsPageProps = {
  params: {
    projectId: string;
  };
};

async function ProjectIdSettingsPage({
  params: { projectId },
}: ProjectIdSettingsPageProps) {
  const user = await getCurrent();

  if (!user) {
    redirect('/');
  }

  const initialValues = await getProject({ projectId });

  if (!initialValues) {
    throw new Error('Project not found');
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
}

export default ProjectIdSettingsPage;
