import {Env} from './worker';
import {GetHoyaBuyPrice, GetMaxPrice, GetBitoProPrice} from './price';
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
  const maxPrice = Number.parseFloat(await GetMaxPrice(env)).toFixed(3);
  const bitoproPrice = Number.parseFloat(await GetBitoProPrice()).toFixed(3);
  const maxhoyadiff = new Decimal(maxPrice).minus(hoyaBuyPrice);
  const bitohoyadiff = new Decimal(bitoproPrice).minus(hoyaBuyPrice);
  if (maxhoyadiff.greaterThan(0.03)) {
    console.log(`maxhoyadiff ${maxhoyadiff} is greater than 0.03`);
    await LineNotify(
      env,
      `MAX Price ${maxPrice} is higher than HOYA Buy Price ${hoyaBuyPrice} more than 0.03\nPrice diff: ${maxhoyadiff}`
    );
  } else {
    console.log(`maxhoyadiff: ${maxhoyadiff} is less than 0.03`);
  }
  if (bitohoyadiff.greaterThan(0.03)) {
    console.log(`bitohoyadiff ${bitohoyadiff} is greater than 0.03`);
    await LineNotify(
      env,
      `MAX Price ${maxPrice} is higher than HOYA Buy Price ${hoyaBuyPrice} more than 0.03\nPrice diff: ${bitohoyadiff}`
    );
  } else {
    console.log(`bitohoyadiff: ${bitohoyadiff} is less than 0.03`);
  }
  console.log('cron triggered!');
};
