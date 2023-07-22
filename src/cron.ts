import { Env } from './worker';
import { GetHoyabitPrice, GetMaxPrice } from './price';
import { accSub } from './acc';

const LineNotify = async (env: Env, message: string) => {
	const url = 'https://notify-api.line.me/api/notify';
	const init = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Bearer ${env.LINE_NOTIFY_TOKEN}`,
		},
		body: `message=\n${message}`,
	};
	const response = await fetch(url, init).then((response) => response.json());
	console.log('Send Line Notify:', response);
};

export const CronJob = async (env: Env) => {
	const hoyaprice = Number.parseFloat(await GetHoyabitPrice()).toFixed(3);
	const maxprice = Number.parseFloat(await GetMaxPrice()).toFixed(3);
	const diff = await accSub(maxprice, hoyaprice);
	console.log(diff);
	if (diff > 0.03) {
		await LineNotify(env, `MAX Sell Price ${maxprice} is higher than HOYA Buy Price ${hoyaprice} more than 0.03\nPrice diff: ${diff}`);
		// } else {
		//   await LineNotify(env, `MAX Sell Price ${maxprice} is higher than HOYA Buy Price ${hoyaprice} less than 0.03\nPrice diff: ${diff}`)
	}
	console.log('cron triggered!');
};
