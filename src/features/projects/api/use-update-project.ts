import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.projects)[':projectId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[':projectId']['$patch']
>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[':projectId']['$patch']({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении проекта');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Проект обновлен!');

      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.$id] });
    },
    onError: () => {
      toast.error('Ошибка при обновлении проекта!');
    },
  });

  return mutation;
};
