const BOT_TOKEN = process.env.NEXT_TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.NEXT_WEBHOOK_URL;

async function setupWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `https://crm.andreyblack.com/telegram/webhook`,
    }),
  });

  const data = await res.json();
  console.log('Webhook response:', data);
}

setupWebhook();
