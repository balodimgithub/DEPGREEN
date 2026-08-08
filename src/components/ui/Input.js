"use client";
import { forwardRef } from "react";
import { Label, ErrorMessage } from "./Typography";

// Custom input module — spec item 5. Single component reused across
// sign-up, sign-in, forgot/reset password, and profile forms.
const Input = forwardRef(function Input(
  { label, id, error, className = "", type = "text", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition
          ${error ? "border-rust focus:border-rust" : "border-clay-100 focus:border-moss"}
          ${className}`}
        {...props}
      />
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
});

export default Input;
