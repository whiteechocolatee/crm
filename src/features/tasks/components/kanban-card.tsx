import React from 'react';
import { Task } from '../types';
import TaskActions from './task-actions';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import DottedSeparator from '@/components/dotted-separator';
import MemberAvatar from '@/features/members/components/member-avatar';
import TaskDate from './task-date';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';

type KanbanCardProps = {
  task: Task;
};

function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="mt-1.5 space-y-3 rounded bg-white p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-x-2">
        <p className="line-clamp-2 text-sm"> {task.name}</p>
        <TaskActions projectId={task.projectId} id={task.$id}>
          <MixerHorizontalIcon className="shrink-1 size-[18px] stroke-1 text-neutral-700 transition hover:opacity-75" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          fallbackClassName="text-[10px]"
          name={task.assignee.name}
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-[10px]" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectsAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
}

export default KanbanCard;
