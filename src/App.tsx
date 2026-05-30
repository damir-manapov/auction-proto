import { useState } from "react";
import type { EmailTemplateType, Flight, MainTab } from "./types";
import { F, T } from "./theme";
import { FLIGHTS_DATA } from "./data";
import { FlightList } from "./FlightList";
import { FlightDetail } from "./FlightDetail";
import { GlobalRules } from "./GlobalRules";
import { EmailPreview } from "./EmailPreview";
import { PassengerBidUI } from "./PassengerBidUI";
import { AdminHeader, EmailTemplateTabs, EmptyFlightState } from "./AdminShell";
import { TXT } from "./i18n";

// ─── Root App ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<MainTab>("flights");
  const [emailTab, setEmailTab] = useState<EmailTemplateType>("pte");
  const [selectedFlight, setSelectedFlight] = useState<Flight["id"] | null>(null);

  const handleSelectFlight = (id: Flight["id"]) => {
    setSelectedFlight(id);
    setTab("flight");
  };
  const handleBack = () => {
    setSelectedFlight(null);
    setTab("flights");
  };

  const totalActive = FLIGHTS_DATA.filter((f) => f.status === "active").length;
  const totalBids = FLIGHTS_DATA.reduce((s, f) => s + f.bids, 0);

  const navItems = [
    { id: "flights", label: TXT.nav.flights },
    { id: "flight", label: TXT.nav.flight, hide: !selectedFlight },
    { id: "rules", label: TXT.nav.rules },
    { id: "email", label: TXT.nav.email },
    { id: "passenger", label: TXT.nav.passenger },
  ] satisfies Array<{ id: MainTab; label: string; hide?: boolean }>;
  const NAV = navItems.filter((t) => !t.hide);

  return (
    <div
      style={{
        background: T.surfacePage,
        minHeight: "600px",
        fontFamily: F.sans,
        color: T.textPrimary,
        lineHeight: 1.4,
      }}
    >
      <AdminHeader
        navItems={NAV}
        activeTab={tab}
        totalActive={totalActive}
        totalBids={totalBids}
        onSelectTab={(nextTab) => {
          setTab(nextTab);
          if (nextTab !== "flight") setSelectedFlight(null);
        }}
      />

      <div style={{ padding: "20px 24px" }}>
        {tab === "flights" && <FlightList onSelect={handleSelectFlight} />}
        {tab === "flight" && selectedFlight && (
          <FlightDetail flightId={selectedFlight} onBack={handleBack} />
        )}
        {tab === "flight" && !selectedFlight && <EmptyFlightState />}
        {tab === "rules" && <GlobalRules />}
        {tab === "passenger" && <PassengerBidUI />}
        {tab === "email" && (
          <>
            <EmailTemplateTabs activeTab={emailTab} onChange={setEmailTab} />
            <EmailPreview type={emailTab} />
          </>
        )}
      </div>
    </div>
  );
}
