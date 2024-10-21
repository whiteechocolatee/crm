import { Loader } from 'lucide-react';
import React from 'react';

type Props = {};

function DashboardLoading({}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default DashboardLoading;
