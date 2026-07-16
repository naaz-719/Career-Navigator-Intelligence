# Threat Model

## Project Overview

HirePilot AI is an early-stage Node.js/Express API server with a React frontend, backed by PostgreSQL via Drizzle ORM. The project is deployed publicly on Replit Autoscale at `https://career-navigator-intelligence.replit.app`. As of this scan the application has only a health-check endpoint (`GET /api/healthz`). A mockup sandbox (`/__mockup`) serves a Vite-based component preview tool for the design canvas.

**Tech stack:** pnpm workspaces, Node.js 24, TypeScript 5.9, Express 5, PostgreSQL + Drizzle ORM, Zod validation, esbuild.

## Assets

- **User data** – No user accounts or PII exist yet; this is an asset to protect as features are added.
- **Application secrets** – `DATABASE_URL` and any future API keys (AI provider keys, etc.) stored in environment variables.
- **Database contents** – PostgreSQL database accessed via `DATABASE_URL`. Currently no schema beyond the initial setup.
- **API integrity** – The `/api` surface is the core trust boundary between clients and backend data.

## Trust Boundaries

- **Browser to API** – All client requests cross this boundary. The API must authenticate and authorize all requests that access sensitive data.
- **API to PostgreSQL** – Direct database access. SQL injection at the API layer would give full database access.
- **Public to Authenticated** – No authentication exists yet; all endpoints are currently public. This boundary must be enforced server-side as features are added.
- **Mockup Sandbox** – Served at `/__mockup`, this is a dev/design tool. Its component loading is bounded by a static pre-built module map generated at build time.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/app.ts` (Express app), `artifacts/api-server/src/routes/index.ts` (route registration)
- **Highest-risk areas (future):** Route handlers that accept user input, database query construction, any authentication/session middleware added
- **Public surface:** `GET /api/healthz` – currently the only endpoint; no auth required (appropriate)
- **Dev-only:** `artifacts/mockup-sandbox/` – component preview canvas, not an application production surface

## Threat Categories

### Spoofing

No authentication is implemented. As the application grows, all endpoints that access user-specific data MUST require a valid, server-verified session. Session tokens must be cryptographically random and expire within a reasonable window.

### Tampering

No input validation middleware exists beyond per-route Zod parsing. All future routes MUST validate request bodies and parameters with Zod before touching the database. Database queries MUST use Drizzle ORM parameterized queries (never raw string concatenation).

### Information Disclosure

CORS is currently configured with `cors()` using no options, which reflects all origins. As authenticated routes are added, this MUST be restricted to trusted origins to prevent cross-site requests from malicious pages reading authenticated API responses.

Error responses MUST NOT include stack traces or database error details in production. The pino HTTP logger currently strips query strings from URLs, which is good practice.

### Denial of Service

No rate limiting exists on any endpoint. Public endpoints (including future auth endpoints) MUST have rate limiting to prevent abuse. The `express.json()` body parser should have a size limit configured to prevent large-body DoS.

### Elevation of Privilege

No role-based access control exists yet. As admin functionality is added, role checks MUST be enforced server-side on every request. All database queries MUST use Drizzle ORM to avoid raw SQL injection.
