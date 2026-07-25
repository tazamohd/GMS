# SLIS-GMS — EXECUTION PLAN
> Last updated: 2026-03-17

> ⚠️ **SUPERSEDED (2026-06-11):** All 28 task checkboxes below are frozen at 2026-03-17; much of the work has since landed without being checked off. Live status: [SPEC_COVERAGE.md](SPEC_COVERAGE.md) + [PLATFORM_AUDIT_REPORT.md](PLATFORM_AUDIT_REPORT.md). Current roadmap: the approved production-launch plan (M0–M5).

---

## THE PROBLEM

| Issue | Number | Risk |
|-------|--------|------|
| Test files | **1 out of 1,198 endpoints** | 🔴 Any deploy can break production |
| Routes monolith | **22,156 lines** in 1 file | 🔴 Unmaintainable, merge conflicts |
| Frontend pages | **238 pages**, most unpolished | 🟡 Users confused, nothing feels "done" |
| Deployment | No staging, no env validation | 🔴 No safe way to verify before go-live |

---

## THE SOLUTION — 4 PHASES, 28 TASKS

---

## PHASE 1 — TESTING 🧪
> **When**: Week 1 · **Why**: Safety net before touching anything else

| # | Task | What Exactly | Files to Create/Edit | Done? |
|---|------|-------------|---------------------|-------|
| 1.1 | Install test deps | `npm i -D supertest @types/supertest` | `package.json` | ☐ |
| 1.2 | Server test setup | Bootstrap Express app + test DB helper | `server/__tests__/setup.ts` | ☐ |
| 1.3 | Test helpers | Login helper, seed data, cleanup between tests | `server/__tests__/helpers.ts` | ☐ |
| 1.4 | Auth tests | Register, login, logout, session check, bad creds → 401 | `server/__tests__/auth.test.ts` | ☐ |
| 1.5 | Job Cards tests | List, create, update, assign tech, change status | `server/__tests__/job-cards.test.ts` | ☐ |
| 1.6 | Customers tests | List, create, update, search | `server/__tests__/customers.test.ts` | ☐ |
| 1.7 | Vehicles tests | List, create, update, link to customer | `server/__tests__/vehicles.test.ts` | ☐ |
| 1.8 | Invoices tests | List, create, update status | `server/__tests__/invoices.test.ts` | ☐ |
| 1.9 | Inventory tests | List parts, add, update quantity | `server/__tests__/inventory.test.ts` | ☐ |
| 1.10 | Golden path E2E | Register → Customer → Vehicle → Job → Invoice → Payment → Close | `server/__tests__/e2e-workflow.test.ts` | ☐ |
| 1.11 | Add npm scripts | `test`, `test:server`, `test:coverage` | `package.json` | ☐ |

**Exit criteria**: `npm run test` → all green, >40% coverage on core routes

---

## PHASE 2 — DEPLOY 🚀
> **When**: Week 2 · **Needs**: Phase 1.4 done (auth tests passing)

| # | Task | What Exactly | Files to Create/Edit | Done? |
|---|------|-------------|---------------------|-------|
| 2.1 | Env template | Document every required env var | `.env.example` | ☐ |
| 2.2 | Env validation | Fail fast on startup if vars missing | `server/config.ts` | ☐ |
| 2.3 | DB schema push | Run `npm run db:push`, verify all 394 tables | `shared/schema.ts` (audit) | ☐ |
| 2.4 | Seed script | Admin user, default roles, feature flags, demo garage | `server/seed.ts` | ☐ |
| 2.5 | Build check | `npm run check` (0 TS errors) + `npm run build` (clean) | — | ☐ |
| 2.6 | Production start | `npm run start` serves app correctly | — | ☐ |
| 2.7 | Smoke test 15 pages | Manually verify each core page loads + works | Checklist below | ☐ |

**Smoke test checklist**:
```
☐ /login         — Can log in
☐ /register      — Can create account
☐ /dashboard     — Stats load
☐ /job-cards     — List + create works
☐ /customers     — List + create works
☐ /vehicles      — List + create works
☐ /invoices      — List + create works
☐ /estimates     — List + create works
☐ /appointments  — Calendar renders
☐ /inventory     — Parts list loads
☐ /technicians   — List loads
☐ /payments      — List loads
☐ /reports       — Charts render
☐ /fleet         — Fleet view works
☐ /settings      — Config loads
```

**Exit criteria**: App runs in production mode, all 15 pages functional

---

## PHASE 3 — ROUTE REFACTORING 🏗️
> **When**: Week 3 · **Needs**: Phase 1 tests as safety net

| # | Task | What Exactly | Files to Create/Edit | Done? |
|---|------|-------------|---------------------|-------|
| 3.1 | Cherry-pick modules | Copy route modules from `pr-branch` → `main` | `server/routes/*.routes.ts` | ☐ |
| 3.2 | Extract job-cards | Move 17 endpoints from monolith → module | `server/routes/jobcards.routes.ts` | ☐ |
| 3.3 | Extract customers | Move 15 endpoints | `server/routes/customers.routes.ts` | ☐ |
| 3.4 | Extract vehicles | Move 10 endpoints | `server/routes/vehicles.routes.ts` | ☐ |
| 3.5 | Extract fleet | Move 37 endpoints | `server/routes/fleet.routes.ts` | ☐ |
| 3.6 | Extract invoices + payments | Move financial endpoints | `server/routes/financial.routes.ts` | ☐ |
| 3.7 | Extract remaining domains | HR, AI, IoT, chat, notifications, etc. | `server/routes/*.routes.ts` | ☐ |
| 3.8 | Wire master router | Import all modules in `routes/index.ts` | `server/routes/index.ts` | ☐ |
| 3.9 | Run all tests | Confirm zero regressions | — | ☐ |
| 3.10 | Delete monolith | Remove `server/routes.ts` (22K lines) | `server/routes.ts` → deleted | ☐ |

