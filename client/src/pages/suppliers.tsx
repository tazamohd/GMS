import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Suppliers — /suppliers route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §068.
 * `Suppliers.dc.html` has not reached this session. Every fixture is
 * marked `// FIXTURE`.
 */

interface SupplierRow {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  categories: string;
  paymentTerms: string;
  rating: number; // 1..5
  status: "active" | "inactive";
}

const SUPPLIERS: SupplierRow[] = [
  // FIXTURE
  { id: "SU-104", name: "Al-Riyadh Auto Parts", contact: "Yousef Al-Nasser", phone: "+966 11 234 5678", email: "orders@ralpauto.sa", categories: "Filters, Brakes", paymentTerms: "Net 30", rating: 4.7, status: "active" },
  { id: "SU-103", name: "Gulf Motor Supplies", contact: "Hassan Al-Otaibi", phone: "+966 12 345 6789", email: "sales@gulfmotor.sa", categories: "Ignition, Engine, Filters", paymentTerms: "Net 30", rating: 4.5, status: "active" },
  { id: "SU-101", name: "Al-Faisal Parts Co.", contact: "Salman Al-Faisal", phone: "+966 13 456 7890", email: "info@faisalparts.sa", categories: "Cooling, Electrical", paymentTerms: "Net 45", rating: 4.2, status: "active" },
  { id: "SU-097", name: "Jeddah Parts Center", contact: "Adel Al-Zahrani", phone: "+966 12 567 8901", email: "orders@jpc.sa", categories: "Body, Trim", paymentTerms: "COD", rating: 3.9, status: "active" },
  { id: "SU-088", name: "Eastern Auto Trade", contact: "Omar Al-Dossari", phone: "+966 13 678 9012", email: "sales@eatrade.sa", categories: "Suspension, Steering", paymentTerms: "Net 30", rating: 4.0, status: "inactive" },
];

type StatusFilter = "all" | SupplierRow["status"];

export default function Suppliers() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SUPPLIERS.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        s.id.toLowerCase().includes(needle) ||
        s.name.toLowerCase().includes(needle) ||
        s.contact.toLowerCase().includes(needle) ||
        s.email.toLowerCase().includes(needle) ||
        s.categories.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter]);

  return (
    <Shell screenLabel="Suppliers" activeItem="Suppliers">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[26px] font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>{t("Suppliers")}</h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("Supplier database — contact, categories, payment terms, rating")}</p>
          </div>
          <Button>
            <SalisIcon name="Truck" size={14} />
            <span>{t("Add supplier")}</span>
          </Button>
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search by id, name, contact, email, or category")} aria-label={t("Search suppliers")} />
          </div>
          <div className="flex gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
            {(["all", "active", "inactive"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)} aria-pressed={statusFilter === s} className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ fontFamily: "var(--font-action)", background: statusFilter === s ? "var(--salis-blue)" : "transparent", color: statusFilter === s ? "#fff" : "var(--text-muted)" }}>
                {t(s === "all" ? "All" : s === "active" ? "Active" : "Inactive")}
              </button>
            ))}
          </div>
        </section>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--surface-inset)", color: "var(--text-muted)" }}>
                  <Th align={rtl ? "right" : "left"}>{t("Supplier")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Contact")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Phone")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Email")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Categories")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Terms")}</Th>
                  <Th align="right">{t("Rating")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Status")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>{t("No suppliers match this filter")}</td></tr>
                ) : (
                  rows.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-[rgba(10,94,215,.03)]" style={{ borderColor: "var(--border-default)" }}>
                      <Td>
                        <Link to={`/suppliers/${s.id}`} className="no-underline" style={{ color: "var(--text-heading)", fontWeight: 500 }}>{s.name}</Link>
                        <p className="m-0 mt-0.5 font-mono text-xs" style={{ color: "var(--text-muted)" }} dir="ltr">{s.id}</p>
                      </Td>
                      <Td><span style={{ color: "var(--text-body)" }}>{s.contact}</span></Td>
                      <Td dir="ltr"><span style={{ color: "var(--text-body)" }}>{s.phone}</span></Td>
                      <Td dir="ltr"><span style={{ color: "var(--text-body)" }}>{s.email}</span></Td>
                      <Td><span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.categories}</span></Td>
                      <Td><span className="font-mono text-xs" style={{ color: "var(--text-body)" }} dir="ltr">{s.paymentTerms}</span></Td>
                      <Td align="right"><Rating rating={s.rating} /></Td>
                      <Td>
                        <StatusBadge status={s.status}>{t(s.status === "active" ? "Active" : "Inactive")}</StatusBadge>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("Showing")} <span dir="ltr">{rows.length}</span> {t("of")} <span dir="ltr">{SUPPLIERS.length}</span> {t("suppliers")}
        </p>
      </div>
    </Shell>
  );
}

function Rating({ rating }: { rating: number }) {
  // Locale-neutral one-decimal number, always LTR so it doesn't reorder
  // under Arabic — the design system's own status pill treats numeric
  // values as LTR by rule.
  return (
    <span className="font-mono text-sm" style={{ color: "var(--text-heading)", fontWeight: 500 }} dir="ltr">
      {rating.toFixed(1)}
      <span className="ms-1 text-xs" style={{ color: "var(--text-muted)" }}>/ 5</span>
    </span>
  );
}

function Th({ align = "left", children }: { align?: "left" | "right"; children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ textAlign: align, fontFamily: "var(--font-action)" }}>{children}</th>;
}
function Td({ align = "left", dir, children }: { align?: "left" | "right"; dir?: "ltr" | "rtl"; children: React.ReactNode }) {
  return <td className="px-4 py-3" style={{ textAlign: align }} dir={dir}>{children}</td>;
}
