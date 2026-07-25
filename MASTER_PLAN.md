# SLIS-GMS — MASTER PLAN
## Complete Roadmap: Testing → Deploy → Refactor → MVP

> ⚠️ **SUPERSEDED (2026-06-11):** Checkboxes and status below are frozen at 2026-03-17 and were never updated as work landed. Live status: [SPEC_COVERAGE.md](SPEC_COVERAGE.md) + [PLATFORM_AUDIT_REPORT.md](PLATFORM_AUDIT_REPORT.md). Current roadmap: the approved production-launch plan (M0–M5).

> **Generated**: 2026-03-17
> **Codebase Audit Results**:
> | Metric | Value |
> |--------|-------|
> | Total frontend pages | **238** (191 root + 47 in subdirs) |
> | API endpoints | **1,198** in a single 22,156-line file |
> | DB tables (schema) | **394** |
> | Test files | **1** (vatUtils.test.ts) |
> | Test framework | Vitest (configured, barely used) |
> | Route architecture | Monolith (`server/routes.ts`) — modular split exists on `pr-branch` |

---

## PHASE 1: TESTING & STABILITY 🧪
**Goal**: Catch breaking bugs before they reach production.
**Timeline**: Sprint 1 (Week 1-2)
**Priority**: 🔴 CRITICAL

### Why First?
- Zero test coverage = zero confidence in every deploy
- Auth hardening was just merged — must verify it works
- 1,198 endpoints with no tests = ticking time bomb

### 1.1 — Test Infrastructure Setup
| Task | Detail |
|------|--------|
| Install `supertest` | For HTTP endpoint testing without running the server |
| Create `server/__tests__/` directory | Server-side test home |
| Create `client/src/__tests__/` directory | Client-side test home |
| Add test scripts to `package.json` | `test`, `test:server`, `test:client`, `test:coverage` |
| Create test DB helper | In-memory or test-specific DB connection for isolated tests |

**Files to create**:
```
server/__tests__/setup.ts          — DB connection, app bootstrap for tests
server/__tests__/helpers.ts        — Login helper, seed data, cleanup
client/src/test/setup.ts           — Already exists, verify it works
```

### 1.2 — Auth Tests (CRITICAL)
| Test | What it verifies |
|------|-----------------|
| `POST /api/register` | Creates user, hashes password, returns session |
| `POST /api/login` | Valid creds → session cookie; invalid → 401 |
| `POST /api/logout` | Destroys session, clears cookie |
| `GET /api/user` (no session) | Returns 401, not 500 |
| `GET /api/user` (with session) | Returns user object |
| Session expiry | Session TTL respected (7-day max) |
| Password hashing | bcrypt rounds = 10, no plaintext storage |
| CSRF protection | Cross-origin requests blocked |

**Files to create**:
```
server/__tests__/auth.test.ts
```

### 1.3 — Core API CRUD Tests
Test the **15 most critical** endpoint groups:

| Domain | Endpoints to test | Priority |
|--------|------------------|----------|
| **Job Cards** | GET list, GET by ID, POST create, PATCH update, DELETE | 🔴 |
| **Customers** | GET list, GET by ID, POST create, PATCH update | 🔴 |
| **Vehicles** | GET list, GET by ID, POST create, PATCH update | 🔴 |
| **Invoices** | GET list, POST create, PATCH status update | 🔴 |
| **Inventory** | GET list, POST add part, PATCH quantity | 🔴 |
| **Estimates** | GET list, POST create, PATCH approve | 🟡 |
| **Payments** | GET list, POST record payment | 🟡 |
| **Appointments** | GET list, POST create, PATCH reschedule | 🟡 |
| **Technicians** | GET list, GET performance | 🟡 |
| **Fleet** | GET list, GET vehicle status | 🟡 |
| **Reports** | GET dashboard stats, GET revenue | 🟡 |
| **Settings** | GET config, PATCH update | 🟢 |