**Method**: Extract one domain at a time → run tests → repeat. Never break the app.

**Exit criteria**: `server/routes.ts` deleted, all tests pass, all endpoints respond same as before

---

## PHASE 4 — MVP FOCUS 🎯
> **When**: Week 4 · **Can overlap with**: Phase 3

### 4A — The 15 Core Pages

| # | Page | Lines | API Calls | What to Fix |
|---|------|-------|-----------|-------------|
| 1 | **Dashboard** | 615 | 8 | Verify all stats are real data |
| 2 | **Job Cards** | 695 | 9 | Full CRUD, status workflow |
| 3 | **Customers** | 876 | 18 | Search, create, edit |
| 4 | **Vehicles** | 989 | 8 | Link to customers |
| 5 | **Invoices** | 186 | 4 | ⚠️ Thin — needs create/edit flow |
| 6 | **Estimates** | 151 | 4 | ⚠️ Thin — needs create/edit flow |
| 7 | **Appointments** | 424 | 3 | Calendar + scheduling |
| 8 | **Inventory** | 560 | 7 | Stock levels, alerts |
| 9 | **Technicians** | 544 | 8 | Assignment, performance |
| 10 | **Payments** | 464 | 5 | Record + history |
| 11 | **Reports** | 940 | 8 | Charts + export |
| 12 | **Fleet** | 825 | 17 | Vehicle tracking |
| 13 | **Settings** | 491 | 3 | Config management |
| 14 | **Login** | 177 | 3 | Auth flow |
| 15 | **Register** | 203 | 3 | Onboarding flow |

### 4B — Execution Tasks

| # | Task | What Exactly | Done? |
|---|------|-------------|-------|
| 4.1 | Audit each core page | Check: loads, API works, CRUD works, errors handled | ☐ |
| 4.2 | Fix Invoices page | Too thin (186 lines) — add full create/edit | ☐ |
| 4.3 | Fix Estimates page | Too thin (151 lines) — add full create/edit | ☐ |
| 4.4 | Cleanup navigation | Show only 15 core pages in sidebar | ☐ |
| 4.5 | Feature flag non-MVP | Hide 223 pages behind feature flags | ☐ |
| 4.6 | Merge duplicates | Reports×2, Tasks×2, SmartParts×2, Voice×2 | ☐ |
| 4.7 | Error & loading states | Add spinners, empty states, error boundaries | ☐ |

**Exit criteria**: 15 pages polished, sidebar clean, non-MVP pages hidden

---

## EXECUTION ORDER

```
Week 1  ████████████████████████████████  Phase 1: Testing
Week 2  ░░░░░░░░████████████████████████  Phase 2: Deploy
Week 3  ░░░░░░░░░░░░░░░░████████████████  Phase 3: Refactor
Week 4  ░░░░░░░░░░░░░░░░████████████████  Phase 4: MVP Focus
Week 5  ░░░░░░░░░░░░░░░░░░░░░░░░████████  Buffer + Launch 🚀
```

**Rule**: Each phase's exit criteria must pass before starting the next.
**Exception**: Phase 4 can overlap with Phase 3 (different files).

---

## DEPENDENCIES MAP

```
1.1 Install test deps
 └─→ 1.2 Server test setup
      └─→ 1.3 Test helpers
           ├─→ 1.4 Auth tests ─────────────→ 2.1 Env template
           ├─→ 1.5 Job Cards tests          2.2 Env validation
           ├─→ 1.6 Customers tests           └─→ 2.3 DB push
           ├─→ 1.7 Vehicles tests                 └─→ 2.4 Seed
           ├─→ 1.8 Invoices tests                      └─→ 2.5 Build
           ├─→ 1.9 Inventory tests                          └─→ 2.6 Start
           └─→ 1.10 E2E workflow                                 └─→ 2.7 Smoke
                     │
                     └─→ 3.1 Cherry-pick modules
                          └─→ 3.2-3.7 Extract domains (one at a time)
                               └─→ 3.8 Wire router
                                    └─→ 3.9 Run tests
                                         └─→ 3.10 Delete monolith
                                              │
                                              └─→ 4.1-4.7 MVP polish
                                                          └─→ 🚀 LAUNCH
```

---

## QUICK REFERENCE — NUMBERS

| What | Before | After |
|------|--------|-------|
| Test files | 1 | ~15 |
| Test coverage | ~0% | >40% |
| `routes.ts` size | 22,156 lines | **DELETED** |
| Route modules | 1 monolith | ~15 clean files |
| Nav items visible | 238 pages | 15 core pages |
| Duplicate pages | 4 pairs | 0 |
| Env validation | None | Fail-fast on boot |

---

## START HERE → TASK 1.1

Run this to begin:
```bash
npm install -D supertest @types/supertest
```

Then create `server/__tests__/setup.ts` and we're rolling.
