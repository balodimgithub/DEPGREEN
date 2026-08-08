"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header, Subheader, Paragraph, Label, ErrorMessage } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatusModal from "@/components/ui/StatusModal";
import HistoryGoBack from "@/components/ui/HistoryGoBack";
import { NEIGHBORHOODS } from "@/data/sets";

// SIGN-UP PAGE — spec: two account classes (Household / Business),
// multi-step flow that changes after each page is filled, followed
// chronologically and with meaning:
//   a. Getting to know you (names)
//   b. How we can contact you / connect you with your agent
//   c. Organizing you into your set
// Uses the shared Modal (loading) + StatusModal (result) + Input +
// Button + HistoryGoBack components throughout.

const STEPS = ["Account type", "Getting to know you", "Contact & verification", "Your set"];

function StepDots({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2 flex-1">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-moss" : "bg-clay-100"}`}
          />
        </div>
      ))}
    </div>
  );
}

const initialForm = {
  accountType: "",
  householdType: "freehold",
  firstName: "",
  middleName: "",
  lastName: "",
  username: "",
  phone: "",
  email: "",
  dob: "",
  ownershipProof: "",
  country: "Nigeria",
  lga: "",
  address: "",
  password: "",
  neighborhoodId: "",
  setId: "",
};

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState(null); // "success" | "failed"
  const [statusMessage, setStatusMessage] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validateStep() {
    const e = {};
    if (step === 0 && !form.accountType) e.accountType = "Choose an account type to continue.";
    if (step === 1) {
      if (!form.firstName) e.firstName = "First name is required.";
      if (!form.lastName) e.lastName = "Last name is required.";
      if (!form.username) e.username = "Choose a username.";
    }
    if (step === 2) {
      if (!form.phone) e.phone = "Phone number is required.";
      if (!form.email) e.email = "Email is required.";
      if (!form.dob) e.dob = "Date of birth is required.";
      if (!form.lga) e.lga = "Local Government Area is required.";
      if (!form.address) e.address = "House address is required.";
      if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters.";
      if (!form.ownershipProof) e.ownershipProof = "Please attach a screenshot proving apartment ownership.";
    }
    if (step === 3) {
      if (!form.neighborhoodId) e.neighborhoodId = "Choose your neighborhood.";
      if (!form.setId) e.setId = "Choose your set.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      submit();
    }
  }

  function back() {
    if (step === 0) {
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      await signUp(form);
      setLoading(false);
      setStatusModal("success");
      setStatusMessage("Your account is ready. Welcome to your set!");
    } catch (err) {
      setLoading(false);
      setStatusModal("failed");
      setStatusMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  const neighborhood = NEIGHBORHOODS.find((n) => n.id === form.neighborhoodId);

  return (
    <main className="min-h-screen bg-sand px-6 py-8 md:flex md:items-center md:justify-center">
      <div className="mx-auto w-full max-w-md">
        <HistoryGoBack label={step === 0 ? "Back" : "Previous step"} />
        <div className="mt-6">
          <StepDots step={step} />
          <Header className="text-2xl">Let&rsquo;s get you started</Header>
          <Subheader className="mt-1">{STEPS[step]}</Subheader>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex flex-col gap-4"
            >
              {step === 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { id: "household", label: "Household", desc: "For freehold or leasehold homes.", icon: HomeIcon },
                    { id: "business", label: "Business / Industry", desc: "For commercial premises.", icon: Building2 },
                  ].map(({ id, label, desc, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setForm((f) => ({ ...f, accountType: id }))}
                      className={`flex flex-col items-start gap-2 rounded-xl2 border-2 p-5 text-left transition ${
                        form.accountType === id ? "border-moss bg-leaf-100" : "border-clay-100 bg-white/60 hover:border-moss/40"
                      }`}
                    >
                      <Icon size={22} className="text-forest" />
                      <span className="font-sans font-semibold text-forest">{label}</span>
                      <span className="text-xs text-ink/60">{desc}</span>
                    </button>
                  ))}
                  <ErrorMessage>{errors.accountType}</ErrorMessage>

                  {form.accountType === "household" && (
                    <div className="sm:col-span-2 mt-1">
                      <Label>Ownership type</Label>
                      <div className="flex gap-3">
                        {["freehold", "leasehold"].map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setForm((f) => ({ ...f, householdType: t }))}
                            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition ${
                              form.householdType === t ? "border-moss bg-leaf-100 text-forest" : "border-clay-100 text-ink/70"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <>
                  <Paragraph className="text-sm -mt-2 mb-1">For the names alone.</Paragraph>
                  <Input id="firstName" label="First name" value={form.firstName} onChange={set("firstName")} error={errors.firstName} placeholder="Chiamaka" />
                  <Input id="middleName" label="Middle name (optional)" value={form.middleName} onChange={set("middleName")} placeholder="Ngozi" />
                  <Input id="lastName" label="Last name" value={form.lastName} onChange={set("lastName")} error={errors.lastName} placeholder="Okonkwo" />
                  <Input id="username" label="Username" value={form.username} onChange={set("username")} error={errors.username} placeholder="chiamaka.o" />
                </>
              )}

              {step === 2 && (
                <>
                  <Paragraph className="text-sm -mt-2 mb-1">
                    How we can contact you and connect you with the agent allocated to your set.
                  </Paragraph>
                  <Input id="phone" label="Phone number" value={form.phone} onChange={set("phone")} error={errors.phone} placeholder="080X XXX XXXX" />
                  <Input id="email" type="email" label="Email" value={form.email} onChange={set("email")} error={errors.email} placeholder="you@example.com" />
                  <Input id="dob" type="date" label="Date of birth" value={form.dob} onChange={set("dob")} error={errors.dob} />
                  <Input id="country" label="Country" value={form.country} onChange={set("country")} />
                  <Input id="lga" label="Local Government Area" value={form.lga} onChange={set("lga")} error={errors.lga} placeholder="Eti-Osa" />
                  <Input id="address" label="House address" value={form.address} onChange={set("address")} error={errors.address} placeholder="12 Freedom Way" />
                  <Input id="password" type="password" label="Password" value={form.password} onChange={set("password")} error={errors.password} placeholder="At least 6 characters" />
                  <div>
                    <Label htmlFor="ownershipProof">Proof of apartment ownership (screenshot)</Label>
                    <input
                      id="ownershipProof"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setForm((f) => ({ ...f, ownershipProof: e.target.files?.[0]?.name || "" }))}
                      className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-leaf-100 file:px-4 file:py-2 file:text-forest file:font-medium"
                    />
                    <ErrorMessage>{errors.ownershipProof}</ErrorMessage>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <Paragraph className="text-sm -mt-2 mb-1">Organizing you into your set.</Paragraph>
                  <div>
                    <Label htmlFor="neighborhoodId">Neighborhood</Label>
                    <select
                      id="neighborhoodId"
                      value={form.neighborhoodId}
                      onChange={(e) => setForm((f) => ({ ...f, neighborhoodId: e.target.value, setId: "" }))}
                      className="w-full rounded-xl border border-clay-100 bg-white/70 px-4 py-3 text-ink outline-none focus:border-moss"
                    >
                      <option value="">Select a neighborhood</option>
                      {NEIGHBORHOODS.map((n) => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </select>
                    <ErrorMessage>{errors.neighborhoodId}</ErrorMessage>
                  </div>
                  {neighborhood && (
                    <div>
                      <Label htmlFor="setId">Set</Label>
                      <select
                        id="setId"
                        value={form.setId}
                        onChange={set("setId")}
                        className="w-full rounded-xl border border-clay-100 bg-white/70 px-4 py-3 text-ink outline-none focus:border-moss"
                      >
                        <option value="">Select your set</option>
                        {neighborhood.sets.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <ErrorMessage>{errors.setId}</ErrorMessage>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            <Button variant="secondary" onClick={back} className="flex-1">
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            <Button onClick={next} className="flex-1">
              {step === STEPS.length - 1 ? "Create account" : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      <Modal open={loading} title="Creating your account" description="Verifying your details with DEPGREEN…" />
      <StatusModal
        open={!!statusModal}
        status={statusModal || "pending"}
        title={statusModal === "success" ? "Welcome to DEPGREEN" : "Sign up failed"}
        description={statusMessage}
        actionLabel={statusModal === "success" ? "Go to home" : "Try again"}
        onClose={() => {
          if (statusModal === "success") {
            router.push("/home");
          } else {
            setStatusModal(null);
          }
        }}
      />
    </main>
  );
}
