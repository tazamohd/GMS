# SalisAuto GMS — Deep Review & Evaluation Report

**Date:** June 26, 2026
**Project:** SalisAuto GMS (Garage Management System)
**Repository:** `rest-express` v1.0.0
**Evaluation Type:** Full codebase audit (architecture, code quality, security, testing, performance)

---

## Executive Summary

SalisAuto GMS is a comprehensive Garage Management System / Automotive ERP targeting the Saudi Arabian market. It features 104 modules spanning garage operations, HR, fleet management, IoT telematics, AI-powered predictions, AR/VR, and full Saudi compliance (ZATCA, VAT, Hijri calendar, Arabic RTL). The project has an impressive feature surface and a modern tech stack (React 18, TypeScript, Vite, Drizzle ORM, Zod, shadcn/ui), but suffers from critical architectural and quality issues that must be addressed before production deployment.

**Overall Score: 4.3/10**

| Dimension | Score | Assessment |
|---|---|---|
| Architecture | 4/10 | Good modular direction, but massive monolith files remain with type-checking disabled |
| Code Quality | 3/10 | Pervasive `any`, duplicate 10K+ files, no client tests |
| Security | 7/10 | Strong foundations (CSRF, rate limiting, bcrypt), but gaps in PUT/PATCH validation |
| Performance | 3/10 | No server-side pagination, search loads all records, `staleTime: Infinity` |
| Testing | 3/10 | 18 server tests, zero client tests, storage layer untested |
| Documentation | 8/10 | Extensive docs (~100 files), design system, deployment guides |
| Market Fit (KSA) | 9/10 | Excellent ZATCA, VAT, Hijri, RTL compliance |

---

## 1. Project Overview

### 1.1 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18.3, TypeScript 5.6, Vite 5.4, TailwindCSS 3.4, shadcn/ui, TanStack Query 5.60, wouter 3.3, react-hook-form, Zod, framer-motion, recharts, i18next |
| **Backend** | Express 4.21, TypeScript (esbuild), Drizzle ORM 0.39, PostgreSQL, Passport.js, bcrypt, express-session, WebSocket (ws) |
| **Integrations** | Stripe, PayPal, Twilio (SMS/WhatsApp), OpenAI, Google APIs, ZATCA, TecDoc |
| **Testing** | Vitest 4.0, @testing-library/react, supertest, Playwright, embedded-postgres |
| **DevOps** | Docker, Railway, Render, Drizzle Kit, GitHub Actions |

### 1.2 Scale

| Metric | Count |
|---|---|
| Pages | 235+ |
| Database Tables | 394+ |
| API Endpoints | 1,198+ |
| Route Modules | 54+ (modular) + legacy monolith |
| Test Files | ~20 server, 0 client, 6 shared, 2 E2E |
| Documentation Files | 100+ |
| Schema File | ~10,683 lines |
| Legacy `storage.ts` | ~11,752 lines |
| Legacy `routes.ts` | ~22,156 lines |

### 1.3 User Roles

Super Admin, Garage Owner, Manager, Service Advisor, Technician, Parts Manager, Accountant — 7 roles with granular RBAC.

---

## 2. Architecture Review

### 2.1 Strengths

- **Hybrid Router Pattern**: Progressive migration from monolithic `routes.ts` to domain modules under `server/routes/`
- **Clean Separation**: `shared/` for schema/types, `server/` for backend, `client/` for frontend
- **Drizzle ORM**: Schema-first approach with auto-derived Zod validation, relations, indexes
- **Workflow Engine**: Event bus, state machines, triggers for automated operations
- **Middleware Chain**: Security headers → rate limiting → session → auth → audit logging → routes

### 2.2 Critical Issues

- **`@ts-nocheck` enabled** on 4 core files: `server/storage.ts`, `server/db.ts`, `server/routes.ts`, `server/storage/_storage.ts` — roughly 15,000+ lines of server code run with zero type checking
- **Duplicate monolithic files**: `shared/schema.ts` and `shared/schema/_schema.ts` are identical (~10,600 lines each); `server/storage.ts` and `server/storage/_storage.ts` are identical (~11,700 lines each)
- **Commented-out code**: Hundreds of lines in `routes.ts` marked `/* MOVED TO X */` bloat the file and create confusion
- **No state management library**: All shared state uses raw React Context (Auth, FeatureFlags, UndoRedo). No Zustand, Redux, or Jotai.
- **1600-line `App.tsx`**: 200+ route definitions in a single component — should be split into feature-based router modules

