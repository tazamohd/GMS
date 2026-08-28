import { useMemo, useState } from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ds";
import { SalisIcon, type SalisIconName } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Analytics — /analytics route.
 *
 * **Spec-only port**, from `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md` §129
 * (Business Intelligence). `BIDashboard.dc.html` not on this session.
 *
 * A chart-heavy screen would need recharts on top of the fixture data;
 * that's not this slice's scope. This lands a KPI board — four
 * headline metrics + a monthly bar-strip drawn in inline SVG (no
 * library needed) + a top-services list. The workshop can read
 * "how is the business doing this month" without a report open.
 */

type Range = "today" | "this-week" | "this-month" | "ytd";

interface Kpi {
  labelKey: string;
  value: string;
  deltaPct: number; // vs previous period
  icon: SalisIconName;
  tone: "blue" | "orange";
}

interface Bar {
  monthKey: string;
  revenueSar: number;
  invoicesCount: number;
}

interface ServiceRow {
  name: string;
  jobs: number;
  revenueSar: number;
  share: number; // 0..1
}

const KPIS: Kpi[] = [
  // FIXTURE — swap for a real /api/analytics/summary call.
  { labelKey: "Revenue", value: "SAR 184,320", deltaPct: 8.4, icon: "Receipt", tone: "blue" },
  { labelKey: "Job cards closed", value: "142", deltaPct: 6.1, icon: "ClipboardList", tone: "blue" },
  { labelKey: "New customers", value: "38", deltaPct: 2.7, icon: "Users", tone: "blue" },
  { labelKey: "Outstanding", value: "SAR 21,480", deltaPct: -3.2, icon: "Bell", tone: "orange" },
];

const BARS: Bar[] = [
  // FIXTURE — trailing 8 months.
  { monthKey: "Jan", revenueSar: 132_400, invoicesCount: 98 },
  { monthKey: "Feb", revenueSar: 118_200, invoicesCount: 84 },
  { monthKey: "Mar", revenueSar: 141_800, invoicesCount: 106 },
  { monthKey: "Apr", revenueSar: 156_100, invoicesCount: 118 },
  { monthKey: "May", revenueSar: 149_300, invoicesCount: 112 },
  { monthKey: "Jun", revenueSar: 167_900, invoicesCount: 124 },
  { monthKey: "Jul", revenueSar: 172_400, invoicesCount: 131 },
  { monthKey: "Aug", revenueSar: 184_320, invoicesCount: 142 },
];

const TOP_SERVICES: ServiceRow[] = [
  // FIXTURE
  { name: "Full service + oil change", jobs: 34, revenueSar: 42_160, share: 0.22 },
  { name: "Brake pads replacement", jobs: 22, revenueSar: 27_640, share: 0.15 },
  { name: "AC repair", jobs: 12, revenueSar: 22_800, share: 0.12 },
  { name: "Diagnostic scan", jobs: 28, revenueSar: 8_400, share: 0.10 },
  { name: "Timing belt replacement", jobs: 6, revenueSar: 17_280, share: 0.09 },
];

const RANGE_LABEL: Record<Range, string> = {
  today: "Today",
  "this-week": "This week",
  "this-month": "This month",
  ytd: "Year to date",
};

