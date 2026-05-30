import { useState } from "react";
import type { ReactNode } from "react";
import type {
  Bid,
  ChannelRuleKey,
  EmailTemplateConfig,
  EmailTemplateType,
  Flight,
  FlightDetailFilter,
  FlightDetailSortCol,
  MainTab,
  PaymentMethodKey,
  PricingHaulKey,
  PricingRow,
  Rules,
  RulesBooleanKey,
  RulesNumberKey,
  RuleSectionId,
  SortDir,
  Tier,
  TimingRow,
} from "./src/features/auction-admin/types";
import { F, T } from "./src/features/auction-admin/theme";
import {
  CH_ICONS,
  DEFAULT_RULES,
  DIST_DATA,
  EXIT_DATA,
  FALLBACK_FLIGHT,
  FLIGHTS_DATA,
  HAUL_LABELS,
  INITIAL_BIDS,
  STATE_META,
  TIER_META,
  weighted,
} from "./src/features/auction-admin/data";
import {
  BarChart,
  MetricCard,
  NumInput,
  Pill,
  SectionLabel,
  SeatMap,
  Toggle,
} from "./src/features/auction-admin/primitives";
import { FlightList } from "./src/features/auction-admin/FlightList";
import { PassengerBidUI } from "./src/features/auction-admin/PassengerBidUI";

// ─── Data ─────────────────────────────────────────────────────
// ─── Data ─────────────────────────────────────────────────────

