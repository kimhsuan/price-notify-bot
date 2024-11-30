import {Env} from '../worker';

// {"status":200,"message":"ok"}
export const sendLINENotify = async (env: Env, message: string) => {
  const url = 'https://notify-api.line.me/api/notify';
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${env.LINE_NOTIFY_TOKEN}`,
    },
    body: `message=\n${message}`,
  };

  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Send Line Notify:', data);
  } catch (error) {
    console.error('Error sending Line Notify:', error);
  }
};
