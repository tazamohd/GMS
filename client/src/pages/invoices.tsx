import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Invoices — /invoices route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §048.
 * `Invoices.dc.html` has not reached this session.
 *
 * Includes a subtotals row at the bottom summarising totals for what's
 * visible in the filter — a real workshop wants to see "how much is
 * outstanding *right now*" without opening a report.
 */

type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue" | "cancelled";

interface InvoiceRow {
  id: string;
  jobId: string;
  customer: string;
  issued: string; // ISO
  due: string;
  totalSar: number;
  paidSar: number;
  status: InvoiceStatus;
}

const INVOICES: InvoiceRow[] = [
  // FIXTURE — SAR amounts include VAT
  { id: "INV-2026-0143", jobId: "JC-1421", customer: "Faisal Al-Otaibi", issued: "2026-08-27", due: "2026-09-11", totalSar: 1240, paidSar: 0, status: "sent" },
  { id: "INV-2026-0142", jobId: "JC-1420", customer: "Sara Al-Harbi", issued: "2026-08-27", due: "2026-09-11", totalSar: 620, paidSar: 0, status: "draft" },
  { id: "INV-2026-0138", jobId: "JC-1416", customer: "Bandar Al-Rashid", issued: "2026-08-25", due: "2026-09-09", totalSar: 2840, paidSar: 1500, status: "partial" },
  { id: "INV-2026-0136", jobId: "JC-1413", customer: "Omar Al-Ghamdi", issued: "2026-08-24", due: "2026-09-08", totalSar: 480, paidSar: 480, status: "paid" },
  { id: "INV-2026-0134", jobId: "JC-1410", customer: "Nada Al-Qahtani", issued: "2026-08-23", due: "2026-09-07", totalSar: 220, paidSar: 220, status: "paid" },
  { id: "INV-2026-0121", jobId: "JC-1382", customer: "Layla Al-Bakri", issued: "2026-07-30", due: "2026-08-14", totalSar: 1150, paidSar: 0, status: "overdue" },
  { id: "INV-2026-0118", jobId: "JC-1377", customer: "Turki Al-Saleh", issued: "2026-07-28", due: "2026-08-12", totalSar: 340, paidSar: 0, status: "cancelled" },
];

type StatusFilter = "all" | "outstanding" | InvoiceStatus;

