import {Env} from '../worker';
import {
  getHOYABuyPrice,
  getHOYASellPrice,
  getMAXPrice,
  getBitoProPrice,
} from '../utils/price';
import {Decimal} from 'decimal.js';

export const Price = async (env: Env) => {
  const HOYABuyPrice = new Decimal(await getHOYABuyPrice()).toFixed(3);
  const HOYASellPrice = new Decimal(await getHOYASellPrice()).toFixed(3);
  const MAXPrice = new Decimal(await getMAXPrice(env)).toFixed(3);
  const BitoProPrice = new Decimal(await getBitoProPrice()).toFixed(3);

  const MAXHOYABuyDiff = new Decimal(MAXPrice).minus(HOYABuyPrice);
  const BitoProHOYABuyDiff = new Decimal(BitoProPrice).minus(HOYABuyPrice);
  const HOYASellMAXDiff = new Decimal(HOYASellPrice).minus(MAXPrice);
  const HOYASellBitoProDiff = new Decimal(HOYASellPrice).minus(BitoProPrice);

  return new Response(
    JSON.stringify({
      HOYABuyPrice: HOYABuyPrice,
      HOYASellPrice: HOYASellPrice,
      MAXPrice: MAXPrice,
      BitoProPrice: BitoProPrice,
      MAXHOYABuyDiff: MAXHOYABuyDiff,
      BitoProHOYABuyDiff: BitoProHOYABuyDiff,
      HOYASellMAXDiff: HOYASellMAXDiff,
      HOYASellBitoProDiff: HOYASellBitoProDiff,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  );
};