---

## 3. Code Quality

### 3.1 Good Patterns

- Strict TypeScript enabled (`tsconfig.json`: `"strict": true`)
- Zod schemas for POST request validation
- Consistent try/catch in every route handler
- Centralized global error handler
- Generic `useCrudMutation` hook with proper invalidation
- Lazy loading with `React.lazy()` + `Suspense`
- Proper HTTP status codes (201 for create, 404 for missing, etc.)

### 3.2 Bad Patterns

| Issue | Location | Impact |
|---|---|---|
| `any` types pervasive | All server files | Defeats TypeScript benefits |
| `console.error` instead of logger | Every server file | `server/logger.ts` exists but is dead code |
| No standard error envelope | All API responses | Inconsistent `{ message }` vs `{ error }` vs raw data |
| No `asyncHandler` wrapper | All route files | ~300 lines of duplicative try/catch boilerplate |
| `sanitizeZodError` duplicated | `routes.ts` + `jobcards.routes.ts` | Maintenance hazard |
| No `useCallback`/`useMemo` | Page components | Unnecessary re-renders |
| `IStorage` prefix | `storage.ts` | Deprecated Hungarian notation |

---

## 4. Security Assessment

### 4.1 Strong Points

- **CSRF**: Constant-time comparison with `timingSafeEqual`
- **Rate Limiting**: API (200/15min) + Auth (10/15min)
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Password Hashing**: bcrypt with 10 salt rounds
- **Session Security**: `httpOnly`, `secure` in prod, `sameSite: "lax"`
- **Audit Redaction**: Sensitive field filtering (passwords, tokens, credit cards)
- **SQL Injection**: Drizzle ORM with parameterized queries throughout
- **WebSocket Auth**: Server-side session validation, not client tokens

### 4.2 Gaps

- **No Zod validation on PUT/PATCH/DELETE**: `jobcards.routes.ts` directly spreads `req.body` into DB update — protected fields (`id`, `createdAt`) could be overwritten
- **Missing authorization checks**: Many mutation endpoints don't verify garage ownership before proceeding
- **Session secret fallback**: `SESSION_SECRET!` non-null assertion without validation
- **Error message leakage**: `err.message` returned in dev mode may expose internals
- **TODO**: Add request body schema validation to all write endpoints

---

## 5. Performance Analysis

### 5.1 Critical Issues

1. **No server-side pagination**: All list endpoints (`getCustomers`, `getVehicles`, `getJobCards`, etc.) return every record. A garage with 10K customers = guaranteed OOM crash.
2. **Search loads all entities**: `/api/search` (routes.ts:771-903) calls storage methods without filters, loading entire tables into memory before filtering
3. **`staleTime: Infinity`**: `queryClient.ts:49` — queries never auto-refetch. Data can be stale indefinitely.
4. **N+1 query patterns**: Multiple sequential DB calls in tracking endpoints where joins suffice
5. **`new Date()` in loops**: Created inside database transaction loops instead of once before

### 5.2 Moderate Issues

- Client-side pagination in `Appointments.tsx` fetches all records then slices
- No Redis for session caching (uses PostgreSQL via `connect-pg-simple`)
- No covering indexes for compound query patterns
- Memory cache lacks TTL-only eviction (only evicts at capacity)

---

## 6. Testing Coverage

### 6.1 What Exists

| Layer | Count | Scope |
|---|---|---|
| Server Integration | 18 files | Auth, CRUD for 8 domains, WebSocket, E2E workflow |
| Shared Utilities | 6 files | VAT, ZATCA, Hijri, workflow engine, compliance |
| E2E (Playwright) | 2 files | Auth, workflow |
| Client | 0 files | **None** |

### 6.2 What's Missing

- Zero React component or hook tests
- No storage layer unit tests
- No API contract tests (request/response shape enforcement)
- No visual regression or snapshot tests
- No coverage threshold enforcement
- Test helpers register users via HTTP endpoint on every run (DB coupling)

---

## 7. Database Schema

### 7.1 Good Practices

- UUID primary keys with `gen_random_uuid()`
- Composite and partial indexes where defined
- Drizzle relations for type-safe joins
- `created_at`/`updated_at` timestamps on every table
- JSONB for flexible/future-proof columns
- Cascade deletes on FK relationships

