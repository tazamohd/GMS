# SLIS-GMS — DETAILED TASK BREAKDOWN
> 28 tasks · 4 phases · Every step spelled out

> ⚠️ **SUPERSEDED (2026-06-11):** Frozen at 2026-03-17. Live status: [SPEC_COVERAGE.md](SPEC_COVERAGE.md) + [PLATFORM_AUDIT_REPORT.md](PLATFORM_AUDIT_REPORT.md). Current roadmap: the approved production-launch plan (M0–M5).

---

# ═══════════════════════════════════════════
# PHASE 1 — TESTING 🧪
# ═══════════════════════════════════════════

---

## TASK 1.1 — Install Test Dependencies

**Goal**: Add the packages needed to test server endpoints

**What to do**:
1. Run: `npm install -D supertest @types/supertest`
2. Add these scripts to `package.json`:
   ```json
   "test": "vitest run",
   "test:watch": "vitest",
   "test:server": "vitest run server",
   "test:coverage": "vitest run --coverage"
   ```

**Already installed**: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
**Need to install**: `supertest` (for HTTP testing without a running server)

**Verify**: Run `npx vitest run` — existing `vatUtils.test.ts` should pass

**Depends on**: Nothing
**Time**: 5 minutes

---

## TASK 1.2 — Server Test Setup

**Goal**: Create a reusable test app bootstrap so every test file doesn't repeat setup

**What to do**:
Create `server/__tests__/setup.ts`:
```typescript
// What this file does:
// 1. Creates an Express app instance (same as production)
// 2. Registers all routes on it
// 3. Exports it for supertest to use
// 4. Does NOT start listening on a port (supertest handles that)

import express from "express";
import { registerRoutes } from "../routes";  // the monolith
import { setupAuth } from "../auth";

export async function createTestApp() {
  const app = express();
  app.use(express.json());
  setupAuth(app);            // passport + sessions
  await registerRoutes(app); // all 1,198 endpoints
  return app;
}
```

**Key decisions**:
- Use real DB or mock? → **Real test DB** (Neon branch or local Postgres)
- Sessions? → Yes, supertest agent maintains cookies across requests

**Verify**: Import and call `createTestApp()` — no crashes

**Depends on**: Task 1.1
**Time**: 30 minutes

---

## TASK 1.3 — Test Helpers

**Goal**: Reusable login, seed data, and cleanup functions

**What to do**:
Create `server/__tests__/helpers.ts`:
```typescript
// What this file provides:
// 1. loginAsAdmin(agent)  — registers + logs in, returns session cookie
// 2. loginAsUser(agent)   — registers a regular user
// 3. seedCustomer(agent)  — creates a test customer, returns ID
// 4. seedVehicle(agent, customerId) — creates test vehicle
// 5. seedJobCard(agent, vehicleId)  — creates test job card
// 6. cleanup()            — deletes test data after each test
```

**Test user data**:
```
Admin:  admin-test@slis.sa  / TestPass123!
User:   user-test@slis.sa   / TestPass123!
```

**Test customer data**:
```
Name: Test Customer
Phone: +966500000000
Email: test@customer.sa
```

**Verify**: Each helper returns expected data when called

**Depends on**: Task 1.2
**Time**: 45 minutes

---

## TASK 1.4 — Auth Tests

**Goal**: Verify login, register, logout, and session handling work correctly

**What to do**:
Create `server/__tests__/auth.test.ts` with these exact tests:

```
TEST 1: POST /api/register with valid data → 201 + user object
TEST 2: POST /api/register with duplicate email → 400/409 error
TEST 3: POST /api/register with missing fields → 400 error
TEST 4: POST /api/login with valid creds → 200 + user object + session cookie
TEST 5: POST /api/login with wrong password → 401
TEST 6: POST /api/login with nonexistent user → 401
TEST 7: GET /api/auth/user without session → 401
TEST 8: GET /api/auth/user with valid session → 200 + user object
TEST 9: POST /api/logout → 200 + session destroyed
TEST 10: GET /api/auth/user after logout → 401
```

**Endpoints being tested**:
```
POST /api/register         (server/routes.ts line ~near top)
POST /api/login            (server/routes.ts)
POST /api/logout           (server/routes.ts)
GET  /api/auth/user        (server/routes.ts)
POST /api/auth/login       (server/routes/auth.ts — duplicate!)
POST /api/auth/logout      (server/routes/auth.ts — duplicate!)
GET  /api/auth/user        (server/routes/auth.ts — duplicate!)
```

**⚠️ Issue found**: Auth routes exist in BOTH `server/routes.ts` AND `server/routes/auth.ts`. Tests will reveal which ones actually work.

**Verify**: All 10 tests green

**Depends on**: Task 1.3
**Time**: 1 hour

---

## TASK 1.5 — Job Cards Tests

**Goal**: Test the core business object — job card CRUD and workflow

**What to do**:
Create `server/__tests__/job-cards.test.ts` with these tests:

