'use client';

import DottedSeparator from '@/components/dotted-separator';
import PageLoader from '@/components/page-loader';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import TaskBreadcrumbs from '@/features/tasks/components/task-breadcrumbs';
import TaskDescription from '@/features/tasks/components/task-description';
import TaskOverview from '@/features/tasks/components/task-overview';
import { useTaskId } from '@/features/tasks/hooks/use-task-id';
import React from 'react';

function TaskIdClient() {
  const taskId = useTaskId();

  const { data, isLoading } = useGetTask({
    taskId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    throw new Error('Что то пошло не так');
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
}

export default TaskIdClient;
