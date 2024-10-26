import { Button } from '@/components/ui/button';
import { getCurrent } from '@/features/auth/actions';
import { getProject } from '@/features/projects/actions';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type ProjectIdPageProps = {
  params: {
    projectId: string;
  };
};

async function ProjectIdPage({ params: { projectId } }: ProjectIdPageProps) {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  const initialValues = await getProject({ projectId });

  if (!initialValues) {
    throw new Error('Project not found');
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectsAvatar
            name={initialValues.name}
            className="size-8"
            image={initialValues.imageUrl}
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}}/projects/${projectId}/settings`}
            >
              <Pencil className="mr-2 size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProjectIdPage;
