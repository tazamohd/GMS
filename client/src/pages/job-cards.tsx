import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Job Cards — /job-cards route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §041.
 * `JobCards.dc.html` is on the user's Claude Design project but this
 * session's `DesignSync` tool has no authorization; the user asked to
 * proceed spec-only rather than block. When the source file arrives,
 * rewrite this against it. Every fixture is inline and marked
 * `// FIXTURE`.
 *
 * The reference guide names the status workflow exactly:
 *   Created → Assigned → In Progress → QC Pending → Completed → Invoiced
 * The status enum below mirrors that; the filter pills are pruned to
 * the states a workshop actually filters by day-to-day (Open covers
 * anything that isn't Completed or Invoiced).
 */

type JobStatus =
  | "created"
  | "assigned"
  | "in-progress"
  | "qc-pending"
  | "completed"
  | "invoiced";

interface JobCardRow {
  id: string;
  customer: string;
  vehicle: string; // e.g. "Toyota Camry 2022 · ABC-1234"
  service: string;
  technician: string;
  status: JobStatus;
  opened: string; // ISO date
  totalSar: number;
}

const JOB_CARDS: JobCardRow[] = [
  // FIXTURE — replace with a real /api/job-cards call
  {
    id: "JC-1421",
    customer: "Faisal Al-Otaibi",
    vehicle: "Toyota Camry 2022 · ABC-1234",
    service: "Full service + oil change",
    technician: "Ahmed R.",
    status: "in-progress",
    opened: "2026-08-27",
    totalSar: 1240,
  },
  {
    id: "JC-1420",
    customer: "Sara Al-Harbi",
    vehicle: "Nissan Sunny 2021 · DEF-4567",
    service: "Brake pads · front",
    technician: "Yasir S.",
    status: "assigned",
    opened: "2026-08-27",
    totalSar: 620,
  },
  {
    id: "JC-1418",
    customer: "Reem Al-Zahrani",
    vehicle: "Hyundai Sonata 2023 · GHI-7890",
    service: "AC repair",
    technician: "Yasir S.",
    status: "qc-pending",
    opened: "2026-08-26",
    totalSar: 1980,
  },
  {
    id: "JC-1416",
    customer: "Bandar Al-Rashid",
    vehicle: "Kia Sportage 2020 · JKL-2345",
    service: "Timing belt replacement",
    technician: "Fahad M.",
    status: "in-progress",
    opened: "2026-08-25",
    totalSar: 2840,
  },
  {
    id: "JC-1413",
    customer: "Omar Al-Ghamdi",
    vehicle: "Hyundai Sonata 2023 · MNO-6789",
    service: "Battery replacement",
    technician: "Ahmed R.",
    status: "completed",
    opened: "2026-08-24",
    totalSar: 480,
  },
  {
    id: "JC-1410",
    customer: "Nada Al-Qahtani",
    vehicle: "Toyota Corolla 2019 · PQR-3456",
    service: "General inspection",
    technician: "Fahad M.",
    status: "invoiced",
    opened: "2026-08-23",
    totalSar: 220,
  },
];

type StatusFilter = "all" | "open" | JobStatus;

/** Status → StatusBadge variant, since the built-in MAP uses underscored
 *  keys (`in_progress`) but the JobStatus enum uses kebab-case. */
function badgeVariant(s: JobStatus): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "in-progress":
    case "assigned":
      return "info";
    case "qc-pending":
    case "created":
      return "warning";
    case "completed":
    case "invoiced":
      return "success";
    default:
      return "neutral";
  }
}

/** Human label for a status; centralised so the `t()` call sites are
 *  auditable and the enum is decoupled from the display copy. */
const STATUS_LABEL: Record<JobStatus, string> = {
  created: "Created",
  assigned: "Assigned",
  "in-progress": "In progress",
  "qc-pending": "QC pending",
  completed: "Completed",
  invoiced: "Invoiced",
};

