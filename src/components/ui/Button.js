"use client";
import { motion } from "framer-motion";

// Custom button component — spec item 4: shared across SignIn, SignUp,
// Forgot Password, Reset Password, and general CTAs.
const VARIANTS = {
  primary: "bg-moss text-sand-50 hover:bg-moss-600 shadow-card",
  secondary: "bg-transparent text-forest border border-forest/25 hover:bg-forest/5",
  ghost: "bg-transparent text-forest hover:bg-forest/5",
  danger: "bg-rust text-sand-50 hover:bg-rust/90",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
      )}
      {children}
    </motion.button>
  );
}
