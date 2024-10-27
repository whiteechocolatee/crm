import { Models } from 'node-appwrite';

export type ProjectsType = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};
