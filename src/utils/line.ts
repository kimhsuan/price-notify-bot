import {Env} from '../worker';

export const sendLINEPushMessage = async (env: Env, message: string) => {
  const url = 'https://api.line.me/v2/bot/message/push';
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: env.LINE_SEND_TO,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Send LINE push message:', data);
  } catch (error) {
    console.error('Error sending LINE push message:', error);
  }
};
