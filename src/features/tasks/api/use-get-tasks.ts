import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { TaskStatus } from '../types';

type UseGetTasksProps = {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
};

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  search,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      'tasks',
      workspaceId,
      projectId,
      status,
      assigneeId,
      dueDate,
      search,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error('Что то пошло не так');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
