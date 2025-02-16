import {Env} from '../worker';
import {sendLINEPushMessage} from '../utils/line';
import {getHOYASellPrice, getMAXPrice, getBitoProPrice} from '../utils/price';
import {Decimal} from 'decimal.js';

const checkAndNotifyPriceDiff = async (
  env: Env,
  price1: Decimal,
  price2: Decimal,
  priceName1: string,
  priceName2: string,
  diffPrice: Decimal
) => {
  const priceDiff = price1.minus(price2);
  if (priceDiff.greaterThan(diffPrice)) {
    console.log(`${priceName1} ${priceDiff} is greater than ${diffPrice}`);
    await sendLINEPushMessage(
      env,
      `${priceName1}: ${price1}\n${priceName2}: ${price2}\nis more than ${diffPrice}\nDiff: ${priceDiff}`
    );
  } else {
    console.log(
      `${priceName1} minus ${priceName2} ${priceDiff} is less than ${diffPrice}`
    );
  }
};

export const checkPriceDiff = async (env: Env) => {
  const HOYASellPrice = new Decimal(await getHOYASellPrice()).toFixed(3);
  const MAXPrice = new Decimal(await getMAXPrice(env)).toFixed(3);
  const BitoProPrice = new Decimal(await getBitoProPrice()).toFixed(3);
  const diffPrice = new Decimal(0.03);

  await checkAndNotifyPriceDiff(
    env,
    new Decimal(HOYASellPrice),
    new Decimal(MAXPrice),
    'HOYA Sell Price',
    'MAX Price',
    diffPrice
  );
  await checkAndNotifyPriceDiff(
    env,
    new Decimal(HOYASellPrice),
    new Decimal(BitoProPrice),
    'HOYA Sell Price',
    'BitoPro Price',
    diffPrice
  );

  console.log('cron triggered!');
};
