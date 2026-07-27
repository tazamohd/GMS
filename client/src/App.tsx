import { Route, Switch } from "wouter";

import { SalisPrefsProvider } from "@/lib/salis-prefs";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: "var(--bg-page)",
        fontFamily: "var(--font-ui)",
      }}
    >
      <h1 style={{ margin: 0, fontFamily: "var(--font-display)", color: "var(--text-heading)" }}>
        404
      </h1>
      <p style={{ margin: 0, color: "var(--text-muted)" }}>This page does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <SalisPrefsProvider>
      <Switch>
        <Route component={NotFound} />
      </Switch>
    </SalisPrefsProvider>
  );
}
