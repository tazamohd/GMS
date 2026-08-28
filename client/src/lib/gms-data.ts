/**
 * Port of the `gms-data.js` module the design files import at runtime:
 *
 *   import("./gms-data.js").then(m => this.setState({ AR: m.AR, NAV: m.NAV }))
 *
 * The upstream module was not available, so both exports are reconstructed:
 *   - `AR` covers every string the ported screens pass through `t()`.
 *   - `NAV` matches the shape the sidebar consumes ({ label, icon, items:[{l,href}] })
 *     and the group count the design hints at (hint-placeholder-count="7"), but the
 *     specific sections are inferred from the product domain. Replace wholesale if
 *     the real module turns up — nothing reads these beyond the two accessors below.
 */

export type NavItem = { l: string; href: string };
export type NavGroup = { label: string; icon: string; items: NavItem[] };

/** English → Arabic. Missing keys fall through to the English source string. */
export const AR: Record<string, string> = {
  // Sign In
  "Sign In": "تسجيل الدخول",
  "Enter your credentials to access your account": "أدخل بياناتك للوصول إلى حسابك",
  Email: "البريد الإلكتروني",
  Password: "كلمة المرور",
  "Don't have an account?": "ليس لديك حساب؟",
  Register: "إنشاء حساب",
  Error: "خطأ",
  "Please fill in all fields": "يرجى تعبئة جميع الحقول",
  Success: "تم بنجاح",
  "Logged in successfully": "تم تسجيل الدخول بنجاح",
  "Show password": "إظهار كلمة المرور",
  "Hide password": "إخفاء كلمة المرور",

  // Account Locked
  "Account Locked": "الحساب مقفل",
  "Your account has been locked for security reasons.": "تم قفل حسابك لأسباب أمنية.",
  "Contact Support": "التواصل مع الدعم",
  "Back to Sign In": "العودة لتسجيل الدخول",

  // Chrome
  ADMIN: "مدير",
  Logout: "تسجيل الخروج",
  Settings: "الإعدادات",
  "Save Changes": "حفظ التغييرات",

  // Settings — sections
  "Workshop Information": "معلومات الورشة",
  "Security Settings": "إعدادات الأمان",
  "Notifications Preferences": "تفضيلات الإشعارات",
  Integrations: "التكاملات",
  "Data Management": "إدارة البيانات",

  // Settings — rows
  "Workshop Name": "اسم الورشة",
  "VAT Rate": "نسبة ضريبة القيمة المضافة",
  "Tax Settings": "إعدادات الضريبة",
  "Business Hours": "ساعات العمل",
  "Two-Factor Authentication": "المصادقة الثنائية",
  "Session Timeout": "انتهاء الجلسة",
  "Audit Log": "سجل التدقيق",
  "Email Notifications": "إشعارات البريد الإلكتروني",
  "SMS Alerts": "تنبيهات الرسائل النصية",
  "Auto Backup": "النسخ الاحتياطي التلقائي",
  "Retention Period": "مدة الاحتفاظ",
  Connected: "متصل",
  Disconnected: "غير متصل",
  "1 year": "سنة واحدة",

  // Navigation
  Dashboard: "لوحة التحكم",
  Overview: "نظرة عامة",
  Operations: "العمليات",
  "Job Orders": "أوامر العمل",
  Appointments: "المواعيد",
  Customers: "العملاء",
  Vehicles: "المركبات",
  Inventory: "المخزون",
  Parts: "قطع الغيار",
  Suppliers: "الموردون",
  Finance: "المالية",
  Invoices: "الفواتير",
  Payments: "المدفوعات",
  Reports: "التقارير",
  Analytics: "التحليلات",
  System: "النظام",
  Users: "المستخدمون",
};

export const NAV: NavGroup[] = [
  {
    label: "Dashboard",
    icon: "LayoutDashboard",
    items: [{ l: "Overview", href: "/" }],
  },
  {
    label: "Operations",
    icon: "Wrench",
    items: [
      { l: "Job Cards", href: "/job-cards" },
      { l: "Appointments", href: "/appointments" },
    ],
  },
  {
    label: "Customers",
    icon: "Users",
    items: [
      { l: "Customers", href: "/customers" },
      { l: "Vehicles", href: "/vehicles" },
    ],
  },
  {
    label: "Inventory",
    icon: "Package",
    items: [
      { l: "Parts", href: "/parts" },
      { l: "Suppliers", href: "/suppliers" },
    ],
  },
  {
    label: "Finance",
    icon: "Receipt",
    items: [
      { l: "Invoices", href: "/invoices" },
      { l: "Payments", href: "/payments" },
    ],
  },
  {
    label: "Reports",
    icon: "FileText",
    items: [{ l: "Analytics", href: "/analytics" }],
  },
  {
    label: "System",
    icon: "UserCog",
    items: [
      { l: "Users", href: "/users" },
      { l: "Settings", href: "/settings" },
    ],
  },
];
