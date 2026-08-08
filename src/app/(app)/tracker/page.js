"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { Header, Subheader, Paragraph, Eyebrow } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import CycleRing from "@/components/ui/CycleRing";
import Modal from "@/components/ui/Modal";
import StatusModal from "@/components/ui/StatusModal";

function daysUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}

// SYSTEM TRACKER — spec: remaining days for pickup + CTA to contribute for
// next month; CTA changes once the agent has picked up for the current
// cycle, into a fresh "complete payment for this month" flow. Agents will
// not come for pickup until the household's contribution is complete.
export default function Tracker() {
  const { user } = useAuth();
  const { cycle, rates, completeContribution, advanceCycleAfterPickup } = useApp();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const daysLeft = cycle ? daysUntil(cycle.nextPickupDate) : 0;
  const rate = useMemo(() => {
    if (!user) return rates.freehold;
    if (user.accountType === "business") return rates.business;
    if (user.householdType === "leasehold") return rates.leasehold_tenant;
    return rates.freehold;
  }, [user, rates]);

  function payForCycle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      completeContribution();
      setStatus("success");
    }, 1000);
  }

  const steps = [
    { label: "Contribution submitted", done: cycle?.contributionComplete },
    { label: "Added to agent's pickup route", done: cycle?.contributionComplete },
    { label: "Agent collects waste", done: false },
  ];

  return (
    <main className="px-6 pt-6 md:px-10 md:pt-2 max-w-3xl mx-auto">
      <Eyebrow>System tracker</Eyebrow>
      <Header className="mt-2">Your collection cycle</Header>
      <Paragraph className="mt-1">
        {cycle?.contributionComplete
          ? "Your agent is scheduled to collect on your pickup day."
          : "Your agent won't be routed to your set until this cycle's contribution is complete."}
      </Paragraph>

      <div className="mt-6 flex flex-col items-center gap-4 rounded-xl2 bg-white/70 p-8 shadow-card">
        <CycleRing daysRemaining={daysLeft} cycleLength={cycle?.cycleLengthDays || 30} size={168} />
        <Subheader>
          {cycle ? new Date(cycle.nextPickupDate).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" }) : "—"}
        </Subheader>

        {!cycle?.contributionComplete ? (
          <Button onClick={payForCycle} loading={loading} className="mt-2 w-full sm:w-auto">
            Complete payment for this month — ₦{rate.toLocaleString()}
          </Button>
        ) : (
          <div className="mt-2 flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-2 text-sm font-medium text-forest">
            <CheckCircle2 size={16} /> Contribution complete for this cycle
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl2 border border-clay-100 bg-white/50 p-6">
        <Subheader>Cycle progress</Subheader>
        <ul className="mt-4 flex flex-col gap-4">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-3">
              {s.done ? <CheckCircle2 size={20} className="text-moss" /> : <Circle size={20} className="text-clay-400" />}
              <span className={`text-sm ${s.done ? "text-forest font-medium" : "text-ink/60"}`}>{s.label}</span>
            </li>
          ))}
        </ul>

        {cycle?.contributionComplete && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-amber-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-forest">
              <Truck size={16} /> Demo control — simulate the agent completing today&rsquo;s pickup.
            </div>
            <Button
              variant="secondary"
              className="shrink-0 py-2 px-4 text-xs"
              onClick={() => { advanceCycleAfterPickup(); setStatus(null); }}
            >
              Simulate pickup
            </Button>
          </div>
        )}
      </div>

      <Modal open={loading} title="Processing payment" description="Confirming with Paystack…" />
      <StatusModal
        open={status === "success"}
        status="success"
        title="You're on the route"
        description="Your agent has been notified and will collect on your scheduled day."
        onClose={() => setStatus(null)}
      />
    </main>
  );
}
