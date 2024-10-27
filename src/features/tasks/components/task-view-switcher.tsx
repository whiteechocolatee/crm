'use client';

import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import React from 'react';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';

function TaskViewSwitcher() {
  const { open } = useCreateTaskModal();

  return (
    <Tabs className="w-full flex-1 rounded-lg border">
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
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
        Data filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent className="mt-0" value="table">
            Data Table
          </TabsContent>
          <TabsContent className="mt-0" value="kanban">
            Data Kanban
          </TabsContent>
          <TabsContent className="mt-0" value="calendar">
            Data Calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
}

export default TaskViewSwitcher;
