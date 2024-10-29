import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

type useGetWorkspaceProps = {
  workspaceId: string;
};

export const useGetWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
  const query = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId']['$get']({
        param: { workspaceId },
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
