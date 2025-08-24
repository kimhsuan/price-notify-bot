import {Env} from '../worker';
import {LinePushBody} from '../interfaces/line';

export const sendLINEPushMessage = async (
  env: Env,
  message: string
): Promise<void> => {
  const url = 'https://api.line.me/v2/bot/message/push';
  const body: LinePushBody = {
    to: env.LINE_SEND_TO,
    messages: [{type: 'text', text: message}],
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LINE push failed: ${response.status} - ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('LINE push message sent:', data);
  } catch (error) {
    console.error('Error sending LINE push message:', error);
  }
};