export default function Analytics() {
  const { t, rtl } = useTranslate();
  const [range, setRange] = useState<Range>("this-month");

  const maxRevenue = useMemo(() => Math.max(...BARS.map((b) => b.revenueSar)), []);

  return (
    <Shell screenLabel="Analytics" activeItem="Analytics">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[26px] font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>{t("Analytics")}</h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("Headline metrics, trend, and top services")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
              {(["today", "this-week", "this-month", "ytd"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRange(r)} aria-pressed={range === r} className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ fontFamily: "var(--font-action)", background: range === r ? "var(--salis-blue)" : "transparent", color: range === r ? "#fff" : "var(--text-muted)" }}>
                  {t(RANGE_LABEL[r])}
                </button>
              ))}
            </div>
            <Button variant="outline">
              <SalisIcon name="FileText" size={14} />
              <span>{t("Export")}</span>
            </Button>
          </div>
        </section>

        {/* KPIs -------------------------------------------------- */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => (
            <KpiTile key={k.labelKey} kpi={k} label={t(k.labelKey)} rangeLabel={t(RANGE_LABEL[range])} />
          ))}
        </section>

        {/* Revenue trend ----------------------------------------- */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>{t("Revenue — trailing 8 months")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueBars data={BARS} max={maxRevenue} rtl={rtl} />
              <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{t("Bars")}: {t("SAR revenue")}</span>
                <span>{t("Max")}: <span className="font-mono" dir="ltr">{formatSar(maxRevenue)}</span></span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Top services ------------------------------------------ */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>{t("Top services")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {TOP_SERVICES.map((s) => (
                  <li key={s.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span style={{ color: "var(--text-heading)", fontWeight: 500 }}>{s.name}</span>
                      <span className="font-mono" style={{ color: "var(--text-body)" }} dir="ltr">
                        {formatSar(s.revenueSar)} <span style={{ color: "var(--text-muted)" }}>· {s.jobs} {t("jobs")}</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(10,94,215,.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.max(6, s.share * 100)}%`, background: "var(--salis-gradient)" }} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </Shell>
  );
}

function KpiTile({ kpi, label, rangeLabel }: { kpi: Kpi; label: string; rangeLabel: string }) {
  const isOrange = kpi.tone === "orange";
  const isPositive = kpi.deltaPct >= 0;
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
          <p className="m-0 mt-1 text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: isOrange ? "var(--salis-orange)" : "var(--text-heading)" }} dir="ltr">
            {kpi.value}
          </p>
          <p className="m-0 mt-1 text-xs" style={{ color: isPositive ? "var(--salis-blue)" : "var(--salis-orange)" }} dir="ltr">
            {isPositive ? "+" : ""}{kpi.deltaPct.toFixed(1)}% <span style={{ color: "var(--text-muted)" }}>vs {rangeLabel.toLowerCase()}</span>
          </p>
        </div>
        <span className="flex flex-shrink-0 items-center justify-center rounded-lg p-2" style={{ background: isOrange ? "rgba(255,138,0,.12)" : "rgba(10,94,215,.12)", color: isOrange ? "var(--salis-orange)" : "var(--salis-blue)" }}>
          <SalisIcon name={kpi.icon} size={18} />
        </span>
      </CardContent>
    </Card>
  );
}

/** Inline-SVG bar strip — no charting library needed for a scaffold.
 *  Bars scale to the max value in the series; the y-axis is implicit. */
function RevenueBars({ data, max, rtl }: { data: Bar[]; max: number; rtl: boolean }) {
  const barCount = data.length;
  const width = 100;
  const height = 32;
  const gap = 1;
  const barWidth = (width - gap * (barCount - 1)) / barCount;
  const bars = rtl ? [...data].reverse() : data;
  return (
    <svg viewBox={`0 0 ${width} ${height + 8}`} preserveAspectRatio="none" className="w-full" style={{ height: 120 }} aria-hidden="true">
      {bars.map((b, i) => {
        const h = max === 0 ? 0 : (b.revenueSar / max) * height;
        const x = i * (barWidth + gap);
        const y = height - h;
        return (
          <g key={b.monthKey}>
            <rect x={x} y={y} width={barWidth} height={h} rx={0.6} fill="var(--salis-blue)" opacity={0.85} />
            <text x={x + barWidth / 2} y={height + 6} textAnchor="middle" fontSize={3} fill="var(--text-muted)" style={{ fontFamily: "var(--font-action)" }}>
              {b.monthKey}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function formatSar(amount: number): string {
  return `SAR ${amount.toLocaleString("en-US")}`;
}
