# AGENTS.md

Roommate Splitter frontend: Vue 3 (Composition API) + Vite + Tailwind v4. Two consumer surfaces: the gastos/finance app (against a Spring Boot backend) and a project dashboard fed by GitHub REST. UI text is in Spanish (es-AR).

## Commands

- `npm run typecheck` (`vue-tsc --noEmit`) is the **only** verification. There are no tests and no lint/format tooling configured. Run it after changes; it must exit 0.
- `npm run dev` / `npm run preview` / `npm run build` (Vite).

## Gotchas

- **`typescript` is pinned to `~5.9.3`. Never bump to 7.x** — `vue-tsc` fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- **Tailwind v4 CSS-first config**: theme tokens (navy/slate/emerald palette, 8px `--spacing`, text scale, dark variant) live in `src/index.css` `@theme`. `tailwind.config.js` is a stub.
- **daisyui was removed; the README is stale** (still lists DaisyUI and "no password login"). There is a custom UI kit in `src/components/ui/` — use it.
- Dark mode is the `.dark` class on `<html>` (`@custom-variant`). Utilities must always pair light + dark variants (e.g. `bg-white ... dark:bg-navy-800`).
- Icons come from the sprite `public/icons.svg`, referenced as `/icons.svg#<name>` via `SvgIcon` (`:name` prop). New icons must be added to that sprite.

## Architecture

- Entry: `src/main.ts` → `App.vue` → router (`src/routes/index.ts`, pages lazy-loaded). Auth guard reads the `usuarioId` localStorage key.
- **Two data sources**:
  - Backend `http://localhost:8080/api` via axios (`src/api/axiosConfig.ts`): gastos, balances, auth. No JWT (endpoints are `permitAll`); session persisted in `localStorage` under `usuario` + `usuarioId`.
  - Dashboard via GitHub REST (`src/services/githubService.ts` + `src/composables/useDashboard.ts`), cached in localStorage with TTL, with `isDemo` fallback when the repo is unconfigured or unreachable.
- Env vars are read only through `src/config/env.ts` (`VITE_API_URL`, `VITE_GITHUB_REPO_OWNER`, `VITE_GITHUB_REPO_NAME`, `VITE_GITHUB_TOKEN`). Copy `.env.example` → `.env.local` (`*.local` is gitignored).
- Backend contract (verified, do not "fix"): `Gasto` has numeric `usuarioId`; balances are a **flat** `BalanceDTO[] {deudor, acreedor, monto}`; `Usuario.id` is `number`. Types live in `src/types/*`, re-exported by `src/types/index.ts` (which also exports `QUIEN_PAGO_OPCIONES`/`QUIEN_PAGO_LABEL`).
- Feature composables (`useAuth`, `useGastos`, `useDashboard`, `useBackendHealth`) are built on `useFetch<T>` + `utils/cache.ts`. **Store a composable return via `shallowRef`, never `ref`** — plain `ref()` deeply unwraps nested refs and breaks `.value` typing.
- `FormGasto.vue` emits `Omit<CreateGastoDTO, 'usuarioId'>`; the parent must merge `usuarioId` from the authenticated user.
- `MainLayout` is self-contained (auth, theme toggle, backend-health). Do not pass the old `:usuario` / `@menu` / `@logout` props.

## Dead code (unreferenced legacy; don't resurrect)

- `src/components/ui/{Button,Modal,Tabs,AppToggle,AppModal}.vue`, `src/components/features/LoginModal.vue`
- `src/context/stores/*`, `src/data/constants.ts`, `src/services/deudaService.ts`, `src/utils/{formatters,helpers,validators}.ts`

If a task seems to require any of these, rebuild against the current composables/types instead of wiring them back in.