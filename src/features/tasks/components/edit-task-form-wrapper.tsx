import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Loader } from 'lucide-react';
import { useGetTask } from '../api/use-get-task';
import EditTaskForm from './edit-task-form';

type EditTaskFormWrapperProps = {
  onCancel: () => void;
  id: string;
};

function EditTaskFormWrapper({ onCancel, id }: EditTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isInitialValuesLoading } = useGetTask(
    {
      taskId: id,
    },
  );
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map(project => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map(project => ({
    id: project.$id,
    name: project.name,
  }));

  const isLoading =
    isProjectsLoading || isMembersLoading || isInitialValuesLoading;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditTaskForm
      initialValues={initialValues}
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    />
  );
}

export default EditTaskFormWrapper;
