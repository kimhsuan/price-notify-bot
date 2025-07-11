import {Env} from './worker';
import {checkPriceDiff} from './schedule';

/*
 * Schedule handler
 * For handling requests made by Cloudflare's CRON trigger
 */
export async function handleSchedule(
  controller: ScheduledController,
  env: Env
) {
  return checkPriceDiff(env);
}
