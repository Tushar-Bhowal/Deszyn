# Deszyn

- AI design platform for developers — generates brand identity (names, logos) and React design systems. Product vision lives in [README.md](README.md), but its stack tables are partly stale (see Gotchas).
- Frontend-first: the **Brand studio** chat experience is built end-to-end on mock data (see the Brand studio section); the **Design studio** and all **backend** are not built yet. `apps/server` and `apps/ai` are still minimal scaffolds (env validation + a health route).
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

## Brand studio (frontend — `apps/web/app/(dashboard)/project/[projectId]/`)

- The product UI is one full-bleed route with its **own** `layout.tsx` (`_components/studio-shell.tsx` → `SidebarProvider defaultOpen={false}` + an **offcanvas** `AppSidebar`). It deliberately does NOT use the dashboard's centered `AppShell`. `AppSidebar` takes optional `collapsible` / `headerTrigger` props so the studio can differ from the dashboard.
- All studio UI is route-scoped in `_components/` (chat-panel, composer, message-list, chat-message, brand-output, logo-output, style-editor, brand-kit-panel, working-indicator, loading-block, next-step, download-kit-dialog, welcome-hero, grid-backdrop, voice-input, studio-provider, studio-shell).
- **State = one client store.** `_components/studio-provider.tsx` exposes `useStudio()` (built with `createContext` + a hook that throws outside its provider — the same pattern as `useSidebar` in `components/ui/sidebar.tsx`). It owns the chat messages, the staged flow (`stage`/`status`), the accumulating `brandKit`, and every action (send, choose/save name & logo, style, edit/delete/reset). Put new studio state here, not in scattered component state.
- **Mock-first contracts.** Shared types live in `apps/web/lib/contracts.ts`; mock generators (which simulate token streaming via `streamTokens`) live in `apps/web/lib/mock/`. UI renders these types, so swapping to a real API is a drop-in — keep the two in sync when adding fields.
- **Client-side asset helpers (no backend needed):** `lib/export-svg.ts` (SVG→PNG/JPG via `<canvas>`), `lib/theme-export.ts` (BrandKit → shadcn Tailwind-v4 `globals.css` or plain CSS), `lib/download-kit.ts` (zips the kit with `fflate`), plus `lib/validate-attachment.ts` and `lib/clean-transcript.ts`.
- **Shared hooks** live in `apps/web/hooks/` (e.g. `use-voice-dictation.ts` — free voice-to-text via `react-speech-recognition`; no API key, no backend). **Ambient module types** for deps that ship none live in `apps/web/types/` (e.g. `react-speech-recognition.d.ts`).

## Conventions

- Commit directly to main; Vercel auto-deploys the web app from main.
- Biome owns JS/TS format + lint (single quotes, 100-col — see `biome.json`); `apps/web` additionally lints with `eslint-config-next`. ruff owns `apps/ai` (double quotes, 100-col). Never add Prettier or extra ESLint configs.
- Dark theme is forced (`forcedTheme="dark"`) — do not add light-mode styles or a theme toggle.
- Route-scoped components go in a `_components/` folder beside the route (see `app/(auth)/auth/_components/`); shared UI goes in `components/ui`.
- `components.json` declares custom shadcn registries (`@magicui`, `@fancy`, `@efferd`); pull their components with `npx shadcn add @magicui/<name>` etc. (registry components install into `components/ui` or a namespaced folder like `components/fancy/`). `motion` (the `motion/react` package) is installed alongside `framer-motion` because some registry components import from it.
- Extra Google fonts (Space Grotesk, Sora, Inter, Playfair Display, Instrument Serif) are loaded in `app/layout.tsx` as `--font-*` CSS vars, offered by the style editor's font picker — add new picker fonts there.
- Client-only libs (`react-speech-recognition`, `fflate`, canvas export) are used inside `'use client'` components/hooks; keep them out of server components.

## Gotchas

- **IMPORTANT:** README.md's architecture/stack tables are stale — auth is Better Auth (not NextAuth), email is Resend, LLMs are OpenAI/Anthropic (not Gemini). Trust the env schemas in `packages/config` and `apps/ai/src/deszyn_ai/env.py` over the README.
- Root `npm run dev` currently crashes for `@deszyn/server` (missing `src/index.ts`) — run web via the workspace flag until the server entry exists.
- Server requires a fully populated `.env` (Mongo, Redis, Better Auth, Resend) to boot at all; its scripts load it via `dotenv -e .env --`.
- No TS test suite exists yet; pytest is configured for `apps/ai` only. Don't invent a test command.
