/**
 * Section data for the settings screens.
 *
 * `AdvancedSettings.dc.html` and `AdvancedSettings.Mobile.dc.html` carry the same
 * five sections but shorten labels and descriptions on small screens, so each
 * string is expressed as a `{ full, compact }` pair and picked via `isMobile`.
 */

export type ToggleKey = "twoFa" | "emailNotif" | "smsAlert" | "autoBackup" | "auditLog";

export type Toggles = Record<ToggleKey, boolean>;

export const DEFAULT_TOGGLES: Toggles = {
  twoFa: true,
  emailNotif: true,
  smsAlert: false,
  autoBackup: true,
  auditLog: true,
};

export type Control =
  | { kind: "toggle"; key: ToggleKey }
  | { kind: "value"; value: string }
  | { kind: "badge"; label: string; tone: "blue" | "orange" };

export type SettingsRow = { label: string; desc: string; control: Control };
export type SettingsSection = { icon: string; title: string; items: SettingsRow[] };

type Translate = (source: string) => string;

/** Picks the compact wording on phones, matching the mobile design file. */
function pick(isMobile: boolean, full: string, compact: string) {
  return isMobile ? compact : full;
}

export function buildSettingsSections({
  t,
  rtl,
  isMobile,
}: {
  t: Translate;
  rtl: boolean;
  isMobile: boolean;
}): SettingsSection[] {
  const m = (full: string, compact: string) => pick(isMobile, full, compact);

  const toggle = (key: ToggleKey): Control => ({ kind: "toggle", key });
  const value = (v: string): Control => ({ kind: "value", value: v });
  const badge = (label: string, tone: "blue" | "orange"): Control => ({
    kind: "badge",
    label,
    tone,
  });

  return [
    {
      icon: "Building2",
      title: t("Workshop Information"),
      items: [
        {
          label: t("Workshop Name"),
          desc: "Al-Amri Auto Center",
          control: value(m("Al-Amri Auto Center", "Al-Amri")),
        },
        { label: t("VAT Rate"), desc: t("Tax Settings"), control: value("15%") },
        {
          label: t("Business Hours"),
          desc: rtl ? "السبت-الخميس" : m("Sat–Thu, 8 AM – 6 PM", "Sat–Thu"),
          control: value("8–18"),
        },
      ],
    },
    {
      icon: "Shield",
      title: t("Security Settings"),
      items: [
        {
          label: t("Two-Factor Authentication"),
          desc: rtl
            ? m("طبقة أمان إضافية", "أمان إضافي")
            : m("Extra layer of security", "Extra security"),
          control: toggle("twoFa"),
        },
        {
          label: t("Session Timeout"),
          desc: rtl
            ? m("انتهاء تلقائي بعد", "انتهاء تلقائي")
            : m("Auto-expire after inactivity", "Auto-expire"),
          control: value("30 min"),
        },
        {
          label: t("Audit Log"),
          desc: rtl
            ? m("تتبع جميع الإجراءات", "تتبع الإجراءات")
            : m("Track all system actions", "Track actions"),
          control: toggle("auditLog"),
        },
      ],
    },
    {
      icon: "Bell",
      title: t("Notifications Preferences"),
      items: [
        {
          label: t("Email Notifications"),
          desc: rtl
            ? m("إشعارات البريد الإلكتروني", "إشعارات البريد")
            : m("Receive email alerts", "Email alerts"),
          control: toggle("emailNotif"),
        },
        {
          label: t("SMS Alerts"),
          desc: rtl
            ? m("تنبيهات الرسائل النصية", "رسائل نصية")
            : m("SMS for critical alerts", "SMS alerts"),
          control: toggle("smsAlert"),
        },
      ],
    },
    {
      icon: "Plug",
      title: t("Integrations"),
      items: [
        {
          label: m("ZATCA E-Invoice", "ZATCA"),
          desc: rtl
            ? m("ربط الفوترة الإلكترونية", "فوترة إلكترونية")
            : m("Saudi e-invoicing integration", "E-invoicing"),
          control: badge(t("Connected"), "blue"),
        },
        {
          label: m("WhatsApp Business", "WhatsApp"),
          desc: rtl ? m("إشعارات العملاء", "إشعارات") : m("Customer notifications", "Notifications"),
          control: badge(t("Connected"), "blue"),
        },
        {
          label: rtl ? "محاسبة" : m("Accounting Software", "Accounting"),
          desc: rtl ? m("تصدير البيانات المالية", "تصدير مالي") : m("Financial data export", "Export"),
          control: badge(t("Disconnected"), "orange"),
        },
      ],
    },
    {
      icon: "Database",
      title: t("Data Management"),
      items: [
        {
          label: t("Auto Backup"),
          desc: rtl ? m("نسخ احتياطي يومي", "نسخ يومي") : m("Daily automatic backup", "Daily backup"),
          control: toggle("autoBackup"),
        },
        {
          label: t("Retention Period"),
          desc: rtl ? m("مدة الاحتفاظ بالبيانات", "احتفاظ") : m("How long to keep data", "Data retention"),
          control: value(t("1 year")),
        },
      ],
    },
  ];
}
