import { Loader } from 'lucide-react';
import React from 'react';

type Props = {};

function PageLoader({}: Props) {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default PageLoader;