```
SETUP: Login as admin, create test customer + vehicle

TEST 1:  GET /api/job-cards → 200 + array (can be empty)
TEST 2:  POST /api/job-cards → 201 + new job card with ID
         Body: { customerId, vehicleId, description, priority }
TEST 3:  GET /api/job-cards/:id → 200 + job card details
TEST 4:  PATCH /api/job-cards/:id → 200 + updated fields
         Body: { status: "in_progress" }
TEST 5:  GET /api/job-cards/:id/details → 200 + full details
TEST 6:  POST /api/job-cards/:jobCardId/parts → 201 + part linked
TEST 7:  GET /api/job-cards/:jobCardId/parts → 200 + array of parts
TEST 8:  POST /api/job-cards/:jobCardId/tasks → 201 + task assigned
TEST 9:  GET /api/job-cards/:jobCardId/tasks → 200 + array of tasks
TEST 10: DELETE /api/job-cards/:jobCardId/parts/:partId → 200

TEARDOWN: Delete test job card, vehicle, customer
```

**Endpoints being tested** (from routes.ts):
```
GET    /api/job-cards
GET    /api/job-cards/:id
GET    /api/job-cards/:id/details
POST   /api/job-cards
PUT    /api/job-cards/:id
PATCH  /api/job-cards/:id
GET    /api/job-cards/:jobCardId/parts
POST   /api/job-cards/:jobCardId/parts
DELETE /api/job-cards/:jobCardId/parts/:partId
GET    /api/job-cards/:jobCardId/tasks
POST   /api/job-cards/:jobCardId/tasks
```

**Verify**: All 10 tests green

**Depends on**: Task 1.3
**Time**: 1.5 hours

---

## TASK 1.6 — Customers Tests

**Goal**: Test customer CRUD, search, and related data

**What to do**:
Create `server/__tests__/customers.test.ts`:

```
SETUP: Login as admin

TEST 1: GET /api/customers → 200 + array
TEST 2: POST /api/customers → 201 + customer with ID
        Body: { name, email, phone, address }
TEST 3: GET /api/customers/:id → 200 + customer details
TEST 4: GET /api/customers/:id/vehicles → 200 + array
TEST 5: GET /api/customers/:id/job-cards → 200 + array
TEST 6: GET /api/customers/:id/invoices → 200 + array
TEST 7: GET /api/customers/:id/payments → 200 + array
TEST 8: POST /api/customers/:id/notes → 201 + note added
TEST 9: GET /api/customers/:id/notes → 200 + array of notes
TEST 10: DELETE /api/customer-notes/:noteId → 200

TEARDOWN: Delete test customer
```

**Verify**: All 10 tests green

**Depends on**: Task 1.3
**Time**: 1 hour

---

## TASK 1.7 — Vehicles Tests

**Goal**: Test vehicle CRUD and service history

**What to do**:
Create `server/__tests__/vehicles.test.ts`:

```
SETUP: Login as admin, create test customer

TEST 1: GET /api/vehicles → 200 + array
TEST 2: POST /api/vehicles → 201 + vehicle with ID
        Body: { customerId, make, model, year, vin, plateNumber }
TEST 3: PATCH /api/vehicles/:id → 200 + updated
TEST 4: GET /api/vehicles/:id/service-history → 200 + array
TEST 5: POST /api/vehicles/:id/service-history → 201 + entry added
TEST 6: GET /api/vehicles/:id/maintenance-schedules → 200 + array
TEST 7: POST /api/vehicles/:id/maintenance-schedules → 201
TEST 8: GET /api/catalogs/vehicle-makes → 200 + array
TEST 9: GET /api/catalogs/vehicle-models → 200 + array
TEST 10: DELETE /api/vehicles/:id → 200

TEARDOWN: Delete test customer
```

**Verify**: All 10 tests green

**Depends on**: Task 1.3
**Time**: 1 hour

---

## TASK 1.8 — Invoices Tests

**Goal**: Test invoice creation, line items, and conversions

**What to do**:
Create `server/__tests__/invoices.test.ts`:

```
SETUP: Login as admin, create customer + vehicle + job card

TEST 1: GET /api/invoices → 200 + array
TEST 2: POST /api/invoices → 201 + invoice with ID
        Body: { customerId, jobCardId, items: [...] }
TEST 3: GET /api/invoices/:id → 200 + invoice details
TEST 4: GET /api/invoices/:id/items → 200 + line items
TEST 5: POST /api/invoices/with-items → 201 (create with items in one call)
TEST 6: POST /api/invoices/from-job/:jobId → 201 (auto-generate from job)
TEST 7: PATCH /api/invoices/:id → 200 (update status: draft → sent → paid)
TEST 8: DELETE /api/invoices/:id → 200 (admin only)

TEARDOWN: Delete test data
```

**Verify**: All 8 tests green

**Depends on**: Task 1.3
**Time**: 1 hour

---

## TASK 1.9 — Inventory Tests

**Goal**: Test spare parts and stock management

**What to do**:
Create `server/__tests__/inventory.test.ts`:

