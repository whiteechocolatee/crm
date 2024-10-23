import React from 'react';

type Props = {
  params: {
    workspaceId: string;
    joinId: string;
  };
};

function JoinWorkspacePage({ params }: Props) {
  return <div>{params.joinId}</div>;
}

export default JoinWorkspacePage;
