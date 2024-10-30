'use client';

import Analytics from '@/components/analytics';
import DottedSeparator from '@/components/dotted-separator';
import PageLoader from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import MemberAvatar from '@/features/members/components/member-avatar';
import { Member } from '@/features/members/types';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';
import { useCreateProjectsModal } from '@/features/projects/hooks/use-create-project-modal';
import { ProjectsType } from '@/features/projects/types';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { Task, TaskStatus } from '@/features/tasks/types';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, Plus, Settings } from 'lucide-react';
import Link from 'next/link';

function WorkspaceIdClient() {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({
      workspaceId,
    });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    throw new Error('Что то пошло не так....');
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList
          workspaceId={workspaceId}
          tasks={tasks.documents}
          total={tasks.total}
        />
        <MembersList
          workspaceId={workspaceId}
          members={members.documents}
          total={members.total}
        />
      </div>
      <ProjectList
        workspaceId={workspaceId}
        projects={projects.documents}
        total={projects.total}
      />
    </div>
  );
}

export default WorkspaceIdClient;

const TaskList = ({
  tasks,
  total,
  workspaceId,
}: {
  tasks: Task[];
  total: number;
  workspaceId: string;
}) => {
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-semibold">
              Общее кол-во задач ({total})
            </p>
            <p className="text-xs text-muted-foreground">
              Здесь отображаются первые 8 задач в статусе "In Progress"
            </p>
          </div>
          <Button variant="muted" size="icon" onClick={createTask}>
            <Plus className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {tasks
            .filter(task => task.status === TaskStatus.IN_PROGRESS)
            .slice(0, 8)
            .map(task => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <li key={task.$id}>
                      <Link
                        href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
                      >
                        <Card className="rounded-lg shadow-none transition hover:opacity-75">
                          <CardContent className="p-4">
                            <p className="truncate text-lg font-medium">
                              {task.name}
                            </p>
                            <div className="flex items-center gap-x-2">
                              <p className="line-clamp-1 text-sm text-muted-foreground">
                                {task.project?.name}
                              </p>
                              <div className="size-1 rounded-full bg-neutral-300" />
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 size-3" />
                                <span className="truncate">
                                  {formatDistanceToNow(task.dueDate, {
                                    locale: ru,
                                  })}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent>
                    Задача выполняется: {task.assignee?.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            Задач не найдено
          </li>
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Показать все</Link>
        </Button>
      </div>
    </div>
  );
};

const ProjectList = ({
  projects,
  total,
  workspaceId,
}: {
  projects: ProjectsType[];
  total: number;
  workspaceId: string;
}) => {
  const { open: createProject } = useCreateProjectsModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-semibold">
              Общее кол-во проектов ({total})
            </p>
          </div>
          <Button variant="secondary" size="icon" onClick={createProject}>
            <Plus className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectsAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      name={project?.name}
                      image={project?.imageUrl}
                    />
                    <p className="truncate text-lg font-medium">
                      {project?.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            Проектов не найдено
          </li>
        </ul>
      </div>
    </div>
  );
};

const MembersList = ({
  members,
  total,
  workspaceId,
}: {
  members: Member[];
  total: number;
  workspaceId: string;
}) => {
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Общее кол-во участников ({total})
          </p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Settings className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map(member => (
            <li key={member.$id}>
              <Card className="overflow-hidden rounded-lg shadow-none">
                <CardContent className="flex flex-col items-center p-3">
                  <MemberAvatar className="size-12" name={member?.name} />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="line-clamp-1 truncate text-lg font-medium">
                      {member?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member?.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            Участников не найдено
          </li>
        </ul>
      </div>
    </div>
  );
};
