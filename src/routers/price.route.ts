import {Env} from '../worker';
import {GetHoyaBuyPrice, GetMaxPrice} from '../price';
import {Decimal} from 'decimal.js';

export const Price = async (env: Env) => {
  const hoyaBuyPrice = Number.parseFloat(await GetHoyaBuyPrice()).toFixed(3);
  const maxSellPrice = Number.parseFloat(await GetMaxPrice(env)).toFixed(3);
  const diff = new Decimal(maxSellPrice).minus(hoyaBuyPrice);
  return new Response(
    JSON.stringify({
      hoyaBuyPrice: hoyaBuyPrice,
      maxSellPrice: maxSellPrice,
      diff: diff,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  );
};
