import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { MemberRole } from '@/features/members/types';
import { ProjectsType } from '@/features/projects/types';
import { getMember } from '@/features/workspaces/utils';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { createTaskSchema } from '../schemas';
import { Task, TaskStatus } from '../types';

const app = new Hono()
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async c => {
      const user = c.get('user');
      const databases = c.get('databases');

      const {
        name,
        workspaceId,
        projectId,
        description,
        status,
        dueDate,
        assigneeId,
      } = c.req.valid('json');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('status', status),
          Query.equal('workspaceId', workspaceId),
          Query.orderAsc('position'),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const newTask = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          projectId,
          description,
          status,
          dueDate,
          assigneeId,
          position: newPosition,
        },
      );

      return c.json({ data: newTask });
    },
  )
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async c => {
      const { users } = await createAdminClient();
      const databases = c.get('databases');
      const user = c.get('user');

      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const query = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ];

      if (projectId) {
        console.log({ projectId });
        query.push(Query.equal('projectId', projectId));
      }

      if (status) {
        console.log({ status });
        query.push(Query.equal('status', status));
      }

      if (assigneeId) {
        console.log({ assigneeId });
        query.push(Query.equal('assigneeId', assigneeId));
      }

      if (dueDate) {
        console.log({ dueDate });
        query.push(Query.equal('dueDate', dueDate));
      }

      if (search) {
        console.log({ search });
        query.push(Query.search('name', search));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query,
      );

      const projectIds = tasks.documents.map(task => task.projectId);
      const assigneeIds = tasks.documents.map(task => task.assigneeId);

      const projects = await databases.listDocuments<ProjectsType>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
      );

      const assignees = await Promise.all(
        members.documents.map(async member => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        }),
      );

      const populatedTasks = tasks.documents.map(task => {
        const project = projects.documents.find(
          project => project.$id === task.projectId,
        );

        const assignee = assignees.find(
          assignee => assignee.$id === task.assigneeId,
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    },
  )
  .delete('/:taskId', sessionMiddleware, async c => {
    const user = c.get('user');
    const databases = c.get('databases');
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({
      data: {
        $id: task.$id,
      },
    });
  })
  .patch(
    '/:taskId',
    sessionMiddleware,
    zValidator('json', createTaskSchema.partial()),
    async c => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { taskId } = c.req.param();

      const { name, projectId, description, status, dueDate, assigneeId } =
        c.req.valid('json');

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const newTask = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          projectId,
          description,
          status,
          dueDate,
          assigneeId,
        },
      );

      return c.json({ data: newTask });
    },
  )
  .get('/:taskId', sessionMiddleware, async c => {
    const currentUser = c.get('user');
    const databases = c.get('databases');
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const project = await databases.getDocument<ProjectsType>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId,
    );

    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId,
    );

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post(
    '/bulk-update',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          }),
        ),
      }),
    ),
    async c => {
      const user = c.get('user');
      const databases = c.get('databases');

      const { tasks } = c.req.valid('json');

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            '$id',
            tasks.map(task => task.$id),
          ),
        ],
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map(task => task.workspaceId),
      );

      if (workspaceIds.size !== 1) {
        return c.json({ error: 'Invalid request' }, 400);
      }

      const workspaceId = workspaceIds.values().next().value;

      if (!workspaceId) {
        return c.json({ error: 'Invalid request' }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async task => {
          return await databases.updateDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            task.$id,
            {
              status: task.status,
              position: task.position,
            },
          );
        }),
      );

      return c.json({ data: updatedTasks });
    },
  );

export default app;
