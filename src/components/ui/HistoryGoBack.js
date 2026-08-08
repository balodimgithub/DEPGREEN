"use client";
import { useRouter } from "next/navigation";

// HistoryGoBack() — spec: "Every Page with multi-step flows should
// include a HistoryGoback()". Sits top-left per the Sign-In spec note.
export default function HistoryGoBack({ label = "Back", className = "" }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-forest/70 hover:text-forest transition ${className}`}
    >
      <span aria-hidden="true">&#8592;</span> {label}
    </button>
  );
}