```
SETUP: Login as admin

TEST 1: GET /api/spare-parts → 200 + array
TEST 2: POST /api/spare-parts → 201 + part with ID
        Body: { name, sku, price, quantity, minStock }
TEST 3: GET /api/spare-parts/:id → 200 + part details
TEST 4: PATCH /api/spare-parts/:id → 200 + updated
TEST 5: GET /api/spare-part-inventories → 200 + stock levels
TEST 6: POST /api/spare-part-inventories → 201 + stock entry
TEST 7: GET /api/stock-alerts → 200 + low stock items
TEST 8: POST /api/stock-alerts → 201 + alert created
TEST 9: GET /api/reports/inventory → 200 + inventory report
TEST 10: DELETE /api/spare-parts/:id → 200

TEARDOWN: Delete test parts
```

**Verify**: All 10 tests green

**Depends on**: Task 1.3
**Time**: 1 hour

---

## TASK 1.10 — Golden Path E2E Test

**Goal**: Test the complete business workflow end-to-end in one test

**What to do**:
Create `server/__tests__/e2e-workflow.test.ts`:

```
This is ONE test that runs 10 steps in sequence:

STEP 1:  POST /api/register
         → Create garage admin account
         → Save: userId, sessionCookie

STEP 2:  POST /api/customers
         → Create "Ahmed Al-Rashid" as customer
         → Save: customerId

STEP 3:  POST /api/vehicles
         → Create "2024 Toyota Camry" for Ahmed
         → Save: vehicleId

STEP 4:  POST /api/job-cards
         → Create job card: "Engine oil change + brake inspection"
         → Save: jobCardId

STEP 5:  PATCH /api/job-cards/:id
         → Update status: "pending" → "in_progress"
         → Assign technician

STEP 6:  POST /api/job-cards/:jobCardId/parts
         → Add part: "Engine Oil 5W-30" (from inventory)

STEP 7:  PATCH /api/job-cards/:id
         → Update status: "in_progress" → "completed"

STEP 8:  POST /api/invoices/from-job/:jobId
         → Auto-generate invoice from completed job
         → Save: invoiceId

STEP 9:  POST /api/payments
         → Record payment: { invoiceId, amount, method: "card" }

STEP 10: GET /api/reports/overview
         → Verify dashboard shows:
           - 1 completed job
           - 1 paid invoice
           - Revenue > 0
```

**Why this matters**: If this test passes, the core business loop works.

**Verify**: All 10 steps complete without errors

**Depends on**: Tasks 1.4–1.9 (uses all the same patterns)
**Time**: 2 hours

---

## TASK 1.11 — Add Test Scripts & Run All

**Goal**: Finalize test config and verify everything passes

**What to do**:
1. Update `package.json` scripts (if not done in 1.1)
2. Run `npm run test` — all tests must pass
3. Run `npm run test:coverage` — check coverage %
4. Fix any failures discovered

**Target numbers**:
```
Auth tests:      10 passing
Job Cards tests: 10 passing
Customers tests: 10 passing
Vehicles tests:  10 passing
Invoices tests:   8 passing
Inventory tests: 10 passing
E2E workflow:     1 passing (10 steps)
VAT utils:        3 passing (existing)
─────────────────────────────
Total:           62 assertions passing
Coverage:        >40% on server code
```

**Verify**: `npm run test` exits with code 0

**Depends on**: All of 1.1–1.10
**Time**: 30 minutes

---

# ═══════════════════════════════════════════
# PHASE 2 — DEPLOY 🚀
# ═══════════════════════════════════════════

---

## TASK 2.1 — Environment Template

**Goal**: Document every env var the app needs so deploys don't fail

**What to do**:
Create `.env.example`:
```env
# ═══ REQUIRED ═══
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SESSION_SECRET=generate-a-random-64-character-string-here

# ═══ APP CONFIG ═══
NODE_ENV=development
PORT=5000

# ═══ OPTIONAL — Enhanced features ═══
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
GOOGLE_MAPS_API_KEY=AIza...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
SENDGRID_API_KEY=SG...
```

**How to find what's needed**: Search codebase for `process.env.`:
```bash
grep -r "process.env\." server/ --include="*.ts" | grep -oE "process\.env\.[A-Z_]+" | sort -u
```

**Verify**: Every `process.env.X` in the code has a matching line in `.env.example`

**Depends on**: Nothing (can start alongside Phase 1)
**Time**: 30 minutes

---

## TASK 2.2 — Env Validation on Startup

**Goal**: App crashes immediately with a clear message if required vars are missing

**What to do**:
Create `server/config.ts`:
```typescript
// What this file does:
// 1. Lists every required env var
// 2. Checks they exist on startup
// 3. Throws clear error if any missing
// 4. Exports typed config object

const REQUIRED = ["DATABASE_URL", "SESSION_SECRET"] as const;
const OPTIONAL = ["STRIPE_SECRET_KEY", "OPENAI_API_KEY", ...] as const;

export function validateEnv() {
  const missing = REQUIRED.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error("❌ Missing required env vars:", missing.join(", "));
    console.error("   Copy .env.example to .env and fill in values");
    process.exit(1);
  }
}

export const config = {
  databaseUrl: process.env.DATABASE_URL!,
  sessionSecret: process.env.SESSION_SECRET!,
  port: parseInt(process.env.PORT || "5000"),
  isProduction: process.env.NODE_ENV === "production",
  // ...
};
```

