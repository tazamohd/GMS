# Demo Script: SALIS AUTO - Enterprise Garage Management Platform

> **Duration:** 15 minutes
> **Presenter:** Platform Admin role
> **Base URL:** `http://localhost:5000` (or production domain)
> **Login credentials:** Admin account created via `npm run db:seed`

---

## Opening (1 min)

### Login

- **Navigate to:** `/login`
- **Action:** Enter admin credentials and log in
- **Say:** "Welcome to SALIS AUTO, a full-stack enterprise garage management platform built for the Saudi automotive market. The system supports Arabic/RTL, Saudi VAT compliance, and Hijri calendar -- all out of the box."

### Dashboard Overview

- **Navigate to:** `/` (Dashboard)
- **Highlight:**
  - Real-time KPI cards: total revenue, active jobs, pending appointments, inventory alerts
  - Today's appointments timeline
  - Revenue trend chart (daily/weekly/monthly)
  - Technician utilization rates
  - Recent activity feed with live WebSocket updates
- **Say:** "The dashboard gives management a single-glance view of the entire operation. Every number here is live -- powered by WebSocket connections that push updates in real time."

---

## 1. Customer Journey (3 min)

### 1.1 Self-Service Kiosk: Walk-In Check-In

- **Navigate to:** `/kiosk-checkin`
- **Action:** Walk through the kiosk check-in flow:
  1. Select "New Customer" or search by phone number
  2. Enter vehicle details (make, model, plate number, VIN)
  3. Select service type from menu
  4. Confirm and print ticket
- **Say:** "Walk-in customers use this touchscreen kiosk in the waiting area. No receptionist needed -- the system creates the customer record, vehicle record, and appointment automatically."
- **Key point:** The kiosk runs as a standalone route at `/kiosk` with a simplified, large-button UI designed for tablets.

### 1.2 Customer Portal: Self-Service Access

- **Navigate to:** `/customer-portal` (or `/client`)
- **Action:** Show the customer-facing portal:
  - `/client/appointments` -- Book a new appointment, view upcoming ones
  - `/client/vehicles` -- View registered vehicles with full service history
  - `/client/invoices` -- View and download invoices, pay online
  - `/client/live-tracking` -- Real-time job progress tracking
  - `/client/service-history` -- Complete service history per vehicle
  - `/client/review-chat` -- Leave reviews, chat with advisor
- **Say:** "Customers get their own portal. They can book appointments, track their vehicle's repair status in real time, view invoices, and even chat with their service advisor -- all without calling the shop."
- **Key point:** The public tracking link at `/track/:token` lets customers check job status without logging in.

### 1.3 WhatsApp Business Integration

- **Navigate to:** `/whatsapp`
- **Action:**
  - Show template message list (appointment reminders, job completion, invoice ready)
  - Demonstrate sending a test reminder
  - Show conversation history view
- **Say:** "WhatsApp is the primary communication channel in Saudi Arabia. We integrate directly with the WhatsApp Business API to send appointment reminders, job status updates, and invoice links as template messages. SMS campaigns are also available at `/sms-campaigns`."

---

## 2. Service Operations (3 min)

### 2.1 Appointments and Scheduling

- **Navigate to:** `/appointments`
- **Action:**
  - Show the appointment list with status filters (Scheduled, Confirmed, In Progress, Completed)
  - Click "New Appointment" -- select customer, vehicle, service type, date/time, assign advisor
  - Show the calendar view at `/calendar` for drag-and-drop scheduling
- **Say:** "Every service starts as an appointment. Staff can create them manually, or they flow in automatically from the kiosk, customer portal, or WhatsApp booking."

### 2.2 Job Cards: The Core Workflow

- **Navigate to:** `/job-cards`
- **Action:**
  - Create a new job card from an existing appointment
  - Show fields: customer, vehicle, assigned technician, service items, parts needed, estimated hours
  - Walk through status workflow: Open -> In Progress -> Quality Check -> Completed -> Invoiced
  - Show the service bay assignment
- **Say:** "The job card is the heart of the system. It tracks every detail of a repair -- who's working on it, what parts are needed, how long it's taking, and what it costs. Status transitions are enforced, so nothing slips through the cracks."
- **Key metrics to mention:** Average job completion time, first-time fix rate, jobs per day

### 2.3 AI Scheduling and Smart Assignment

- **Navigate to:** `/ai-scheduling`
- **Action:**
  - Show the AI scheduling optimizer with skill-match scores
  - Demonstrate technician-to-job matching based on certifications, workload, and availability
  - Show the optimization result with before/after utilization comparison
