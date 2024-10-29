import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[':taskId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[':taskId']['$patch']
>;

export const useUpdateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId']['$patch']({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении задачи');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      router.refresh();
      toast.success('Задача обновлена!');

      queryClient.invalidateQueries({ queryKey: ['project-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
    },
    onError: () => {
      toast.error('Возникла проблема при обновлении задачи!');
    },
  });

  return mutation;
};
