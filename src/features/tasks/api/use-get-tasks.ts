import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetTasks = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
