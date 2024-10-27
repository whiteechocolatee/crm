import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from '@/config';
import { createSessionClient } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { WorkspaceType } from './types';
import { getMember } from './utils';

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map(member => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)],
    );

    return workspaces;
  } catch (error) {
    return { documents: [], total: 0 };
  }
};

type GetWorkspaceProps = {
  workspaceId: string;
};

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return null;
    }

    const workspaces = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
    );

    return workspaces;
  } catch (error) {
    return null;
  }
};

type GetWorkspaceInfoProps = {
  workspaceId: string;
};

export const getWorkspaceInfo = async ({
  workspaceId,
}: GetWorkspaceInfoProps) => {
  try {
    const { databases } = await createSessionClient();

    const workspaces = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
    );

    return {
      name: workspaces.name,
    };
  } catch (error) {
    return null;
  }
};
