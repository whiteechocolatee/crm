import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['join']['$post'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[':workspaceId']['join']['$post']
>;

export const useJoinWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[':workspaceId']['join'][
        '$post'
      ]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error('Что то пошло не так');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Вы присоединились к рабочей области!');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
      });
    },
    onError: data => {
      toast.error(data.message);
    },
  });

  return mutation;
};