function badgeVariant(s: InvoiceStatus): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "paid":
      return "success";
    case "sent":
    case "partial":
      return "info";
    case "draft":
      return "neutral";
    case "overdue":
    case "cancelled":
      return "warning";
    default:
      return "neutral";
  }
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  partial: "Partial",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export default function Invoices() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return INVOICES.filter((inv) => {
      if (statusFilter === "outstanding") {
        // Outstanding = anything with a non-zero balance and not cancelled.
        if (inv.status === "cancelled") return false;
        if (inv.paidSar >= inv.totalSar) return false;
      } else if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        inv.id.toLowerCase().includes(needle) ||
        inv.jobId.toLowerCase().includes(needle) ||
        inv.customer.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter]);

  const totals = useMemo(() => {
    let total = 0;
    let paid = 0;
    let outstanding = 0;
    for (const row of rows) {
      total += row.totalSar;
      paid += row.paidSar;
      if (row.status !== "cancelled") outstanding += row.totalSar - row.paidSar;
    }
    return { total, paid, outstanding };
  }, [rows]);

  return (
    <Shell screenLabel="Invoices" activeItem="Invoices">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[26px] font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>{t("Invoices")}</h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("Filter, review balance, act on overdue")}</p>
          </div>
          <Button>
            <SalisIcon name="Receipt" size={14} />
            <span>{t("New invoice")}</span>
          </Button>
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search by invoice id, job id, or customer")} aria-label={t("Search invoices")} />
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
            {(["all", "outstanding", "sent", "partial", "paid", "overdue"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)} aria-pressed={statusFilter === s} className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ fontFamily: "var(--font-action)", background: statusFilter === s ? "var(--salis-blue)" : "transparent", color: statusFilter === s ? "#fff" : "var(--text-muted)" }}>
                {t(s === "all" ? "All" : s === "outstanding" ? "Outstanding" : STATUS_LABEL[s as InvoiceStatus])}
              </button>
            ))}
          </div>
        </section>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--surface-inset)", color: "var(--text-muted)" }}>
                  <Th align={rtl ? "right" : "left"}>{t("Invoice")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Job")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Customer")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Issued")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Due")}</Th>
                  <Th align="right">{t("Total")}</Th>
                  <Th align="right">{t("Paid")}</Th>
                  <Th align="right">{t("Balance")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Status")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>{t("No invoices match this filter")}</td></tr>
                ) : (
                  rows.map((inv) => {
                    const balance = inv.totalSar - inv.paidSar;
                    return (
                      <tr key={inv.id} className="border-t hover:bg-[rgba(10,94,215,.03)]" style={{ borderColor: "var(--border-default)" }}>
                        <Td><Link to={`/invoices/${inv.id}`} className="font-mono font-semibold no-underline" style={{ color: "var(--salis-blue)" }} dir="ltr">{inv.id}</Link></Td>
                        <Td dir="ltr"><Link to={`/job-cards/${inv.jobId}`} className="font-mono no-underline" style={{ color: "var(--text-body)" }}>{inv.jobId}</Link></Td>
                        <Td><span style={{ color: "var(--text-heading)", fontWeight: 500 }}>{inv.customer}</span></Td>
                        <Td dir="ltr"><span style={{ color: "var(--text-body)" }}>{formatDate(inv.issued)}</span></Td>
                        <Td dir="ltr"><span style={{ color: inv.status === "overdue" ? "var(--salis-orange)" : "var(--text-body)", fontWeight: inv.status === "overdue" ? 600 : 400 }}>{formatDate(inv.due)}</span></Td>
                        <Td align="right"><span className="font-mono" style={{ color: "var(--text-body)" }} dir="ltr">{formatSar(inv.totalSar)}</span></Td>
                        <Td align="right"><span className="font-mono" style={{ color: "var(--text-muted)" }} dir="ltr">{inv.paidSar === 0 ? "—" : formatSar(inv.paidSar)}</span></Td>
                        <Td align="right"><span className="font-mono" style={{ color: balance === 0 ? "var(--text-muted)" : "var(--text-heading)", fontWeight: balance === 0 ? 400 : 600 }} dir="ltr">{balance === 0 ? "—" : formatSar(balance)}</span></Td>
                        <Td><StatusBadge variant={badgeVariant(inv.status)}>{t(STATUS_LABEL[inv.status])}</StatusBadge></Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {rows.length > 0 ? (
                <tfoot>
                  <tr style={{ background: "var(--surface-inset)", color: "var(--text-heading)" }}>
                    <Td>{t("Totals")}</Td>
                    <Td colSpan={4} />
                    <Td align="right"><span className="font-mono font-semibold" dir="ltr">{formatSar(totals.total)}</span></Td>
                    <Td align="right"><span className="font-mono font-semibold" dir="ltr">{formatSar(totals.paid)}</span></Td>
                    <Td align="right"><span className="font-mono font-semibold" style={{ color: totals.outstanding > 0 ? "var(--salis-orange)" : "var(--text-heading)" }} dir="ltr">{formatSar(totals.outstanding)}</span></Td>
                    <Td />
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </Card>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("Showing")} <span dir="ltr">{rows.length}</span> {t("of")} <span dir="ltr">{INVOICES.length}</span> {t("invoices")}
        </p>
      </div>
    </Shell>
  );
}

function Th({ align = "left", children }: { align?: "left" | "right"; children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ textAlign: align, fontFamily: "var(--font-action)" }}>{children}</th>;
}
function Td({ align = "left", dir, colSpan, children }: { align?: "left" | "right"; dir?: "ltr" | "rtl"; colSpan?: number; children?: React.ReactNode }) {
  return <td className="px-4 py-3" style={{ textAlign: align }} dir={dir} colSpan={colSpan}>{children}</td>;
}
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
}
function formatSar(amount: number): string {
  return `SAR ${amount.toLocaleString("en-US")}`;
}
