"use client";
import { useState } from "react";
import { Users, MapPinned, Home as HomeIcon, Truck, Sparkles, Send, ChevronLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Header, Subheader, Paragraph, Eyebrow } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

// MESSAGES — spec: five groups — set, neighborhood, household, direct
// agent DM (for artificial demand / reports / complaints), and the
// DepGreen AI ChatBox for quick guidance when an agent is unavailable.
const GROUPS = [
  { id: "set", label: "My Set", icon: Users, desc: "Discuss issues, request agent reassignment, report concerns." },
  { id: "neighborhood", label: "Neighborhood", icon: MapPinned, desc: "Wider updates across your neighborhood." },
  { id: "household", label: "Household", icon: HomeIcon, desc: "Private thread with members of your household." },
  { id: "agent", label: "Your Agent", icon: Truck, desc: "Direct message for artificial demand, reports, or complaints." },
  { id: "ai", label: "DepGreen AI", icon: Sparkles, desc: "Quick help with cleaning equipment maintenance or recycling." },
];

const AI_REPLIES = [
  "To keep your compound bin fresh, rinse it weekly and let it air-dry before relining.",
  "For recycling, rinse plastics, remove caps if a different resin, and keep them dry before your pickup day.",
  "Your agent typically arrives within a 2-hour window of your scheduled slot — check the System Tracker for the exact day.",
  "Cleaner, un-crushed plastics are graded higher during valuation — flatten only after weighing where possible.",
];

export default function Messages() {
  const { messages, sendMessage } = useApp();
  const [activeGroup, setActiveGroup] = useState(null);
  const [draft, setDraft] = useState("");

  if (!messages) return null;

  const group = GROUPS.find((g) => g.id === activeGroup);

  function handleSend(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(activeGroup, draft.trim());
    setDraft("");
    if (activeGroup === "ai") {
      setTimeout(() => {
        const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
        sendMessage("ai", reply, "DepGreen AI");
      }, 700);
    }
  }

  if (!group) {
    return (
      <main className="px-6 pt-6 md:px-10 md:pt-2 max-w-3xl mx-auto">
        <Eyebrow>Messages</Eyebrow>
        <Header className="mt-2">Your conversations</Header>
        <Paragraph className="mt-1">Reach your set, neighborhood, household, agent, or DepGreen AI.</Paragraph>
        <ul className="mt-6 flex flex-col gap-3">
          {GROUPS.map(({ id, label, icon: Icon, desc }) => {
            const last = messages[id]?.[messages[id].length - 1];
            return (
              <li key={id}>
                <button
                  onClick={() => setActiveGroup(id)}
                  className="flex w-full items-center gap-4 rounded-xl2 bg-white/70 p-4 text-left shadow-card hover:bg-white/90 transition"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-100">
                    <Icon size={18} className="text-moss" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between">
                      <span className="font-sans font-semibold text-forest text-sm">{label}</span>
                      {last && <span className="text-xs text-ink/40">{last.time}</span>}
                    </span>
                    <span className="block truncate text-xs text-ink/60 mt-0.5">
                      {last ? `${last.from}: ${last.text}` : desc}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col px-6 pt-4 md:px-10 md:h-[calc(100vh-6rem)] max-w-3xl mx-auto">
      <button onClick={() => setActiveGroup(null)} className="flex items-center gap-1 text-sm font-medium text-forest/70 hover:text-forest w-fit">
        <ChevronLeft size={16} /> All conversations
      </button>
      <Subheader className="mt-3">{group.label}</Subheader>
      <Paragraph className="text-xs text-ink/60 mt-0.5">{group.desc}</Paragraph>

      <div className="mt-4 flex-1 overflow-y-auto rounded-xl2 bg-white/50 p-4 flex flex-col gap-3">
        {messages[activeGroup].length === 0 && (
          <p className="text-sm text-ink/40 text-center mt-8">No messages yet — say hello.</p>
        )}
        {messages[activeGroup].map((m) => {
          const isMe = m.from === "You";
          return (
            <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "self-end bg-moss text-sand-50" : "self-start bg-white shadow-card text-ink"}`}>
              {!isMe && <p className="text-[11px] font-semibold text-forest/70 mb-0.5">{m.from}</p>}
              <p>{m.text}</p>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="mt-3 mb-2 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${group.label}…`}
          className="flex-1 rounded-full border border-clay-100 bg-white/80 px-4 py-3 text-sm outline-none focus:border-moss"
        />
        <Button type="submit" className="rounded-full !px-4 !py-3">
          <Send size={16} />
        </Button>
      </form>
    </main>
  );
}
