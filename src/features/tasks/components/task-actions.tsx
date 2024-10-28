import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirm } from '@/hooks/use-confirm';
import { ExternalLink, Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDeleteTask } from '../api/use-delete-task';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

type TaskActionsProps = {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

function TaskActions({ id, projectId, children }: TaskActionsProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    'Удалить задачу?',
    'Вы уверены, что хотите удалить задачу?',
  );

  const { open } = useEditTaskModal();

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate({
      param: {
        taskId: id,
      },
    });
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLink className="mr-2 size-4 stroke-2" />
            Описание задачи
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLink className="mr-2 size-4 stroke-2" />
            Открыть проект
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <Pencil className="mr-2 size-4 stroke-2" />
            Редактировать задачу
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
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
