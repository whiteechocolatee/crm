import { Models } from 'node-appwrite';

export type WorkspaceType = Models.Document & {
  name: string;
  imageUrl: string;
  inviteCode: string;
  userId: string;
};
