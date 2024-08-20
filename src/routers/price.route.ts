import {Env} from '../worker';
import {GetHoyaBuyPrice, GetMaxPrice, GetBitoProPrice} from '../price';
import {Decimal} from 'decimal.js';

export const Price = async (env: Env) => {
  const hoyaBuyPrice = Number.parseFloat(await GetHoyaBuyPrice()).toFixed(3);
  const maxPrice = Number.parseFloat(await GetMaxPrice(env)).toFixed(3);
  const bitoproPrice = Number.parseFloat(await GetBitoProPrice()).toFixed(3);
  const maxhoyadiff = new Decimal(maxPrice).minus(hoyaBuyPrice);
  const bitohoyadiff = new Decimal(bitoproPrice).minus(hoyaBuyPrice);
  return new Response(
    JSON.stringify({
      hoyaBuyPrice: hoyaBuyPrice,
      maxPrice: maxPrice,
      bitoproPrice: bitoproPrice,
      maxhoyadiff: maxhoyadiff,
      bitohoyadiff: bitohoyadiff,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  );
};