- **Navigate to:** `/smart-assignment` for automatic technician assignment
- **Say:** "The AI scheduler considers each technician's certifications, current workload, and skill ratings to find the optimal assignment. It can reduce idle time by up to 30%."

### 2.4 Technician Mobile Portal

- **Navigate to:** `/technician-portal`
- **Action:**
  - Show "My Jobs" at `/technician-portal/my-jobs` -- active job cards assigned to this tech
  - Time clock at `/technician-portal/time-clock` -- clock in/out per job
  - Parts request at `/technician-portal/parts` -- request parts from inventory
  - Documentation at `/technician-portal/documentation` -- access repair manuals
  - AR Repair Guide at `/technician-portal/guides` -- augmented reality overlay for complex repairs
- **Say:** "Technicians have their own mobile-optimized portal. They accept jobs, clock time against each task, request parts directly from inventory, and access repair documentation -- all from their phone or tablet on the shop floor."

### 2.5 Quality Control

- **Navigate to:** `/quality-control`
- **Action:**
  - Show inspection checklist creation
  - Run through a sample QC inspection: pass/fail per item, photo upload, technician sign-off
  - Show the Computer Vision QC feature at `/computer-vision-qc` for automated visual inspection
- **Say:** "Before any vehicle leaves the shop, it goes through a quality control inspection. Checklists are customizable per service type, and results are permanently attached to the job card for auditing."

---

## 3. Parts and Inventory (2 min)

### 3.1 Inventory Management

- **Navigate to:** `/inventory-management`
- **Action:**
  - Show parts catalog with stock levels, locations, and reorder points
  - Filter by low stock alerts (items below minimum threshold)
  - Show barcode scanner integration at `/barcode-scanner` for quick lookups
  - Demonstrate stock adjustment and transfer between warehouse locations
- **Say:** "The inventory module tracks every part across multiple warehouse locations. Low stock alerts trigger automatically when items drop below their reorder point."
- **Key metrics:** Total SKUs, current stock value (SAR), items below reorder point

### 3.2 Smart Parts Recommendations

- **Navigate to:** `/smart-parts-recommendations`
- **Action:**
  - Enter a vehicle (make/model/year) and service type
  - Show AI-recommended parts with compatibility scores, pricing, and availability
  - Show the parts auto-reorder feature at `/parts-auto-reorder`
- **Say:** "Enter the vehicle and service type, and the AI engine recommends the exact parts needed -- with compatibility verification, pricing from multiple suppliers, and one-click ordering."

### 3.3 Supplier Portal and Purchase Orders

- **Navigate to:** `/supplier-portal`
- **Action:**
  - Show supplier directory with ratings, lead times, and pricing history
  - Create a purchase order at `/purchase-orders`
  - Show the price comparison tool at `/purchase-agent/price-compare`
- **Say:** "The supplier portal lets you compare pricing across vendors, track delivery times, and manage purchase orders -- all from one screen. The purchase agent module automates the entire procurement workflow."

### 3.4 Predictive Maintenance

- **Navigate to:** `/predictive-maintenance`
- **Action:**
  - Select a vehicle and show its maintenance predictions
  - Show predicted failure components with confidence scores and recommended service dates
  - Show the vehicle health monitoring dashboard at `/vehicle-health-monitoring`
- **Say:** "Using service history and vehicle data, the predictive engine forecasts when components are likely to need replacement. This lets you proactively contact customers before a breakdown happens."

---

## 4. Financial (2 min)

### 4.1 Estimates and Quotations

- **Navigate to:** `/estimates`
- **Action:**
  - Create a new estimate with line items (labor, parts, fees)
  - Show 15% Saudi VAT auto-calculation on each line
  - Demonstrate "Convert to Job Card" and "Convert to Invoice" actions
  - Show status workflow: Draft -> Sent -> Approved -> Converted
- **Say:** "Estimates are created with line items for labor and parts. Saudi VAT at 15% is calculated automatically. Once the customer approves, one click converts it into a job card or invoice."

### 4.2 Invoices and Payments

- **Navigate to:** `/invoices`
- **Action:**
  - Show auto-generated invoice from a completed job
  - Highlight line items, subtotal, VAT breakdown, and total in SAR
  - Show status workflow: Draft -> Sent -> Partially Paid -> Paid
  - Navigate to `/payments` for payment processing
  - Show Stripe integration at `/stripe-payment-processing`
- **Say:** "Invoices are auto-generated when a job completes. The system calculates VAT, tracks partial payments, and integrates with Stripe for online card payments. Customers can pay through their portal too."

