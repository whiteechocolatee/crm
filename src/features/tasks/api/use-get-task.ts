import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

type UseGetTaskProps = {
  taskId: string;
};

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  const query = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await client.api.tasks[':taskId'].$get({
        param: { taskId },
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
