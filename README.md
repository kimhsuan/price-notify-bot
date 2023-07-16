# Cloudflare Worker CronJob Practice

## Install Wrangler

``` bash
npm install -g wrangler@3.2.0
```

Reference

- [Install/Update Wrangler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Test Cron Triggers using Wrangler

``` bash
wrangler dev --test-scheduled
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

Reference

- [Setting Cron Triggers · Cloudflare Workers docs](https://developers.cloudflare.com/workers/examples/cron-trigger/)

## Secrets on deployed Workers

``` bash
echo <VALUE> | wrangler secret put <NAME>
```

Reference

- [Environment variables · Cloudflare Workers docs](https://developers.cloudflare.com/workers/platform/environment-variables/)

## Reference

- [Cloudflare Workers · Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- [alvinwilta/cloudflare-worker-boilerplate: Simple boilerplate for Cloudflare Worker with Typescript with CRON schedule handler](https://github.com/alvinwilta/cloudflare-worker-boilerplate/)
