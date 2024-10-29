import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.members)[':memberId']['$delete'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[':memberId']['$delete']
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[':memberId']['$delete']({
        param,
      });

      if (!response.ok) {
        throw new Error('Не получилось удалить участника');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Участник удален!');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      toast.error('Возникла проблема при удалении!');
    },
  });

  return mutation;
};
