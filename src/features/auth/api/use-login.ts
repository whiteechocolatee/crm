import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.login)['$post']>;
type RequestType = InferRequestType<
  (typeof client.api.auth.login)['$post']
>['json'];

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.auth.login.$post({ json });

      if (!response.ok) {
        throw new Error('Что то пошло не так');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Вы вошли!');
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },
    onError: () => {
      toast.error('Не удалось войти!');
    },
  });

  return mutation;
};
