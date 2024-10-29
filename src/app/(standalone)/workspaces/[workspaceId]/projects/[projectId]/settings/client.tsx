'use client';

import PageLoader from '@/components/page-loader';
import { useGetProject } from '@/features/projects/api/use-get-project';
import EditProjectForm from '@/features/projects/components/edit-project-form';
import { useProjectId } from '@/features/projects/hooks/use-project-id';

export const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();

  const { data: initialValues, isLoading: isInitialValuesLoading } =
    useGetProject({
      projectId,
    });

  if (isInitialValuesLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    throw new Error('Проект не найден!');
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};