export default function JobCards() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return JOB_CARDS.filter((j) => {
      if (statusFilter === "open") {
        // "Open" covers anything not yet closed out.
        if (j.status === "completed" || j.status === "invoiced") return false;
      } else if (statusFilter !== "all" && j.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        j.id.toLowerCase().includes(needle) ||
        j.customer.toLowerCase().includes(needle) ||
        j.vehicle.toLowerCase().includes(needle) ||
        j.service.toLowerCase().includes(needle) ||
        j.technician.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter]);

  return (
    <Shell screenLabel="JobCards" activeItem="Job Cards">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        {/* Header row -------------------------------------------- */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="m-0 text-[26px] font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
            >
              {t("Job cards")}
            </h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Service work orders — filter by status, technician, or vehicle")}
            </p>
          </div>
          <Button>
            <SalisIcon name="ClipboardList" size={14} />
            <span>{t("New job card")}</span>
          </Button>
        </section>

        {/* Filter row -------------------------------------------- */}
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search by job id, customer, vehicle, service, or technician")}
              aria-label={t("Search job cards")}
            />
          </div>
          <div
            className="flex flex-wrap gap-1 rounded-lg border p-0.5"
            style={{ borderColor: "var(--border-default)" }}
          >
            {(["all", "open", "in-progress", "qc-pending", "completed"] as const).map((s) => (
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
                    : s === "open"
                      ? "Open"
                      : STATUS_LABEL[s as JobStatus],
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Table ------------------------------------------------- */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr
                  style={{
                    background: "var(--surface-inset)",
                    color: "var(--text-muted)",
                  }}
                >
                  <Th align={rtl ? "right" : "left"}>{t("Job")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Customer")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Vehicle")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Service")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Technician")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Opened")}</Th>
                  <Th align="right">{t("Total")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Status")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("No job cards match this filter")}
                    </td>
                  </tr>
                ) : (
                  rows.map((j) => (
                    <tr
                      key={j.id}
                      className="border-t hover:bg-[rgba(10,94,215,.03)]"
                      style={{ borderColor: "var(--border-default)" }}
                    >
                      <Td>
                        {/* /job-cards/:id is not mounted yet — the target
                            page will be the detail + line-items screen. */}
                        <Link
                          to={`/job-cards/${j.id}`}
                          className="font-mono font-semibold no-underline"
                          style={{ color: "var(--salis-blue)" }}
                          dir="ltr"
                        >
                          {j.id}
                        </Link>
                      </Td>
                      <Td>
                        <span style={{ color: "var(--text-heading)", fontWeight: 500 }}>
                          {j.customer}
                        </span>
                      </Td>
                      <Td dir="ltr">
                        <span style={{ color: "var(--text-body)" }}>{j.vehicle}</span>
                      </Td>
                      <Td>
                        <span style={{ color: "var(--text-body)" }}>{j.service}</span>
                      </Td>
                      <Td>
                        <span style={{ color: "var(--text-body)" }}>{j.technician}</span>
                      </Td>
                      <Td dir="ltr">
                        <span style={{ color: "var(--text-body)" }}>{formatDate(j.opened)}</span>
                      </Td>
                      <Td align="right">
                        <span
                          className="font-mono"
                          style={{ color: "var(--text-heading)", fontWeight: 500 }}
                          dir="ltr"
                        >
                          {formatSar(j.totalSar)}
                        </span>
                      </Td>
                      <Td>
                        <StatusBadge variant={badgeVariant(j.status)}>
                          {t(STATUS_LABEL[j.status])}
                        </StatusBadge>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("Showing")} <span dir="ltr">{rows.length}</span> {t("of")}{" "}
          <span dir="ltr">{JOB_CARDS.length}</span> {t("job cards")}
        </p>
      </div>
    </Shell>
  );
}

function Th({
  align = "left",
  children,
}: {
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <th
      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
      style={{
        textAlign: align,
        fontFamily: "var(--font-action)",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  align = "left",
  dir,
  children,
}: {
  align?: "left" | "right";
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return (
    <td className="px-4 py-3" style={{ textAlign: align }} dir={dir}>
      {children}
    </td>
  );
}

/** ISO YYYY-MM-DD → "27 Aug 2026", locale-neutral so it doesn't drift under `ar`. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
}

function formatSar(amount: number): string {
  return `SAR ${amount.toLocaleString("en-US")}`;
}
