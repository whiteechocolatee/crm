import { ProjectsType } from '@/features/projects/types';
import React from 'react';
import { Task } from '../types';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';
import Link from 'next/link';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { ChevronRight, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '../api/use-delete-task';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';

type TaskBreadcrumbsProps = {
  project: ProjectsType;
  task: Task;
};

function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useDeleteTask();

  const [ConfirmDialog, confirm] = useConfirm(
    'Удалить задачу?',
    'Вы уверены, что хотите удалить задачу? Вся информация о задаче будет удалена.',
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      {
        param: {
          taskId: task.$id,
        },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectsAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm font-semibold text-muted-foreground transition hover:opacity-75 lg:text-lg">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 text-muted-foreground lg:size-5" />
      <p className="truncate text-sm font-semibold lg:text-lg">{task.name}</p>
      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="ml-auto"
        variant="destructive"
        size="sm"
      >
        <Trash className="size-4 lg:mr-2" />
        <span className="hidden lg:inline">Удалить задачу</span>
      </Button>
    </div>
  );
}

export default TaskBreadcrumbs;
