import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import React from 'react';
import TaskIdClient from './client';

type Props = {};

async function TaskIdPage({}: Props) {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  return <TaskIdClient />;
}

export default TaskIdPage;