### 4.3 Full Accounting Suite

- **Navigate to each page briefly:**
  - `/general-ledger` -- All transactions with double-entry bookkeeping
  - `/chart-of-accounts` -- Full chart of accounts (assets, liabilities, equity, revenue, expenses)
  - `/journal-entries` -- Manual journal entries for adjustments
  - `/trial-balance` -- Period trial balance report
  - `/balance-sheet` -- Balance sheet with assets = liabilities + equity
  - `/income-statement` -- Profit and loss statement
  - `/cash-flow-statement` -- Cash flow analysis
  - `/accounts-receivable` -- Outstanding customer balances
  - `/accounts-payable` -- Outstanding supplier balances
- **Say:** "The platform includes a complete double-entry accounting system. General ledger, chart of accounts, journal entries, trial balance, and all three financial statements -- balance sheet, income statement, and cash flow -- are generated in real time from actual transaction data."

### 4.4 Multi-Currency

- **Navigate to:** `/currency-settings`
- **Action:** Show SAR as base currency, demonstrate conversion rates for USD, EUR, AED
- **Say:** "Multi-currency support for international suppliers and customers. SAR is the base currency with real-time exchange rate conversion."

---

## 5. Saudi Compliance (1 min)

### 5.1 Compliance Dashboard

- **Navigate to:** `/compliance-management`
- **Action:**
  - Show ZATCA e-invoicing compliance status
  - Show VAT registration and filing status
  - Show Hijri date display alongside Gregorian dates
  - Demonstrate the compliance checklist with pass/fail indicators
- **Say:** "Built for the Saudi market from day one. ZATCA e-invoicing compliance, 15% VAT enforcement, Hijri calendar support, and all the regulatory requirements are baked into every transaction."
- **Key points:** ZATCA Phase 2 compliance, VAT auto-calculation, bilingual Arabic/English documents

### 5.2 Arabic/RTL Toggle

- **Action:** Open Settings or use the language toggle in the header
- **Switch the interface from English to Arabic**
- **Show:**
  - Full RTL layout -- sidebar moves to the right, text flows right-to-left
  - All labels, buttons, and messages in Arabic
  - Numbers and currency formatting follow Arabic locale
- **Say:** "The entire interface switches to Arabic with full RTL support. Every page, every form, every report -- fully translated and correctly laid out for Arabic users."
- **Switch back to English** before continuing

---

## 6. Analytics and Intelligence (1 min)

### 6.1 Advanced Reports

- **Navigate to:** `/advanced-reports`
- **Action:**
  - Show revenue reports with date range filters and chart visualizations
  - Show technician performance reports with efficiency metrics
  - Show inventory turnover analysis
  - Navigate to `/custom-reports` for the custom report builder
- **Say:** "The reporting engine covers every department -- revenue trends, technician efficiency, inventory turnover, customer retention, and more. The custom report builder lets managers create their own views."

### 6.2 AI Insights and Business Intelligence

- **Navigate to:** `/business-intelligence-dashboard`
- **Action:**
  - Show revenue forecast with trend lines
  - Show anomaly detection alerts (unusual spending, revenue drops)
  - Show customer segmentation analysis
  - Navigate to `/profit-analysis` and `/customer-ltv-analysis`
- **Say:** "The BI dashboard goes beyond basic reporting. Revenue forecasting, anomaly detection, customer lifetime value analysis, and profit margin breakdowns -- all powered by the platform's data engine."

### 6.3 Real-Time Operations

- **Navigate to:** `/service-bay-dashboard`
- **Action:**
  - Show real-time bay utilization: which bays are occupied, which technicians are active
  - Show live job progress across all active service bays
- **Say:** "The service bay dashboard gives shop managers a real-time view of every bay, every technician, and every active job. It's the digital equivalent of walking the shop floor."

---

## 7. Administration (1 min)

### 7.1 HR and Payroll

- **Navigate to:** `/hr-payroll`
- **Action:**
  - Show employee directory with roles, departments, and employment status
  - Show GOSI (General Organization for Social Insurance) payslip generation
  - Navigate to `/timeclock-payroll` for time tracking and payroll integration
  - Show technician leaderboards at `/technician-leaderboards`
- **Say:** "HR and payroll are integrated directly. Employee records, GOSI-compliant payslips, time tracking, and technician performance leaderboards -- all in one place."

### 7.2 CRM and Loyalty

