import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import ProjectIdClient from './client';

async function ProjectIdPage() {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  return <ProjectIdClient />;
}

export default ProjectIdPage;
