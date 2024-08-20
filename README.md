# Cloudflare Worker CronJob Practice

## Install Wrangler

``` bash
npm install -g wrangler@3.72.0
```

Reference

- [Install/Update Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Wrangler commands

``` bash
# Authorize Wrangler with your Cloudflare account using OAuth.
npx wrangler login
# Retrieve your user information and test your authentication configuration.
npx wrangler whoami
# Start a session to livestream logs from a deployed Worker.
npx wrangler tail
# Deploy your Worker to Cloudflare.
npx wrangler deploy
```

## Test Cron Triggers using Wrangler

``` bash
npm start
curl "http://localhost:8787/__scheduled?cron=*%2F5+*+*+*+*"
```

Reference

- [Setting Cron Triggers · Cloudflare Workers docs](https://developers.cloudflare.com/workers/examples/cron-trigger/)

## Secrets on deployed Workers

``` bash
echo <VALUE> | npx wrangler secret put <NAME>
```

Reference

- [Environment variables · Cloudflare Workers docs](https://developers.cloudflare.com/workers/platform/environment-variables/)

## Reference

- [Cloudflare Workers · Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- [alvinwilta/cloudflare-worker-boilerplate: Simple boilerplate for Cloudflare Worker with Typescript with CRON schedule handler](https://github.com/alvinwilta/cloudflare-worker-boilerplate/)
