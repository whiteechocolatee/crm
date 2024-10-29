'use client';

import { useGetProjects } from '@/features/projects/api/use-get-projects';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';
import { useCreateProjectsModal } from '@/features/projects/hooks/use-create-project-modal';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';

function Projects() {
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const pathname = usePathname();

  const { open } = useCreateProjectsModal();

  const { data } = useGetProjects({
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>
      {data && data?.total > 0 ? (
        data?.documents.map(project => {
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
                <ProjectsAvatar image={project.imageUrl} name={project.name} />
                <span className="truncate">{project.name}</span>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 pl-0 text-sm text-neutral-500 transition hover:opacity-75">
          No projects found
        </div>
      )}
    </div>
  );
}

export default Projects;
