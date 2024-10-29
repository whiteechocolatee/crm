import React from 'react';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import DottedSeparator from '@/components/dotted-separator';
import OverviewProperty from './overview-property';
import MemberAvatar from '@/features/members/components/member-avatar';
import TaskDate from './task-date';
import { Badge } from '@/components/ui/badge';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

type TaskOverviewProps = {
  task: Task;
};

function TaskOverview({ task }: TaskOverviewProps) {
  const { open } = useEditTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Обзор</p>
          <Button onClick={() => open(task.$id)} size="sm" variant="secondary">
            <Pencil className="mr-2 size-4" />
            Редактировать
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Ответственный">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Дедлайн">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Статус">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}

export default TaskOverview;