**Files to create**:
```
server/__tests__/job-cards.test.ts
server/__tests__/customers.test.ts
server/__tests__/vehicles.test.ts
server/__tests__/invoices.test.ts
server/__tests__/inventory.test.ts
server/__tests__/estimates.test.ts
server/__tests__/payments.test.ts
server/__tests__/appointments.test.ts
server/__tests__/technicians.test.ts
server/__tests__/fleet.test.ts
server/__tests__/reports.test.ts
server/__tests__/settings.test.ts
```

### 1.4 — E2E Workflow Test
The **golden path** — the most important business flow:

```
1. Register garage admin        → POST /api/register
2. Create customer              → POST /api/customers
3. Create vehicle for customer  → POST /api/vehicles
4. Create job card              → POST /api/job-cards
5. Assign technician            → PATCH /api/job-cards/:id/assign
6. Update job status            → PATCH /api/job-cards/:id/status
7. Generate invoice             → POST /api/invoices
8. Record payment               → POST /api/payments
9. Close job card               → PATCH /api/job-cards/:id/close
10. Verify dashboard stats      → GET /api/dashboard/stats
```

**Files to create**:
```
server/__tests__/e2e-workflow.test.ts
```

### 1.5 — WebSocket Auth Test
| Test | What it verifies |
|------|-----------------|
| Connect with valid session | WebSocket upgrades successfully |
| Connect without session | Connection rejected with 401 |
| Connect with expired session | Connection rejected |
| Message broadcast | Connected clients receive real-time updates |

**Files to create**:
```
server/__tests__/websocket.test.ts
```

### 1.6 — Success Criteria
- [ ] `npm run test` passes with **0 failures**
- [ ] Auth tests: **8/8 passing**
- [ ] Core CRUD tests: **60+ assertions passing**
- [ ] E2E workflow: **10-step golden path passing**
- [ ] Coverage: **>40% on server/routes.ts** (the critical code)

---

## PHASE 2: DEPLOY & GO LIVE 🚀
**Goal**: Production-ready deployment with confidence.
**Timeline**: Sprint 2 (Week 2-3)
**Priority**: 🔴 CRITICAL
**Depends on**: Phase 1 (tests passing)

### 2.1 — Environment Configuration
| Task | Detail |
|------|--------|
| Create `.env.example` | Document ALL required env vars |
| Validate env on startup | Fail fast if vars missing |
| Separate dev/staging/prod configs | `NODE_ENV` drives behavior |

**Required environment variables**:
```env
# Database
DATABASE_URL=postgresql://...

# Auth
SESSION_SECRET=<random-64-chars>

# App
NODE_ENV=production
PORT=5000

# Optional
STRIPE_SECRET_KEY=
OPENAI_API_KEY=
GOOGLE_MAPS_API_KEY=
```

**Files to create/update**:
```
.env.example
server/config.ts              — Centralized env validation
```

### 2.2 — Database Schema Push & Validation
| Task | Detail |
|------|--------|
| Run `npm run db:push` on staging | Push 394 tables to Neon |
| Verify all tables created | `SELECT count(*) FROM information_schema.tables` |
| Seed essential data | Default roles, feature flags, admin user |
| Test rollback strategy | Can we revert schema changes? |

**Files to create**:
```
server/seed.ts                — Seed script for essential data
scripts/verify-db.ts          — Verify all tables exist
```

**Seed data needed**:
```
- Roles: admin, manager, technician, receptionist, customer
- Default garage record
- Admin user (email: admin@slis.sa)
- Feature flags (all core features ON, experimental OFF)
- SaaS plan tiers
```

### 2.3 — Build Verification
| Task | Detail |
|------|--------|
| `npm run check` (TypeScript) | Zero type errors |
| `npm run build` (Vite + esbuild) | Clean build, no warnings |
| `npm run start` (production mode) | Server starts, serves client |
| Bundle size check | Main bundle < 2MB |
| Lighthouse audit | Performance > 60, Accessibility > 80 |

### 2.4 — Smoke Test: Core 15 Pages
Manual + automated verification that these pages **load and function**:

