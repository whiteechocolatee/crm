import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

type WorkspaceAvatarProps = {
  image?: string;
  name: string;
  className?: string;
};

function WorkspaceAvatar({ image, name, className }: WorkspaceAvatarProps) {
  if (image) {
    return (
      <div
        className={cn('relative size-10 overflow-hidden rounded-md', className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-10 rounded-md', className)}>
      <AvatarFallback className="bg-blue-600 text-lg font-semibold uppercase text-white rounded-md">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default WorkspaceAvatar;
