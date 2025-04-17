import {Env} from '../worker';
import {
  HOYAPrice,
  HOYAApiResponse,
  MAXPrice,
  BitoProApiResponse,
} from '../interfaces/price';

export const getHOYABuyPrice = async (): Promise<string> => {
  try {
    const url =
      'https://guest-apis.hoyabit.com/guest/apis/v2/common/trade/overview/buy';
    const init = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    const response = await fetch(url, init);
    const data: HOYAApiResponse = await response.json();
    const price = data.data.find(
      (price: HOYAPrice) => price.symbol === 'USDT'
    )?.price;
    if (price === undefined) {
      throw new Error('Price is undefined');
    }
    console.log('getHOYABuyPrice Success: ' + price);
    return price;
  } catch (error) {
    console.error('getHOYABuyPrice Error: ' + error);
    throw error;
  }
};

export const getHOYASellPrice = async (): Promise<string> => {
  try {
    const url =
      'https://guest-apis.hoyabit.com/guest/apis/v2/common/trade/overview/sell';
    const init = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    const response = await fetch(url, init);
    const data: HOYAApiResponse = await response.json();
    const price = data.data.find(
      (price: HOYAPrice) => price.symbol === 'USDT'
    )?.price;
    if (price === undefined) {
      throw new Error('Price is undefined');
    }
    console.log('getHOYASellPrice Success: ' + price);
    return price;
  } catch (error) {
    console.error('getHOYASellPrice Error: ' + error);
    throw error;
  }
};

export const getMAXPrice = async (env: Env): Promise<string> => {
  try {
    const url = env.MAX_API_URL + '/api/v2/trades?market=usdttwd&limit=1';
    const init = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'CF-Access-Client-Id': env.CF_ACCESS_CLIENT_ID,
        'CF-Access-Client-Secret': env.CF_ACCESS_CLIENT_SECRET,
      },
    };
    const response = await fetch(url, init);
    const data: MAXPrice[] = await response.json();
    const price = data[0]?.price;
    console.log('getMAXPrice Success: ' + price);
    return price;
  } catch (error) {
    console.error('getMAXPrice Error: ' + error);
    throw error;
  }
};

export const getBitoProPrice = async (): Promise<string> => {
  try {
    const url = 'https://api.bitopro.com/v3/trades/USDT_TWD';
    const init = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    const response = await fetch(url, init);
    const data: BitoProApiResponse = await response.json();
    const price = data.data[0].price;
    console.log('getBitoProPrice Success: ' + price);
    return price;
  } catch (error) {
    console.error('getBitoProPrice Error: ' + error);
    throw error;
  }
};
