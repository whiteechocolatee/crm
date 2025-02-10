import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from '@/config';
import { Hono } from 'hono';
import { Query, Client, Databases } from 'node-appwrite';

const app = new Hono();

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

app
  .post('/webhook', async c => {
    const { message } = await c.req.json();
    if (!message) return c.json({ success: false });

    const databases = new Databases(client);

    const chatId = message.chat.id;
    const userId = message.text.trim();

    if (!userId) {
      return c.json({
        method: 'sendMessage',
        chat_id: chatId,
        text: 'Неверный userId.',
      });
    }

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', userId),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map(member => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)],
    );

    return c.json({ data: workspaces });
  })
  .post('/set-webhook', async c => {
    console.log('Webhook received!');

    const body = await c.req.json();
    console.log('Telegram Data:', body);

    return c.json({ success: true });
  })
  .get('/', async c => {
    return c.json({
      success: true,
    });
  });

export default app;
