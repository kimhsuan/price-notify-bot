## price-notify-bot – AI Coding Agent Instructions

Concise, project-specific guidance so you can contribute immediately. Keep edits tight, TypeScript-safe, and Cloudflare Worker compatible.

### 1. Architecture & Flow
Entry: `src/worker.ts` exports `scheduled` handler -> delegates to `checkPriceDiff` in `src/schedule.ts`.
Core logic: `checkPriceDiff` fetches prices (HOYA sell, MAX, BitoPro) via helpers in `src/utils/price.ts`, converts to `Decimal` (rounded to 3 places), compares, and conditionally sends LINE notifications using `src/utils/line.ts`.
State / rate limit: Cloudflare KV (binding `KV`) stores last notification timestamps per pair (`last_notify_time_hoya_max`, `last_notify_time_hoya_bito`) enforcing a 1800s (30m) cooldown.
Threshold: Difference trigger uses constant `diffPrice = 0.03` (absolute price diff) – comparisons are `Decimal` subtraction (base - compare) > diff.

### 2. Environment & Secrets
Env interface in `src/worker.ts` defines required bindings (add here first, mirror in `wrangler.toml`, then `wrangler secret put <NAME>` if secret). Current keys: `KV`, `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_SEND_TO`, `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`, `BITOPRO_API_URL`, `HOYABIT_API_URL`, `MAX_API_URL`.
Cloudflare Access headers (`CF-Access-Client-Id/Secret`) are required only for MAX API calls.

### 3. Cron & Local Testing
Cron schedules live in `wrangler.toml` under `[env.dev.triggers]` and `[env.prod.triggers]` (different frequencies). Use `npm start` (alias: `wrangler dev --env dev --test-scheduled`) then manual invoke: `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to simulate.
Production deploy: `npx wrangler deploy --env prod` (omit `--env` for default). Tail logs: `npx wrangler tail --env dev`.

### 4. Coding Conventions
Fetch helpers in `src/utils/price.ts` return raw `string` numeric prices; conversion to `Decimal` happens in scheduling layer (keeps fetch layer simple and reusable).
Round once at ingestion in `schedule.ts` via `toDecimalPlaces(3)`; don’t re-round downstream.
Notification assembly pattern: Multiline text with labels, base then compare then Diff. Replicate format for consistency.
KV key naming: `last_notify_time_<lowercase_pair>`; reuse cooldown check logic (see `checkAndNotify`). Avoid duplicating that function—extend it or reuse parameters.
External integration isolation: Only use LINE API inside `utils/line.ts`. New outbound services should follow the same single-purpose util approach.

### 5. Adding a New Exchange / Price Source
1. Add interface (if needed) in `src/interfaces/price.ts` (keep fields minimal, strings for numeric JSON fields).
2. Create fetch fn in `src/utils/price.ts` (mirror existing: build URL from env, set headers, parse JSON, extract price, log success/error). Return a `string`.
3. Bind any new base URL / auth in `Env` + `wrangler.toml` + secrets.
4. In `src/schedule.ts`, fetch, wrap with `new Decimal(...).toDecimalPlaces(3)`, then call `checkAndNotify` with a new KV key and labels.
5. Maintain cooldown + diff threshold logic unless you introduce a clearly parameterized alternative.

### 6. Error & Logging Pattern
Each fetch logs `Success:` or `Error:` with function name – keep identical prefix style for greppable logs.
On notification skip (cooldown) or diff below threshold, log explicit reason (copy existing wording for consistency).

### 7. Style / Tooling
Project uses `gts` (Google TypeScript Style). Run `npm run fix` before committing if you modify or add files. Compilation (`tsc`) runs via `prepare` and before tests (no tests yet—if adding, keep them fast, pure, and Worker-safe).

### 8. Safe Changes Checklist (Quick)
Add secret? -> Env interface + wrangler.toml + `wrangler secret put`.
Add price source? -> interface -> util fetch -> schedule integration -> KV key.
Adjust threshold/cooldown? -> Change constants in `schedule.ts` & document in this file if semantics change.

### 9. Don’ts
Don’t mutate notification formatting arbitrarily (users may parse logs/messages).
Don’t perform arithmetic before converting to `Decimal` (avoid floating inaccuracies).
Don’t bypass KV cooldown logic for existing pairs.

### 10. Reference Files
Entrypoint: `src/worker.ts`
Scheduler & diff logic: `src/schedule.ts`
Price fetchers: `src/utils/price.ts`
LINE integration: `src/utils/line.ts`
Data interfaces: `src/interfaces/price.ts`
Config & cron: `wrangler.toml`

Update this doc whenever workflows, env bindings, or notification logic patterns meaningfully change.
