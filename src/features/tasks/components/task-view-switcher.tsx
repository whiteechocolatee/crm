'use client';

import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, Plus } from 'lucide-react';
import React from 'react';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { useGetTasks } from '../api/use-get-tasks';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useQueryState } from 'nuqs';
import DataFilters from './data-filters';
import { useTaskFilters } from '../api/use-task-filters';

function TaskViewSwitcher() {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });

  const [{ projectId, assigneeId, status, dueDate, search }, setFilters] =
    useTaskFilters();

  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    status,
    dueDate,
    search,
  });

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 rounded-lg border"
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList defaultValue="table" className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <Plus className="mr-2 size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isTasksLoading ? (
          <div className="flex h-[800px] items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent className="mt-0" value="table">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent className="mt-0" value="kanban">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent className="mt-0" value="calendar">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
