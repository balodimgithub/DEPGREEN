"use client";
import { useState } from "react";
import { Package, ShoppingCart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Header, Subheader, Paragraph, Eyebrow } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import StatusModal from "@/components/ui/StatusModal";
import Modal from "@/components/ui/Modal";

// MARKETPLACE — spec: two tabs, "Tools Owned" (auto-populated from what
// was assigned at registration per the Capex list) and "Explore" (buy
// replacement/extra cleaning equipment, delivered for an affordable
// carriage-outward fee).
export default function Marketplace() {
  const { equipment } = useApp();
  const [tab, setTab] = useState("owned");

  return (
    <main className="px-6 pt-6 md:px-10 md:pt-2 max-w-3xl mx-auto">
      <Eyebrow>Marketplace</Eyebrow>
      <Header className="mt-2">Your cleaning equipment</Header>
      <Paragraph className="mt-1">
        Equipment listed under DEPGREEN&rsquo;s capital expenditure is issued
        to every household at registration. Need a replacement or an extra
        piece? Explore the marketplace below.
      </Paragraph>

      <div className="mt-6 flex gap-2 rounded-full bg-clay-100/60 p-1 w-fit">
        {[
          { id: "owned", label: "Tools Owned" },
          { id: "explore", label: "Explore" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              tab === t.id ? "bg-forest text-sand-50" : "text-forest/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "owned" ? <OwnedList equipment={equipment} /> : <ExploreList equipment={equipment} />}
    </main>
  );
}

function OwnedList({ equipment }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {equipment.map((item) => (
        <li key={item.id} className="flex items-start gap-3 rounded-xl2 bg-white/70 p-4 shadow-card">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-100">
            <Package size={16} className="text-moss" />
          </span>
          <div>
            <p className="font-sans font-semibold text-forest text-sm">{item.name}</p>
            <p className="text-xs text-ink/60 mt-0.5">Qty owned: {item.quantity}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ExploreList({ equipment }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);

  function order(item) {
    setCart(item);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrdered(true);
    }, 900);
  }

  return (
    <>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {equipment.map((item) => (
          <li key={item.id} className="flex flex-col gap-2 rounded-xl2 bg-white/70 p-4 shadow-card">
            <div className="flex items-start justify-between">
              <p className="font-sans font-semibold text-forest text-sm">{item.name}</p>
              <span className="font-mono text-sm font-bold text-forest">₦{item.price.toLocaleString()}</span>
            </div>
            <p className="text-xs text-ink/60">{item.description}</p>
            <Button variant="secondary" className="mt-1 self-start py-2 px-4 text-xs" onClick={() => order(item)}>
              <ShoppingCart size={14} /> Order &middot; affordable delivery
            </Button>
          </li>
        ))}
      </ul>
      <Modal open={loading} title="Placing your order" description={cart ? `Confirming ${cart.name}…` : undefined} />
      <StatusModal
        open={ordered}
        status="success"
        title="Order placed"
        description={cart ? `${cart.name} will be delivered to your household with the standard carriage fee.` : undefined}
        onClose={() => setOrdered(false)}
      />
    </>
  );
}
