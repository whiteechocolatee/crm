import { DATABASE_ID, PROJECTS_ID, WORKSPACE_ID } from '@/config';
import { createSessionClient } from '@/lib/appwrite';
import { WorkspaceType } from '../workspaces/types';
import { getMember } from '../workspaces/utils';
import { ProjectsType } from './types';

type GetProjectProps = {
  projectId: string;
};

export const getProject = async ({ projectId }: GetProjectProps) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const project = await databases.getDocument<ProjectsType>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return null;
    }

    return project;
  } catch (error) {
    return null;
  }
};
