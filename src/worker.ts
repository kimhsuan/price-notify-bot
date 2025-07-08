/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import {handleSchedule} from './handler';

export interface Env {
  LINE_CHANNEL_ACCESS_TOKEN: string;
  LINE_SEND_TO: string;
  CF_ACCESS_CLIENT_ID: string;
  CF_ACCESS_CLIENT_SECRET: string;
  KV: KVNamespace;
  MAX_API_URL: string;
}

export default {
  // The scheduled handler is invoked at the interval set in our wrangler.toml's
  // [[triggers]] configuration.
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(handleSchedule(event, env));
  },
};
