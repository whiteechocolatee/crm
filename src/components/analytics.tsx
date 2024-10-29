import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics';
import React from 'react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import AnalyticsCard from './analytics-card';
import DottedSeparator from './dotted-separator';

function Analytics({ data }: ProjectAnalyticsResponseType) {
  if (!data) return null;

  return (
    <ScrollArea className="w-full shrink-0 whitespace-nowrap rounded-lg border">
      <div className="flex w-full flex-row">
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Все задачи"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? 'up' : 'down'}
            increasingValue={data.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Назначенные задания"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? 'up' : 'down'}
            increasingValue={data.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Выполненные задания"
            value={data.completeTaskCount}
            variant={data.completeTaskDifference > 0 ? 'up' : 'down'}
            increasingValue={data.completeTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Просроченные задачи"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? 'up' : 'down'}
            increasingValue={data.overdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Незавершенные задачи"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifference > 0 ? 'up' : 'down'}
            increasingValue={data.incompleteTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default Analytics;