### 7.2 Issues

- **10,683-line monolithic schema file** — should be split by domain
- **Missing explicit indexes** on frequently filtered foreign key columns
- **Raw SQL for session management** instead of Drizzle ORM
- **No migration versioning** beyond Drizzle Kit's auto-generation

---

## 8. Bugs & Risks (Prioritized)

### Critical

| # | Issue | Location | Risk |
|---|---|---|---|
| 1 | `db.ts` exports `pool`/`db` before top-level awaits resolve | `server/db.ts:44` | All DB imports silently get `undefined` |
| 2 | Search API loads ALL records into memory | `server/routes.ts:771-903` | OOM crash with >5K records |
| 3 | Auto-generated passwords never returned to customer | `server/routes/customers.routes.ts:33-34` | Customers cannot log in |
| 4 | `staleTime: Infinity` | `client/src/lib/queryClient.ts:49` | Users see permanently stale data |
| 5 | PUT/PATCH body spread directly into DB | `server/routes/jobcards.routes.ts:190` | Protected fields can be overwritten |

### Moderate

| # | Issue | Location | Risk |
|---|---|---|---|
| 6 | Race condition in `generateJobNumber` | `server/routes/jobcards.routes.ts:24-28` | Duplicate job numbers |
| 7 | No authorization check on many PATCH endpoints | Multiple route files | Unauthorized updates |
| 8 | Passport serializes full user object | `server/auth.ts:82` | Bloated session cookies |
| 9 | Missing `garageId` ownership verification | `customers.routes.ts:24` | Cross-garage data access |

---

## 9. Recommendations (Priority Order)

### Immediate (Week 1)

1. **Remove `@ts-nocheck` from `db.ts`** (small file, low risk) — fix the module-level await pattern
2. **Add server-side pagination** (`LIMIT/OFFSET`) to all list and search endpoints
3. **Fix `staleTime: Infinity`** — set per-resource type (e.g., 30s for jobs, 5min for reference data)
4. **Delete duplicate files**: `shared/schema/_schema.ts`, `server/storage/_storage.ts`

### Short-Term (Week 2-3)

5. **Create `asyncHandler` wrapper** — eliminate 300+ lines of try/catch boilerplate
6. **Add Zod validation to all PUT/PATCH/DELETE endpoints**
7. **Fix `customers.routes.ts`** — return generated passwords or implement email-based reset flow
8. **Write 5 critical client tests** (auth flow, login form, key page rendering)

### Medium-Term (Week 4-6)

9. **Split `App.tsx`** into feature-based router modules
10. **Split `shared/schema.ts`** by domain (schema/appointments.ts, schema/inventory.ts, etc.)
11. **Implement standard API response envelope**: `{ success, data, error: { code, message, details } }`
12. **Replace `console.error` with `server/logger.ts`** throughout
13. **Add Zustand or Jotai** for state management (replace raw Context)

### Long-Term (Month 2+)

14. **Remove `@ts-nocheck` from `storage.ts`** — fix types incrementally per domain
15. **Remove `@ts-nocheck` from `routes.ts`** — complete the route modularization
16. **Add storage layer unit tests** with mocked database
17. **Auto-generate OpenAPI spec** from Zod schemas
18. **Add performance benchmarks** for critical API endpoints
19. **Implement cursor-based pagination** for high-volume endpoints

---

## 10. Conclusion

SalisAuto GMS is an extraordinarily ambitious project with genuine market potential in the Saudi Arabian garage management space. The feature set is comprehensive, the compliance work is thorough, and the technology choices are modern and sound.

However, the codebase exhibits patterns characteristic of rapid AI-assisted development: massive monolith files with type-checking disabled, significant code duplication, absent pagination, and virtually no client-side testing. These issues are structural but fixable.

The path to production readiness is clear:
- **First**: Fix the pagination and data freshness issues (without these, the app cannot scale)
- **Second**: Remove `@ts-nocheck` and resolve the underlying type errors (without this, refactoring is dangerous)
- **Third**: Add client tests and validation to all endpoints (without these, regressions are invisible)

With disciplined execution on these priorities, this project can deliver on its ambitious vision.

---

*Report generated via deep codebase review — code quality analysis, architecture audit, security assessment, and performance evaluation.*
