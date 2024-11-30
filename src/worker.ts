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
import {config} from './config';
import {handleRequest, handleOptions, handleSchedule} from './handler';

export interface Env {
  LINE_NOTIFY_TOKEN: string;
  MAX_API_URL: string;
  CF_ACCESS_CLIENT_ID: string;
  CF_ACCESS_CLIENT_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const isMethodAllowed = config.methods.includes(request.method);

    if (!isMethodAllowed)
      return new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed',
      });

    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    } else {
      return handleRequest(request, env);
    }
  },
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
