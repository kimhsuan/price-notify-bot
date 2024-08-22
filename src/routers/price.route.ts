import {Env} from '../worker';
import {GetHoyaBuyPrice, GetHoyaSellPrice, GetMaxPrice, GetBitoProPrice} from '../price';
import {Decimal} from 'decimal.js';

export const Price = async (env: Env) => {
  const hoyaBuyPrice = Number.parseFloat(await GetHoyaBuyPrice()).toFixed(3);
  const hoyaSellPrice = Number.parseFloat(await GetHoyaSellPrice()).toFixed(3);
  const maxPrice = Number.parseFloat(await GetMaxPrice(env)).toFixed(3);
  const bitoproPrice = Number.parseFloat(await GetBitoProPrice()).toFixed(3);
  const maxhoyabuydiff = new Decimal(maxPrice).minus(hoyaBuyPrice);
  const bitohoyabuydiff = new Decimal(bitoproPrice).minus(hoyaBuyPrice);
  const hoyasellmaxdiff = new Decimal(hoyaSellPrice).minus(maxPrice);
  const hoyasellbitodiff = new Decimal(hoyaSellPrice).minus(bitoproPrice);
  return new Response(
    JSON.stringify({
      hoyaBuyPrice: hoyaBuyPrice,
      hoyaSellPrice: hoyaSellPrice,
      maxPrice: maxPrice,
      bitoproPrice: bitoproPrice,
      maxhoyabuydiff: maxhoyabuydiff,
      bitohoyabuydiff: bitohoyabuydiff,
      hoyasellmaxdiff: hoyasellmaxdiff,
      hoyasellbitodiff: hoyasellbitodiff,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  );
};
