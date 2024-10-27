import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLink, Pencil, Trash } from 'lucide-react';
import React from 'react';

type TaskActionsProps = {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

function TaskActions({ id, projectId, children }: TaskActionsProps) {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem
            onClick={() => {}}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLink className="mr-2 size-4 stroke-2" />
            Описание задачи
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLink className="mr-2 size-4 stroke-2" />
            Открыть проект
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <Pencil className="mr-2 size-4 stroke-2" />
            Редактировать задачу
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            disabled={false}
            className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
          >
            <Trash className="mr-2 size-4 stroke-2" />
            Удалить задачу
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TaskActions;
