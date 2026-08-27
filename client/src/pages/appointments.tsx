import { useMemo, useState } from "react";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Appointments — /appointments route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §012.
 * `Appointments.dc.html` has not reached this session; when it lands,
 * rewrite this file against it. Every fixture is marked `// FIXTURE`.
 *
 * The reference guide lists three views (day / week / month) plus a
 * list view. The list view is what this file lands — a week-grouped
 * table is closer to what workshops actually use for triage than a
 * calendar grid drawn in ASCII, and it composes from primitives that
 * already exist. Calendar views are a follow-up slice once the
 * `.dc.html` and a proper calendar library are on hand.
 *
 * Status set: Scheduled, Confirmed, In Progress, Completed, Cancelled,
 * No Show. The first four map to StatusBadge `info`/`success`; the
 * last two to `warning` — per the guide's "Blue vs Orange" note the
 * cancel-family is what the brand rule treats as needs-attention.
 */

type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";

interface AppointmentRow {
  id: string;
  when: string; // ISO date-time, e.g. "2026-08-28T09:00"
  customer: string;
  vehicle: string;
  service: string;
  technician: string;
  status: AppointmentStatus;
}

const APPOINTMENTS: AppointmentRow[] = [
  // FIXTURE — replace with a real /api/appointments call
  { id: "AP-3081", when: "2026-08-28T09:00", customer: "Faisal Al-Otaibi", vehicle: "Toyota Camry 2022 · ABC-1234", service: "Full service", technician: "Ahmed R.", status: "confirmed" },
  { id: "AP-3082", when: "2026-08-28T10:30", customer: "Sara Al-Harbi", vehicle: "Nissan Sunny 2021 · DEF-4567", service: "Brake pads", technician: "Yasir S.", status: "scheduled" },
  { id: "AP-3083", when: "2026-08-28T13:00", customer: "Omar Al-Ghamdi", vehicle: "Hyundai Sonata 2023 · GHI-7890", service: "Diagnostic", technician: "Fahad M.", status: "scheduled" },
  { id: "AP-3084", when: "2026-08-28T15:30", customer: "Nada Al-Qahtani", vehicle: "Kia Sportage 2020 · JKL-2345", service: "Oil change", technician: "Ahmed R.", status: "confirmed" },
  { id: "AP-3080", when: "2026-08-27T08:00", customer: "Bandar Al-Rashid", vehicle: "Kia Sportage 2020 · JKL-2345", service: "Timing belt", technician: "Fahad M.", status: "in-progress" },
  { id: "AP-3079", when: "2026-08-27T14:00", customer: "Reem Al-Zahrani", vehicle: "Hyundai Sonata 2023 · MNO-6789", service: "AC repair", technician: "Yasir S.", status: "completed" },
  { id: "AP-3078", when: "2026-08-27T16:30", customer: "Turki Al-Saleh", vehicle: "Chevrolet Tahoe 2020 · PQR-3456", service: "Wheel alignment", technician: "Fahad M.", status: "no-show" },
  { id: "AP-3077", when: "2026-08-26T11:00", customer: "Layla Al-Bakri", vehicle: "Ford Explorer 2019 · STU-8901", service: "Battery check", technician: "Ahmed R.", status: "cancelled" },
];

type StatusFilter = "all" | "upcoming" | AppointmentStatus;

/** Map status → StatusBadge variant explicitly (the built-in MAP is
 *  underscored so kebab-case keys fall through to neutral). */
function badgeVariant(s: AppointmentStatus): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "in-progress":
    case "scheduled":
    case "confirmed":
      return "info";
    case "completed":
      return "success";
    case "cancelled":
    case "no-show":
      return "warning";
    default:
      return "neutral";
  }
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No show",
};