Then add `validateEnv()` call at the top of `server/index.ts`.

**Verify**: Remove `DATABASE_URL` from `.env` → app crashes with clear message

**Depends on**: Task 2.1
**Time**: 30 minutes

---

## TASK 2.3 — DB Schema Push & Validation

**Goal**: Push all 394 tables to the database and verify they exist

**What to do**:
1. Run `npm run db:push` (this is `drizzle-kit push`)
2. Check output for errors
3. Create a verification script:

Create `scripts/verify-db.ts`:
```typescript
// Connects to DB, counts tables, reports missing ones
// Run with: npx tsx scripts/verify-db.ts
```

**Known risks**:
- 394 tables is A LOT — some may have circular references
- Some tables may fail due to missing enum types
- Neon free tier may have limits

**Strategy**: If push fails, identify which tables fail and fix schema

**Verify**: Script reports all expected tables exist

**Depends on**: Task 2.2 (needs valid DATABASE_URL)
**Time**: 1-2 hours (depends on schema issues)

---

## TASK 2.4 — Seed Script

**Goal**: Populate essential data so the app is usable after fresh deploy

**What to do**:
Create `server/seed.ts`:
```typescript
// Run with: npx tsx server/seed.ts

// STEP 1: Create default roles
// → admin, manager, technician, receptionist, customer

// STEP 2: Create default garage
// → name: "SLIS Garage", status: "active"

// STEP 3: Create admin user
// → email: admin@slis.sa, password: hashed, role: admin

// STEP 4: Create feature flags (all core ON, experimental OFF)
// → Core: job_cards, customers, vehicles, invoices, estimates, etc.
// → Experimental OFF: ai_automation, iot_dashboard, blockchain, vr, ar, etc.

// STEP 5: Create default tax config
// → Saudi VAT: 15%
```

Add script to `package.json`:
```json
"db:seed": "tsx server/seed.ts"
```

**Verify**: Run `npm run db:seed` → logs show all data created

**Depends on**: Task 2.3 (tables must exist first)
**Time**: 1 hour

---

## TASK 2.5 — Build Check

**Goal**: Verify TypeScript compiles and Vite builds without errors

**What to do**:
1. Run `npm run check` (TypeScript compiler)
   - Fix any type errors
   - Track how many errors and which files
2. Run `npm run build` (Vite + esbuild)
   - Fix any build errors
   - Note bundle size

**Expected issues**:
- Unused imports (easy fix)
- Missing type definitions (add `as any` or proper types)
- Circular dependencies (refactor imports)

**Target**:
```
npm run check  → 0 errors
npm run build  → Clean build, main bundle < 2MB
```

**Verify**: Both commands exit with code 0

**Depends on**: Nothing (can run anytime)
**Time**: 1-3 hours (depends on TS errors)

---

## TASK 2.6 — Production Start Test

**Goal**: Verify the built app actually runs in production mode

**What to do**:
1. Run `npm run build` (must succeed from 2.5)
2. Run `npm run start` (NODE_ENV=production node dist/index.js)
3. Open browser to `http://localhost:5000`
4. Verify:
   - Login page loads
   - Static assets load (CSS, JS, images)
   - API calls work (check Network tab)
   - No console errors

**Common issues**:
- Missing `dist/` folder → build didn't run
- Static files 404 → Vite base path wrong
- API 500s → env vars not loaded in production mode

**Verify**: Login page renders, can log in, dashboard loads

**Depends on**: Task 2.5
**Time**: 30 minutes

---

## TASK 2.7 — Smoke Test All 15 Core Pages

**Goal**: Manually verify every core page loads and functions

**What to do**:
Go through each page in the browser and check:

```
PAGE              LOAD?  API OK?  CRUD?  NOTES
──────────────────────────────────────────────
/login            ☐      ☐        ☐
/register         ☐      ☐        ☐
/dashboard        ☐      ☐        n/a
/job-cards        ☐      ☐        ☐
/customers        ☐      ☐        ☐
/vehicles         ☐      ☐        ☐
/invoices         ☐      ☐        ☐
/estimates        ☐      ☐        ☐
/appointments     ☐      ☐        ☐
/inventory        ☐      ☐        ☐
/technicians      ☐      ☐        ☐
/payments         ☐      ☐        ☐
/reports          ☐      ☐        n/a
/fleet            ☐      ☐        ☐
/settings         ☐      ☐        ☐
```

**For each page check**:
- [ ] Page loads without white screen
- [ ] No red errors in console
- [ ] API calls in Network tab return 200 (not 500)
- [ ] Data displays (tables, cards, charts)
- [ ] Create/Edit forms work (where applicable)