- **Navigate to:** `/crm-loyalty`
- **Action:**
  - Show customer segments (VIP, Regular, At-Risk, Churned)
  - Show loyalty program configuration at `/loyalty-program`
  - Show customer feedback and reviews at `/customer-feedback`
  - Show marketing campaigns at `/email-marketing-campaigns`
- **Say:** "The CRM module segments customers automatically based on visit frequency and spend. The loyalty program, email campaigns, and feedback system help drive retention."

### 7.3 Audit Trail

- **Navigate to:** `/audit-trail`
- **Action:**
  - Show the audit log with user actions, timestamps, and affected records
  - Filter by user, action type, or date range
  - Show the security dashboard at `/security`
- **Say:** "Every action in the system is logged. Who changed what, when, and from which IP address. Essential for compliance and for resolving disputes."

### 7.4 API Documentation

- **Navigate to:** `/api-docs`
- **Action:** Show the interactive API documentation with endpoint list and try-it-out functionality
- **Say:** "The platform exposes over 250 RESTful API endpoints, all documented with request/response schemas. Third-party integrations can hook into any part of the system."

---

## 8. Enterprise (1 min)

### 8.1 Fleet Management

- **Navigate to:** `/fleet-management`
- **Action:**
  - Show corporate fleet accounts with vehicle lists
  - Show fleet tracking at `/fleet-tracking`
  - Show contract management at `/contract-management`
- **Say:** "Fleet management handles corporate accounts with dozens or hundreds of vehicles. Bulk scheduling, contract pricing, and fleet-wide reporting are all supported."

### 8.2 Franchise and Multi-Location

- **Navigate to:** `/franchise-management`
- **Action:**
  - Show multi-location analytics and comparison
  - Show location-level KPIs side by side
- **Say:** "For franchise operations, the platform aggregates data across multiple locations. Compare performance, standardize pricing, and manage operations from a single dashboard."

### 8.3 Warranty Contracts and Claims

- **Navigate to:** `/warranty-management`
- **Action:**
  - Show active warranty contracts with coverage details and expiration dates
  - Navigate to `/warranty-contracts` for contract management
  - Show insurance claims workflow at `/insurance-claims`
- **Say:** "Warranty management tracks service contracts, coverage limits, and expiration dates. When a covered vehicle comes in, the system automatically flags applicable warranties and streamlines the claims process."

### 8.4 Data Backup and Export

- **Navigate to:** `/data-backup`
- **Action:**
  - Show backup schedule and last backup status
  - Demonstrate CSV and JSON export for any data table
  - Show the data import/export tool at `/data-import-export`
- **Say:** "Data backup runs on schedule with full export capability. Any table can be exported to CSV or JSON for external analysis or migration."

---

## Closing (30 sec)

### Platform Statistics

Summarize the platform with these numbers:

| Metric | Count |
|--------|-------|
| Frontend Pages | 238+ |
| API Endpoints | 1,198+ |
| Database Tables | 394 |
| Route Modules | 30+ |
| Supported Languages | 2 (English, Arabic) |
| User Roles | 6 (Platform Admin, Admin, Manager, Advisor, Technician, Accountant) |
| Subscription Tiers | 3 (Starter, Pro, Enterprise) |

### Architecture Highlights

- **Say:** "Under the hood, this is a TypeScript monolith -- React with Vite on the frontend, Express with Drizzle ORM on the backend, PostgreSQL on Neon for the database. The architecture is modular: 30+ route modules handle domain logic, with a legacy monolith as fallback. Real-time updates via WebSocket, session-based auth with Passport.js, and full i18n with Arabic RTL support."

### Deployment

- **Say:** "The platform deploys with a single command. Database schema push, seed data with Saudi VAT configuration, and a production-ready build under 2MB. Ready for cloud deployment on any Node.js host."

---

## Quick Reference: All Demo URLs

