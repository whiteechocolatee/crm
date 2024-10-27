import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Folder, ListChecks, Loader, UserIcon } from 'lucide-react';
import React from 'react';
import { TaskStatus } from '../types';
import { useTaskFilters } from '../api/use-task-filters';
import DatePicker from '@/components/date-picker';

type DataFiltersProps = {
  hideProjectFilters?: boolean;
};

function DataFilters({}: DataFiltersProps) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  const isLoading = isProjectsLoading || isMembersLoading;

  const projectOptions = projects?.documents.map(project => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map(project => ({
    id: project.$id,
    name: project.name,
  }));

  const [{ projectId, assigneeId, status, dueDate, search }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === 'all' ? null : (value as TaskStatus) });
  };
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === 'all' ? null : (value as string) });
  };
  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === 'all' ? null : (value as string) });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={value => onStatusChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListChecks className="mr-2 size-4 text-muted-foreground" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={value => onAssigneeChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <UserIcon className="mr-2 size-4 text-muted-foreground" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map(member => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={value => onProjectChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <Folder className="mr-2 size-4 text-muted-foreground" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {projectOptions?.map(project => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={date =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
      />
    </div>
  );
}

export default DataFilters;
