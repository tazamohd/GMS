import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Payments — /payments route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §051.
 * `Payments.dc.html` has not reached this session.
 *
 * The guide lists a "payment processing center" — mixing capture form
 * and receipt history. This lands the history table (what a workshop
 * actually looks at day-to-day); capturing a new payment is a modal or
 * a `/payments/new` follow-up.
 */

type Method = "cash" | "card" | "bank-transfer" | "stcpay" | "cheque";

interface PaymentRow {
  id: string;
  invoiceId: string;
  customer: string;
  when: string; // ISO date
  method: Method;
  reference?: string;
  amountSar: number;
  status: "posted" | "pending" | "refunded";
}

const PAYMENTS: PaymentRow[] = [
  // FIXTURE
  { id: "PY-8912", invoiceId: "INV-2026-0138", customer: "Bandar Al-Rashid", when: "2026-08-27", method: "card", reference: "ch_3AbCdEf...", amountSar: 1500, status: "posted" },
  { id: "PY-8908", invoiceId: "INV-2026-0136", customer: "Omar Al-Ghamdi", when: "2026-08-24", method: "cash", amountSar: 480, status: "posted" },
  { id: "PY-8905", invoiceId: "INV-2026-0134", customer: "Nada Al-Qahtani", when: "2026-08-23", method: "stcpay", reference: "STC-778829", amountSar: 220, status: "posted" },
  { id: "PY-8901", invoiceId: "INV-2026-0128", customer: "Reem Al-Zahrani", when: "2026-08-18", method: "bank-transfer", reference: "SNBSA-4402", amountSar: 1980, status: "posted" },
  { id: "PY-8898", invoiceId: "INV-2026-0125", customer: "Sara Al-Harbi", when: "2026-08-14", method: "cheque", reference: "CHK-118422", amountSar: 620, status: "pending" },
  { id: "PY-8874", invoiceId: "INV-2026-0102", customer: "Layla Al-Bakri", when: "2026-07-30", method: "card", reference: "ch_3XwYzAb...", amountSar: 340, status: "refunded" },
];

type StatusFilter = "all" | PaymentRow["status"];
type MethodFilter = "all" | Method;

const METHOD_LABEL: Record<Method, string> = {
  cash: "Cash",
  card: "Card",
  "bank-transfer": "Bank transfer",
  stcpay: "STC Pay",
  cheque: "Cheque",
};

function methodIcon(m: Method): "CreditCard" | "Receipt" {
  return m === "card" ? "CreditCard" : "Receipt";
}

function badgeVariant(s: PaymentRow["status"]): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "posted":
      return "success";
    case "pending":
      return "info";
    case "refunded":
      return "warning";
    default:
      return "neutral";
  }
}

export default function Payments() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PAYMENTS.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (methodFilter !== "all" && p.method !== methodFilter) return false;
      if (!needle) return true;
      return (
        p.id.toLowerCase().includes(needle) ||
        p.invoiceId.toLowerCase().includes(needle) ||
        p.customer.toLowerCase().includes(needle) ||
        (p.reference?.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [query, statusFilter, methodFilter]);

  const totalSar = useMemo(
    () => rows.filter((r) => r.status === "posted").reduce((sum, r) => sum + r.amountSar, 0),
    [rows],
  );

  return (
    <Shell screenLabel="Payments" activeItem="Payments">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[26px] font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>{t("Payments")}</h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("Receipt history — search, filter by method, verify against bank")}</p>
          </div>
          <Button>
            <SalisIcon name="CreditCard" size={14} />
            <span>{t("Record payment")}</span>
          </Button>
        </section>

        <section className="flex flex-col gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search by payment id, invoice id, customer, or reference")} aria-label={t("Search payments")} />
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
              {(["all", "posted", "pending", "refunded"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)} aria-pressed={statusFilter === s} className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ fontFamily: "var(--font-action)", background: statusFilter === s ? "var(--salis-blue)" : "transparent", color: statusFilter === s ? "#fff" : "var(--text-muted)" }}>
                  {t(s === "all" ? "All statuses" : s === "posted" ? "Posted" : s === "pending" ? "Pending" : "Refunded")}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
              {(["all", "cash", "card", "bank-transfer", "stcpay", "cheque"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMethodFilter(m)} aria-pressed={methodFilter === m} className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ fontFamily: "var(--font-action)", background: methodFilter === m ? "var(--salis-blue)" : "transparent", color: methodFilter === m ? "#fff" : "var(--text-muted)" }}>
                  {t(m === "all" ? "All methods" : METHOD_LABEL[m as Method])}
                </button>
              ))}
            </div>
          </div>
        </section>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--surface-inset)", color: "var(--text-muted)" }}>
                  <Th align={rtl ? "right" : "left"}>{t("Payment")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Invoice")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Customer")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Date")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Method")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Reference")}</Th>
                  <Th align="right">{t("Amount")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Status")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>{t("No payments match this filter")}</td></tr>
                ) : (
                  rows.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-[rgba(10,94,215,.03)]" style={{ borderColor: "var(--border-default)" }}>
                      <Td><Link to={`/payments/${p.id}`} className="font-mono font-semibold no-underline" style={{ color: "var(--salis-blue)" }} dir="ltr">{p.id}</Link></Td>
                      <Td dir="ltr"><Link to={`/invoices/${p.invoiceId}`} className="font-mono no-underline" style={{ color: "var(--text-body)" }}>{p.invoiceId}</Link></Td>
                      <Td><span style={{ color: "var(--text-heading)", fontWeight: 500 }}>{p.customer}</span></Td>
                      <Td dir="ltr"><span style={{ color: "var(--text-body)" }}>{formatDate(p.when)}</span></Td>
                      <Td>
                        <span className="inline-flex items-center gap-1.5">
                          <SalisIcon name={methodIcon(p.method)} size={14} style={{ color: "var(--text-muted)" }} />
                          <span style={{ color: "var(--text-body)" }}>{t(METHOD_LABEL[p.method])}</span>
                        </span>
                      </Td>
                      <Td dir="ltr"><span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{p.reference ?? "—"}</span></Td>
                      <Td align="right"><span className="font-mono" style={{ color: "var(--text-heading)", fontWeight: 500 }} dir="ltr">{formatSar(p.amountSar)}</span></Td>
                      <Td><StatusBadge variant={badgeVariant(p.status)}>{t(p.status === "posted" ? "Posted" : p.status === "pending" ? "Pending" : "Refunded")}</StatusBadge></Td>
                    </tr>
                  ))
                )}
              </tbody>
              {rows.length > 0 ? (
                <tfoot>
                  <tr style={{ background: "var(--surface-inset)", color: "var(--text-heading)" }}>
                    <Td colSpan={6}>{t("Total posted")}</Td>
                    <Td align="right"><span className="font-mono font-semibold" dir="ltr">{formatSar(totalSar)}</span></Td>
                    <Td />
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </Card>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("Showing")} <span dir="ltr">{rows.length}</span> {t("of")} <span dir="ltr">{PAYMENTS.length}</span> {t("payments")}
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