**Log bugs found** → create fix tasks for Phase 4

**Verify**: All 15 pages have ☑ in LOAD and API columns

**Depends on**: Tasks 2.4 + 2.6 (need seeded DB + running app)
**Time**: 2 hours

---

# ═══════════════════════════════════════════
# PHASE 3 — ROUTE REFACTORING 🏗️
# ═══════════════════════════════════════════

---

## TASK 3.1 — Cherry-Pick Route Modules from pr-branch

**Goal**: Get the modular route files onto main without re-writing them

**What to do**:
```bash
# These files exist on pr-branch but not on main:
git checkout pr-branch -- server/routes/customers.routes.ts
git checkout pr-branch -- server/routes/vehicles.routes.ts
git checkout pr-branch -- server/routes/jobcards.routes.ts
git checkout pr-branch -- server/routes/invoices.routes.ts
git checkout pr-branch -- server/routes/inventory.routes.ts
git checkout pr-branch -- server/routes/fleet.routes.ts
git checkout pr-branch -- server/routes/technicians.routes.ts
git checkout pr-branch -- server/routes/scheduling.routes.ts
git checkout pr-branch -- server/routes/reports.routes.ts
git checkout pr-branch -- server/routes/settings.routes.ts
git checkout pr-branch -- server/routes/misc.routes.ts
```

**After copying**: Review each file to make sure imports/paths are correct for main branch

**Verify**: All 11 files exist in `server/routes/`, no import errors

**Depends on**: Phase 1 complete (tests are safety net)
**Time**: 30 minutes

---

## TASK 3.2 — Extract Job Cards (17 endpoints)

**Goal**: Move all job card routes from monolith to module

**What to do**:
1. Open `server/routes.ts`
2. Find all routes matching `/api/job-cards*` (17 endpoints)
3. Move them to `server/routes/jobcards.routes.ts`
4. In the module, use `Router()` instead of `app.`
5. Run tests: `npm run test:server -- job-cards`
6. Verify all job card tests still pass

**Endpoints to move**:
```
GET    /api/job-cards
GET    /api/job-cards/:id
GET    /api/job-cards/:id/details
POST   /api/job-cards
PUT    /api/job-cards/:id
PATCH  /api/job-cards/:id
GET    /api/job-cards/:jobCardId/parts
POST   /api/job-cards/:jobCardId/parts
DELETE /api/job-cards/:jobCardId/parts/:partId
GET    /api/job-cards/:jobCardId/tasks
POST   /api/job-cards/:jobCardId/tasks
POST   /api/job-cards/:id/tracking/generate
POST   /api/job-cards/:id/tracking/events
GET    /api/job-cards/:id/tracking/events
PATCH  /api/job-cards/:id/eta
GET    /api/reports/job-cards          (cross-domain — leave in monolith for now)
GET    /api/customer/job-cards         (cross-domain — leave in monolith for now)
```

**Verify**: `npm run test -- job-cards` → all green

**Depends on**: Task 3.1
**Time**: 1 hour

---

## TASK 3.3 — Extract Customers (15 endpoints)

**Goal**: Move customer routes to module

**Endpoints to move**:
```
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
GET    /api/customers/:id/vehicles
GET    /api/customers/:id/job-cards
GET    /api/customers/:id/invoices
GET    /api/customers/:id/payments
GET    /api/customers/:id/notes
POST   /api/customers/:id/notes
DELETE /api/customer-notes/:id
```

**Verify**: `npm run test -- customers` → all green

**Depends on**: Task 3.1
**Time**: 45 minutes

---

## TASK 3.4 — Extract Vehicles (10 endpoints)

**Endpoints to move**:
```
GET    /api/vehicles
POST   /api/vehicles
PATCH  /api/vehicles/:id
DELETE /api/vehicles/:id
GET    /api/vehicles/:id/service-history
POST   /api/vehicles/:id/service-history
GET    /api/vehicles/:id/maintenance-schedules
POST   /api/vehicles/:id/maintenance-schedules
GET    /api/vehicles/:id/service-reminders
POST   /api/vehicles/:id/service-reminders
GET    /api/catalogs/vehicle-makes
GET    /api/catalogs/vehicle-models
```

**Verify**: `npm run test -- vehicles` → all green

**Depends on**: Task 3.1
**Time**: 45 minutes

---

## TASK 3.5 — Extract Fleet (37 endpoints)

**Goal**: Largest domain — move all fleet/tracking routes

**What to do**:
```bash
# Find all fleet endpoints:
grep -n "app\.\(get\|post\|put\|patch\|delete\).*fleet" server/routes.ts
```
Move all 37 to `server/routes/fleet.routes.ts`

**Verify**: `npm run test -- fleet` → all green (if fleet tests exist) or manual check

**Depends on**: Task 3.1
**Time**: 1.5 hours

---

## TASK 3.6 — Extract Invoices + Payments (Financial)