// ─── GlobalRules ──────────────────────────────────────────────
function GlobalRules() {
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  const [saved, setSaved] = useState(true);
  const [activeSection, setActiveSection] = useState<RuleSectionId>("timing");

  const setRule = <K extends RulesNumberKey | RulesBooleanKey>(key: K, val: Rules[K]) => {
    setRules((r) => ({ ...r, [key]: val }));
    setSaved(false);
  };
  const setNestedRule = <K extends "channels" | "paymentMethods", SK extends keyof Rules[K]>(
    key: K,
    subkey: SK,
    val: boolean,
  ) => {
    setRules((r) => ({ ...r, [key]: { ...r[key], [subkey]: val } as Rules[K] }));
    setSaved(false);
  };

  const SECTIONS: Array<{ id: RuleSectionId; l: string }> = [
    { id: "timing", l: "Тайминг" },
    { id: "pricing", l: "Ценообразование" },
    { id: "loyalty", l: "Лояльность" },
    { id: "channels", l: "Каналы охвата" },
    { id: "payment", l: "Платежи" },
    { id: "features", l: "Функции" },
  ];

  const RuleRow = ({
    label,
    desc,
    children,
  }: {
    label: ReactNode;
    desc?: ReactNode;
    children: ReactNode;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 0",
        borderBottom: `0.5px solid ${T.border}`,
        gap: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{label}</div>
        {desc && (
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3, lineHeight: 1.5 }}>
            {desc}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );

  const haulCols: Array<{ k: PricingHaulKey; lbl: string }> = [
    { k: "UltraShort", lbl: "<1.5ч" },
    { k: "Short", lbl: "1.5–3ч" },
    { k: "Medium", lbl: "3–5ч" },
    { k: "Long", lbl: "5–8ч" },
    { k: "UltraLong", lbl: "8ч+" },
  ];
  const pricingRows: PricingRow[] = [
    {
      product: "Бизнес-класс",
      keys: {
        UltraShort: "minBcUltraShort",
        Short: "minBcShort",
        Medium: "minBcMedium",
        Long: "minBcLong",
        UltraLong: "minBcUltraLong",
      },
    },
    {
      product: "Ряды у выхода",
      keys: {
        UltraShort: "minExitShort",
        Short: "minExitShort",
        Medium: "minExitMedium",
        Long: "minExitLong",
        UltraLong: "minExitLong",
      },
    },
    {
      product: "Блок соседнего",
      keys: {
        UltraShort: "minSeatBlockShort",
        Short: "minSeatBlockShort",
        Medium: "minSeatBlockMedium",
        Long: "minSeatBlockLong",
        UltraLong: "minSeatBlockLong",
      },
    },
  ];
  const timingRows: TimingRow[] = [
    {
      key: "inviteDaysBefore",
      label: "Первое приглашение (PTE)",
      desc: "За сколько дней отправить первое письмо",
      min: 1,
      max: 60,
      unit: "дн. до вылета",
    },
    {
      key: "chaserHoursBefore",
      label: "Напоминание (Chaser)",
      desc: "За сколько часов отправить напоминание без заявки",
      min: 12,
      max: 168,
      unit: "ч. до вылета",
    },
    {
      key: "closureHoursBefore",
      label: "Закрытие аукциона",
      desc: "За сколько часов прекратить приём заявок",
      min: 1,
      max: 48,
      unit: "ч. до вылета",
    },
  ];
  const timingToggleRows: Array<{ key: RulesBooleanKey; label: string; desc: string }> = [
    {
      key: "autoFulfillment",
      label: "Авто-фулфилмент",
      desc: "Автоматически выбирает победителей и обновляет PNR",
    },
    {
      key: "requirePurchased",
      label: "Только при наличии билета",
      desc: "Ключевой антидилюционный механизм",
    },
    {
      key: "blindBids",
      label: "Слепые ставки",
      desc: "Пассажиры не видят ставки других участников",
    },
  ];
  const loyaltyRows: Array<{ key: RulesNumberKey; tier: Tier; color: string; bg: string }> = [
    { key: "multiplierPlatinum", tier: "Platinum", color: T.amber, bg: T.amberDim },
    { key: "multiplierGold", tier: "Gold", color: T.accent, bg: T.accentDim },
    { key: "multiplierSilver", tier: "Silver", color: T.textSub, bg: T.neutralSoft },
  ];
  const loyaltyPreview: Array<{ tier: Tier; mult: number }> = [
    { tier: "Standard", mult: 1 },
    { tier: "Silver", mult: 1 + rules.multiplierSilver / 100 },
    { tier: "Gold", mult: 1 + rules.multiplierGold / 100 },
    { tier: "Platinum", mult: 1 + rules.multiplierPlatinum / 100 },
  ];
  const channelRows: Array<{ key: ChannelRuleKey; label: string; desc: string }> = [
    {
      key: "email",
      label: "Email (PTE + Chaser + Confirm)",
      desc: "30%+ всех заявок. Базовый канал",
    },
    { key: "mmb", label: "Manage My Booking", desc: "+25% к объёму. Средняя ставка выше на 77%" },
    { key: "app", label: "Мобильное приложение + Push", desc: "+4% к объёму" },
    { key: "web", label: "Маркетинговая страница", desc: "41% выручки партнёра" },
    {
      key: "webcheckin",
      label: "Онлайн-регистрация",
      desc: "+10% к выручке. 55% уникальных посетителей",
    },
    { key: "pushNotif", label: "Push-уведомления", desc: "Уведомляет о статусе ставки" },
  ];
  const paymentRows: Array<{ key: PaymentMethodKey; label: string; desc: string }> = [
    { key: "visa", label: "Visa", desc: "Поддерживается всеми PSP-партнёрами" },
    { key: "mastercard", label: "Mastercard", desc: "Поддерживается всеми PSP-партнёрами" },
    { key: "amex", label: "American Express", desc: "Более высокий средний чек" },
    { key: "jcb", label: "JCB", desc: "Актуально для маршрутов в Азию" },
    { key: "diners", label: "Diners Club", desc: "Ограниченная поддержка эквайеров" },
  ];
  const featureRows: Array<{ key: RulesBooleanKey; label: string; desc: string }> = [
    {
      key: "seatBlocker",
      label: "Seat Blocker",
      desc: "+10–20% выручки. Блокировка соседнего места",
    },
    { key: "payWithPoints", label: "Pay with Points", desc: "Оплата баллами лояльности" },
    {
      key: "crossAirlineUpgrades",
      label: "Cross Airline Upgrades",
      desc: "+21% заявок через альянс/кодшер",
    },
    {
      key: "continuousPricing",
      label: "Continuous Pricing (AI)",
      desc: "+12% выручки по A/B-тесту",
    },
    {
      key: "autoFulfillment",
      label: "Авто-фулфилмент",
      desc: "Автовыбор победителей без ручного одобрения",
    },
    { key: "blindBids", label: "Слепые ставки", desc: "Участники не видят предложения других" },
  ];
  const featureStatusLabels: Record<
    | "seatBlocker"
    | "payWithPoints"
    | "crossAirlineUpgrades"
    | "continuousPricing"
    | "autoFulfillment"
    | "blindBids",
    string
  > = {
    seatBlocker: "Seat Blocker",
    payWithPoints: "Pay with Points",
    crossAirlineUpgrades: "Cross Airline",
    continuousPricing: "Continuous Pricing",
    autoFulfillment: "Авто-фулфилмент",
    blindBids: "Слепые ставки",
  };

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: 16, alignItems: "start" }}
    >
      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "12px 14px", borderBottom: `0.5px solid ${T.border}` }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: T.textMuted,
            }}
          >
            Глобальные правила
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, lineHeight: 1.5 }}>
            Применяются ко всем рейсам по умолчанию
          </div>
        </div>
        {SECTIONS.map((s, i) => (
          <button
            type="button"
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "11px 14px",
              fontSize: 13,
              fontWeight: activeSection === s.id ? 600 : 400,
              color: activeSection === s.id ? T.accent : T.textSub,
              background: activeSection === s.id ? T.accentDim : "transparent",
              border: "none",
              cursor: "pointer",
              borderBottom: i < SECTIONS.length - 1 ? `0.5px solid ${T.border}` : "none",
            }}
          >
            {s.l}
          </button>
        ))}
        <div style={{ padding: "10px 12px", borderTop: `0.5px solid ${T.border}` }}>
          <button
            type="button"
            onClick={() => setSaved(true)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background: saved ? T.greenDim : T.accent,
              border: `0.5px solid ${saved ? T.green : T.accent}`,
              color: saved ? T.greenText : T.onAccentSoft,
              transition: "all .2s",
            }}
          >
            {saved ? "✓ Сохранено" : "Сохранить правила"}
          </button>
          {!saved && (
            <div style={{ fontSize: 10, color: T.amber, marginTop: 5, textAlign: "center" }}>
              Есть несохранённые изменения
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: 12,
          padding: "20px 24px",
        }}
      >
        {activeSection === "timing" && (
          <div>
            <SectionLabel>Тайминг аукциона</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              Управляет жизненным циклом коммуникаций и автоматическими процессами.
            </div>
            {timingRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <NumInput
                  value={rules[row.key]}
                  onChange={(v) => setRule(row.key, v)}
                  min={row.min}
                  max={row.max}
                  unit={row.unit}
                />
              </RuleRow>
            ))}
            {timingToggleRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle checked={rules[row.key]} onChange={(v) => setRule(row.key, v)} />
              </RuleRow>
            ))}
            <RuleRow label="Макс. апгрейдов на рейс" desc="0 = без ограничений">
              <NumInput
                value={rules.maxUpgradesPerFlight}
                onChange={(v) => setRule("maxUpgradesPerFlight", v)}
                min={0}
                max={50}
                unit="мест (0=∞)"
              />
            </RuleRow>
          </div>
        )}
        {activeSection === "pricing" && (
          <div>
            <SectionLabel>Минимальные ставки по типу хола (USD)</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              Пассажир не сможет предложить сумму ниже указанной.
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        color: T.textMuted,
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        borderBottom: `0.5px solid ${T.border}`,
                        background: T.bgElevated,
                      }}
                    >
                      Продукт
                    </th>
                    {haulCols.map((c) => (
                      <th
                        key={c.k}
                        style={{
                          textAlign: "center",
                          padding: "8px 10px",
                          color: T.textMuted,
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          borderBottom: `0.5px solid ${T.border}`,
                          background: T.bgElevated,
                        }}
                      >
                        {c.lbl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row) => (
                    <tr key={row.product} style={{ borderBottom: `0.5px solid ${T.border}` }}>
                      <td style={{ padding: "9px 10px", fontWeight: 600, color: T.text }}>
                        {row.product}
                      </td>
                      {haulCols.map((c) => (
                        <td key={c.k} style={{ padding: "9px 10px", textAlign: "center" }}>
                          <input
                            type="number"
                            value={rules[row.keys[c.k]]}
                            min={0}
                            onChange={(e) => setRule(row.keys[c.k], Number(e.target.value))}
                            style={{
                              width: 58,
                              padding: "4px 6px",
                              borderRadius: 5,
                              textAlign: "center",
                              border: `0.5px solid ${T.borderLight}`,
                              background: T.bgElevated,
                              color: T.text,
                              fontSize: 12,
                              fontFamily: "monospace",
                              outline: "none",
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16 }}>
              <RuleRow label="Continuous Pricing (AI)" desc="+12% выручки по A/B-тесту">
                <Toggle
                  checked={rules.continuousPricing}
                  onChange={(v) => setRule("continuousPricing", v)}
                />
              </RuleRow>
            </div>
          </div>
        )}
        {activeSection === "loyalty" && (
          <div>
            <SectionLabel>Множители статуса лояльности</SectionLabel>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              Взвешенная = базовая × (1 + множитель%). При равных ставках побеждает более высокий
              статус.
            </div>
            {loyaltyRows.map((row) => (
              <RuleRow
                key={row.key}
                label={
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Pill color={row.color} bg={row.bg}>
                      {row.tier}
                    </Pill>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{row.tier}</span>
                  </span>
                }
                desc=""
              >
                <NumInput
                  value={rules[row.key]}
                  onChange={(v) => setRule(row.key, v)}
                  min={0}
                  max={50}
                  unit="%"
                />
              </RuleRow>
            ))}
            <div
              style={{ marginTop: 16, background: T.bgElevated, borderRadius: 10, padding: "14px" }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: T.textMuted,
                  marginBottom: 10,
                }}
              >
                Предпросмотр: базовая $400
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {loyaltyPreview.map((row) => {
                  const tm = TIER_META[row.tier];
                  return (
                    <div
                      key={row.tier}
                      style={{
                        background: T.bg,
                        borderRadius: 8,
                        padding: "9px 11px",
                        textAlign: "center",
                      }}
                    >
                      <Pill color={tm.color} bg={tm.bg} size={10}>
                        {row.tier}
                      </Pill>
                      <div style={{ fontSize: 11, color: T.textMuted, margin: "5px 0 2px" }}>
                        $400
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: T.accentText,
                          fontFamily: "monospace",
                        }}
                      >
                        ${Math.round(400 * row.mult)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {activeSection === "channels" && (
          <div>
            <SectionLabel>Активные каналы охвата</SectionLabel>
            {channelRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle
                  checked={rules.channels[row.key]}
                  onChange={(v) => setNestedRule("channels", row.key, v)}
                />
              </RuleRow>
            ))}
          </div>
        )}
        {activeSection === "payment" && (
          <div>
            <SectionLabel>Методы оплаты</SectionLabel>
            {paymentRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle
                  checked={rules.paymentMethods[row.key]}
                  onChange={(v) => setNestedRule("paymentMethods", row.key, v)}
                />
              </RuleRow>
            ))}
            <RuleRow
              label="3DS аутентификация"
              desc="Снижает конверсию. Включайте только при обязательном 3DS в регионе"
            >
              <Toggle checked={rules.use3ds} onChange={(v) => setRule("use3ds", v)} />
            </RuleRow>
            {rules.use3ds && (
              <div
                style={{
                  marginTop: 8,
                  background: T.amberDim,
                  border: `0.5px solid ${T.amber}`,
                  borderRadius: 8,
                  padding: "10px 13px",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: T.amberText, marginBottom: 2 }}>
                  ⚠ 3DS включён
                </div>
                <div style={{ fontSize: 11, color: T.amber, lineHeight: 1.5 }}>
                  Используйте Plusgrade Community MPI.
                </div>
              </div>
            )}
          </div>
        )}
        {activeSection === "features" && (
          <div>
            <SectionLabel>Дополнительные функции</SectionLabel>
            {featureRows.map((row) => (
              <RuleRow key={row.key} label={row.label} desc={row.desc}>
                <Toggle checked={rules[row.key]} onChange={(v) => setRule(row.key, v)} />
              </RuleRow>
            ))}
            <div
              style={{ marginTop: 16, background: T.bgElevated, borderRadius: 10, padding: "14px" }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: T.textMuted,
                  marginBottom: 10,
                }}
              >
                Статус функций
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 7 }}>
                {(Object.keys(featureStatusLabels) as Array<keyof typeof featureStatusLabels>).map(
                  (k) => {
                    return (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: T.bg,
                          borderRadius: 7,
                          padding: "7px 11px",
                        }}
                      >
                        <span style={{ fontSize: 12, color: T.textSub }}>
                          {featureStatusLabels[k]}
                        </span>
                        <Pill
                          color={rules[k] ? T.greenText : T.textMuted}
                          bg={rules[k] ? T.greenDim : T.neutralSoft}
                          size={10}
                        >
                          {rules[k] ? "вкл" : "выкл"}
                        </Pill>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FlightDetail ─────────────────────────────────────────────
function FlightDetail({ flightId, onBack }: { flightId: Flight["id"]; onBack: () => void }) {
  const flight = FLIGHTS_DATA.find((f) => f.id === flightId) ?? FLIGHTS_DATA[0] ?? FALLBACK_FLIGHT;
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [filter, setFilter] = useState<FlightDetailFilter>("all");
  const [autoRan, setAutoRan] = useState(false);
  const [sortCol, setSortCol] = useState<FlightDetailSortCol>("weighted");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const detailFilters: Array<[FlightDetailFilter, string]> = [
    ["all", "Все"],
    ["pending", "Ожидают"],
    ["approved", "Принятые"],
    ["rejected", "Отклонённые"],
  ];
  const detailHeaderCols: Array<[FlightDetailSortCol | null, string, string]> = [
    ["name", "Пассажир", "22%"],
    ["tier", "Статус", "11%"],
    ["bid", "Ставка", "10%"],
    ["weighted", "Взвешенная", "11%"],
    ["channel", "Канал", "9%"],
    ["time", "Время", "9%"],
    [null, "Статус", "11%"],
    [null, "Действие", "17%"],
  ];

  const sorted = [...bids]
    .filter((b) => (filter === "all" ? true : b.state === filter))
    .sort((a, b2) => {
      const va =
        sortCol === "name"
          ? a.name
          : sortCol === "bid"
            ? a.bid
            : sortCol === "time"
              ? a.time
              : weighted(a);
      const vb =
        sortCol === "name"
          ? b2.name
          : sortCol === "bid"
            ? b2.bid
            : sortCol === "time"
              ? b2.time
              : weighted(b2);
      return sortDir === "desc" ? (vb > va ? 1 : -1) : va > vb ? 1 : -1;
    });

  const approve = (id: Bid["id"]) =>
    setBids((bs) => bs.map((b) => (b.id === id ? { ...b, state: "approved" } : b)));
  const reject = (id: Bid["id"]) =>
    setBids((bs) => bs.map((b) => (b.id === id ? { ...b, state: "rejected" } : b)));
  const autoSelect = () => {
    const top = [...bids]
      .filter((b) => b.state === "pending")
      .sort((a, b) => weighted(b) - weighted(a))
      .slice(0, flight.bcFree)
      .map((b) => b.id);
    setBids((bs) => bs.map((b) => (top.includes(b.id) ? { ...b, state: "approved" } : b)));
    setAutoRan(true);
  };
  const counts: Record<FlightDetailFilter, number> = {
    all: bids.length,
    pending: bids.filter((b) => b.state === "pending").length,
    approved: bids.filter((b) => b.state === "approved").length,
    rejected: bids.filter((b) => b.state === "rejected").length,
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "6px 12px",
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            background: "transparent",
            border: `0.5px solid ${T.border}`,
            color: T.textMuted,
          }}
        >
          ← Все рейсы
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{flight.id}</span>
          <span style={{ fontSize: 13, color: T.textSub }}>
            {flight.from} → {flight.to}
          </span>
          <Pill color={T.greenText} bg={T.greenDim}>
            Аукцион открыт
          </Pill>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!autoRan ? (
            <button
              type="button"
              onClick={autoSelect}
              style={{
                background: T.accent,
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: T.onAccentSoft,
                cursor: "pointer",
              }}
            >
              ⚡ Авто-отбор
            </button>
          ) : (
            <Pill color={T.greenText} bg={T.greenDim}>
              ✓ Amadeus RES обновлён
            </Pill>
          )}
        </div>
      </div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 18 }}>
        {flight.dep} — {flight.arr} · {flight.aircraft} · {flight.duration} ·{" "}
        {HAUL_LABELS[flight.haul]}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}
      >
        <MetricCard
          label="Мест в BC"
          value={`${flight.bcFree} / ${flight.bcTotal}`}
          accent={flight.bcFree < 4 ? T.redText : T.greenText}
          sub="свободно"
        />
        <MetricCard
          label="Заявок на BC"
          value={String(bids.length)}
          sub={`${counts.pending} ожидают`}
        />
        <MetricCard
          label="Топ ставка"
          value={`$${flight.topBid}`}
          accent={T.accentText}
          sub={`взвеш. $${Math.round(flight.topBid * 1.1)}`}
        />
        <MetricCard
          label="Прогноз выручки"
          value={`$${flight.revenue.toLocaleString()}`}
          accent={T.greenText}
          sub={`${flight.bcFree} победителя`}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <SectionLabel>Карта мест — бизнес-класс</SectionLabel>
          <SeatMap />
          <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
            {flight.bcFree} свободных · {bids.length} заявок
          </div>
        </div>
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <SectionLabel>Распределение ставок</SectionLabel>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            Бизнес-класс
          </div>
          <BarChart data={DIST_DATA} />
          <div style={{ height: 1, background: T.border, margin: "12px 0" }} />
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: T.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            Ряды у выхода
          </div>
          <BarChart data={EXIT_DATA} />
        </div>
      </div>
      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <SectionLabel>Заявки на бизнес-класс</SectionLabel>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {detailFilters.map(([k, lbl]) => (
              <button
                type="button"
                key={k}
                onClick={() => setFilter(k)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `0.5px solid ${filter === k ? T.accent : T.border}`,
                  background: filter === k ? T.accentDim : "transparent",
                  color: filter === k ? T.accentText : T.textMuted,
                }}
              >
                {lbl} ({counts[k]})
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                {detailHeaderCols.map(([col, lbl, w]) => (
                  <th
                    key={lbl}
                    onClick={
                      col
                        ? () => {
                            if (sortCol === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
                            else {
                              setSortCol(col);
                              setSortDir("desc");
                            }
                          }
                        : undefined
                    }
                    style={{
                      width: w,
                      textAlign: "left",
                      padding: "9px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: col && sortCol === col ? T.accentText : T.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      borderBottom: `0.5px solid ${T.border}`,
                      cursor: col ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    {lbl}
                    {col && sortCol === col ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((b, i) => {
                const w = weighted(b);
                const isTop = b.state === "pending" && i < flight.bcFree && filter === "all";
                const tm = TIER_META[b.tier];
                const sm = STATE_META[b.state] ?? STATE_META.pending;
                return (
                  <tr key={b.id} style={{ background: isTop ? T.overlayAccent : "transparent" }}>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {isTop && (
                          <div
                            style={{
                              width: 3,
                              height: 28,
                              background: T.accent,
                              borderRadius: 2,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: T.text }}>{b.name}</div>
                          {isTop && (
                            <div style={{ fontSize: 10, color: T.accentText }}>→ кандидат</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      <Pill color={tm.color} bg={tm.bg} size={10}>
                        {tm.label}
                      </Pill>
                      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
                        {tm.mult}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        fontWeight: 700,
                        fontFamily: F.mono,
                      }}
                    >
                      ${b.bid}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        fontWeight: 700,
                        color: T.accentText,
                        fontFamily: F.mono,
                      }}
                    >
                      ${w}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        color: T.textMuted,
                        fontSize: 12,
                      }}
                    >
                      {CH_ICONS[b.channel]} {b.channel}
                    </td>
                    <td
                      style={{
                        padding: "10px 10px",
                        borderBottom: `0.5px solid ${T.border}`,
                        color: T.textMuted,
                        fontFamily: F.mono,
                        fontSize: 12,
                      }}
                    >
                      {b.time}
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      <Pill color={sm.color} bg={sm.bg} size={10}>
                        {sm.label}
                      </Pill>
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: `0.5px solid ${T.border}` }}>
                      {b.state === "pending" && (
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            type="button"
                            onClick={() => approve(b.id)}
                            style={{
                              padding: "4px 9px",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 5,
                              cursor: "pointer",
                              background: T.greenDim,
                              border: `0.5px solid ${T.green}`,
                              color: T.greenText,
                            }}
                          >
                            ✓ Принять
                          </button>
                          <button
                            type="button"
                            onClick={() => reject(b.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 5,
                              cursor: "pointer",
                              background: T.redDim,
                              border: `0.5px solid ${T.red}`,
                              color: T.redText,
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.textMuted }}>
          Взвешенная = базовая × множитель статуса. Кликните заголовок для сортировки.
        </div>
      </div>
    </div>
  );
}

// ─── EmailPreview ─────────────────────────────────────────────
function EmailPreview({ type }: { type: EmailTemplateType }) {
  const cfgs: Record<EmailTemplateType, EmailTemplateConfig> = {
    pte: {
      subject: "Азиз, предложите свою цену на бизнес-класс",
      to: "aziz.karimov@mail.uz",
      tag: "PTE · за 7–14 дней",
      tagC: T.accent,
      tagBg: T.accentDim,
      hBg: T.emailPteBg,
      hLine: T.accent,
      title: "Улучшите перелёт до бизнес-класса",
      body: "Ваш рейс HY 602 квалифицирован для участия в аукционе. Предложите цену — средства спишутся только при подтверждении.",
      ctaLabel: "Предложить цену →",
      ctaBg: T.accent,
      offers: [
        { name: "Бизнес-класс", desc: "Раскладное кресло · Лаундж", from: "$262" },
        { name: "Ряд у выхода", desc: "+30 см для ног", from: "$32" },
      ],
      footer: "Ставка не гарантирует апгрейд. Оплата только при подтверждении.",
    },
    chaser: {
      subject: "Последний шанс: мест в бизнес-классе почти нет",
      to: "j.smith@company.com",
      tag: "Chaser · за 48–72 часа",
      tagC: T.amber,
      tagBg: T.amberDim,
      hBg: T.emailChaserBg,
      hLine: T.amber,
      title: "Аукцион закрывается через 14 часов",
      body: "Вы не подавали заявку. Осталось ограниченное число мест. Деньги не списываются без подтверждённого апгрейда.",
      ctaLabel: "Участвовать — осталось мало мест →",
      ctaBg: T.amber,
      urgency: true,
      footer: "Ставка не гарантирует апгрейд. Оплата только при подтверждении.",
    },
    win: {
      subject: "Поздравляем — вы летите бизнес-классом!",
      to: "aziz.karimov@mail.uz",
      tag: "Confirm · за 4–8 часов",
      tagC: T.green,
      tagBg: T.greenDim,
      hBg: T.emailWinBg,
      hLine: T.green,
      title: "Ваш апгрейд подтверждён!",
      body: "Добро пожаловать в бизнес-класс, Азиз! Место 4A забронировано, $580 списано. Приоритетная посадка и лаундж уже доступны.",
      ctaLabel: "Посмотреть посадочный →",
      ctaBg: T.green,
      booking: {
        Рейс: "HY 602",
        Маршрут: "Ташкент → Стамбул",
        Место: "4A · Бизнес-класс",
        Вылет: "15 июня · 08:45",
        Списано: "$580",
      },
      footer: "Uzbekistan Airways · hy-support@uzbekistanairways.com",
    },
  };
  const c = cfgs[type];
  const metaRows: Array<[string, string]> =
    type === "pte"
      ? [
          ["Открываемость", "~35%"],
          ["Конверсия", "18.4%"],
          ["Доля заявок", "30%+"],
          ["Отписок", "0.4%"],
        ]
      : type === "chaser"
        ? [
            ["Открываемость", "~42%"],
            ["Конверсия", "11.2%"],
            ["Срочность", "высокая"],
            ["A/B тест", "2 варианта"],
          ]
        : [
            ["Доставлено", "100%"],
            ["Открыто", "~88%"],
            ["Жалоб", "0"],
            ["NPS impact", "+12"],
          ];
  const metadataRows: Array<{ key: string; label: string; value: ReactNode }> = [
    {
      key: "type",
      label: "Тип",
      value: (
        <Pill color={c.tagC} bg={c.tagBg}>
          {c.tag}
        </Pill>
      ),
    },
    {
      key: "to",
      label: "Кому",
      value: <span style={{ fontSize: 12, color: T.textSub }}>{c.to}</span>,
    },
    {
      key: "subject",
      label: "Тема",
      value: <span style={{ fontSize: 12, color: T.text }}>{c.subject}</span>,
    },
  ];
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 20, alignItems: "start" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <SectionLabel>Метаданные</SectionLabel>
          {metadataRows.map((row) => (
            <div
              key={row.key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "7px 0",
                borderBottom: `0.5px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  width: 44,
                  fontSize: 11,
                  color: T.textMuted,
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {row.label}
              </div>
              <div>{row.value}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: T.bgCard,
            border: `0.5px solid ${T.border}`,
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <SectionLabel>Метрики канала</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {metaRows.map(([k, v]) => (
              <div key={k} style={{ background: T.bg, borderRadius: 7, padding: "9px 11px" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: T.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: T.text,
                    marginTop: 3,
                    fontFamily: F.mono,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: T.bgElevated,
            borderBottom: `0.5px solid ${T.border}`,
            padding: "7px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {[T.windowControlRed, T.windowControlAmber, T.windowControlGreen].map((col) => (
            <div key={col} style={{ width: 9, height: 9, borderRadius: "50%", background: col }} />
          ))}
          <div
            style={{
              flex: 1,
              background: T.bg,
              borderRadius: 4,
              height: 17,
              marginLeft: 8,
              display: "flex",
              alignItems: "center",
              paddingLeft: 8,
            }}
          >
            <span style={{ fontSize: 10, color: T.textMuted }}>mail.uzbekistanairways.uz</span>
          </div>
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ borderRadius: 7, overflow: "hidden", border: `0.5px solid ${T.border}` }}>
            <div
              style={{
                background: c.hBg,
                borderBottom: `2px solid ${c.hLine}`,
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  background: c.hLine,
                  borderRadius: 4,
                  width: 24,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 8, fontWeight: 800, color: T.onAccent }}>HY</span>
              </div>
              <span style={{ color: T.text, fontWeight: 600, fontSize: 12 }}>
                Uzbekistan Airways
              </span>
            </div>
            <div style={{ background: T.bgCard, padding: 14 }}>
              <div
                style={{
                  background: T.bgElevated,
                  border: `0.5px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>TAS</div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>Ташкент</div>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                  <span style={{ fontSize: 10, color: T.textMuted }}>✈</span>
                  <div style={{ flex: 1, height: 1, background: T.border }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>IST</div>
                  <div style={{ fontSize: 9, color: T.textMuted }}>Стамбул</div>
                </div>
              </div>
              {c.urgency && (
                <div
                  style={{
                    background: T.amberDim,
                    border: `0.5px solid ${T.amber}`,
                    borderRadius: 5,
                    padding: "6px 9px",
                    marginBottom: 9,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 12 }}>⏳</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.amberText }}>
                      Аукцион закрывается через 14 часов
                    </div>
                    <div style={{ fontSize: 10, color: T.amber }}>HY 602 · 15 июня · 08:45</div>
                  </div>
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 11, color: T.textSub, lineHeight: 1.6, marginBottom: 9 }}>
                {c.body}
              </div>
              {c.offers?.map((o) => (
                <div
                  key={o.name}
                  style={{
                    border: `0.5px solid ${T.border}`,
                    borderRadius: 5,
                    padding: "6px 9px",
                    marginBottom: 5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{o.name}</div>
                    <div style={{ fontSize: 10, color: T.textMuted }}>{o.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: T.textMuted }}>от</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.tagC }}>{o.from}</div>
                  </div>
                </div>
              ))}
              {c.booking && (
                <div
                  style={{
                    background: T.greenDim,
                    border: `0.5px solid ${T.green}`,
                    borderRadius: 5,
                    padding: "8px 9px",
                    marginBottom: 9,
                  }}
                >
                  {Object.entries(c.booking).map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        padding: "2px 0",
                        borderBottom: `0.5px solid ${T.dividerSuccess}`,
                      }}
                    >
                      <span style={{ color: T.greenText }}>{k}</span>
                      <span style={{ fontWeight: 600, color: T.greenText }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  background: c.ctaBg,
                  borderRadius: 5,
                  padding: "8px",
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.onAccent,
                  marginBottom: 7,
                  cursor: "pointer",
                }}
              >
                {c.ctaLabel}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: T.textMuted,
                  borderTop: `0.5px solid ${T.border}`,
                  paddingTop: 7,
                  lineHeight: 1.6,
                }}
              >
                {c.footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────
export default function UpgradeAuctionAdmin() {
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
    { id: "flights", label: "Рейсы" },
    { id: "flight", label: "Детали рейса", hide: !selectedFlight },
    { id: "rules", label: "Глобальные правила" },
    { id: "email", label: "Email-шаблоны" },
    { id: "passenger", label: "Интерфейс пассажира" },
  ] satisfies Array<{ id: MainTab; label: string; hide?: boolean }>;
  const NAV = navItems.filter((t) => !t.hide);

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "600px",
        fontFamily: F.sans,
        color: T.text,
        lineHeight: 1.4,
      }}
    >
      <div
        style={{
          borderBottom: `0.5px solid ${T.border}`,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 0,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "13px 0",
            marginRight: 24,
          }}
        >
          <div
            style={{
              width: 26,
              height: 17,
              background: T.accent,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ fontSize: 8, fontWeight: 800, color: T.onAccentSoft, letterSpacing: 0.5 }}
            >
              HY
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text, letterSpacing: 0.5 }}>
            Auction Admin
          </span>
        </div>
        {NAV.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id !== "flight") setSelectedFlight(null);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "14px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: tab === t.id ? T.accent : T.textMuted,
              borderBottom: tab === t.id ? `2px solid ${T.accent}` : "2px solid transparent",
              marginBottom: -1,
              letterSpacing: 0.3,
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Pill color={T.greenText} bg={T.greenDim}>
            {totalActive} активных
          </Pill>
          <Pill color={T.accentText} bg={T.accentDim}>
            {totalBids} заявок
          </Pill>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: T.accentDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: T.accentText,
            }}
          >
            OP
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {tab === "flights" && <FlightList onSelect={handleSelectFlight} />}
        {tab === "flight" && selectedFlight && (
          <FlightDetail flightId={selectedFlight} onBack={handleBack} />
        )}
        {tab === "flight" && !selectedFlight && (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.textMuted }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>✈</div>
            <div style={{ fontSize: 14 }}>Выберите рейс из списка</div>
          </div>
        )}
        {tab === "rules" && <GlobalRules />}
        {tab === "passenger" && <PassengerBidUI />}
        {tab === "email" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 20,
                borderBottom: `0.5px solid ${T.border}`,
              }}
            >
              {(
                [
                  ["pte", "Приглашение (PTE)"],
                  ["chaser", "Напоминание"],
                  ["win", "Подтверждение"],
                ] as Array<[EmailTemplateType, string]>
              ).map(([id, lbl]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setEmailTab(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: emailTab === id ? T.text : T.textMuted,
                    borderBottom:
                      emailTab === id ? `2px solid ${T.accent}` : "2px solid transparent",
                    marginBottom: -1,
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <EmailPreview type={emailTab} />
          </>
        )}
      </div>
    </div>
  );
}
