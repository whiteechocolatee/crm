'use client';

import Analytics from '@/components/analytics';
import PageLoader from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { useGetProjectAnalytics } from '@/features/projects/api/use-get-project-analytics';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import TaskViewSwitcher from '@/features/tasks/components/task-view-switcher';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

function ProjectIdClient() {
  const projectId = useProjectId();

  const { data: initialValues, isLoading } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  const isLoadingData = isLoading || isLoadingAnalytics;

  if (isLoadingData) {
    return <PageLoader />;
  }

  if (!initialValues) {
    throw new Error('Проект не найден!');
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectsAvatar
            name={initialValues.name}
            className="size-8"
            image={initialValues.imageUrl}
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}}/projects/${projectId}/settings`}
            >
              <Pencil className="mr-2 size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilters />
    </div>
  );
}

export default ProjectIdClient;
