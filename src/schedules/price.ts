import {Env} from '../worker';
import {sendLINEPushMessage} from '../utils/line';
import {getHOYASellPrice, getMAXPrice, getBitoProPrice} from '../utils/price';
import {Decimal} from 'decimal.js';

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
  let sendNotificationHoyaMax = false;
  let sendNotificationHoyaBito = false;

  // 檢查 HOYA Sell Price 與 MAX Price 差異
  {
    const price1 = new Decimal(HOYASellPrice);
    const price2 = new Decimal(MAXPrice);
    const priceDiff = price1.minus(price2);
    if (priceDiff.greaterThan(diffPrice)) {
      if (
        !lastNotifyTimeHoyaMax ||
        currentTime - parseInt(lastNotifyTimeHoyaMax) >= 1800
      ) {
        messageBody += `${'HOYA Sell Price'}: ${price1}\n${'MAX Price'}: ${price2}\nDiff: ${priceDiff}\n`;
        sendNotificationHoyaMax = true;
        console.log(
          `${'HOYA Sell Price'} minus ${'MAX Price'} ${priceDiff} is greater than ${diffPrice}, sending notification (HOYA-MAX)`
        );
      } else {
        console.log('Notification (HOYA-MAX) skipped due to time limit');
      }
    } else {
      console.log(
        `${'HOYA Sell Price'} minus ${'MAX Price'} ${priceDiff} is less than ${diffPrice}`
      );
    }
  }

  // 檢查 HOYA Sell Price 與 BitoPro Price 差異
  {
    const price1 = new Decimal(HOYASellPrice);
    const price2 = new Decimal(BitoProPrice);
    const priceDiff = price1.minus(price2);
    if (priceDiff.greaterThan(diffPrice)) {
      if (
        !lastNotifyTimeHoyaBito ||
        currentTime - parseInt(lastNotifyTimeHoyaBito) >= 1800
      ) {
        messageBody += `${'HOYA Sell Price'}: ${price1}\n${'BitoPro Price'}: ${price2}\nDiff: ${priceDiff}`;
        sendNotificationHoyaBito = true;
        console.log(
          `${'HOYA Sell Price'} minus ${'BitoPro Price'} ${priceDiff} is greater than ${diffPrice}, sending notification (HOYA-BITO)`
        );
      } else {
        console.log('Notification (HOYA-BITO) skipped due to time limit');
      }
    } else {
      console.log(
        `${'HOYA Sell Price'} minus ${'BitoPro Price'} ${priceDiff} is less than ${diffPrice}`
      );
    }
  }

  console.log(messageBody);
  if (sendNotificationHoyaMax || sendNotificationHoyaBito) {
    await sendLINEPushMessage(env, messageBody);
    if (sendNotificationHoyaMax) {
      await env.KV.put(notify_key_hoya_max, currentTime.toString());
    }
    if (sendNotificationHoyaBito) {
      await env.KV.put(notify_key_hoya_bito, currentTime.toString());
    }
  }

  console.log('cron triggered!');
};
