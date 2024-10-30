'use client';

import { useGetProjects } from '@/features/projects/api/use-get-projects';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';
import { useCreateProjectsModal } from '@/features/projects/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

function Projects() {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const { open } = useCreateProjectsModal();
  const { data } = useGetProjects({ workspaceId });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = data?.documents.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Проекты</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Волосатый"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>

      {filteredProjects && filteredProjects.length > 0 ? (
        <ScrollArea className="h-[450px] w-full">
          {filteredProjects.map(project => {
            const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
            const isActive = pathname === href;

            return (
              <Link href={href} key={project.$id}>
                <div
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-neutral-500 transition hover:opacity-75',
                    isActive &&
                      'bg-white text-primary shadow-sm hover:opacity-100',
                  )}
                >
                  <ProjectsAvatar
                    image={project.imageUrl}
                    name={project.name}
                  />
                  <span className="truncate">{project.name}</span>
                </div>
              </Link>
            );
          })}
        </ScrollArea>
      ) : (
        <div className="flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 pl-0 text-sm text-neutral-500 transition hover:opacity-75">
          Нет проектов
        </div>
      )}
    </div>
  );
}

export default Projects;
