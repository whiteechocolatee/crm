'use client';

import DottedSeparator from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Loader, LogOut } from 'lucide-react';
import { useCurrent } from '../api/use-current';
import { useLogout } from '../api/use-logout';
import Hint from '@/components/hint';

function UserButton() {
  const { data: user, isLoading } = useCurrent();
  const { mutate } = useLogout();

  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : (email.charAt(0).toUpperCase() ?? '?');

  const handleCopy = () => {
    navigator.clipboard.writeText(user.$id);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 border border-neutral-300 transition hover:opacity-75">
          <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300 transition">
            <AvatarFallback className="flex items-center justify-center bg-neutral-200 text-xl font-medium text-neutral-500">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || 'User'}
            </p>
            <p className="text-sm text-neutral-500">{email}</p>
            <Hint label="Копировать ID">
              <p
                onClick={handleCopy}
                className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-2xl bg-neutral-100/80 p-4 text-sm text-neutral-500"
              >
                <span className="line-clamp-1 truncate text-xs">
                  {user.$id}
                </span>
                <Copy className="ml-2 size-4" />
              </p>
            </Hint>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={() => mutate()}
          className="flex h-10 cursor-pointer items-center justify-center font-medium text-amber-700"
        >
          <LogOut className="mr-2 size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
