"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radar, User, ShoppingBag, MessageCircle, Leaf } from "lucide-react";

// NAVIGATION — spec: "home page icon, system tracker icon, Profile Page,
// marketplace icon, and message icon at the bottom for mobile screens and
// a fixed top navbar for large screens."
const ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tracker", label: "Tracker", icon: Radar },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-center justify-around border-t border-clay-100 bg-sand-50/95 backdrop-blur px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg"
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} className={active ? "text-moss" : "text-forest/50"} />
            <span className={`text-[10px] font-medium ${active ? "text-moss" : "text-forest/50"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function TopNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex fixed top-0 inset-x-0 z-40 items-center justify-between border-b border-clay-100 bg-sand-50/95 backdrop-blur px-8 py-4">
      <Link href="/home" className="flex items-center gap-2">
        <Leaf size={22} className="text-moss" />
        <span className="font-sans font-extrabold text-forest tracking-tight text-lg">
          DEP<span className="text-moss">GREEN</span>
        </span>
      </Link>
      <div className="flex items-center gap-8">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 text-sm font-medium transition ${active ? "text-moss" : "text-forest/60 hover:text-forest"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