| # | Page | Route | Must Work |
|---|------|-------|-----------|
| 1 | Login | `/login` | Auth flow |
| 2 | Register | `/register` | New garage signup |
| 3 | Dashboard | `/dashboard` | Stats load from API |
| 4 | Job Cards | `/job-cards` | List, create, edit |
| 5 | Customers | `/customers` | List, create, edit |
| 6 | Vehicles | `/vehicles` | List, create, edit |
| 7 | Invoices | `/invoices` | List, create |
| 8 | Estimates | `/estimates` | List, create |
| 9 | Appointments | `/appointments` | Calendar view |
| 10 | Inventory | `/inventory` | Parts list, stock |
| 11 | Technicians | `/technicians` | List, assign |
| 12 | Payments | `/payments` | Record, history |
| 13 | Reports | `/reports` | Charts render |
| 14 | Fleet | `/fleet` | Vehicle tracking |
| 15 | Settings | `/settings` | Config updates |

### 2.5 — Deployment Checklist
- [ ] `.env` configured for production
- [ ] `DATABASE_URL` points to production Neon DB
- [ ] `SESSION_SECRET` is unique, random, 64+ chars
- [ ] `npm run build` succeeds
- [ ] `npm run start` serves app on correct port
- [ ] HTTPS enabled (via Replit/hosting provider)
- [ ] Session cookie `secure: true` in production
- [ ] CORS configured for production domain
- [ ] Error pages render (404, 500)
- [ ] Logging configured (no sensitive data in logs)

---

## PHASE 3: ROUTE REFACTORING 🏗️
**Goal**: Break the 22,156-line monolith into maintainable domain modules.
**Timeline**: Sprint 3 (Week 3-4)
**Priority**: 🟡 HIGH
**Depends on**: Phase 1 (tests act as safety net for refactoring)

### 3.1 — Current State
```
server/routes.ts          — 22,156 lines, 1,198 endpoints (MONOLITH)
server/routes/index.ts    — 71 lines (hybrid router, delegates to monolith)
server/routes/auth.ts     — Auth routes (already extracted)
server/routes/public.ts   — Public routes (already extracted)
```

### 3.2 — Target State (from pr-branch)
The `pr-branch` already has modular route files. Apply them to `main`:

```
server/routes/
├── index.ts               — Master router (wires all modules)
├── auth.ts                — Auth (login, register, logout, session)
├── public.ts              — Public API (no auth required)
├── customers.routes.ts    — 15 endpoints
├── vehicles.routes.ts     — 10 endpoints
├── jobcards.routes.ts     — 17 endpoints
├── invoices.routes.ts     — 8 endpoints
├── inventory.routes.ts    — Parts, stock, reorder
├── fleet.routes.ts        — 37 endpoints
├── technicians.routes.ts  — Performance, assignment
├── scheduling.routes.ts   — Appointments, calendar
├── reports.routes.ts      — Dashboard, analytics
├── settings.routes.ts     — Config, feature flags
├── misc.routes.ts         — Catch-all for uncategorized
├── financial.ts           — Accounting, payments, invoicing
├── ai-insights.ts         — AI/ML endpoints
├── iot.ts                 — IoT dashboard
├── franchise.ts           — Multi-garage/franchise
├── customer-portal.ts     — Customer-facing API
├── technician-mobile.ts   — Technician app API
├── workflow.ts            — Workflow engine
├── command-center.ts      — Command center
├── health.ts              — Health check endpoint
└── docs.ts                — API documentation
```

### 3.3 — Migration Strategy
**Approach**: Extract-and-delegate (zero downtime)

```
Step 1: Copy route module files from pr-branch to main
Step 2: In index.ts, import new modules alongside legacy routes
Step 3: For each domain, move endpoints from routes.ts → domain.routes.ts
Step 4: Run tests after each domain extraction (Phase 1 safety net!)
Step 5: Once routes.ts is empty, delete it
```

### 3.4 — Endpoint Distribution Plan
Based on the audit, here's how the 1,198 endpoints distribute:

