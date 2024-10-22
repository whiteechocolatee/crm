import { cookies } from 'next/headers';
import { Account, Client, Databases, Query } from 'node-appwrite';
import { AUTH_COOKIE } from '../auth/constants';
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from '@/config';
import { getMember } from './utils';
import { WorkspaceType } from './types';

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(AUTH_COOKIE);

    if (!session) {
      return { documents: [], total: 0 };
    }

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
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
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(AUTH_COOKIE);

    if (!session) {
      return null;
    }

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const member = await getMember({
      databases: new Databases(client),
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
