"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Header, Paragraph } from "./Typography";
import Button from "./Button";

// API request status UI modal — spec item 2. A single module reusable for
// success / pending / failed states anywhere in the app (payments,
// sign-up, plastic submission, etc.)
const CONFIG = {
  success: { icon: "\u2713", ring: "border-moss text-moss", bg: "bg-leaf-100" },
  pending: { icon: "\u2026", ring: "border-amber text-amber", bg: "bg-amber-100" },
  failed: { icon: "\u2715", ring: "border-rust text-rust", bg: "bg-rust-100" },
};

export default function StatusModal({ open, status = "pending", title, description, onClose, actionLabel = "Done" }) {
  const cfg = CONFIG[status] || CONFIG.pending;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-xl2 bg-sand-50 p-7 shadow-soft text-center"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 ${cfg.ring} ${cfg.bg} text-2xl font-bold`}>
              {cfg.icon}
            </div>
            <Header className="text-xl">{title}</Header>
            {description && <Paragraph className="mt-2 text-sm">{description}</Paragraph>}
            <Button className="mt-6 w-full" onClick={onClose}>
              {actionLabel}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
