"use client";
import { useState } from "react";
import { Copy, Camera, Recycle, KeyRound, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header, Subheader, Paragraph, Label } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusModal from "@/components/ui/StatusModal";

// PROFILE PAGE — spec: change password, referral link, change profile
// picture, plastics submission (image + weigh + visual valuation), and
// an official photograph of the person responsible for rent.
export default function Profile() {
  const router = useRouter();
  const { user, updateUser, signOut } = useAuth();
  const referralLink = `depgreen.app/join?ref=${user?.username || "you"}`;
  const [copied, setCopied] = useState(false);

  function copyReferral() {
    navigator.clipboard?.writeText(`https://${referralLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="px-6 pt-6 md:px-10 md:pt-2 max-w-3xl mx-auto pb-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-sand-50 text-xl font-bold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <ProfilePictureButton />
        </div>
        <div>
          <Header className="text-2xl">
            {user?.firstName} {user?.lastName}
          </Header>
          <Paragraph className="text-sm mt-0.5">@{user?.username} &middot; {user?.accountType === "business" ? "Business account" : "Household account"}</Paragraph>
        </div>
      </div>

      <section className="mt-8 rounded-xl2 bg-white/70 p-6 shadow-card">
        <Subheader>Referral link</Subheader>
        <Paragraph className="text-sm mt-1">Invite your neighbors to join your set.</Paragraph>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-clay-100 bg-sand-50 px-4 py-3">
          <span className="flex-1 truncate font-mono text-sm text-forest">{referralLink}</span>
          <button onClick={copyReferral} className="text-moss hover:text-moss-600" aria-label="Copy referral link">
            <Copy size={16} />
          </button>
        </div>
        {copied && <p className="mt-2 text-xs font-medium text-moss">Copied to clipboard</p>}
      </section>

      <PlasticsSubmission />
      <ChangePassword />
      <RentResponsibleUpload />

      <Button variant="danger" className="mt-8 w-full sm:w-auto" onClick={() => { signOut(); router.push("/"); }}>
        <LogOut size={16} /> Sign out
      </Button>
    </main>
  );
}

function ProfilePictureButton() {
  const { updateUser } = useAuth();
  return (
    <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-moss text-white shadow-card">
      <Camera size={13} />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => updateUser({ avatarFileName: e.target.files?.[0]?.name })}
      />
    </label>
  );
}

function ChangePassword() {
  const { updateUser } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!current || !next || next.length < 6) {
      setError("Enter your current password and a new password of at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      updateUser({ password: next });
      setLoading(false);
      setDone(true);
      setCurrent("");
      setNext("");
    }, 700);
  }

  return (
    <section className="mt-6 rounded-xl2 bg-white/70 p-6 shadow-card">
      <div className="flex items-center gap-2">
        <KeyRound size={18} className="text-forest" />
        <Subheader>Change password</Subheader>
      </div>
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input id="current" type="password" label="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <Input id="next" type="password" label="New password" value={next} onChange={(e) => setNext(e.target.value)} error={error} />
        <Button type="submit" loading={loading} className="sm:col-span-2 sm:w-fit">Update password</Button>
      </form>
      <StatusModal open={done} status="success" title="Password updated" onClose={() => setDone(false)} />
    </section>
  );
}

function PlasticsSubmission() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function submit() {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mock valuation — real weighing/inspection happens on the agent app.
      const weightKg = (1 + Math.random() * 4).toFixed(1);
      const grade = weightKg > 3 ? "Premium" : "Standard";
      setResult({ weightKg, grade, value: Math.round(weightKg * 350) });
    }, 1100);
  }

  return (
    <section className="mt-6 rounded-xl2 bg-white/70 p-6 shadow-card">
      <div className="flex items-center gap-2">
        <Recycle size={18} className="text-forest" />
        <Subheader>Submit plastics for recycling</Subheader>
      </div>
      <Paragraph className="text-sm mt-1">
        Upload a photo at pickup time. Your agent will weigh and visually
        inspect it — cleaner, in-shape plastics earn a higher valuation.
      </Paragraph>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block flex-1 text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-leaf-100 file:px-4 file:py-2 file:text-forest file:font-medium"
        />
        <Button onClick={submit} loading={loading} disabled={!file}>Submit</Button>
      </div>
      {result && (
        <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-leaf-100 px-4 py-3 text-sm text-forest">
          <span>Weight: <strong>{result.weightKg} kg</strong></span>
          <span>Grade: <strong>{result.grade}</strong></span>
          <span>Estimated value: <strong>₦{result.value.toLocaleString()}</strong></span>
        </div>
      )}
    </section>
  );
}

function RentResponsibleUpload() {
  const { updateUser } = useAuth();
  const [fileName, setFileName] = useState("");
  return (
    <section className="mt-6 rounded-xl2 bg-white/70 p-6 shadow-card">
      <Subheader>Person responsible for rent</Subheader>
      <Paragraph className="text-sm mt-1">
        Attach an official photograph of the person known to be responsible for rent on this household.
      </Paragraph>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const name = e.target.files?.[0]?.name || "";
          setFileName(name);
          updateUser({ rentResponsiblePhoto: name });
        }}
        className="mt-3 block text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-leaf-100 file:px-4 file:py-2 file:text-forest file:font-medium"
      />
      {fileName && <p className="mt-2 text-xs text-moss font-medium">Attached: {fileName}</p>}
    </section>
  );
}
