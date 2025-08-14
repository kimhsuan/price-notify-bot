# Copilot Coding Agent Instructions for price-notify-bot

## Project Overview
- This is a Cloudflare Worker project using TypeScript, designed to run scheduled jobs (cron) for price notifications.
- The main entry points are `src/worker.ts` (worker logic) and `src/schedule.ts` (cron scheduling).
- Data models and interfaces are in `src/interfaces/`, with price-related logic in `src/utils/price.ts` and LINE messaging integration in `src/utils/line.ts`.

## Build & Deploy Workflow
- Use Wrangler for all build, deploy, and secret management tasks.
- Install Wrangler: `npm install wrangler@4.10.0 --save-dev`
- Deploy: `npx wrangler deploy`
- Test locally: `npm start` then `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"`
- Set secrets: `echo <VALUE> | npx wrangler secret put <NAME>`

## Key Patterns & Conventions
- All business logic is organized under `src/`, with clear separation between scheduling, worker logic, and utility functions.
- Use TypeScript interfaces from `src/interfaces/price.ts` for all price-related data structures.
- External API integration (e.g., LINE messaging) is handled in dedicated utility files (`src/utils/line.ts`).
- Cron triggers are configured via Wrangler and tested using the provided curl command.
- Environment variables and secrets are managed exclusively via Wrangler CLI.

## Integration Points
- Cloudflare Worker runtime: All code must be compatible with Worker APIs and deployment model.
- LINE Messaging API: Outbound notifications are sent via logic in `src/utils/line.ts`.
- Price data processing and notification logic are modularized for easy extension.

## Example Workflow
1. Add new price notification logic in `src/utils/price.ts`.
2. Update interfaces in `src/interfaces/price.ts` as needed.
3. Integrate with worker entry (`src/worker.ts`) and schedule (`src/schedule.ts`).
4. Test locally and deploy using Wrangler commands.

## References
- See `README.md` for Wrangler usage and Cloudflare Worker documentation links.
- Key files: `src/worker.ts`, `src/schedule.ts`, `src/interfaces/price.ts`, `src/utils/line.ts`, `src/utils/price.ts`

---

**For AI agents:**
- Always use Wrangler for build/deploy/secrets.
- Follow the modular structure in `src/` for new features.
- Reference TypeScript interfaces for all data models.
- Keep external integrations isolated in utility files.
- Update this file if new conventions or workflows are introduced.
