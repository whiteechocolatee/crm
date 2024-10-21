'use client';

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { RiAddCircleFill } from 'react-icons/ri';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { SelectValue } from '@radix-ui/react-select';
import WorkspaceAvatar from '@/features/workspaces/components/wokrspace-avatar';

function WorkspaceSwitcher() {
  const { data: workspaces } = useGetWorkspaces();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75" />
      </div>
      <Select>
        <SelectTrigger className="w-full bg-neutral-200 p-1 font-medium">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map(workspace => (
            <SelectItem key={workspace.$id} value={workspace.name} className='cursor-pointer'>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className='truncate'>{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default WorkspaceSwitcher;
