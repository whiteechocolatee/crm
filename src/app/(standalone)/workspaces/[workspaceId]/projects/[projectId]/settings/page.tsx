import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import { ProjectIdSettingsClient } from './client';

async function ProjectIdSettingsPage() {
  const user = await getCurrent();

  if (!user) {
    redirect('/');
  }

  return <ProjectIdSettingsClient />;
}

export default ProjectIdSettingsPage;
