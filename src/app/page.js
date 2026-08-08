"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import Button from "@/components/ui/Button";
import { Header, Paragraph, Eyebrow } from "@/components/ui/Typography";

// ONBOARDING PAGE — per spec: headline, sub-text on shared community
// responsibility, Get Started -> Sign Up, Sign In -> Sign In.
export default function Onboarding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-forest flex flex-col justify-between px-6 pb-10 pt-16 md:items-center md:pt-24">
      {/* Ambient cycle-ring watermark, echoes the signature motif from the start */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[18px] border-leaf/10" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full border-[14px] border-moss/15" />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 md:mb-16"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss/20">
          <Leaf size={18} className="text-leaf" />
        </span>
        <span className="font-sans font-extrabold tracking-tight text-sand-50 text-lg">
          DEP<span className="text-leaf">GREEN</span>
        </span>
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col justify-center md:max-w-md md:flex-none">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Eyebrow className="text-leaf/80">Fast &amp; regular disposal</Eyebrow>
          <Header className="mt-3 text-sand-50 text-4xl md:text-5xl">
            Hey there, let&rsquo;s make your environment clean.
          </Header>
          <Paragraph className="mt-4 text-sand-100/80">
            Making your environment clean is a team effort — not only DEPGREEN
            and you, but a whole community effort.
          </Paragraph>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="relative z-10 flex flex-col gap-3 md:w-full md:max-w-xs"
      >
        <Link href="/sign-up" className="w-full">
          <Button className="w-full py-4 text-base">Get Started</Button>
        </Link>
        <Link href="/sign-in" className="w-full">
          <Button variant="secondary" className="w-full border-sand-50/30 text-sand-50 hover:bg-sand-50/10">
            Sign In
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
