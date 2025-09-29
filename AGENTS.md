# Repository Guidelines

## Project Structure & Module Organization
- App core: `src/app.tsx`, `src/entry-*.tsx`, global styles in `src/app.css`.
- Routes (file-based): `src/routes/*.tsx` (pages) and `src/routes/api/*` (API proxy to Hono).
- Server (Hono): `src/server/app.ts`, middleware in `src/server/middleware.ts`, routers in `src/server/routes/*`.
- Env schemas (zod): `src/env/{client,server}.ts` with `~/*` path alias.
- Data: `src/db/schema.ts` (+ `drizzle.config.ts`, SQL output in `drizzle/`).
- UI components: `src/components/*` (PascalCase filenames).
- Static assets: `public/`.

## Build, Test, and Development Commands
- `npm run dev` (or `bun run dev`): start the dev server at `http://localhost:3000`.
- `npm run build`: production build via `vinxi` and `@solidjs/start`.
- `npm start`: run the built server.
- Drizzle: `npx drizzle-kit generate` to emit SQL, `npx drizzle-kit push` to apply.

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer typed APIs and zod-validated inputs/ENV.
- Never use the TypeScript `any` type or cast to `any`. Prefer precise types, generics, `unknown` with narrowing, and zod-inferred types.
- Indentation 2 spaces in TS/TSX; keep imports and quotes consistent with nearby files.
- Components: PascalCase (e.g., `UserAccounts.tsx`). Routes/pages: kebab/camel as needed (e.g., `about.tsx`). Helpers/libs: camelCase.
- Use the `~/*` alias for intra-project imports (e.g., `import env from '~/env/server'`).
- Exports: prefer named exports for components; do not use default exports except when required by the framework (e.g., certain route files).

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest and colocate as `*.test.ts[x]` next to the unit under test. Ensure `npm run build` passes and exercise critical flows locally.

## Commit & Pull Request Guidelines
- Use Conventional Commits when possible: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- PRs should include: clear description, linked issue (if any), steps to reproduce/verify, and screenshots for UI changes.
- Keep PRs focused and small; include notes on ENV/API assumptions.

## Security & Configuration Tips
- Environment: define values in `.env`/`.env.local` (git-ignored). Do not commit real secrets. Required keys include `BASE_URL`, `VITE_BASE_URL`, `TURSO_*`, `BETTER_AUTH_*`, `KV_*`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `GITHUB_*`.
- CORS/base URL: `src/server/app.ts` uses `BASE_URL`—update when deploying.
- Database: configure Turso via `drizzle.config.ts`; run migrations before starting the app.
