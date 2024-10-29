'use client';

import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useJoinWorkspace } from '../api/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { useRouter } from 'next/navigation';

type JoinWorkspaceFormProps = {
  initialValues: {
    name: string;
  };
};

function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      { param: { workspaceId }, json: { code: inviteCode } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">
          Присоединиться к рабочей области
        </CardTitle>
        <CardDescription>
          Вас пригласили в рабочую область <strong>{initialValues.name}</strong>
          .
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
          <Button
            variant="secondary"
            type="button"
            size="lg"
            asChild
            disabled={isPending}
            className="w-full lg:w-fit"
          >
            <Link href="/">Отменить</Link>
          </Button>
          <Button
            disabled={isPending}
            onClick={onSubmit}
            size="lg"
            type="button"
            className="w-full lg:w-fit"
          >
            Присоединиться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default JoinWorkspaceForm;
