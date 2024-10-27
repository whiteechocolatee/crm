import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

type ProjectsAvatarProps = {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
};

function ProjectsAvatar({
  image,
  name,
  className,
  fallbackClassName,
}: ProjectsAvatarProps) {
  if (image) {
    return (
      <div
        className={cn('relative size-5 overflow-hidden rounded-md', className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-5 rounded-md', className)}>
      <AvatarFallback
        className={cn(
          'rounded-md bg-blue-600 text-sm font-semibold uppercase text-white',
          fallbackClassName,
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default ProjectsAvatar;
