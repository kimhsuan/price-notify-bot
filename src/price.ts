export const GetHoyabitPrice = async () => {
	const url = 'https://guest-apis.hoyabit.com/guest/apis/v2/common/trade/overview/buy';
	const init = {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	};
	const response = await fetch(url, init)
		.then((response) => response.json())
		.then((data) => {
			// console.log(data)
			for (const price of data.data) {
				if (price.symbol === 'USDT') {
					// console.log(price.price)
					return price.price;
				}
			}
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
		.then((data) => {
			// console.log(JSON.stringify(data[0].price))
			return data[0].price;
		});
	return response;
};
