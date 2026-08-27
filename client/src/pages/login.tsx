import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { SalisIcon } from "@/components/salis-icon";
import { Button, Input, Label, Toast, type ToastVariant } from "@/components/ds";
import { useTranslate } from "@/lib/i18n";
import { useSalisPrefs } from "@/lib/salis-prefs";

type ToastState = { variant: ToastVariant; title: string; description: string };

/**
 * Sign In — ported from `ui_kits/gms-admin/LoginScreen.jsx` in the design
 * system bundle.
 *
 * Note this is the GMS admin UI kit's login, not the `Login.dc.html` screen the
 * task originally named — that file has never been available in this session.
 * Both come from the same design system, but they may differ.
 */
export default function Login() {
  const { t, rtl } = useTranslate();
  const { dark, toggleTheme } = useSalisPrefs();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setToast({
        variant: "destructive",
        title: t("Error"),
        description: t("Please fill in all fields"),
      });
      return;
    }

    setToast({
      variant: "default",
      title: t("Success"),
      description: t("Logged in successfully"),
    });

    // Upstream calls an `onLogin` prop supplied by the kit's router. There is no
    // dashboard screen in this app yet, so this lands on the one built screen.
    setTimeout(() => navigate("/settings"), 600);
  };

  return (
    <div
      data-screen-label="Login"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-page)", fontFamily: "var(--font-ui)" }}
    >
      {/* Corner gradient blobs — brand rule is flat page colour plus soft washes. */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <div
          className="absolute right-0 top-0 h-[800px] w-[800px] rounded-full blur-[64px]"
          style={{ background: "radial-gradient(circle,rgba(10,94,215,.1),transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full blur-[64px]"
          style={{ background: "radial-gradient(circle,rgba(11,179,255,.1),transparent 65%)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[64px]"
          style={{ background: "radial-gradient(circle,rgba(249,115,22,.05),transparent 65%)" }}
        />
      </div>

      <button
        type="button"
        className="kit-iconbtn fixed top-4 z-50"
        style={{ insetInlineEnd: 16 }}
        onClick={toggleTheme}
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      >
        <SalisIcon name={dark ? "Sun" : "Moon"} size={16} />
      </button>

      <div className="relative z-10 w-full max-w-[448px] p-4">
        <div className="kit-glass">
          <div className="flex flex-col gap-4 p-6 pb-0">
            <div className="flex justify-center">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-2xl opacity-20 blur-[24px]"
                  style={{ background: "var(--salis-gradient)" }}
                />
                {/*
                 * Upstream renders assets/logo-blue-orange.png, which was not
                 * provided. The design system documents the wordmark fallback:
                 * "SALIS AUTO" set in Montserrat 700+, gradient-clipped.
                 */}
                <p
                  className="text-gradient-salis relative m-0 text-[28px] leading-none"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.02em" }}
                >
                  SALIS AUTO
                </p>
              </div>
            </div>

            <div className="text-center">
              <h1
                className="m-0 text-2xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--text-heading)",
                }}
              >
                {t("Sign In")}
              </h1>
              <p
                className="mb-0 mt-2 text-sm"
                style={{ fontFamily: "var(--font-action)", color: "var(--text-muted)" }}
              >
                {t("Enter your credentials to access your account")}
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5 p-6" noValidate>
            <div>
              <Label htmlFor="email" style={{ fontFamily: "var(--font-action)" }}>
                {t("Email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                size="lg"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<SalisIcon name="Mail" size={20} />}
                style={{ fontFamily: "var(--font-action)" }}
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="password" style={{ fontFamily: "var(--font-action)" }}>
                {t("Password")}
              </Label>
              <span className="relative flex items-center">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  size="lg"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<SalisIcon name="Lock" size={20} />}
                  // Reserve room for the reveal button on the inline-end edge.
                  style={{ paddingInlineEnd: 40, fontFamily: "var(--font-action)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t("Hide password") : t("Show password")}
                  aria-pressed={showPassword}
                  className="absolute flex cursor-pointer border-none bg-transparent p-0"
                  style={{ insetInlineEnd: 12, color: "var(--text-muted)" }}
                >
                  <SalisIcon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                </button>
              </span>
            </div>

            <Button type="submit" size="lg" style={{ width: "100%", fontWeight: 600 }}>
              {t("Sign In")}
            </Button>

            <p
              className="m-0 text-center text-sm"
              style={{ fontFamily: "var(--font-action)", color: "var(--text-muted)" }}
            >
              {t("Don't have an account?")}{" "}
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontWeight: 600 }}>
                {t("Register")}
              </a>
            </p>
          </form>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 z-[100]"
          style={{ insetInlineEnd: 24 }}
          dir={rtl ? "rtl" : "ltr"}
        >
          <Toast
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
