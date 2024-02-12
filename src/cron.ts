import {Env} from './worker';
import {GetHoyaBuyPrice, GetMaxPrice} from './price';
import {Decimal} from 'decimal.js';

const LineNotify = async (env: Env, message: string) => {
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
  console.log('Send Line Notify:', response);
};

export const CronJob = async (env: Env) => {
  const hoyaBuyPrice = Number.parseFloat(await GetHoyaBuyPrice()).toFixed(3);
  const maxSellPrice = Number.parseFloat(await GetMaxPrice()).toFixed(3);
  const diff = new Decimal(maxSellPrice).minus(hoyaBuyPrice);
  console.log(diff);
  if (diff > 0.03) {
    await LineNotify(
      env,
      `MAX Sell Price ${maxSellPrice} is higher than HOYA Buy Price ${hoyaBuyPrice} more than 0.03\nPrice diff: ${diff}`
    );
  } else {
    // await LineNotify(
    //   env,
    //   `MAX Sell Price ${maxSellPrice} is not higher than HOYA Buy Price ${hoyaBuyPrice} less than 0.03\nPrice diff: ${diff}`
    // );
  }
  console.log('cron triggered!');
};
