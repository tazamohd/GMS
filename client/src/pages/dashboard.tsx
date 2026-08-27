import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatusBadge,
} from "@/components/ds";
import { SalisIcon, type SalisIconName } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Dashboard — /-route landing page.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §001. No
 * `.dc.html` file for this screen has reached the session, so pixel
 * fidelity is not claimed here; the layout follows the reference guide's
 * feature list (welcome + quick actions + four key metrics + today's
 * appointments + active job cards + activity feed) and the design system
 * primitives already ported from other screens.
 *
 * When the design bundle arrives, this is the file to rewrite against
 * `Dashboard.dc.html` (and `.Mobile.dc.html`). Every fixture value is
 * inline and identified by a `// FIXTURE` comment so the swap for real
 * data is mechanical.
 *
 * Numbers are placeholders. They will be wrong the moment a customer
 * looks at them. The rest of the platform's data-layer plumbing is out
 * of scope for this slice.
 */

const USER_NAME = "Khalid Al-Amri"; // FIXTURE — real name comes from session

interface Metric {
  icon: SalisIconName;
  labelKey: string;
  value: string;
  tone: "blue" | "orange";
}

const METRICS: Metric[] = [
  { icon: "Users", labelKey: "Customers today", value: "24", tone: "blue" }, // FIXTURE
  { icon: "ClipboardList", labelKey: "Open job cards", value: "12", tone: "blue" }, // FIXTURE
  { icon: "Receipt", labelKey: "Pending invoices", value: "SAR 48,320", tone: "blue" }, // FIXTURE
  { icon: "Package", labelKey: "Low stock alerts", value: "3", tone: "orange" }, // FIXTURE
];

interface QuickAction {
  icon: SalisIconName;
  labelKey: string;
  to: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: "ClipboardList", labelKey: "New Job Card", to: "/job-cards" }, // route lands on the 404 fallback until the screen ships
  { icon: "Calendar", labelKey: "New Appointment", to: "/appointments" },
  { icon: "Users", labelKey: "Add Customer", to: "/customers" },
  { icon: "Receipt", labelKey: "New Invoice", to: "/invoices" },
];

interface Appointment {
  time: string;
  customer: string;
  vehicle: string;
  status: "scheduled" | "in-progress" | "done";
}

const APPOINTMENTS: Appointment[] = [
  // FIXTURE — replace with today's real appointments
  { time: "09:00", customer: "Faisal Al-Otaibi", vehicle: "Toyota Camry 2022", status: "in-progress" },
  { time: "10:30", customer: "Sara Al-Harbi", vehicle: "Nissan Sunny 2021", status: "scheduled" },
  { time: "13:00", customer: "Omar Al-Ghamdi", vehicle: "Hyundai Sonata 2023", status: "scheduled" },
  { time: "15:30", customer: "Nada Al-Qahtani", vehicle: "Kia Sportage 2020", status: "scheduled" },
];

interface JobCardRow {
  id: string;
  customer: string;
  technician: string;
  status: "in-progress" | "qc-pending" | "waiting-parts";
}

const JOB_CARDS: JobCardRow[] = [
  // FIXTURE
  { id: "JC-1421", customer: "Faisal Al-Otaibi", technician: "Ahmed R.", status: "in-progress" },
  { id: "JC-1418", customer: "Reem Al-Zahrani", technician: "Yasir S.", status: "qc-pending" },
  { id: "JC-1416", customer: "Bandar Al-Rashid", technician: "Fahad M.", status: "waiting-parts" },
];

/** Domain-agnostic status → StatusBadge intent map. */
function badgeStatus(s: string): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "in-progress":
      return "info";
    case "scheduled":
    case "waiting-parts":
    case "qc-pending":
      return "warning";
    case "done":
      return "success";
    default:
      return "neutral";
  }
}

export default function Dashboard() {
  const { t, rtl } = useTranslate();

  return (
    <Shell screenLabel="Dashboard" activeItem="Overview">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
        {/* Welcome + quick actions ---------------------------------- */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1
              className="m-0 text-[26px] font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
            >
              {t("Welcome back")}, <span dir={rtl ? "ltr" : undefined}>{USER_NAME}</span>
            </h1>
            <p className="m-0 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Here is what needs attention today")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.labelKey} to={action.to} className="no-underline">
                <Button variant="outline">
                  <SalisIcon name={action.icon} size={14} />
                  <span>{t(action.labelKey)}</span>
                </Button>
              </Link>
            ))}
          </div>
        </section>

        {/* Key metrics --------------------------------------------- */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <MetricTile key={m.labelKey} metric={m} label={t(m.labelKey)} />
          ))}
        </section>

        {/* Today + active job cards -------------------------------- */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Today's appointments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {APPOINTMENTS.map((a) => (
                  <li
                    key={a.time + a.customer}
                    className="flex items-center gap-3 border-b py-2 last:border-b-0"
                    style={{ borderColor: "var(--border-default)" }}
                  >
                    <span
                      className="font-mono text-sm font-semibold"
                      style={{ color: "var(--text-heading)", minWidth: 56 }}
                      dir="ltr"
                    >
                      {a.time}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className="m-0 truncate text-sm font-medium"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {a.customer}
                      </p>
                      <p
                        className="m-0 truncate text-xs"
                        style={{ color: "var(--text-muted)" }}
                        dir="ltr"
                      >
                        {a.vehicle}
                      </p>
                    </div>
                    <StatusBadge variant={badgeStatus(a.status)}>
                      {t(a.status.replace("-", " "))}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Active job cards")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {JOB_CARDS.map((j) => (
                  <li
                    key={j.id}
                    className="flex items-center gap-3 border-b py-2 last:border-b-0"
                    style={{ borderColor: "var(--border-default)" }}
                  >
                    <SalisIcon name="Wrench" size={16} style={{ color: "var(--text-muted)" }} />
                    <div className="min-w-0 flex-1">
                      <p
                        className="m-0 truncate text-sm font-medium"
                        style={{ color: "var(--text-heading)" }}
                        dir="ltr"
                      >
                        {j.id} · {j.customer}
                      </p>
                      <p
                        className="m-0 truncate text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {t("Technician")}: {j.technician}
                      </p>
                    </div>
                    <StatusBadge variant={badgeStatus(j.status)}>
                      {t(j.status.replace("-", " "))}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* System alerts placeholder ------------------------------- */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>{t("System alerts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <SalisIcon name="Bell" size={16} style={{ color: "var(--salis-orange)" }} />
                <p className="m-0 text-sm" style={{ color: "var(--text-body)" }}>
                  {/* FIXTURE */}
                  {t("3 parts are below reorder level. Review inventory to restock.")}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Shell>
  );
}

function MetricTile({ metric, label }: { metric: Metric; label: string }) {
  const isOrange = metric.tone === "orange";
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-xs" style={{ color: "var(--text-muted)" }}>
            {label}
          </p>
          <p
            className="m-0 mt-1 text-2xl font-black"
            style={{
              fontFamily: "var(--font-display)",
              color: isOrange ? "var(--salis-orange)" : "var(--text-heading)",
            }}
            dir="ltr"
          >
            {metric.value}
          </p>
        </div>
        <span
          className="flex flex-shrink-0 items-center justify-center rounded-lg p-2"
          style={{
            background: isOrange ? "rgba(255,138,0,.12)" : "rgba(10,94,215,.12)",
            color: isOrange ? "var(--salis-orange)" : "var(--salis-blue)",
          }}
        >
          <SalisIcon name={metric.icon} size={18} />
        </span>
      </CardContent>
    </Card>
  );
}