**Endpoints to move to `server/routes/financial.routes.ts`**:
```
# Invoices (8)
GET    /api/invoices
GET    /api/invoices/:id
POST   /api/invoices
POST   /api/invoices/with-items
POST   /api/invoices/from-job/:jobId
PATCH  /api/invoices/:id
DELETE /api/invoices/:id
GET    /api/invoices/:id/items

# Payments (6)
GET    /api/payments
POST   /api/payments
DELETE /api/payments/:id
GET    /api/payment-plans
POST   /api/payment-plans
PATCH  /api/payment-plans/:id

# Estimates (5)
GET    /api/estimates
GET    /api/estimates/:id
POST   /api/estimates/with-items
PATCH  /api/estimates/:id
DELETE /api/estimates/:id
```

**Verify**: `npm run test -- invoices` → all green

**Depends on**: Task 3.1
**Time**: 1.5 hours

---

## TASK 3.7 — Extract Remaining Domains

**Goal**: Move everything else out of the monolith

**Domains to extract** (in order of size):

| File to create | Endpoint prefix | Count |
|---------------|----------------|-------|
| `hr.routes.ts` | `/api/hr/*` | 77 |
| `nextgen.routes.ts` | `/api/nextgen/*` | 61 |
| `ai.routes.ts` | `/api/ai/*` | 26 |
| `call-center.routes.ts` | `/api/call-center/*` | 25 |
| `security.routes.ts` | `/api/security/*` | 21 |
| `notifications.routes.ts` | `/api/notifications/*` | 21 |
| `mobile.routes.ts` | `/api/mobile/*` | 18 |
| `chat.routes.ts` | `/api/chat/*` | 17 |
| `integrations.routes.ts` | `/api/integrations/*` | 16 |
| `pricing.routes.ts` | `/api/dynamic-pricing/*` | 16 |
| `analytics.routes.ts` | `/api/analytics/*` | 16 |
| `emerging-tech.routes.ts` | `/api/emerging-tech/*` | 15 |
| Remaining misc | Various | ~750 |

**Strategy**: Extract the big ones first (HR=77, nextgen=61), then batch the rest.

**Verify**: After each extraction, run full test suite

**Depends on**: Tasks 3.2–3.6
**Time**: 3-4 hours

---

## TASK 3.8 — Wire Master Router

**Goal**: `server/routes/index.ts` imports and mounts all modules

**What to do**:
Update `server/routes/index.ts`:
```typescript
import customerRoutes from "./customers.routes";
import vehicleRoutes from "./vehicles.routes";
import jobCardRoutes from "./jobcards.routes";
import financialRoutes from "./financial.routes";
import fleetRoutes from "./fleet.routes";
// ... all modules

app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/job-cards", jobCardRoutes);
app.use("/api/invoices", financialRoutes);
app.use("/api/fleet", fleetRoutes);
// ... all modules
```

Remove the `registerLegacyRoutes` import once all routes are extracted.

**Verify**: `npm run test` → full suite green

**Depends on**: Tasks 3.2–3.7
**Time**: 1 hour

---

## TASK 3.9 — Run Full Test Suite

**Goal**: Confirm zero regressions after refactoring

**What to do**:
```bash
npm run test           # All tests pass
npm run test:coverage  # Coverage didn't drop
npm run build          # Build still works
npm run start          # App still runs
```

Then re-run the smoke test checklist from Task 2.7.

**Verify**: Same results as before refactoring

**Depends on**: Task 3.8
**Time**: 1 hour

---

## TASK 3.10 — Delete the Monolith

**Goal**: Remove `server/routes.ts` (22,156 lines)

**What to do**:
1. Verify `server/routes.ts` has no remaining routes (all extracted)
2. Remove any imports of the old file
3. Delete `server/routes.ts`
4. Run tests one final time
5. Commit: `"Remove monolithic routes.ts — all endpoints now in domain modules"`

**Before deleting, verify**:
```bash
# Should return 0 — no endpoints left in monolith
grep -c "app\.\(get\|post\|put\|patch\|delete\)" server/routes.ts
```

**Verify**: Tests pass, app runs, no 404s on any endpoint

**Depends on**: Task 3.9
**Time**: 30 minutes

---

# ═══════════════════════════════════════════
# PHASE 4 — MVP FOCUS 🎯
# ═══════════════════════════════════════════

---

## TASK 4.1 — Audit Each Core Page

**Goal**: Go through all 15 core pages and document what's broken/missing

**What to do**:
For each of these 15 pages, open in browser and fill in:

```
PAGE: Dashboard (615 lines, 8 API calls)
├── Loads?           ☐ yes / ☐ no
├── API calls work?  ☐ yes / ☐ no → which ones fail?
├── Data displays?   ☐ yes / ☐ no → what's empty?
├── Forms work?      ☐ n/a (dashboard has no forms)
├── Error handling?  ☐ yes / ☐ no → white screen on error?
├── Loading states?  ☐ yes / ☐ no → blank while loading?
├── Mobile OK?       ☐ yes / ☐ no → broken on small screen?
└── Bugs found:      (list them)
```

