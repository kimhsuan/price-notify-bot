import {Env} from '../worker';
import {sendLINEPushMessage} from '../utils/line';
import {getHOYASellPrice, getMAXPrice, getBitoProPrice} from '../utils/price';
import {Decimal} from 'decimal.js';

// Helper function to check price difference and handle notification logic
async function checkAndNotify({
  env,
  basePrice,
  comparePrice,
  baseLabel,
  compareLabel,
  notifyKey,
  lastNotifyTime,
  currentTime,
  diffPrice,
}: {
  env: Env;
  basePrice: Decimal;
  comparePrice: Decimal;
  baseLabel: string;
  compareLabel: string;
  notifyKey: string;
  lastNotifyTime: string | null;
  currentTime: number;
  diffPrice: Decimal;
}) {
  const priceDiff = basePrice.minus(comparePrice);
  if (priceDiff.greaterThan(diffPrice)) {
    if (!lastNotifyTime || currentTime - parseInt(lastNotifyTime) >= 1800) {
      const message = `${baseLabel}: ${basePrice}\n${compareLabel}: ${comparePrice}\nDiff: ${priceDiff}`;
      console.log(
        `${baseLabel} minus ${compareLabel} ${priceDiff} is greater than ${diffPrice}, sending notification (${baseLabel}-${compareLabel})`
      );
      await sendLINEPushMessage(env, message);
      await env.KV.put(notifyKey, currentTime.toString());
      return message;
    } else {
      console.log(
        `Notification (${baseLabel}-${compareLabel}) skipped due to time limit`
      );
    }
  } else {
    console.log(
      `${baseLabel} minus ${compareLabel} ${priceDiff} is less than ${diffPrice}`
    );
  }
  return '';
}

export const checkPriceDiff = async (env: Env) => {
  if (!env.KV) {
    console.error(
      'KV namespace is not defined on env. Please check your wrangler.toml and environment bindings.'
    );
    return;
  }

  const notify_key_hoya_max = 'last_notify_time_hoya_max';
  const notify_key_hoya_bito = 'last_notify_time_hoya_bito';
  const lastNotifyTimeHoyaMax = await env.KV.get(notify_key_hoya_max);
  const lastNotifyTimeHoyaBito = await env.KV.get(notify_key_hoya_bito);
  const currentTime = Math.floor(Date.now() / 1000);

  const HOYASellPrice = new Decimal(await getHOYASellPrice()).toFixed(3);
  const MAXPrice = new Decimal(await getMAXPrice(env)).toFixed(3);
  const BitoProPrice = new Decimal(await getBitoProPrice()).toFixed(3);
  const diffPrice = new Decimal(0.03);

  let messageBody = '';

  // 檢查 HOYA Sell Price 與 MAX Price 差異
  messageBody += await checkAndNotify({
    env,
    basePrice: new Decimal(HOYASellPrice),
    comparePrice: new Decimal(MAXPrice),
    baseLabel: 'HOYA Sell Price',
    compareLabel: 'MAX Price',
    notifyKey: notify_key_hoya_max,
    lastNotifyTime: lastNotifyTimeHoyaMax,
    currentTime,
    diffPrice,
  });

  // 檢查 HOYA Sell Price 與 BitoPro Price 差異
  messageBody += await checkAndNotify({
    env,
    basePrice: new Decimal(HOYASellPrice),
    comparePrice: new Decimal(BitoProPrice),
    baseLabel: 'HOYA Sell Price',
    compareLabel: 'BitoPro Price',
    notifyKey: notify_key_hoya_bito,
    lastNotifyTime: lastNotifyTimeHoyaBito,
    currentTime,
    diffPrice,
  });

  if (messageBody) {
    console.log('Notification sent with message:\n' + messageBody);
  }
  console.log('cron triggered!');
};
