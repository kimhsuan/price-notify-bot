import {Env} from '../worker';

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
  const response = await fetch(url, init).then(response => response.json());
  console.log('Send Line Notify:' + response);
};
