import {Env} from './worker';
import {config, list_api} from './config';
import {Home} from './routers/home';
import {Price} from './routers/price';
import {checkPriceDiff} from './schedules/price';

export async function handleRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const requestURL = new URL(request.url);
  const requestPath = requestURL.pathname;

  //* Check target URL validity
  if (config.methods && !config.methods.includes(request.method)) {
    return new Response(null, {
      status: 405,
      statusText: 'Method not allowed',
    });
  }

  /*
   * Handle Worker's URL Path
   * If you want to manage various URL path for your worker
   */
  switch (requestPath) {
    case list_api.home:
      return Home();
    case list_api.price:
      return Price(env);
    default:
      // * You can return a HTML body for a 404 page
      return new Response(null, {
        status: 404,
        statusText: 'Request path url not defined',
      });
  }
}

export async function handleOptions(request: Request): Promise<Response> {
  /*
   * Handle CORS pre-flight request.
   * If you want to check the requested method + headers you can do that here.
   */
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': config.host,
        'Access-Control-Allow-Methods': config.methods.join(', '),
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

    /*
     * Handle standard OPTIONS request.
     * If you want to allow other HTTP Methods, you can do that here.
     */
  } else {
    return new Response(null, {
      headers: {
        Allow: config.methods.join(', '),
      },
    });
  }
}

/*
 * Schedule handler
 * For handling requests made by Cloudflare's CRON trigger
 */
export async function handleSchedule(event: ScheduledEvent, env: Env) {
  return checkPriceDiff(env);
}
