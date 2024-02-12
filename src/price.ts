export const GetHoyaBuyPrice = async () => {
	const url = 'https://guest-apis.hoyabit.com/guest/apis/v2/common/trade/overview/buy';
	const init = {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	};
	const response = await fetch(url, init)
		.then((response) => response.json())
		.then((data: any) => {
			// console.log(data)
			return data.data.find((price: any) => price.symbol === 'USDT').price;
		});

	return response;
};

export const GetMaxPrice = async () => {
	const url = 'https://max-api.maicoin.com/api/v2/trades?market=usdttwd&limit=1';
	const init = {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	};
	const response = await fetch(url, init)
		.then((response) => response.json())
		.then((data: any) => {
			// console.log(JSON.stringify(data[0].price))
			return data[0].price;
		});
	return response;
};
