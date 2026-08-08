"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Paragraph } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusModal from "@/components/ui/StatusModal";
import HistoryGoBack from "@/components/ui/HistoryGoBack";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = {};
    if (!password || password.length < 6) e2.password = "Use at least 6 characters.";
    if (confirm !== password) e2.confirm = "Passwords don't match.";
    setErrors(e2);
    if (Object.keys(e2).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-8 md:flex md:items-center md:justify-center">
      <div className="mx-auto w-full max-w-sm">
        <HistoryGoBack />
        <Header className="mt-8 text-2xl">Set a new password</Header>
        <Paragraph className="mt-1 text-sm">Choose something you haven&rsquo;t used before.</Paragraph>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input id="password" type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <Input id="confirm" type="password" label="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
          <Button type="submit" className="mt-2 w-full py-3.5">Reset password</Button>
        </form>
      </div>
      <Modal open={loading} title="Updating your password" />
      <StatusModal
        open={done}
        status="success"
        title="Password updated"
        description="You can now sign in with your new password."
        actionLabel="Go to sign in"
        onClose={() => router.push("/sign-in")}
      />
    </main>
  );
}
