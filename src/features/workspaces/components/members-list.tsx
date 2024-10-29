'use client';

import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetMembers } from '@/features/members/api/use-get-members';
import MemberAvatar from '@/features/members/components/member-avatar';
import { MoreVertical, X } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { cn } from '@/lib/utils';
import { MemberRole } from '@/features/members/types';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';

function MemberList() {
  const [ConfirmDialog, handleConfirm] = useConfirm(
    'Удалить участника',
    'Вы уверены, что хотите удалить этого пользователя? После удаления участник больше не сможет получить доступ к рабочему пространству, а все его данные будут удалены.',
  );

  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      param: { memberId },
      json: { role },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await handleConfirm();

    if (!ok) return;

    deleteMember(
      {
        param: { memberId },
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  };

  const isPending = isDeletingMember || isUpdatingMember;

  return (
    <Card className="h-full w-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center justify-between gap-x-4 space-y-0 p-7">
        <CardTitle className="text-2xl font-bold">Список участников</CardTitle>
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <X className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {member.name}{' '}
                  <span
                    className={cn(
                      'text-xs lowercase text-muted-foreground',
                      member.role === MemberRole.ADMIN && 'text-amber-800',
                      member.role === MemberRole.MEMBER && 'text-emerald-600',
                    )}
                  >
                    ({member.role})
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                  <Button variant="secondary" size="icon">
                    <MoreVertical className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="cursor-pointer font-medium"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isPending}
                  >
                    Назначить админом
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer font-medium"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={isPending}
                  >
                    Назначить участником
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isPending}
                  >
                    Удалить {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2.5 bg-neutral-200" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

export default MemberList;
