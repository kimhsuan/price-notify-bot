import {Env} from './worker';

export const GetHoyaBuyPrice = async () => {
  const url =
    'https://guest-apis.hoyabit.com/guest/apis/v2/common/trade/overview/buy';
  const init = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const response = await fetch(url, init)
    .then(response => response.json())
    .then((data: any) => {
      // console.log(data)
      return data.data.find((price: any) => price.symbol === 'USDT').price;
    });
  console.log('GetHoyaBuyPrice; ' + response);
  return response;
};

export const GetMaxPrice = async (env: Env) => {
  const url = env.MAX_API_URL + '/api/v2/trades?market=usdttwd&limit=1';
  const init = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'CF-Access-Client-Id': env.CF_ACCESS_CLIENT_ID,
      'CF-Access-Client-Secret': env.CF_ACCESS_CLIENT_SECRET,
    },
  };
  const response = await fetch(url, init)
    .then(response => response.json())
    .then((data: any) => {
      // console.log(data);
      return data[0].price;
    });
  console.log('GetMaxPrice; ' + response);
  return response;
};

export const GetBitoProPrice = async () => {
  const url = 'https://api.bitopro.com/v3/trades/USDT_TWD';
  const init = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const response = await fetch(url, init)
    .then(response => response.json())
    .then((data: any) => {
      // console.log(data);
      return data.data[0].price;
    });
  console.log('GetBitoProPrice; ' + response);
  return response;
};
