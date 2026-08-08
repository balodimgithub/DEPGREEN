"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header, Paragraph } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusModal from "@/components/ui/StatusModal";
import HistoryGoBack from "@/components/ui/HistoryGoBack";

// SIGN-IN PAGE — spec: Email/Username + Password, loading component,
// Forgot Password + HistoryGoBack() at top left.
export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = {};
    if (!identifier) e2.identifier = "Enter your email or username.";
    if (!password) e2.password = "Enter your password.";
    setErrors(e2);
    if (Object.keys(e2).length) return;

    setLoading(true);
    try {
      await signIn({ identifier, password });
      setLoading(false);
      router.push("/home");
    } catch (err) {
      setLoading(false);
      setFailed(err.message || "Sign in failed. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-8 md:flex md:items-center md:justify-center">
      <div className="mx-auto w-full max-w-sm">
        <HistoryGoBack />

        <div className="mt-8 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100">
            <Leaf size={20} className="text-moss" />
          </span>
          <Header className="mt-4 text-2xl">Welcome back</Header>
          <Paragraph className="mt-1 text-sm">Sign in to check your next pickup.</Paragraph>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Input
            id="identifier"
            label="Username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            placeholder="chiamaka.o or you@example.com"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••••"
          />
          <div className="flex justify-end -mt-1">
            <Link href="/forgot-password" className="text-sm font-medium text-moss hover:text-moss-600">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="mt-2 w-full py-3.5">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          New to DEPGREEN?{" "}
          <Link href="/sign-up" className="font-semibold text-moss hover:text-moss-600">
            Create an account
          </Link>
        </p>
      </div>

      <Modal open={loading} title="Signing you in" description="Checking your details securely…" />
      <StatusModal
        open={!!failed}
        status="failed"
        title="We couldn't sign you in"
        description={failed}
        actionLabel="Try again"
        onClose={() => setFailed("")}
      />
    </main>
  );
}
