import {Env} from '../worker';
import {sendLINEPushMessage} from '../utils/line';
import {getHOYASellPrice, getMAXPrice, getBitoProPrice} from '../utils/price';
import {Decimal} from 'decimal.js';

export const checkPriceDiff = async (env: Env) => {
  // 用全域的通知 key 限制 30 分鐘內只送一次訊息
  const notify_key = 'last_notify_time_all';
  const lastNotifyTime = await env.KV.get(notify_key);
  const currentTime = Math.floor(Date.now() / 1000);
  if (lastNotifyTime && currentTime - parseInt(lastNotifyTime) < 1800) {
    console.log('Notification skipped due to time limit');
    return;
  }

  const HOYASellPrice = new Decimal(await getHOYASellPrice()).toFixed(3);
  const MAXPrice = new Decimal(await getMAXPrice(env)).toFixed(3);
  const BitoProPrice = new Decimal(await getBitoProPrice()).toFixed(3);
  const diffPrice = new Decimal(0.03);

  let messageBody = '';
  let sendNotification = false;

  // 檢查 HOYA Sell Price 與 MAX Price 差異
  {
    const price1 = new Decimal(HOYASellPrice);
    const price2 = new Decimal(MAXPrice);
    const priceDiff = price1.minus(price2);
    if (priceDiff.greaterThan(diffPrice)) {
      messageBody += `${'HOYA Sell Price'}: ${price1}\n${'MAX Price'}: ${price2}\nDiff: ${priceDiff}\n`;
      sendNotification = true;
      console.log(
        `${'HOYA Sell Price'} minus ${'MAX Price'} ${priceDiff} is greater than ${diffPrice}, sending notification`
      );
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
      messageBody += `${'HOYA Sell Price'}: ${price1}\n${'BitoPro Price'}: ${price2}\nDiff: ${priceDiff}`;
      sendNotification = true;
      console.log(
        `${'HOYA Sell Price'} minus ${'BitoPro Price'} ${priceDiff} is greater than ${diffPrice}, sending notification`
      );
    } else {
      console.log(
        `${'HOYA Sell Price'} minus ${'BitoPro Price'} ${priceDiff} is less than ${diffPrice}`
      );
    }
  }

  console.log(messageBody);
  if (sendNotification) {
    await sendLINEPushMessage(env, messageBody);
    await env.KV.put(notify_key, currentTime.toString());
  }

  console.log('cron triggered!');
};
