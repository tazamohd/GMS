import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Vehicles — /vehicles route.
 *
 * **Spec-only port**, combining `SALIS_AUTO_PAGE_REFERENCE_GUIDE.md`
 * §019 (add/edit form) and §020 (list). The sidebar links to `/vehicles`
 * so this lands the list view — the guide's §019 form ("Add vehicle
 * with make/model/year fields, VIN input with decoder button, photo
 * upload") is a separate future slice at `/vehicles/new`.
 *
 * `Vehicles.dc.html` has not reached this session. Every fixture is
 * marked `// FIXTURE`.
 */

interface VehicleRow {
  id: string;
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  owner: string;
  mileage: number;
  status: "active" | "in-service" | "archived";
  lastVisit: string; // ISO
}

const VEHICLES: VehicleRow[] = [
  // FIXTURE
  { id: "VH-2418", plate: "ABC-1234", vin: "1HGCM82633A004352", make: "Toyota", model: "Camry", year: 2022, owner: "Faisal Al-Otaibi", mileage: 42_180, status: "in-service", lastVisit: "2026-08-27" },
  { id: "VH-2417", plate: "DEF-4567", vin: "3N1AB7AP7HY283194", make: "Nissan", model: "Sunny", year: 2021, owner: "Sara Al-Harbi", mileage: 61_020, status: "active", lastVisit: "2026-08-14" },
  { id: "VH-2414", plate: "GHI-7890", vin: "5NPE24AF6HH461028", make: "Hyundai", model: "Sonata", year: 2023, owner: "Omar Al-Ghamdi", mileage: 18_450, status: "active", lastVisit: "2026-06-30" },
  { id: "VH-2410", plate: "JKL-2345", vin: "KNAKN811BJ5054321", make: "Kia", model: "Sportage", year: 2020, owner: "Bandar Al-Rashid", mileage: 89_770, status: "in-service", lastVisit: "2026-08-25" },
  { id: "VH-2402", plate: "MNO-6789", vin: "KMHDU4AD1BU210987", make: "Hyundai", model: "Sonata", year: 2023, owner: "Reem Al-Zahrani", mileage: 21_310, status: "active", lastVisit: "2026-08-08" },
  { id: "VH-2395", plate: "PQR-3456", vin: "2T1BURHE7HC876543", make: "Toyota", model: "Corolla", year: 2019, owner: "Nada Al-Qahtani", mileage: 118_240, status: "archived", lastVisit: "2026-03-11" },
];

type StatusFilter = "all" | VehicleRow["status"];

function badgeVariant(s: VehicleRow["status"]): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "in-service":
      return "info";
    case "active":
      return "success";
    case "archived":
      return "neutral";
    default:
      return "neutral";
  }
}

const STATUS_LABEL: Record<VehicleRow["status"], string> = {
  active: "Active",
  "in-service": "In service",
  archived: "Archived",
};

export default function Vehicles() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return VEHICLES.filter((v) => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        v.id.toLowerCase().includes(needle) ||
        v.plate.toLowerCase().includes(needle) ||
        v.vin.toLowerCase().includes(needle) ||
        v.make.toLowerCase().includes(needle) ||
        v.model.toLowerCase().includes(needle) ||
        v.owner.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter]);

  return (
    <Shell screenLabel="Vehicles" activeItem="Vehicles">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="m-0 text-[26px] font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}
            >
              {t("Vehicles")}
            </h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {t("Registered vehicles — search by VIN, plate, make, or owner")}
            </p>
          </div>
          <Button>
            <SalisIcon name="Car" size={14} />
            <span>{t("Add vehicle")}</span>
          </Button>
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Search by VIN, plate, make, model, or owner")}
              aria-label={t("Search vehicles")}
            />
          </div>
          <div className="flex gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
            {(["all", "active", "in-service", "archived"] as const).map((s) => (
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
                {t(s === "all" ? "All" : STATUS_LABEL[s as VehicleRow["status"]])}
              </button>
            ))}
          </div>
        </section>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--surface-inset)", color: "var(--text-muted)" }}>
                  <Th align={rtl ? "right" : "left"}>{t("Vehicle")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Plate")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("VIN")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Owner")}</Th>
                  <Th align="right">{t("Mileage")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Last visit")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Status")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                      {t("No vehicles match this filter")}
                    </td>
                  </tr>
                ) : (
                  rows.map((v) => (
                    <tr
                      key={v.id}
                      className="border-t hover:bg-[rgba(10,94,215,.03)]"
                      style={{ borderColor: "var(--border-default)" }}
                    >
                      <Td>
                        <Link
                          to={`/vehicles/${v.id}`}
                          className="no-underline"
                          style={{ color: "var(--text-heading)", fontWeight: 500 }}
                        >
                          {v.year} {v.make} {v.model}
                        </Link>
                        <p className="m-0 mt-0.5 font-mono text-xs" style={{ color: "var(--text-muted)" }} dir="ltr">
                          {v.id}
                        </p>
                      </Td>
                      <Td>
                        <span className="font-mono" style={{ color: "var(--text-body)" }} dir="ltr">
                          {v.plate}
                        </span>
                      </Td>
                      <Td>
                        <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }} dir="ltr">
                          {v.vin}
                        </span>
                      </Td>
                      <Td>
                        <span style={{ color: "var(--text-body)" }}>{v.owner}</span>
                      </Td>
                      <Td align="right">
                        <span className="font-mono" style={{ color: "var(--text-body)" }} dir="ltr">
                          {v.mileage.toLocaleString("en-US")} km
                        </span>
                      </Td>
                      <Td dir="ltr">
                        <span style={{ color: "var(--text-body)" }}>{formatDate(v.lastVisit)}</span>
                      </Td>
                      <Td>
                        <StatusBadge variant={badgeVariant(v.status)}>
                          {t(STATUS_LABEL[v.status])}
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
          <span dir="ltr">{VEHICLES.length}</span> {t("vehicles")}
        </p>
      </div>
    </Shell>
  );
}

function Th({ align = "left", children }: { align?: "left" | "right"; children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
      style={{ textAlign: align, fontFamily: "var(--font-action)" }}
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

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
}
