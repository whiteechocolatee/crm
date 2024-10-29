'use client';

import DottedSeparator from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ImageIcon, CopyIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateWorkspace } from '../api/use-update-workspace';
import { updateWorkspaceSchema } from '../schemas';
import { WorkspaceType } from '../types';
import { useDeleteWorkspace } from '../api/use-delete-workspace';
import { toast } from 'sonner';
import { useResetInviteCode } from '../api/use-reset-invite-code';

type EditWorkspaceFormProps = {
  onCancel?: () => void;
  initialValues: WorkspaceType;
};

function EditWorkspaceForm({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInvite } =
    useResetInviteCode();
  const { mutate, isPending } = useUpdateWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Удалить рабочую область',
    'Вы уверены, что хотите удалить это рабочую область? Это действие нельзя отменить.',
  );
  const [ResetDialog, confirmReset] = useConfirm(
    'Сброс кода приглашения',
    'Это приведет к аннулированию текущей ссылки на приглашение и созданию новой.',
  );

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    );
  };

  const handleReset = async () => {
    const ok = await confirmReset();

    if (!ok) return;

    resetInviteCode(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      form.setValue('image', file);
    }
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success('Invite link copied to clipboard!');
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <DeleteDialog />
      <ResetDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4 space-y-0 p-7">
          <CardTitle className="text-2xl font-bold">
            {initialValues.name}
          </CardTitle>
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-y-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название рабочей области</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="ITPEDIA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="image"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              alt="workspace image"
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Иконка рабочей области</p>
                          <p className="text-[10px] text-muted-foreground">
                            JPG, PNG, JPEG (max 1mb)
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept=".jpg, .png, .jpeg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="teritary"
                            size="sm"
                            className="mt-2 w-fit"
                            onClick={() => inputRef.current?.click()}
                          >
                            Загрузить
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  className={cn(!onCancel && 'invisible')}
                  onClick={onCancel}
                  disabled={isPending}
                >
                  Отменить
                </Button>
                <Button type="submit" disabled={isPending} size="lg">
                  Сохранить
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Пригласить участников</h3>
            <p className="text-sm text-muted-foreground">
              Чтобы пригласить участников в свою рабочую область, воспользуйтесь
              приведенной ниже ссылкой для приглашения.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input type="text" value={fullInviteLink} disabled />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="ml-auto mt-6 w-fit"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isResettingInvite || isPending}
              onClick={handleReset}
            >
              Обновить ссылку
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Опасная операция</h3>
            <p className="text-sm text-muted-foreground">
              Удаление рабочей области удалит всю информацию о ней (участники,
              задачи, и проекты).
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="ml-auto mt-6 w-fit"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditWorkspaceForm;
