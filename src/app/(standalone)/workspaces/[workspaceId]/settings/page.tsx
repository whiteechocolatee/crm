import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import WorkspaceIdSettingsClient from './client';

async function WorkspaceIdSettingsPage() {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  return <WorkspaceIdSettingsClient />;
}

export default WorkspaceIdSettingsPage;
