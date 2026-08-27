import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SalisPrefsProvider } from "@/lib/salis-prefs";
import AccountLocked from "@/pages/account-locked";
import AdvancedSettings from "@/pages/advanced-settings";
import Appointments from "@/pages/appointments";
import Customers from "@/pages/customers";
import Dashboard from "@/pages/dashboard";
import JobCards from "@/pages/job-cards";
import Login from "@/pages/login";
import Vehicles from "@/pages/vehicles";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/job-cards" element={<JobCards />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<AdvancedSettings />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/account-locked" element={<AccountLocked />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SalisPrefsProvider>
  );
}
