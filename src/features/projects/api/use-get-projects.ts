import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetProjects = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
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