Repeat for: JobCards, Customers, Vehicles, Invoices, Estimates, Appointments, Inventory, Technicians, Payments, Reports, Fleet, Settings, Login, Register

**Output**: A bug list for Tasks 4.2, 4.3, 4.7

**Verify**: Audit document completed for all 15 pages

**Depends on**: Task 2.7 (smoke test reveals initial issues)
**Time**: 3 hours

---

## TASK 4.2 — Fix Invoices Page

**Goal**: Invoices page is only 186 lines — too thin for a core page

**What to do**:
1. Open `client/src/pages/Invoices.tsx` (186 lines, 4 API calls)
2. Add missing features:
   - **Create invoice form** (customer, items, amounts, tax)
   - **Edit invoice** (update line items, recalculate totals)
   - **Status workflow** (draft → sent → paid → overdue)
   - **PDF generation** button
   - **VAT calculation** (15% Saudi VAT)
   - **Payment link** (connect to payments)
3. Wire to existing endpoints:
   ```
   POST /api/invoices/with-items    — create with line items
   PATCH /api/invoices/:id          — update status
   GET /api/invoices/:id/items      — load line items
   POST /api/invoices/from-job/:id  — auto-create from job card
   ```

**Target**: 400+ lines with full CRUD

**Verify**: Can create, view, edit, and change status of invoices

**Depends on**: Task 4.1 (audit reveals exact issues)
**Time**: 2-3 hours

---

## TASK 4.3 — Fix Estimates Page

**Goal**: Estimates page is only 151 lines — too thin for a core page

**What to do**:
1. Open `client/src/pages/Estimates.tsx` (151 lines, 4 API calls)
2. Add missing features:
   - **Create estimate form** (customer, vehicle, line items)
   - **Edit estimate** (update items, recalculate)
   - **Convert to job card** button (calls POST /api/estimates/:id/convert-to-job-card)
   - **Convert to invoice** button (calls POST /api/estimates/:id/convert-to-invoice)
   - **Status workflow** (draft → sent → approved → rejected)
   - **Customer approval** flow
3. Wire to existing endpoints:
   ```
   POST /api/estimates/with-items             — create
   PATCH /api/estimates/:id                   — update
   GET /api/estimates/:id/items               — load items
   POST /api/estimates/:id/convert-to-job-card — convert
   POST /api/estimates/:id/convert-to-invoice  — convert
   ```

**Target**: 400+ lines with full CRUD + conversion flows

**Verify**: Can create estimate, add items, convert to job card or invoice

**Depends on**: Task 4.1
**Time**: 2-3 hours

---

## TASK 4.4 — Cleanup Navigation

**Goal**: Sidebar shows only 15 core pages instead of 238

**What to do**:
1. Open `client/src/config/navigation.ts` (469 lines)
2. Replace the entire nav config with:

```typescript
export const coreNavigation = [
  { label: "Dashboard",    path: "/dashboard",    icon: Home },
  { label: "Job Cards",    path: "/job-cards",    icon: Wrench },
  { label: "Customers",    path: "/customers",    icon: Users },
  { label: "Vehicles",     path: "/vehicles",     icon: Car },
  { label: "Invoices",     path: "/invoices",     icon: Receipt },
  { label: "Estimates",    path: "/estimates",     icon: FileText },
  { label: "Appointments", path: "/appointments",  icon: Calendar },
  { label: "Inventory",    path: "/inventory",     icon: Package },
  { label: "Technicians",  path: "/technicians",   icon: HardHat },
  { label: "Payments",     path: "/payments",      icon: CreditCard },
  { label: "Reports",      path: "/reports",       icon: BarChart3 },
  { label: "Fleet",        path: "/fleet",         icon: Truck },
  { label: "Settings",     path: "/settings",      icon: Settings },
];
```

3. Keep all routes in the router (pages still accessible via URL)
4. Only the sidebar/nav changes

**Verify**: Sidebar shows exactly 13 items (+ login/register are separate)

**Depends on**: Nothing (can do anytime in Phase 4)
**Time**: 1 hour

---

## TASK 4.5 — Feature Flag Non-MVP Pages

**Goal**: Hide 223 non-core pages behind the feature flag system

**What to do**:
1. Identify feature flag groups:
   ```
   ai_features      → AIAutomation, AIChatbot, AIScheduling, AIServiceAdvisor, etc.
   iot_features      → IoTDashboard, SensorManagement, etc.
   blockchain        → BlockchainServiceHistory, SmartContracts
   ar_vr             → AROverlay, ARRepairGuide, VRShowroom
   advanced_finance  → BalanceSheet, GeneralLedger, ChartOfAccounts, etc.
   hr_module         → HRManagement, PayrollManagement, etc.
   call_center       → CallCenter, SupportChatDashboard
   marketing         → EmailMarketing, MarketingHub, LoyaltyProgram, etc.
   emerging_tech     → DroneInspection, DigitalTwin, ComputerVision, etc.
   ```

