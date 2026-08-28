import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Input, StatusBadge } from "@/components/ds";
import { SalisIcon } from "@/components/salis-icon";
import { Shell } from "@/components/shell";
import { useTranslate } from "@/lib/i18n";

/**
 * Users — /users route.
 *
 * **Spec-only port**, no matching `.dc.html` this session. Domain-derived
 * from the auth/role scaffolding: the workshop needs an admin view of
 * who can log in, their role, their last-login, and whether they're
 * still active. Deactivation replaces deletion so audit history holds.
 */

type Role = "owner" | "admin" | "manager" | "advisor" | "technician" | "accountant";

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: "active" | "inactive" | "invited";
  lastLogin?: string; // ISO
}

const USERS: UserRow[] = [
  // FIXTURE
  { id: "US-001", name: "Mohammed Al-Otaibi", email: "mohammed@salisauto.sa", phone: "+966 55 111 2233", role: "owner", status: "active", lastLogin: "2026-08-27T09:12:00" },
  { id: "US-004", name: "Fahad Al-Qahtani", email: "fahad@salisauto.sa", phone: "+966 55 222 3344", role: "admin", status: "active", lastLogin: "2026-08-27T08:44:00" },
  { id: "US-011", name: "Reem Al-Zahrani", email: "reem@salisauto.sa", phone: "+966 55 333 4455", role: "manager", status: "active", lastLogin: "2026-08-26T17:03:00" },
  { id: "US-018", name: "Nasser Al-Harbi", email: "nasser@salisauto.sa", phone: "+966 55 444 5566", role: "advisor", status: "active", lastLogin: "2026-08-27T07:58:00" },
  { id: "US-024", name: "Youssef Al-Ghamdi", email: "youssef@salisauto.sa", phone: "+966 55 555 6677", role: "technician", status: "active", lastLogin: "2026-08-27T08:02:00" },
  { id: "US-027", name: "Khalid Al-Shammari", email: "khalid@salisauto.sa", phone: "+966 55 666 7788", role: "technician", status: "active", lastLogin: "2026-08-26T18:41:00" },
  { id: "US-030", name: "Layla Al-Bakri", email: "layla@salisauto.sa", phone: "+966 55 777 8899", role: "accountant", status: "active", lastLogin: "2026-08-27T09:26:00" },
  { id: "US-035", name: "Turki Al-Saleh", email: "turki@salisauto.sa", phone: "+966 55 888 9900", role: "advisor", status: "inactive", lastLogin: "2026-06-18T14:20:00" },
  { id: "US-041", name: "Sara Al-Nasser", email: "sara@salisauto.sa", phone: "+966 55 999 0011", role: "accountant", status: "invited" },
];

type StatusFilter = "all" | UserRow["status"];
type RoleFilter = "all" | Role;

const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  advisor: "Service advisor",
  technician: "Technician",
  accountant: "Accountant",
};

const STATUS_LABEL: Record<UserRow["status"], string> = {
  active: "Active",
  inactive: "Inactive",
  invited: "Invited",
};

function badgeVariant(s: UserRow["status"]): "success" | "warning" | "info" | "neutral" {
  switch (s) {
    case "active":
      return "success";
    case "invited":
      return "info";
    case "inactive":
      return "warning";
    default:
      return "neutral";
  }
}

export default function Users() {
  const { t, rtl } = useTranslate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return USERS.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!needle) return true;
      return (
        u.id.toLowerCase().includes(needle) ||
        u.name.toLowerCase().includes(needle) ||
        u.email.toLowerCase().includes(needle) ||
        u.phone.toLowerCase().includes(needle)
      );
    });
  }, [query, statusFilter, roleFilter]);

  return (
    <Shell screenLabel="Users" activeItem="Users">
      <div className="animate-salis-fade-up mx-auto flex max-w-[1280px] flex-col gap-6 p-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[26px] font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>{t("Users")}</h1>
            <p className="m-0 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t("Team members, roles, and access — the login list")}</p>
          </div>
          <Button>
            <SalisIcon name="Users" size={14} />
            <span>{t("Invite user")}</span>
          </Button>
        </section>

        <section className="flex flex-col gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search by name, email, phone, or user id")} aria-label={t("Search users")} />
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
              {(["all", "active", "invited", "inactive"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)} aria-pressed={statusFilter === s} className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ fontFamily: "var(--font-action)", background: statusFilter === s ? "var(--salis-blue)" : "transparent", color: statusFilter === s ? "#fff" : "var(--text-muted)" }}>
                  {t(s === "all" ? "All" : STATUS_LABEL[s as UserRow["status"]])}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg border p-0.5" style={{ borderColor: "var(--border-default)" }}>
              {(["all", "owner", "admin", "manager", "advisor", "technician", "accountant"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRoleFilter(r)} aria-pressed={roleFilter === r} className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ fontFamily: "var(--font-action)", background: roleFilter === r ? "var(--salis-blue)" : "transparent", color: roleFilter === r ? "#fff" : "var(--text-muted)" }}>
                  {t(r === "all" ? "All roles" : ROLE_LABEL[r as Role])}
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
                  <Th align={rtl ? "right" : "left"}>{t("User")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Email")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Phone")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Role")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Last login")}</Th>
                  <Th align={rtl ? "right" : "left"}>{t("Status")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>{t("No users match this filter")}</td></tr>
                ) : (
                  rows.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-[rgba(10,94,215,.03)]" style={{ borderColor: "var(--border-default)" }}>
                      <Td>
                        <Link to={`/users/${u.id}`} className="no-underline" style={{ color: "var(--text-heading)", fontWeight: 500 }}>{u.name}</Link>
                        <p className="m-0 mt-0.5 font-mono text-xs" style={{ color: "var(--text-muted)" }} dir="ltr">{u.id}</p>
                      </Td>
                      <Td dir="ltr"><span style={{ color: "var(--text-body)" }}>{u.email}</span></Td>
                      <Td dir="ltr"><span style={{ color: "var(--text-body)" }}>{u.phone}</span></Td>
                      <Td><span style={{ color: "var(--text-body)" }}>{t(ROLE_LABEL[u.role])}</span></Td>
                      <Td dir="ltr"><span style={{ color: "var(--text-muted)" }}>{u.lastLogin ? formatWhen(u.lastLogin) : "—"}</span></Td>
                      <Td><StatusBadge variant={badgeVariant(u.status)}>{t(STATUS_LABEL[u.status])}</StatusBadge></Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("Showing")} <span dir="ltr">{rows.length}</span> {t("of")} <span dir="ltr">{USERS.length}</span> {t("users")}
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
function formatWhen(iso: string): string {
  const [datePart, timePart] = iso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hhmm = timePart ? timePart.slice(0, 5) : "";
  return `${day} ${months[month - 1]} ${year}${hhmm ? " " + hhmm : ""}`;
}
