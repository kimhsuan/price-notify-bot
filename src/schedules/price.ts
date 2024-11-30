import {Env} from '../worker';
import {sendLINENotify} from '../utils/notify';
import {getHOYASellPrice, getMAXPrice, getBitoProPrice} from '../utils/price';
import {Decimal} from 'decimal.js';

export const checkPriceDiff = async (env: Env) => {
  const HOYASellPrice = new Decimal(await getHOYASellPrice()).toFixed(3);
  const MAXPrice = new Decimal(await getMAXPrice(env)).toFixed(3);
  const BitoProPrice = new Decimal(await getBitoProPrice()).toFixed(3);
  const HOYASellMAXDiff = new Decimal(HOYASellPrice).minus(MAXPrice);
  const HOYASellBitoProDiff = new Decimal(HOYASellPrice).minus(BitoProPrice);
  const diffPrice = new Decimal(0.03);

  if (HOYASellMAXDiff.greaterThan(diffPrice)) {
    console.log(`maxhoyadiff ${HOYASellMAXDiff} is greater than ${diffPrice}`);
    await sendLINENotify(
      env,
      `HOYA Sell Price ${HOYASellPrice} is higher than MAX Price ${MAXPrice} more than ${diffPrice}\nPrice diff: ${HOYASellMAXDiff}`
    );
  } else {
    console.log(
      `HOYASellMAXDiff: ${HOYASellMAXDiff} is less than ${diffPrice}`
    );
  }

  if (HOYASellBitoProDiff.greaterThan(diffPrice)) {
    console.log(
      `HOYASellBitoProDiff ${HOYASellBitoProDiff} is greater than ${diffPrice}`
    );
    await sendLINENotify(
      env,
      `HOYA Sell Price ${HOYASellPrice} is higher than BitoPro Price ${BitoProPrice} more than ${diffPrice}\nPrice diff: ${HOYASellBitoProDiff}`
    );
  } else {
    console.log(
      `HOYASellBitoProDiff: ${HOYASellBitoProDiff} is less than ${diffPrice}`
    );
  }

  console.log('cron triggered!');
};