| Module | Endpoint Count | From routes.ts |
|--------|---------------|----------------|
| `hr.routes.ts` | 77 | `/api/hr/*` |
| `nextgen.routes.ts` | 61 | `/api/nextgen/*` |
| `fleet.routes.ts` | 37 | `/api/fleet/*` |
| `ai-insights.ts` | 26 | `/api/ai/*` |
| `call-center.routes.ts` | 25 | `/api/call-center/*` |
| `security.routes.ts` | 21 | `/api/security/*` |
| `notifications.routes.ts` | 21 | `/api/notifications/*` |
| `mobile.routes.ts` | 18 | `/api/mobile/*` |
| `jobcards.routes.ts` | 17 | `/api/job-cards/*` |
| `chat.routes.ts` | 17 | `/api/chat/*` |
| `integrations.routes.ts` | 16 | `/api/integrations/*` |
| `pricing.routes.ts` | 16 | `/api/dynamic-pricing/*` |
| `analytics.routes.ts` | 16 | `/api/analytics/*` |
| `customers.routes.ts` | 15 | `/api/customers/*` |
| `emerging-tech.routes.ts` | 15 | `/api/emerging-tech/*` |
| Others (< 15 each) | ~750 | Various `/api/*` paths |

### 3.5 — Auth Middleware per Module
```typescript
// Each route module gets its own auth guard:
import { requireAuth, requireRole } from "../middleware/auth";

router.use(requireAuth);                    // All routes need login
router.use("/admin/*", requireRole("admin")); // Admin-only routes
```

### 3.6 — Success Criteria
- [ ] `server/routes.ts` deleted or < 100 lines (legacy shim only)
- [ ] All 1,198 endpoints exist in domain modules
- [ ] Each module < 500 lines (split further if needed)
- [ ] All Phase 1 tests still pass
- [ ] No endpoint regressions (same URLs, same responses)

---

## PHASE 4: MVP FOCUS 🎯
**Goal**: Ship a polished product with 15 core pages, not 238 half-finished ones.
**Timeline**: Sprint 4 (Week 4-5)
**Priority**: 🟡 HIGH
**Depends on**: Phase 2 (deployment working), Phase 3 (clean routes)

### 4.1 — Core MVP Pages (15 pages)
These are the pages that **must work perfectly** for launch:

| Tier | Page | Why Essential |
|------|------|--------------|
| 🔴 T1 | **Dashboard** | First thing users see, shows KPIs |
| 🔴 T1 | **Job Cards** | Core business — create/manage repair orders |
| 🔴 T1 | **Customers** | Customer database — every job needs a customer |
| 🔴 T1 | **Vehicles** | Vehicle registry — every job needs a vehicle |
| 🔴 T1 | **Invoices** | Revenue — billing customers for work done |
| 🔴 T1 | **Login / Register** | Access control — garage onboarding |
| 🟡 T2 | **Estimates** | Pre-job quotes for customers |
| 🟡 T2 | **Appointments** | Scheduling incoming work |
| 🟡 T2 | **Inventory** | Parts tracking for repairs |
| 🟡 T2 | **Technicians** | Staff management and assignment |
| 🟡 T2 | **Payments** | Payment recording and tracking |
| 🟡 T2 | **Reports** | Business analytics |
| 🟢 T3 | **Fleet Management** | Multi-vehicle corporate clients |
| 🟢 T3 | **Settings** | System configuration |
| 🟢 T3 | **Profile** | User profile management |

### 4.2 — Page Audit & Fix Checklist
For each of the 15 core pages, verify:

```
[ ] Page loads without errors
[ ] API calls succeed (no 404s, 500s)
[ ] Data displays correctly (tables, charts, cards)
[ ] CRUD operations work (create, read, update, delete)
[ ] Form validation works (required fields, formats)
[ ] Error states handled (empty data, API failure, timeout)
[ ] Loading states shown (spinners, skeletons)
[ ] Mobile responsive (usable on tablet at minimum)
[ ] Arabic/RTL support (Saudi market requirement)
[ ] Proper permissions (admin vs technician vs customer views)
```

### 4.3 — Non-MVP Page Strategy
**223 non-core pages** need to be handled:

