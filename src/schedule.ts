import {Env} from './worker';
import {sendLINEPushMessage} from './utils/line';
import {getHOYASellPrice, getMAXPrice, getBitoProPrice} from './utils/price';
import {Decimal} from 'decimal.js';

// Helper function to check price difference and handle notification logic
type CheckAndNotifyParams = {
  env: Env;
  basePrice: Decimal;
  comparePrice: Decimal;
  baseLabel: string;
  compareLabel: string;
  notifyKey: string;
  lastNotifyTime: string | null;
  currentTime: number;
  diffPrice: Decimal;
};

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
}: CheckAndNotifyParams): Promise<string> {
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

  // 只做一次 toFixed(3) 並直接用 Decimal
  const HOYASellPrice = new Decimal(await getHOYASellPrice()).toDecimalPlaces(
    3
  );
  const MAXPrice = new Decimal(await getMAXPrice(env)).toDecimalPlaces(3);
  const BitoProPrice = new Decimal(await getBitoProPrice()).toDecimalPlaces(3);
  const diffPrice = new Decimal(0.03);

  const messages: string[] = [];

  // 檢查 HOYA Sell Price 與 MAX Price 差異
  const msgHoyaMax = await checkAndNotify({
    env,
    basePrice: HOYASellPrice,
    comparePrice: MAXPrice,
    baseLabel: 'HOYA Sell Price',
    compareLabel: 'MAX Price',
    notifyKey: notify_key_hoya_max,
    lastNotifyTime: lastNotifyTimeHoyaMax,
    currentTime,
    diffPrice,
  });
  if (msgHoyaMax) messages.push(msgHoyaMax);

  // 檢查 HOYA Sell Price 與 BitoPro Price 差異
  const msgHoyaBito = await checkAndNotify({
    env,
    basePrice: HOYASellPrice,
    comparePrice: BitoProPrice,
    baseLabel: 'HOYA Sell Price',
    compareLabel: 'BitoPro Price',
    notifyKey: notify_key_hoya_bito,
    lastNotifyTime: lastNotifyTimeHoyaBito,
    currentTime,
    diffPrice,
  });
  if (msgHoyaBito) messages.push(msgHoyaBito);

  if (messages.length > 0) {
    console.log('Notification sent with message:\n' + messages.join('\n'));
  }
  console.log('cron triggered!');
};
