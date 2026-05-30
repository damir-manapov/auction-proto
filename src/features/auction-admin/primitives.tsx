import type { ReactNode } from "react";
import { SEAT_MAP_BC } from "./data";
import { F, T } from "./theme";
import type { SeatCell } from "./types";

export function Pill({
  children,
  color,
  bg,
  size = 11,
}: {
  children: ReactNode;
  color: string;
  bg: string;
  size?: number;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: 20,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: 0.2,
        color,
        background: bg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: T.bgElevated,
        border: `0.5px solid ${T.border}`,
        borderRadius: 10,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: T.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.9,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: accent || T.text,
          fontFamily: F.mono,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1.2,
        color: T.textMuted,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

export function BarChart({
  data,
}: {
  data: Array<{ range: string; count: number; pct: number; color: string }>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {data.map((d) => (
        <div key={d.range} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 68, fontSize: 11, color: T.textMuted, flexShrink: 0 }}>
            {d.range}
          </div>
          <div
            style={{
              flex: 1,
              height: 6,
              background: T.border,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{ width: `${d.pct}%`, height: "100%", background: d.color, borderRadius: 3 }}
            />
          </div>
          <div
            style={{ width: 18, fontSize: 12, fontWeight: 600, color: T.text, textAlign: "right" }}
          >
            {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeatMap() {
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        {[
          { c: T.seatTaken, l: "Занято" },
          { c: T.accent, l: "Заявка" },
          { c: T.bgElevated, l: "Свободно", b: T.border },
        ].map((s) => (
          <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: s.c,
                border: `0.5px solid ${s.b || s.c}`,
              }}
            />
            <span style={{ fontSize: 11, color: T.textMuted }}>{s.l}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 28px)", gap: 4 }}>
        {SEAT_MAP_BC.flatMap((row) => {
          const rowKey = row
            .filter((seat): seat is SeatCell => seat !== null)
            .map((seat) => seat.id)
            .join("-");
          return row.map((seat) =>
            seat === null ? (
              <div key={`${rowKey}-aisle`} style={{ width: 4 }} />
            ) : (
              <div
                key={seat.id}
                style={{
                  width: 28,
                  height: 22,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 600,
                  background: seat.bid ? T.accent : seat.taken ? T.seatTaken : T.bgElevated,
                  color: seat.bid ? T.onAccent : seat.taken ? T.seatTakenText : T.border,
                  border: `0.5px solid ${seat.bid ? T.accent : seat.taken ? T.seatTakenBorder : T.border}`,
                }}
              >
                {seat.id}
              </div>
            ),
          );
        })}
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        border: "none",
        padding: 0,
        cursor: "pointer",
        flexShrink: 0,
        background: checked ? T.accent : T.border,
        position: "relative",
        transition: "background .2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 17 : 3,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: checked ? T.text : T.neutralMid,
          transition: "left .2s",
        }}
      />
    </button>
  );
}

export function NumInput({
  value,
  onChange,
  min = 0,
  max = 9999,
  unit = "",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: 72,
          padding: "5px 8px",
          borderRadius: 6,
          border: `0.5px solid ${T.borderLight}`,
          background: T.bgElevated,
          color: T.text,
          fontSize: 13,
          fontFamily: "monospace",
          outline: "none",
        }}
      />
      {unit && <span style={{ fontSize: 11, color: T.textMuted }}>{unit}</span>}
    </div>
  );
}