| Section | URL Path | Description |
|---------|----------|-------------|
| Login | `/login` | Authentication |
| Dashboard | `/` | Main KPI dashboard |
| Kiosk | `/kiosk-checkin` | Self-service check-in |
| Customer Portal | `/client` | Customer self-service |
| Live Tracking | `/client/live-tracking` | Real-time job tracking |
| Public Tracking | `/track/:token` | No-login job status |
| WhatsApp | `/whatsapp` | WhatsApp Business messages |
| SMS Campaigns | `/sms-campaigns` | Bulk SMS marketing |
| Appointments | `/appointments` | Appointment management |
| Calendar | `/calendar` | Visual scheduling |
| Job Cards | `/job-cards` | Service job management |
| AI Scheduling | `/ai-scheduling` | AI-powered optimization |
| Smart Assignment | `/smart-assignment` | Auto technician matching |
| Technician Portal | `/technician-portal` | Mobile tech workflow |
| Quality Control | `/quality-control` | QC inspections |
| Computer Vision QC | `/computer-vision-qc` | Automated visual QC |
| Inventory | `/inventory-management` | Parts and stock |
| Barcode Scanner | `/barcode-scanner` | Quick part lookup |
| Smart Parts | `/smart-parts-recommendations` | AI parts matching |
| Parts Auto-Reorder | `/parts-auto-reorder` | Automated reordering |
| Supplier Portal | `/supplier-portal` | Vendor management |
| Purchase Orders | `/purchase-orders` | PO management |
| Price Compare | `/purchase-agent/price-compare` | Supplier comparison |
| Predictive Maintenance | `/predictive-maintenance` | Failure prediction |
| Vehicle Health | `/vehicle-health-monitoring` | Vehicle monitoring |
| Estimates | `/estimates` | Quotations with VAT |
| Invoices | `/invoices` | Billing and VAT |
| Payments | `/payments` | Payment tracking |
| Stripe Payments | `/stripe-payment-processing` | Card processing |
| General Ledger | `/general-ledger` | Double-entry ledger |
| Chart of Accounts | `/chart-of-accounts` | Account structure |
| Journal Entries | `/journal-entries` | Manual entries |
| Trial Balance | `/trial-balance` | Period balance |
| Balance Sheet | `/balance-sheet` | Financial position |
| Income Statement | `/income-statement` | Profit and loss |
| Cash Flow | `/cash-flow-statement` | Cash flow analysis |
| Accounts Receivable | `/accounts-receivable` | Customer balances |
| Accounts Payable | `/accounts-payable` | Supplier balances |
| Currency Settings | `/currency-settings` | Multi-currency |
| Compliance | `/compliance-management` | Saudi regulatory |
| Advanced Reports | `/advanced-reports` | Multi-department reports |
| Custom Reports | `/custom-reports` | Report builder |
| Business Intelligence | `/business-intelligence-dashboard` | BI analytics |
| Profit Analysis | `/profit-analysis` | Margin analysis |
| Customer LTV | `/customer-ltv-analysis` | Lifetime value |
| Service Bay | `/service-bay-dashboard` | Live bay status |
| HR Payroll | `/hr-payroll` | Employee management |
| Time Clock | `/timeclock-payroll` | Time tracking |
| Leaderboards | `/technician-leaderboards` | Tech performance |
| CRM Loyalty | `/crm-loyalty` | Customer segments |
| Loyalty Program | `/loyalty-program` | Points and rewards |
| Customer Feedback | `/customer-feedback` | Reviews and ratings |
| Email Campaigns | `/email-marketing-campaigns` | Email marketing |
| Audit Trail | `/audit-trail` | Action logging |
| Security | `/security` | Security dashboard |
| API Docs | `/api-docs` | Endpoint documentation |
| Fleet Management | `/fleet-management` | Corporate fleets |
| Fleet Tracking | `/fleet-tracking` | Vehicle GPS tracking |
| Contract Management | `/contract-management` | Service contracts |
| Franchise | `/franchise-management` | Multi-location |
| Warranty | `/warranty-management` | Warranty tracking |
| Warranty Contracts | `/warranty-contracts` | Contract details |
| Insurance Claims | `/insurance-claims` | Claims workflow |
| Data Backup | `/data-backup` | Backup and export |
| Data Import/Export | `/data-import-export` | Bulk data tools |
| Settings | `/settings` | System configuration |
| Profile | `/profile` | User profile |
| Platform Admin | `/platform-admin` | Super admin panel |

---

## Tips for the Presenter

1. **Seed data first:** Run `npm run db:seed` before the demo to populate realistic sample data (customers, vehicles, job cards, invoices with Saudi VAT).
2. **Use two browser tabs:** Keep the admin view in one tab and the customer portal (`/client`) in another to show both sides of an interaction.
3. **Show the RTL switch early** if your audience is Arabic-speaking -- it makes an immediate impression.
4. **Skip sections based on audience:** For a CFO, spend more time on Section 4 (Financial). For an ops manager, expand Section 2 (Service Operations). For IT, focus on the Closing architecture slide and API docs.
5. **Keep the dashboard visible** between sections -- it updates in real time as you create records in other modules.
6. **Network required:** WhatsApp, Stripe, and predictive maintenance features require API keys to be configured in `.env`. The UI will show configuration prompts if keys are missing.
