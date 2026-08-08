"use client";
import { useMemo, useState } from "react";
import { HeartHandshake, Wallet, ArrowRight } from "lucide-react";
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
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

// HOME PAGE — spec: days remaining for pickup, PayStack-style payment CTA,
// "Make a donation" component, community framing.
export default function Home() {
  const { user } = useAuth();
  const { cycle, rates } = useApp();
  const [payLoading, setPayLoading] = useState(false);
  const [payStatus, setPayStatus] = useState(null);
  const [donateOpen, setDonateOpen] = useState(false);

  const daysLeft = cycle ? daysUntil(cycle.nextPickupDate) : 0;
  const rate = useMemo(() => {
    if (!user) return rates.freehold;
    if (user.accountType === "business") return rates.business;
    if (user.householdType === "leasehold") return rates.leasehold_tenant;
    return rates.freehold;
  }, [user, rates]);

  // Mock Paystack flow — spec calls out "Payment integration call to
  // action button using PayStack flows". No live Paystack public key is
  // connected in this environment, so this simulates the redirect +
  // callback lifecycle (pending -> success) that PaystackPop.setup()
  // would normally drive. Swap in real `react-paystack` / PaystackPop
  // once a public key is available — see README.md.
  function payNow() {
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPayStatus("success");
    }, 1200);
  }

  return (
    <main className="px-6 pt-6 md:px-10 md:pt-2 max-w-3xl mx-auto">
      <Eyebrow>{cycle?.contributionComplete ? "Pickup confirmed" : "Awaiting your contribution"}</Eyebrow>
      <Header className="mt-2">
        Hey {user?.firstName || "there"}, here&rsquo;s your set.
      </Header>
      <Paragraph className="mt-1">
        {cycle?.contributionComplete
          ? "You're all set — your agent has you scheduled for this cycle."
          : "Complete your contribution so your agent can add you to this cycle's pickup route."}
      </Paragraph>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-5 rounded-xl2 bg-white/70 p-6 shadow-card">
          <CycleRing daysRemaining={daysLeft} cycleLength={cycle?.cycleLengthDays || 30} size={112} />
          <div>
            <Subheader>Next pickup</Subheader>
            <Paragraph className="text-sm mt-1">
              {cycle ? new Date(cycle.nextPickupDate).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" }) : "—"}
            </Paragraph>
          </div>
        </div>

        <div className="rounded-xl2 bg-forest text-sand-50 p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-leaf">
              <Wallet size={18} />
              <span className="text-sm font-medium">This cycle&rsquo;s contribution</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold">₦{rate.toLocaleString()}</p>
          </div>
          <Button onClick={payNow} loading={payLoading} disabled={cycle?.contributionComplete} className="mt-4 bg-leaf text-forest hover:bg-leaf/90">
            {cycle?.contributionComplete ? "Payment complete" : "Pay with Paystack"} <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-xl2 border border-clay-100 bg-white/50 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-100">
            <HeartHandshake size={18} className="text-moss" />
          </span>
          <div>
            <Subheader>Make a donation</Subheader>
            <Paragraph className="text-sm mt-1">
              Support DEPGREEN&rsquo;s agents and equipment so we can keep Lagos
              clean — beyond your own household&rsquo;s contribution.
            </Paragraph>
            <Button variant="secondary" className="mt-3" onClick={() => setDonateOpen(true)}>
              Donate to the initiative
            </Button>
          </div>
        </div>
      </div>

      <Modal open={payLoading} title="Processing payment" description="Confirming with Paystack…" />
      <StatusModal
        open={!!payStatus}
        status={payStatus || "success"}
        title="Payment received"
        description="Your contribution for this cycle is confirmed. Your agent has been notified."
        actionLabel="Great"
        onClose={() => setPayStatus(null)}
      />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </main>
  );
}

function DonateModal({ open, onClose }) {
  const [amount, setAmount] = useState(1000);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function donate() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus("success");
    }, 1000);
  }

  if (!open && !status) return null;

  return (
    <>
      {open && !loading && !status && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm px-4" onClick={onClose}>
          <div className="w-full max-w-sm rounded-xl2 bg-sand-50 p-7 shadow-soft" onClick={(e) => e.stopPropagation()}>
            <Subheader>Make a donation</Subheader>
            <Paragraph className="text-sm mt-1">Every naira helps fund agents and equipment.</Paragraph>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[500, 1000, 5000].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${amount === v ? "border-moss bg-leaf-100 text-forest" : "border-clay-100 text-ink/70"}`}
                >
                  ₦{v.toLocaleString()}
                </button>
              ))}
            </div>
            <Button className="mt-5 w-full" onClick={donate}>Donate ₦{amount.toLocaleString()}</Button>
          </div>
        </div>
      )}
      <Modal open={loading} title="Processing donation" />
      <StatusModal
        open={!!status}
        status="success"
        title="Thank you!"
        description={`Your ₦${amount.toLocaleString()} donation helps keep Lagos clean.`}
        onClose={() => { setStatus(null); onClose(); }}
      />
    </>
  );
}
