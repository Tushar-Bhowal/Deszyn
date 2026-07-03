# Deszyn

- AI design platform for developers — generates brand identity (names, logos) and React design systems. Product vision lives in [README.md](README.md), but its stack tables are partly stale (see Gotchas).
- Currently Phase 1: polished frontend with mock data. `apps/server` and `apps/ai` are minimal scaffolds (env validation + a health route).
- npm workspaces + Turborepo. npm only (`package-lock.json`), Node >= 22.

## Commands

- Dev (all workspaces): `npm run dev` — web only: `npm run dev --workspace=@deszyn/web`
- Build: `npm run build` · Types: `npm run check-types`
- Lint: `npm run lint` · Format + autofix: `npm run check` (Biome, writes in place)
- Python (`apps/ai`): ruff + pytest are configured in `pyproject.toml`; local venv/run setup is not decided yet — ask before assuming uv or pip.

## Architecture

- `apps/web` — Next.js 16 App Router, React 19, Tailwind v4 CSS-first (no `tailwind.config`; design tokens live in `app/globals.css`), shadcn/ui in `components/ui`.
- `apps/server` — Node API gateway scaffold (ESM, run with tsx + dotenv-cli). Only `src/env.ts` exists; `src/index.ts` (the dev-script entry) is not written yet.
- `apps/ai` — Python 3.12 FastAPI service. Not an npm workspace; excluded from Biome and Turbo.
- `packages/config` — `@deszyn/config`: shared Zod env schemas, exported as raw TS with no build step (web consumes it via `transpilePackages`).
- Every app validates env fail-fast at startup: `apps/web/lib/env.ts`, `apps/server/src/env.ts`, `apps/ai/src/deszyn_ai/env.py`. Add new env vars to the schema first (packages/config for TS, `Settings` in env.py for Python), then to the app's `.env` and `.env.example`.
- Default ports: web 3000, server 8000, ai 8001.

## Conventions

- Commit directly to main; Vercel auto-deploys the web app from main.
- Biome owns JS/TS format + lint (single quotes, 100-col — see `biome.json`); `apps/web` additionally lints with `eslint-config-next`. ruff owns `apps/ai` (double quotes, 100-col). Never add Prettier or extra ESLint configs.
- Dark theme is forced (`forcedTheme="dark"`) — do not add light-mode styles or a theme toggle.
- Route-scoped components go in a `_components/` folder beside the route (see `app/(auth)/auth/_components/`); shared UI goes in `components/ui`.

## Gotchas

- **IMPORTANT:** README.md's architecture/stack tables are stale — auth is Better Auth (not NextAuth), email is Resend, LLMs are OpenAI/Anthropic (not Gemini). Trust the env schemas in `packages/config` and `apps/ai/src/deszyn_ai/env.py` over the README.
- Root `npm run dev` currently crashes for `@deszyn/server` (missing `src/index.ts`) — run web via the workspace flag until the server entry exists.
- Server requires a fully populated `.env` (Mongo, Redis, Better Auth, Resend) to boot at all; its scripts load it via `dotenv -e .env --`.
- No TS test suite exists yet; pytest is configured for `apps/ai` only. Don't invent a test command.