2. In seed script (Task 2.4), create these flags defaulting to `isEnabled: false`

3. In router (`client/src/App.tsx`), wrap non-core routes:
   ```tsx
   {flags?.ai_features && <Route path="/ai-automation" element={<AIAutomation />} />}
   ```

4. Pages not behind a flag → show "Coming Soon" component

**Verify**: Non-core pages show "Coming Soon" or are hidden based on flags

**Depends on**: Task 2.4 (seed script creates flags)
**Time**: 2-3 hours

---

## TASK 4.6 — Merge Duplicate Pages

**Goal**: Consolidate 4 pairs of duplicate/overlapping pages

**What to do**:

| Pair | Keep | Delete | Action |
|------|------|--------|--------|
| `Reports.tsx` + `Reports.tsx.backup` | Reports.tsx | Reports.tsx.backup | Delete backup |
| `TaskManagement.tsx` + `TasksManagement.tsx` | TaskManagement.tsx | TasksManagement.tsx | Merge unique code, delete |
| `SmartPartsRecommendations.tsx` + `SmartPartsRecommender.tsx` | SmartPartsRecommender.tsx | SmartPartsRecommendations.tsx | Merge, delete |
| `VoiceCommandInterface.tsx` + `VoiceCommands.tsx` | VoiceCommands.tsx | VoiceCommandInterface.tsx | Merge, delete |

For each:
1. Compare both files (diff)
2. Copy any unique functionality into the keeper
3. Update any imports/routes that reference the deleted file
4. Delete the duplicate

**Verify**: No broken imports, no 404s on merged routes

**Depends on**: Nothing
**Time**: 1 hour

---

## TASK 4.7 — Error & Loading States

**Goal**: Core pages handle loading, empty data, and errors gracefully

**What to do**:
For each of the 15 core pages:

1. **Loading state**: Show skeleton/spinner while data loads
   ```tsx
   if (isLoading) return <PageSkeleton />;
   ```

2. **Empty state**: Show helpful message when no data
   ```tsx
   if (data?.length === 0) return <EmptyState message="No job cards yet" action="Create your first job card" />;
   ```

3. **Error state**: Show error message, not white screen
   ```tsx
   if (error) return <ErrorState message="Failed to load job cards" retry={refetch} />;
   ```

Create shared components:
```
client/src/components/PageSkeleton.tsx
client/src/components/EmptyState.tsx
client/src/components/ErrorState.tsx
```

Then add to each core page.

**Verify**: Disconnect DB → pages show error state (not white screen)

**Depends on**: Task 4.1 (audit shows which pages lack these)
**Time**: 2-3 hours

---

# ═══════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════

```
PHASE 1 — TESTING (11 tasks)
  1.1  Install test deps .............. 5 min
  1.2  Server test setup .............. 30 min
  1.3  Test helpers ................... 45 min
  1.4  Auth tests ..................... 1 hr
  1.5  Job Cards tests ................ 1.5 hr
  1.6  Customers tests ................ 1 hr
  1.7  Vehicles tests ................. 1 hr
  1.8  Invoices tests ................. 1 hr
  1.9  Inventory tests ................ 1 hr
  1.10 Golden path E2E ................ 2 hr
  1.11 Run all + coverage ............. 30 min
                              SUBTOTAL: ~10 hours

PHASE 2 — DEPLOY (7 tasks)
  2.1  Env template ................... 30 min
  2.2  Env validation ................. 30 min
  2.3  DB schema push ................. 1-2 hr
  2.4  Seed script .................... 1 hr
  2.5  Build check .................... 1-3 hr
  2.6  Production start test .......... 30 min
  2.7  Smoke test 15 pages ............ 2 hr
                              SUBTOTAL: ~7-9 hours

PHASE 3 — REFACTOR (10 tasks)
  3.1  Cherry-pick from pr-branch ...... 30 min
  3.2  Extract job cards ............... 1 hr
  3.3  Extract customers ............... 45 min
  3.4  Extract vehicles ................ 45 min
  3.5  Extract fleet ................... 1.5 hr
  3.6  Extract financial ............... 1.5 hr
  3.7  Extract remaining ............... 3-4 hr
  3.8  Wire master router .............. 1 hr
  3.9  Full test suite ................. 1 hr
  3.10 Delete monolith ................. 30 min
                              SUBTOTAL: ~11-12 hours

PHASE 4 — MVP FOCUS (7 tasks)
  4.1  Audit 15 core pages ............ 3 hr
  4.2  Fix Invoices page .............. 2-3 hr
  4.3  Fix Estimates page ............. 2-3 hr
  4.4  Cleanup navigation ............. 1 hr
  4.5  Feature flag non-MVP ........... 2-3 hr
  4.6  Merge duplicates ............... 1 hr
  4.7  Error & loading states ......... 2-3 hr
                              SUBTOTAL: ~13-16 hours

═══════════════════════════════════════
GRAND TOTAL: ~41-47 hours of work
═══════════════════════════════════════
```

**Say "GO" to start Task 1.1**