| Strategy | Pages | Action |
|----------|-------|--------|
| **Feature-flagged** | AI, IoT, Blockchain, VR, AR, Drone, etc. | Hide behind `featureFlags` table |
| **Coming Soon** | Advanced analytics, franchise, marketplace | Show "Coming Soon" placeholder |
| **Remove from nav** | Duplicate/redundant pages | Remove nav links, keep routes |
| **Consolidate** | Overlapping pages (e.g., 2x Reports, 2x Tasks) | Merge into one |

**Identified duplicates/overlaps to consolidate**:
```
Reports.tsx + Reports.tsx.backup        → Merge into Reports.tsx
TaskManagement.tsx + TasksManagement.tsx → Merge into TaskManagement.tsx
SmartPartsRecommendations.tsx + SmartPartsRecommender.tsx → Merge
VoiceCommandInterface.tsx + VoiceCommands.tsx → Merge
```

### 4.4 — Navigation Cleanup
Update `client/src/config/navigation.ts` to show **only core pages** in sidebar:

```
📊 Dashboard
📋 Job Cards
👥 Customers
🚗 Vehicles
📄 Invoices
💰 Estimates
📅 Appointments
📦 Inventory
👨‍🔧 Technicians
💳 Payments
📈 Reports
🚚 Fleet
⚙️ Settings
```

All other pages remain accessible via direct URL but **hidden from navigation**.

### 4.5 — Feature Flag System
Use the existing `featureFlags` DB table:

```typescript
// Feature flag check in navigation
const { data: flags } = useQuery({ queryKey: ["/api/feature-flags"] });

// Only show nav items for enabled features
{flags?.ai_enabled && <NavItem to="/ai-automation" label="AI Automation" />}
{flags?.iot_enabled && <NavItem to="/iot-dashboard" label="IoT Dashboard" />}
```

### 4.6 — Success Criteria
- [ ] 15 core pages load and function correctly
- [ ] Navigation shows only core pages
- [ ] Non-MVP pages hidden behind feature flags
- [ ] Zero console errors on core pages
- [ ] Duplicate pages consolidated
- [ ] Mobile-responsive on core pages

---

## EXECUTION ORDER & DEPENDENCIES

```
PHASE 1 (Testing)     ━━━━━━━━━━━━━━━━━━━━━━━━
                       ↓
PHASE 2 (Deploy)       ░░░░░━━━━━━━━━━━━━━━━━━━
                              ↓
PHASE 3 (Refactor)     ░░░░░░░░░░━━━━━━━━━━━━━━
                                   ↓
PHASE 4 (MVP Focus)    ░░░░░░░░░░░░░░░━━━━━━━━━
                                        ↓
                                    🚀 LAUNCH
```

**Phase 1** → Must come first (safety net for everything else)
**Phase 2** → Can start once auth tests pass
**Phase 3** → Needs Phase 1 tests as safety net for refactoring
**Phase 4** → Can run in parallel with Phase 3

---

## RISK REGISTER

| Risk | Impact | Mitigation |
|------|--------|-----------|
| 394 schema tables fail to push | 🔴 Blocks deploy | Run `db:push` on staging first, verify incrementally |
| Route refactoring breaks endpoints | 🔴 Production outage | Phase 1 tests catch regressions immediately |
| 238 pages overwhelm QA | 🟡 Delayed launch | Focus only on 15 MVP pages, flag the rest |
| PAT token lacks permissions | 🟡 Can't create PRs via CLI | Update token with `repo` scope |
| Session store table missing | 🔴 Auth completely broken | Verify `sessions` table exists in DB push |
| No CI/CD pipeline | 🟡 Manual deploys risky | Add GitHub Actions workflow in Phase 2 |

---

## ESTIMATED EFFORT

| Phase | Tasks | Estimated Time |
|-------|-------|---------------|
| Phase 1 | Test infra + 14 test files | 2-3 days |
| Phase 2 | Env + DB + build + smoke | 1-2 days |
| Phase 3 | Extract 1,198 endpoints | 3-4 days |
| Phase 4 | Audit 15 pages + nav + flags | 2-3 days |
| **Total** | | **8-12 days** |

---

## READY TO EXECUTE?
Say **"GO"** and I'll start with **Phase 1, Task 1.1: Test Infrastructure Setup**.
