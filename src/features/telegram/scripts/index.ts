const BOT_TOKEN = process.env.NEXT_TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL;

async function setupWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: `${WEBHOOK_URL}/telegram/webhook` }),
  });

  const data = await res.json();
  console.log('Webhook response:', data);
}

setupWebhook();
