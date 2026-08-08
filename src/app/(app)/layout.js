"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TopNav, BottomNav } from "@/components/ui/Nav";

// Shared shell for authenticated pages: top navbar (desktop) + bottom nav
// (mobile), and a simple auth guard that sends signed-out visitors back
// to onboarding.
export default function AppShellLayout({ children }) {
  const { isLoaded, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <span className="h-8 w-8 rounded-full border-[3px] border-clay-100 border-t-moss animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <TopNav />
      <div className="pt-0 pb-24 md:pt-20 md:pb-10">{children}</div>
      <BottomNav />
    </div>
  );
}
