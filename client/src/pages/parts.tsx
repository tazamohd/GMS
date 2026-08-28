import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Parts / Inventory — /parts route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §054
 * (Inventory Management). Sidebar links to `/parts`; §054 uses
 * `/inventory` — routing at `/parts` so the nav item works, since
 * the nav is what users click.
 *
 * `Inventory.dc.html` has not reached this session (DesignSync auth
 * still not seeded). Every fixture marked `// FIXTURE`.
 */

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

interface PartRow {
  sku: string;
  name: string;
  category: string;
  supplier: string;
  bin: string; // location code
  onHand: number;
  reorderPoint: number;
  costSar: number;
  status: StockStatus;
}

const PARTS: PartRow[] = [
  // FIXTURE
  { sku: "OF-TC22", name: "Oil filter — Camry 2022", category: "Filters", supplier: "Al-Riyadh Auto Parts", bin: "A-01-04", onHand: 24, reorderPoint: 10, costSar: 45, status: "in-stock" },
  { sku: "BP-TC22", name: "Brake pads (front) — Camry 2022", category: "Brakes", supplier: "Al-Riyadh Auto Parts", bin: "B-03-12", onHand: 6, reorderPoint: 8, costSar: 240, status: "low-stock" },
  { sku: "AF-HS23", name: "Air filter — Sonata 2023", category: "Filters", supplier: "Gulf Motor Supplies", bin: "A-01-06", onHand: 0, reorderPoint: 6, costSar: 62, status: "out-of-stock" },
  { sku: "SP-KS20", name: "Spark plugs (set) — Sportage 2020", category: "Ignition", supplier: "Gulf Motor Supplies", bin: "C-05-03", onHand: 12, reorderPoint: 5, costSar: 180, status: "in-stock" },
  { sku: "TB-KS20", name: "Timing belt kit — Sportage 2020", category: "Engine", supplier: "Gulf Motor Supplies", bin: "D-02-08", onHand: 3, reorderPoint: 4, costSar: 720, status: "low-stock" },
  { sku: "WP-NS21", name: "Water pump — Sunny 2021", category: "Cooling", supplier: "Al-Faisal Parts Co.", bin: "D-04-11", onHand: 5, reorderPoint: 3, costSar: 480, status: "in-stock" },
  { sku: "BT-100", name: "Battery — 100 Ah", category: "Electrical", supplier: "Al-Faisal Parts Co.", bin: "E-01-01", onHand: 0, reorderPoint: 4, costSar: 620, status: "out-of-stock" },
];

type StatusFilter = "all" | StockStatus;

function badgeVariant(s: StockStatus): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "in-stock":
      return "success";
    case "low-stock":
      return "warning";
    case "out-of-stock":
      return "warning";
    default:
      return "neutral";
  }
}

const STATUS_LABEL: Record<StockStatus, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "out-of-stock": "Out of stock",
};

export default function Parts() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PARTS.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        p.sku.toLowerCase().includes(needle) ||
        p.name.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.supplier.toLowerCase().includes(needle) ||
        p.bin.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter]);

  return (
    <Shell screenLabel="Parts" activeItem="Parts">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[26px] font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>
              {t("Parts")}
            </h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Inventory — search by SKU, name, category, supplier, or bin")}
            </p>
          </div>
          <Button>
            <SalisIcon name="Package" size={14} />
            <span>{t("Add part")}</span>
          </Button>
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search by SKU, name, category, supplier, or bin")} aria-label={t("Search parts")} />
          </div>
          <div className="flex gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
            {(["all", "in-stock", "low-stock", "out-of-stock"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                aria-pressed={statusFilter === s}
                className="rounded-md px-3 py-1.5 text-xs font-medium"
                style={{ fontFamily: "var(--font-action)", background: statusFilter === s ? "var(--salis-blue)" : "transparent", color: statusFilter === s ? "#fff" : "var(--text-muted)" }}
              >
                {t(s === "all" ? "All" : STATUS_LABEL[s as StockStatus])}
              </button>
            ))}
          </div>
        </section>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--surface-inset)", color: "var(--text-muted)" }}>
                  <Th align={rtl ? "right" : "left"}>{t("SKU")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Part")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Category")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Supplier")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Bin")}</Th>
                  <Th align="right">{t("On hand")}</Th>
                  <Th align="right">{t("Reorder at")}</Th>
                  <Th align="right">{t("Cost")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Status")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                      {t("No parts match this filter")}
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => (
                    <tr key={p.sku} className="border-t hover:bg-[rgba(10,94,215,.03)]" style={{ borderColor: "var(--border-default)" }}>
                      <Td>
                        <Link to={`/parts/${p.sku}`} className="font-mono font-semibold no-underline" style={{ color: "var(--salis-blue)" }} dir="ltr">{p.sku}</Link>
                      </Td>
                      <Td><span style={{ color: "var(--text-heading)", fontWeight: 500 }}>{p.name}</span></Td>
                      <Td><span style={{ color: "var(--text-body)" }}>{p.category}</span></Td>
                      <Td><span style={{ color: "var(--text-body)" }}>{p.supplier}</span></Td>
                      <Td><span className="font-mono" style={{ color: "var(--text-body)" }} dir="ltr">{p.bin}</span></Td>
                      <Td align="right"><span className="font-mono" style={{ color: p.status === "out-of-stock" ? "var(--salis-orange)" : "var(--text-body)", fontWeight: p.status !== "in-stock" ? 600 : 400 }} dir="ltr">{p.onHand}</span></Td>
                      <Td align="right"><span className="font-mono" style={{ color: "var(--text-muted)" }} dir="ltr">{p.reorderPoint}</span></Td>
                      <Td align="right"><span className="font-mono" style={{ color: "var(--text-body)" }} dir="ltr">{formatSar(p.costSar)}</span></Td>
                      <Td><StatusBadge variant={badgeVariant(p.status)}>{t(STATUS_LABEL[p.status])}</StatusBadge></Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("Showing")} <span dir="ltr">{rows.length}</span> {t("of")} <span dir="ltr">{PARTS.length}</span> {t("parts")}
        </p>
      </div>
    </Shell>
  );
}

function Th({ align = "left", children }: { align?: "left" | "right"; children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ textAlign: align, fontFamily: "var(--font-action)" }}>{children}</th>;
}
function Td({ align = "left", dir, children }: { align?: "left" | "right"; dir?: "ltr" | "rtl"; children: React.ReactNode }) {
  return <td className="px-4 py-3" style={{ textAlign: align }} dir={dir}>{children}</td>;
}
function formatSar(amount: number): string {
  return `SAR ${amount.toLocaleString("en-US")}`;
}
