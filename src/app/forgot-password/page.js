"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Paragraph } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusModal from "@/components/ui/StatusModal";
import HistoryGoBack from "@/components/ui/HistoryGoBack";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { setError("Enter the email on your account."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-8 md:flex md:items-center md:justify-center">
      <div className="mx-auto w-full max-w-sm">
        <HistoryGoBack />
        <Header className="mt-8 text-2xl">Reset your password</Header>
        <Paragraph className="mt-1 text-sm">
          Enter your email and we&rsquo;ll send a link to reset your password.
        </Paragraph>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input id="email" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="you@example.com" />
          <Button type="submit" className="mt-2 w-full py-3.5">Send reset link</Button>
        </form>
      </div>
      <Modal open={loading} title="Sending reset link" description="One moment…" />
      <StatusModal
        open={sent}
        status="success"
        title="Check your inbox"
        description={`We've sent a reset link to ${email}.`}
        actionLabel="Back to sign in"
        onClose={() => router.push("/sign-in")}
      />
    </main>
  );
}
