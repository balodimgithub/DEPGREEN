"use client";

// Signature element: the Cycle Ring.
// DEPGREEN's whole premise is a *regular, predictable* collection cycle —
// so the one motif this product is remembered by is a literal cycle: a
// ring that empties as the household moves through its 30-day collection
// window, used on Home and the System Tracker. It's the same shape as a
// clock or a loading ring, but reads specifically as "time until your next
// pickup" because of the day count at its centre and the mono numerals.
export default function CycleRing({ daysRemaining, cycleLength = 30, size = 148, label }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, 1 - daysRemaining / cycleLength));
  const dashOffset = circumference * (1 - progress);
  const urgent = daysRemaining <= 2;

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E4D3B8" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={urgent ? "#AE4E2E" : "#3B7D53"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono text-3xl font-bold ${urgent ? "text-rust" : "text-forest"}`}>
          {daysRemaining}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-forest/60">
          {daysRemaining === 1 ? "day left" : "days left"}
        </span>
      </div>
      {label && <span className="mt-2 text-xs font-medium text-forest/70">{label}</span>}
    </div>
  );
}