export default function Appointments() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const now = new Date("2026-08-27T00:00:00Z").getTime(); // Fixed "today" for the fixture; wire to Date.now() when real data lands.
    return APPOINTMENTS.filter((a) => {
      if (statusFilter === "upcoming") {
        if (new Date(a.when).getTime() < now) return false;
      } else if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        a.id.toLowerCase().includes(needle) ||
        a.customer.toLowerCase().includes(needle) ||
        a.vehicle.toLowerCase().includes(needle) ||
        a.service.toLowerCase().includes(needle) ||
        a.technician.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter]);

  const grouped = useMemo(() => {
    const byDay = new Map<string, AppointmentRow[]>();
    for (const row of rows) {
      const day = row.when.slice(0, 10);
      const bucket = byDay.get(day) ?? [];
      bucket.push(row);
      byDay.set(day, bucket);
    }
    return [...byDay.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, [rows]);

  return (
    <Shell screenLabel="Appointments" activeItem="Appointments">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="m-0 text-[26px] font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
            >
              {t("Appointments")}
            </h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Booking and triage — grouped by day, filter by status")}
            </p>
          </div>
          <Button>
            <SalisIcon name="Calendar" size={14} />
            <span>{t("New appointment")}</span>
          </Button>
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search by id, customer, vehicle, service, or technician")}
              aria-label={t("Search appointments")}
            />
          </div>
          <div
            className="flex flex-wrap gap-1 rounded-lg border p-0.5"
            style={{ borderColor: "var(--border-default)" }}
          >
            {(["all", "upcoming", "scheduled", "confirmed", "in-progress", "completed"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                aria-pressed={statusFilter === s}
                className="rounded-md px-3 py-1.5 text-xs font-medium"
                style={{
                  fontFamily: "var(--font-action)",
                  background: statusFilter === s ? "var(--salis-blue)" : "transparent",
                  color: statusFilter === s ? "#fff" : "var(--text-muted)",
                }}
              >
                {t(
                  s === "all"
                    ? "All"
                    : s === "upcoming"
                      ? "Upcoming"
                      : STATUS_LABEL[s as AppointmentStatus],
                )}
              </button>
            ))}
          </div>
        </section>

        {grouped.length === 0 ? (
          <Card>
            <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              {t("No appointments match this filter")}
            </p>
          </Card>
        ) : (
          grouped.map(([day, dayRows]) => (
            <section key={day} className="flex flex-col gap-3">
              <h2
                className="m-0 text-sm font-semibold"
                style={{ fontFamily: "var(--font-action)", color: "var(--text-muted)" }}
                dir="ltr"
              >
                {formatDayHeading(day)}
              </h2>
              <Card>
                <ul className="m-0 flex list-none flex-col p-0">
                  {dayRows.map((a, index) => (
                    <li
                      key={a.id}
                      className="flex flex-col gap-2 border-t p-4 first:border-t-0 sm:flex-row sm:items-center sm:gap-4"
                      style={{
                        borderColor: index === 0 ? "transparent" : "var(--border-default)",
                      }}
                    >
                      <div
                        className="flex flex-shrink-0 items-center gap-2 font-mono text-sm font-semibold"
                        style={{ color: "var(--text-heading)", minWidth: 64 }}
                        dir="ltr"
                      >
                        {formatTime(a.when)}
                      </div>
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
                      <div className="min-w-0 flex-1 text-sm" style={{ color: "var(--text-body)" }}>
                        {a.service} · {a.technician}
                      </div>
                      <div className={rtl ? "sm:me-0" : "sm:ms-0"}>
                        <StatusBadge variant={badgeVariant(a.status)}>
                          {t(STATUS_LABEL[a.status])}
                        </StatusBadge>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          ))
        )}
      </div>
    </Shell>
  );
}

/** Human day heading — same locale-neutral format as customers/job-cards. */
function formatDayHeading(day: string): string {
  const [year, month, dayNum] = day.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // Use a UTC construction to keep the weekday stable regardless of the
  // viewer's timezone; the fixture and real appointments both carry local
  // wallclock times, so the day label is what matters.
  const weekday = weekdays[new Date(Date.UTC(year, month - 1, dayNum)).getUTCDay()];
  return `${weekday}, ${dayNum} ${months[month - 1]} ${year}`;
}

/** ISO "2026-08-28T09:00" → "09:00". */
function formatTime(iso: string): string {
  return iso.slice(11, 16);
}
