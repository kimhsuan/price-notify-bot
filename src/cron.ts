import {Env} from './worker';
import {GetHoyaBuyPrice, GetHoyaSellPrice, GetMaxPrice, GetBitoProPrice} from './price';
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
  const hoyaSellPrice = Number.parseFloat(await GetHoyaSellPrice()).toFixed(3);
  const maxPrice = Number.parseFloat(await GetMaxPrice(env)).toFixed(3);
  const bitoproPrice = Number.parseFloat(await GetBitoProPrice()).toFixed(3);
  const hoyasellmaxdiff = new Decimal(hoyaSellPrice).minus(maxPrice);
  const hoyasellbitodiff = new Decimal(hoyaSellPrice).minus(bitoproPrice);
  let diffprice = new Decimal(0.03);

  if (hoyasellmaxdiff.greaterThan(diffprice)) {
    console.log(`maxhoyadiff ${hoyasellmaxdiff} is greater than ${diffprice}`);
    await LineNotify(
      env,
      `HOYA Sell Price ${hoyaSellPrice} is higher than MAX Price ${maxPrice} more than ${diffprice}\nPrice diff: ${hoyasellbitodiff}`
    );
  } else {
    console.log(`hoyasellmaxdiff: ${hoyasellmaxdiff} is less than ${diffprice}`);
  }

  if (hoyasellbitodiff.greaterThan(diffprice)) {
    console.log(`bitohoyadiff ${hoyasellbitodiff} is greater than ${diffprice}`);
    await LineNotify(
      env,
      `HOYA Sell Price ${hoyaSellPrice} is higher than BitoPro Price ${bitoproPrice} more than ${diffprice}\nPrice diff: ${hoyasellbitodiff}`
    );
  } else {
    console.log(`hoyasellbitodiff: ${hoyasellbitodiff} is less than ${diffprice}`);
  }

  console.log('cron triggered!');
};
