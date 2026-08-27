import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Customers — /customers route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §004.
 * `Customers.dc.html` has not reached this session (DesignSync
 * authorization has not been seeded from an interactive Claude Code
 * session on this machine, and the claude.ai/design/* URLs return 403
 * to WebFetch). When the source file arrives, rewrite this page against
 * it; every fixture is inline and marked `// FIXTURE` so the swap is
 * mechanical.
 *
 * The reference guide names the table columns exactly — Customer ID,
 * Name, Phone, Email, Total Visits, Last Visit Date, Total Spent,
 * Status, Actions — so the shape below matches the spec even if the
 * visual doesn't yet.
 */

interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  lastVisit: string; // ISO date; formatted below
  totalSar: number;
  status: "active" | "inactive";
}

const CUSTOMERS: CustomerRow[] = [
  // FIXTURE — replace with a real /api/customers call
  {
    id: "CU-1042",
    name: "Faisal Al-Otaibi",
    phone: "+966 50 123 4567",
    email: "faisal@example.com",
    visits: 12,
    lastVisit: "2026-08-20",
    totalSar: 18540,
    status: "active",
  },
  {
    id: "CU-1041",
    name: "Sara Al-Harbi",
    phone: "+966 55 234 5678",
    email: "sara.h@example.com",
    visits: 7,
    lastVisit: "2026-08-14",
    totalSar: 9820,
    status: "active",
  },
  {
    id: "CU-1039",
    name: "Omar Al-Ghamdi",
    phone: "+966 53 345 6789",
    email: "omar@example.com",
    visits: 4,
    lastVisit: "2026-06-30",
    totalSar: 4210,
    status: "active",
  },
  {
    id: "CU-1033",
    name: "Nada Al-Qahtani",
    phone: "+966 56 456 7890",
    email: "nada@example.com",
    visits: 2,
    lastVisit: "2026-03-11",
    totalSar: 1180,
    status: "inactive",
  },
  {
    id: "CU-1028",
    name: "Bandar Al-Rashid",
    phone: "+966 54 567 8901",
    email: "bandar@example.com",
    visits: 21,
    lastVisit: "2026-08-25",
    totalSar: 34220,
    status: "active",
  },
  {
    id: "CU-1017",
    name: "Reem Al-Zahrani",
    phone: "+966 59 678 9012",
    email: "reem@example.com",
    visits: 15,
    lastVisit: "2026-08-08",
    totalSar: 27310,
    status: "active",
  },
];

type StatusFilter = "all" | "active" | "inactive";

export default function Customers() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        c.id.toLowerCase().includes(needle) ||
        c.name.toLowerCase().includes(needle) ||
        c.phone.includes(needle) ||
        c.email.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter]);

  return (
    <Shell screenLabel="Customers" activeItem="Customers">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
        {/* Header row -------------------------------------------- */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="m-0 text-[26px] font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
            >
              {t("Customers")}
            </h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Master customer database — search, filter, and open a record")}
            </p>
          </div>
          <Button>
            <SalisIcon name="Users" size={14} />
            <span>{t("Add customer")}</span>
          </Button>
        </section>

        {/* Filter row -------------------------------------------- */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search by name, ID, phone, or email")}
              aria-label={t("Search customers")}
            />
          </div>
          <div className="flex gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
            {(["all", "active", "inactive"] as const).map((s) => (
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
                {t(s === "all" ? "All" : s === "active" ? "Active" : "Inactive")}
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
                  <Th align={rtl ? "right" : "left"}>{t("Customer ID")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Name")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Phone")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Email")}</Th>
                  <Th align="right">{t("Visits")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Last visit")}</Th>
                  <Th align="right">{t("Total spent")}</Th>
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
                      {t("No customers match this filter")}
                    </td>
                  </tr>
                ) : (
                  rows.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t hover:bg-[rgba(10,94,215,.03)]"
                      style={{ borderColor: "var(--border-default)" }}
                    >
                      <Td>
                        {/* /customers/:id is not mounted yet — TODO: wire once
                            the detail screen ships. Falls back to NotFound. */}
                        <Link
                          to={`/customers/${c.id}`}
                          className="font-mono font-semibold no-underline"
                          style={{ color: "var(--salis-blue)" }}
                          dir="ltr"
                        >
                          {c.id}
                        </Link>
                      </Td>
                      <Td>
                        <span style={{ color: "var(--text-heading)", fontWeight: 500 }}>
                          {c.name}
                        </span>
                      </Td>
                      <Td dir="ltr">
                        <span style={{ color: "var(--text-body)" }}>{c.phone}</span>
                      </Td>
                      <Td dir="ltr">
                        <span style={{ color: "var(--text-body)" }}>{c.email}</span>
                      </Td>
                      <Td align="right">
                        <span className="font-mono" style={{ color: "var(--text-body)" }}>
                          {c.visits}
                        </span>
                      </Td>
                      <Td dir="ltr">
                        <span style={{ color: "var(--text-body)" }}>
                          {formatDate(c.lastVisit)}
                        </span>
                      </Td>
                      <Td align="right">
                        <span className="font-mono" style={{ color: "var(--text-heading)", fontWeight: 500 }} dir="ltr">
                          {formatSar(c.totalSar)}
                        </span>
                      </Td>
                      <Td>
                        <StatusBadge status={c.status}>
                          {t(c.status === "active" ? "Active" : "Inactive")}
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
          <span dir="ltr">{CUSTOMERS.length}</span> {t("customers")}
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

/** ISO YYYY-MM-DD → "20 Aug 2026", locale-neutral so it doesn't drift under `ar`. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
}

/** Format SAR amounts as `SAR 12,340` — LTR digits with a leading currency. */
function formatSar(amount: number): string {
  return `SAR ${amount.toLocaleString("en-US")}`;
}
