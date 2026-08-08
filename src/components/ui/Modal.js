"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Header, Subheader, Paragraph } from "./Typography";

// Modal loading component — spec item 1: includes children of header (h1),
// subheader (h2), and paragraph for subtext, reused across sign-in, sign-up,
// forgot/reset password, dashboards, and anywhere else a blocking action
// needs feedback.
export default function Modal({ open, title, subtitle, description, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-xl2 bg-sand-50 p-7 shadow-soft"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <span className="h-10 w-10 rounded-full border-[3px] border-clay-100 border-t-moss animate-spin" aria-hidden="true" />
              {title && <Header className="text-xl">{title}</Header>}
              {subtitle && <Subheader>{subtitle}</Subheader>}
              {description && <Paragraph className="text-sm">{description}</Paragraph>}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
