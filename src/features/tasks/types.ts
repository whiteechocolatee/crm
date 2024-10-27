import { Models } from 'node-appwrite';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  BACKLOG = 'BACKLOG',
  DONE = 'DONE',
}

export type Task = Models.Document & {
  name: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  assigneeId: string;
  dueDate: string;
};
