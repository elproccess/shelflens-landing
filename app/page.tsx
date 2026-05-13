"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const shelfEase = [0.22, 1, 0.36, 1] as const;

const APP_SIGN_IN_URL = "https://app.shelflens.co.uk";
const REQUEST_ACCESS_EVENT = "shelflens:open-request-access";

function openRequestAccess() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REQUEST_ACCESS_EVENT));
}

type RequestAccessFormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  storeCount: string;
  location: string;
  currentIssue: string;
  message: string;
};

const requestAccessInitialForm: RequestAccessFormState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  businessName: "",
  storeCount: "",
  location: "",
  currentIssue: "",
  message: "",
};

const requestAccessRequiredFields: Array<keyof RequestAccessFormState> = [
  "fullName",
  "email",
  "phoneNumber",
  "businessName",
  "storeCount",
  "location",
  "currentIssue",
];

const requestAccessIssueOptions = [
  "Empty shelves / gaps",
  "Planogram compliance",
  "Staff visibility",
  "Multi-store monitoring",
  "Other",
];

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

function Button({ children, className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "group relative isolate inline-flex min-h-[48px] items-center justify-center overflow-hidden rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "border border-cyan-200/25 bg-[linear-gradient(135deg,#6f55ff_0%,#3b82f6_45%,#20d5ef_100%)] text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.28),inset_0_1px_0_rgba(255,255,255,0.42)] hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(34,211,238,0.42),inset_0_1px_0_rgba(255,255,255,0.5)]",
        variant === "outline" &&
          "border border-white/14 bg-white/[0.035] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-cyan-200/24 hover:bg-white/[0.07]",
        variant === "ghost" && "text-white/70 hover:bg-white/[0.06] hover:text-white",
        className,
      )}
    >
      {variant === "default" && (
        <>
          <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.55),transparent_26%)] opacity-60" />
          <span className="pointer-events-none absolute inset-y-[-55%] left-[-70%] z-[-1] w-[45%] rotate-12 bg-white/45 blur-md transition-transform duration-700 group-hover:translate-x-[420%]" />
        </>
      )}
      {children}
    </button>
  );
}

function Icon({
  className = "h-5 w-5",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

const Icons = {
  Store: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M3 10l2-5h14l2 5" />
      <path d="M5 10v9h14v-9" />
      <path d="M9 19v-5h6v5" />
    </Icon>
  ),
  ShieldCheck: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6z" />
      <path d="M9.5 12.5l1.8 1.8 3.7-4" />
    </Icon>
  ),
  Check: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Icon>
  ),
  Activity: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M4 12h4l2-5 4 10 2-5h4" />
    </Icon>
  ),
  Zap: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z" />
    </Icon>
  ),
  Bars: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M6 20V10" />
      <path d="M12 20V4" />
      <path d="M18 20v-7" />
    </Icon>
  ),
  Sparkles: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </Icon>
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  ),
  X: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  ),
  Scan: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M7 3H5a2 2 0 0 0-2 2v2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M17 21h2a2 2 0 0 0 2-2v-2" />
      <path d="M7 12h10" />
    </Icon>
  ),
};

type RequestAccessFieldProps = {
  field: keyof RequestAccessFormState;
  label: string;
  value: string;
  onChange: (field: keyof RequestAccessFormState, value: string) => void;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  required?: boolean;
  type?: string;
};

const requestAccessInputClass =
  "min-h-[52px] w-full min-w-0 rounded-2xl border border-cyan-400/20 bg-slate-950/70 px-4 py-3 [font-family:inherit] text-[15px] font-semibold leading-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_0_0_1px_rgba(15,23,42,0.45)] outline-none transition duration-200 placeholder:text-slate-500 hover:border-cyan-300/35 hover:bg-slate-950/85 focus:border-cyan-300/70 focus:bg-slate-950/90 focus:ring-2 focus:ring-cyan-300/20 focus:shadow-[0_0_30px_rgba(34,211,238,0.13),inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[54px]";

function RequestAccessLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2.5 block text-xs font-bold uppercase leading-none tracking-[0.18em] text-cyan-100/80">
      {children}
      {required && <span className="ml-1 text-cyan-200">*</span>}
    </label>
  );
}

function RequestAccessField({
  field,
  label,
  value,
  onChange,
  autoComplete,
  inputMode,
  placeholder,
  required = true,
  type = "text",
}: RequestAccessFieldProps) {
  return (
    <div className="group/field min-w-0">
      <RequestAccessLabel required={required}>{label}</RequestAccessLabel>
      <input
        id={`request-access-${field}`}
        name={field}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(field, event.target.value)}
        className={cn(
          requestAccessInputClass,
          "caret-cyan-200 selection:bg-cyan-300/25 selection:text-white",
        )}
      />
    </div>
  );
}

function RequestAccessModal() {
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [form, setForm] = React.useState<RequestAccessFormState>(requestAccessInitialForm);
  const [submitState, setSubmitState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    setMounted(true);

    const handleOpen = () => {
      setIsOpen(true);
      setSubmitState("idle");
      setErrorMessage("");
    };

    window.addEventListener(REQUEST_ACCESS_EVENT, handleOpen);
    return () => window.removeEventListener(REQUEST_ACCESS_EVENT, handleOpen);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("request-access-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && submitState !== "loading") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("request-access-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, submitState]);

  const updateField = (field: keyof RequestAccessFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (submitState === "error") {
      setSubmitState("idle");
      setErrorMessage("");
    }
  };

  const closeModal = () => {
    if (submitState === "loading") return;
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missingRequiredField = requestAccessRequiredFields.some((field) => !form[field].trim());
    if (missingRequiredField) {
      setSubmitState("error");
      setErrorMessage("Please complete the required fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setSubmitState("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setSubmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(data?.error || "Unable to send your request right now.");
      }

      setSubmitState("success");
      setForm(requestAccessInitialForm);
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send your request right now.");
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.14),transparent_34%),rgba(2,7,19,0.88)] px-3 py-4 backdrop-blur-2xl sm:px-6 sm:py-8"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-access-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: shelfEase }}
        className="relative mx-auto w-full max-w-[780px] overflow-hidden rounded-[28px] border border-cyan-400/20 bg-slate-950/88 p-4 shadow-[0_34px_130px_rgba(0,0,0,0.62),0_0_90px_rgba(34,211,238,0.16),0_0_70px_rgba(16,185,129,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-emerald-300/10 backdrop-blur-2xl sm:rounded-[34px] sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_92%_18%,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_82%_90%,rgba(16,185,129,0.13),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-x-[-20%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.88),rgba(16,185,129,0.52),transparent)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/[0.025]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <SectionEyebrow icon={<Icons.Sparkles className="h-3.5 w-3.5" />}>Request access</SectionEyebrow>
              <h2 id="request-access-title" className="mt-4 text-2xl font-black tracking-[-0.035em] text-white sm:text-4xl">
                Tell us about your store.
              </h2>
              <p className="mt-3 max-w-[620px] text-sm font-medium leading-6 text-slate-300/72 sm:text-base sm:leading-7">
                Share the shelf visibility problem you want ShelfLens to help with. We will review it and follow up with access details.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close request access form"
              onClick={closeModal}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-cyan-300/18 bg-slate-950/55 text-cyan-100/74 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_26px_rgba(34,211,238,0.08)] transition hover:border-cyan-300/42 hover:bg-cyan-300/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          </div>

          {submitState === "success" ? (
            <div className="mt-7 overflow-hidden rounded-[24px] border border-emerald-300/28 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(2,8,19,0.78))] p-5 shadow-[0_0_54px_rgba(16,185,129,0.13),inset_0_1px_0_rgba(255,255,255,0.065)] sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-300/30 bg-emerald-400/[0.13] text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.16)]">
                  <Icons.Check className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-black tracking-[-0.02em] text-white">Request received</div>
                  <p className="mt-2 text-sm font-medium leading-6 text-emerald-50/76 sm:text-base sm:leading-7">
                    Request received — we’ll review your store details and send platform access if it’s a fit.
                  </p>
                </div>
              </div>
              <Button type="button" className="mt-5 h-[52px] w-full px-7 text-sm text-slate-950 sm:w-auto" onClick={closeModal}>
                Close
              </Button>
            </div>
          ) : (
            <form className="mt-7 grid gap-5 sm:gap-6" noValidate onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                <RequestAccessField
                  field="fullName"
                  label="Full name"
                  value={form.fullName}
                  autoComplete="name"
                  placeholder="Aimen Sunabara"
                  onChange={updateField}
                />
                <RequestAccessField
                  field="email"
                  label="Email"
                  value={form.email}
                  type="email"
                  autoComplete="email"
                  placeholder="you@store.co.uk"
                  onChange={updateField}
                />
                <RequestAccessField
                  field="phoneNumber"
                  label="Phone number"
                  value={form.phoneNumber}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+44 7000 000000"
                  onChange={updateField}
                />
                <RequestAccessField
                  field="businessName"
                  label="Store / business name"
                  value={form.businessName}
                  autoComplete="organization"
                  placeholder="Store or group name"
                  onChange={updateField}
                />
                <RequestAccessField
                  field="storeCount"
                  label="Number of stores"
                  value={form.storeCount}
                  inputMode="numeric"
                  placeholder="1, 5, 20..."
                  onChange={updateField}
                />
                <RequestAccessField
                  field="location"
                  label="Location / city"
                  value={form.location}
                  autoComplete="address-level2"
                  placeholder="Manchester, London..."
                  onChange={updateField}
                />
              </div>

              <div className="min-w-0">
                <RequestAccessLabel required>Current issue</RequestAccessLabel>
                <div className="relative">
                  <select
                    id="request-access-currentIssue"
                    name="currentIssue"
                    value={form.currentIssue}
                    required
                    onChange={(event) => updateField("currentIssue", event.target.value)}
                    className={cn(
                      requestAccessInputClass,
                      "appearance-none pr-12",
                      form.currentIssue ? "text-white" : "text-slate-500",
                    )}
                  >
                    <option value="" className="bg-slate-950 text-slate-400">
                      Choose the closest issue
                    </option>
                    {requestAccessIssueOptions.map((issue) => (
                      <option key={issue} value={issue} className="bg-slate-950 text-white">
                        {issue}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.045] text-cyan-100/70">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <RequestAccessLabel>Message / notes</RequestAccessLabel>
                <textarea
                  id="request-access-message"
                  name="message"
                  value={form.message}
                  rows={4}
                  placeholder="Tell us what shelf gaps, locations, or store workflows you want to monitor."
                  onChange={(event) => updateField("message", event.target.value)}
                  className={cn(
                    requestAccessInputClass,
                    "min-h-[132px] resize-y leading-6 caret-cyan-200 selection:bg-cyan-300/25 selection:text-white",
                  )}
                />
              </div>

              {submitState === "error" && (
                <div className="rounded-2xl border border-red-400/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.13),rgba(2,8,19,0.78))] px-4 py-3.5 text-sm font-semibold leading-6 text-red-50 shadow-[0_0_34px_rgba(239,68,68,0.13),inset_0_1px_0_rgba(255,255,255,0.045)]">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-300 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
                    <span>{errorMessage || "Something went wrong. Please try again."}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:pt-0">
                <Button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="h-[54px] w-full px-7 [font-family:inherit] text-sm font-black text-slate-950 shadow-[0_20px_58px_rgba(34,211,238,0.32),inset_0_1px_0_rgba(255,255,255,0.46)] sm:w-auto sm:text-base"
                >
                  {submitState === "loading" ? "Sending request..." : "Request access"}
                  <Icons.ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <div className="text-xs font-medium leading-5 text-slate-300/50 sm:text-sm sm:leading-6">Your details are emailed securely through the ShelfLens server.</div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

const nav = ["Product", "How it works", "Operators", "Pilot"];

const proof = [
  {
    icon: Icons.Bars,
    title: "Real-time visibility",
    body: "Across stores and shelves",
  },
  {
    icon: Icons.ShieldCheck,
    title: "AI-powered insights",
    body: "Detect gaps before they spread",
  },
  {
    icon: Icons.Zap,
    title: "Action-driven",
    body: "Prioritise, fix, and measure impact",
  },
];

const workspaceFeatures = [
  ["Desktop inspection", "Debug, clean, and overlay views for precise shelf review."],
  ["Mobile execution", "Store teams can review severity, shelf status, and bay details on site."],
  ["Bay-level evidence", "Every issue stays linked to aisle, bay, shelf, count, and coverage."],
  ["Manager workflow", "Review centrally, then send teams to the shelves that matter first."],
];

const workspaceProof = [
  ["Web workspace", "Full inspection view"],
  ["Phone ready", "In-store issue review"],
  ["Evidence led", "Bay-level shelf context"],
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Capture the aisle",
    body: "Upload bay photos or walk the aisle with your phone. No specialist hardware, no complex setup.",
    rows: [
      ["Store 014 · Cereal Aisle", "Uploaded", "green"],
      ["Store 019 · Snack Bay 3", "Processing", "amber"],
      ["Store 022 · Drinks Aisle", "Queued", "blue"],
    ],
  },
  {
    step: "02",
    title: "ShelfLens analyses shelves",
    body: "Detect shelf coverage, gaps, OOS risk, and compliance drift from normal aisle photos.",
    rows: [
      ["Shelf 1", "91%", "green"],
      ["Shelf 2", "82%", "blue"],
      ["Shelf 3", "64%", "amber"],
      ["Shelf 4", "38%", "red"],
    ],
  },
  {
    step: "03",
    title: "Managers act on priority bays",
    body: "See which stores, aisles, and shelves need fixing first. Prioritised alerts, not a wall of data.",
    rows: [
      ["Store 014 · Shelf 4 OOS", "Urgent", "red"],
      ["Store 019 · Low facing", "Action", "amber"],
      ["Store 022 · Compliant", "Pass", "green"],
    ],
  },
];

const operatorFeatures = [
  ["Store-level compliance", "Scores per location"],
  ["Aisle & bay history", "Track trends over time"],
  ["Critical shelf alerts", "OOS and gap flags"],
  ["Team accountability", "Capture attribution"],
  ["Repeat capture tracking", "Know who scanned when"],
  ["Execution standards", "Measure against target"],
];

const storeRows = [
  ["Store 014", "Manchester · Cereal + Snacks", "62%", "red"],
  ["Store 019", "Birmingham · Dairy + Drinks", "74%", "amber"],
  ["Store 022", "Leeds · Full Aisle Scan", "91%", "green"],
  ["Store 008", "Liverpool · Chilled", "71%", "amber"],
  ["Store 031", "Sheffield · Homecare", "88%", "green"],
  ["Store 005", "Nottingham · Mixed Aisles", "58%", "red"],
];

const beforeItems = [
  "Manual shelf checks that take hours and still miss gaps",
  "Missed OOS until a customer complains or a rep visits",
  "Inconsistent WhatsApp photos with no structure or history",
  "No store-level compliance trend or benchmark data",
  "Problems found too late after shelf availability has already slipped",
];

const afterItems = [
  "AI shelf compliance score per bay in under 2 minutes",
  "OOS and gap flags when photos are uploaded",
  "Bay-by-bay visibility with full capture history",
  "Compliance trends per store, aisle, and shelf over time",
  "Prioritised fixes showing exactly where to send the team first",
];

type StatusTone = "green" | "amber" | "red" | "blue" | "cyan";

const productQueueRows = [
  ["Aisle 3 / Bay 1", "Cereal", "Critical", "56%", "4 gaps", "red"],
  ["Aisle 1 / Bay 12", "Soft drinks", "Critical", "61%", "3 gaps", "red"],
  ["Aisle 5 / Bay 4", "Snacks", "Moderate", "72%", "2 gaps", "amber"],
  ["Aisle 2 / Bay 8", "Homecare", "OK", "91%", "0 gaps", "green"],
] as const;

const managerQueueRows = [
  ["Aisle 3 / Bay 1", "Critical", "56%", "Refill first", "red"],
  ["Aisle 1 / Bay 12", "Critical", "61%", "Check gaps", "red"],
  ["Aisle 4 / Bay 6", "Moderate", "70%", "Face up", "amber"],
  ["Aisle 2 / Bay 3", "Moderate", "74%", "Monitor", "amber"],
] as const;

const aisleRiskRows = [
  ["Aisle 1", "Top risk", "70%", "12 bays below target", "red"],
  ["Aisle 3", "Active risk", "64%", "Bay 1 critical", "red"],
  ["Aisle 5", "Watch", "79%", "4 moderate bays", "amber"],
  ["Aisle 2", "Stable", "92%", "No critical shelves", "green"],
] as const;

const processingJobs = [
  ["Store 014", "Aisle 1 / Bay 12", "Analysis complete", "100%", "green"],
  ["Store 014", "Aisle 3 / Bay 1", "Processing", "68%", "blue"],
  ["Store 021", "Aisle 5 / Bay 4", "Queued", "14%", "amber"],
  ["Store 008", "Aisle 2 / Bay 8", "Capture submitted", "8%", "cyan"],
] as const;

type LifecycleTone = "cyan" | "amber" | "red" | "green";

type LifecycleMetric = {
  label: "Coverage" | "Signal" | "Gaps" | "Status";
  value: string;
  level: number;
};

type LifecycleStep = {
  time: string;
  title: string;
  detail: string;
  state: string;
  tone: LifecycleTone;
  metrics: LifecycleMetric[];
  recovered?: boolean;
};

type PampersShelfTone = "green" | "amber" | "red";

type PampersShelfRow = {
  shelf: string;
  status: string;
  coverage: number;
  gaps: string;
  tone: PampersShelfTone;
};

const lifecycleProgressStages: Array<{
  number: string;
  label: string;
  detail: string;
  tone: LifecycleTone;
}> = [
  { number: "1", label: "Capture", detail: "Issue detected", tone: "cyan" },
  { number: "2", label: "Processing", detail: "Scan reviewed", tone: "amber" },
  { number: "3", label: "Escalation", detail: "Critical priority", tone: "red" },
  { number: "4", label: "Resolution", detail: "Recovered / closed", tone: "green" },
];

const lifecycleSteps: LifecycleStep[] = [
  {
    time: "14:32",
    title: "Capture uploaded",
    detail: "Store 014 - Aisle 3 / Bay 1",
    state: "Capture live",
    tone: "cyan",
    metrics: [
      { label: "Coverage", value: "56%", level: 56 },
      { label: "Signal", value: "6 photos", level: 68 },
      { label: "Gaps", value: "Pending", level: 28 },
      { label: "Status", value: "Upload", level: 45 },
    ],
  },
  {
    time: "14:33",
    title: "ShelfLens detects 4 gaps",
    detail: "Processing complete",
    state: "OOS risk high",
    tone: "amber",
    metrics: [
      { label: "Coverage", value: "56%", level: 56 },
      { label: "Signal", value: "AI match", level: 82 },
      { label: "Gaps", value: "4 gaps", level: 74 },
      { label: "Status", value: "At risk", level: 66 },
    ],
  },
  {
    time: "14:34",
    title: "Bay becomes critical",
    detail: "Priority queue escalated",
    state: "Critical",
    tone: "red",
    metrics: [
      { label: "Coverage", value: "56%", level: 56 },
      { label: "Signal", value: "P1", level: 90 },
      { label: "Gaps", value: "4 gaps", level: 80 },
      { label: "Status", value: "Crit.", level: 88 },
    ],
  },
  {
    time: "14:46",
    title: "Staff refills shelf / recovery verified",
    detail: "Refill confirmed and bay recovered.",
    state: "Recovered",
    tone: "green",
    recovered: true,
    metrics: [
      { label: "Coverage", value: "78%", level: 78 },
      { label: "Signal", value: "Verified", level: 92 },
      { label: "Gaps", value: "0 gaps", level: 100 },
      { label: "Status", value: "Done", level: 100 },
    ],
  },
];

const lifecycleSummaryStats: Array<{
  label: string;
  value: string;
  tone: LifecycleTone;
  path: string;
}> = [
  { label: "Start", value: "56%", tone: "red", path: "M2 24 C12 24 16 21 24 22 C34 24 39 17 48 19 C57 20 60 15 68 17 C78 20 82 13 92 15 C104 17 109 8 118 7" },
  { label: "Delta", value: "+22%", tone: "cyan", path: "M2 26 C12 25 18 23 26 24 C34 25 38 18 46 20 C56 22 62 18 70 19 C79 20 82 13 91 15 C101 18 107 8 118 6" },
  { label: "Now", value: "78%", tone: "green", path: "M2 25 C11 24 16 21 25 22 C34 24 40 18 49 19 C60 21 66 14 75 16 C85 18 89 9 98 11 C108 13 112 7 118 5" },
];

const lifecycleEvents: Array<{
  title: string;
  time: string;
  tone: LifecycleTone;
  complete?: boolean;
}> = [
  { title: "Capture uploaded", time: "14:32", tone: "cyan" },
  { title: "ShelfLens detects 4 gaps", time: "14:33", tone: "amber" },
  { title: "Bay becomes critical", time: "14:34", tone: "red" },
  { title: "Staff refills shelf / recovery verified", time: "14:46", tone: "green", complete: true },
];

const pampersShelfRows: PampersShelfRow[] = [
  { shelf: "S1", status: "Good coverage", coverage: 88, gaps: "0 gaps", tone: "green" },
  { shelf: "S2", status: "Good coverage", coverage: 84, gaps: "0 gaps", tone: "green" },
  { shelf: "S3", status: "Good coverage", coverage: 82, gaps: "0 gaps", tone: "green" },
  { shelf: "S4", status: "OOS critical", coverage: 45, gaps: "1 gap", tone: "red" },
  { shelf: "S5", status: "OOS critical", coverage: 48, gaps: "1 gap", tone: "red" },
  { shelf: "S6", status: "Good coverage", coverage: 80, gaps: "0 gaps", tone: "green" },
  { shelf: "S7", status: "OOS moderate", coverage: 68, gaps: "1 small", tone: "amber" },
  { shelf: "S8", status: "OOS critical", coverage: 32, gaps: "1 large", tone: "red" },
];

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: shelfEase },
  },
};

type HudKey = "shelf-2" | "gap-left" | "gap-right";

type SectionShellProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

function SectionShell({ id, children, className, narrow = false }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10 lg:pb-16 xl:px-12",
        narrow ? "max-w-[1180px]" : "max-w-[1480px]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_17%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_28%_68%,rgba(99,102,241,0.17),transparent_32%),linear-gradient(180deg,#060d1a_0%,#050b15_48%,#020713_100%)]" />

      <motion.div
        aria-hidden
        className="absolute -right-56 -top-52 h-[45rem] w-[45rem] rounded-full bg-cyan-400/12 blur-3xl"
        animate={{ x: [0, -34, 18, 0], y: [0, 24, -14, 0], scale: [1, 1.08, 0.97, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute left-[20%] top-[48%] h-[34rem] w-[34rem] rounded-full bg-indigo-500/14 blur-3xl"
        animate={{ x: [0, 44, -24, 0], y: [0, -28, 18, 0], scale: [1, 0.94, 1.08, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:76px_76px] opacity-55 [mask-image:radial-gradient(circle_at_center,black,transparent_73%)]" />

      <motion.div
        aria-hidden
        className="absolute bottom-[-11rem] left-[-12rem] h-[38rem] w-[94rem] rotate-[-5deg] rounded-[100%] border border-cyan-300/10 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.14),transparent_66%)]"
        animate={{ rotate: [-5, -3.2, -6.4, -5], y: [0, -10, 6, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute bottom-[-1rem] left-0 right-0 h-[25rem] opacity-70 [background-image:radial-gradient(circle,rgba(34,211,238,0.42)_1px,transparent_1.35px)] [background-size:19px_19px] [mask-image:linear-gradient(to_top,black_8%,transparent_88%)]"
        animate={{
          backgroundPosition: ["0px 0px", "38px -19px", "76px 0px"],
          y: [0, -7, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute bottom-[5rem] left-[-7rem] hidden h-[15rem] w-[88rem] opacity-35 sm:block"
        animate={{ x: [0, 30, 0], y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 1200 220" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M0 150 C120 78 250 220 390 126 C540 25 650 198 790 112 C930 28 1030 142 1200 70"
            stroke="rgba(34,211,238,0.34)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 182 C165 92 260 204 430 148 C600 92 706 184 860 128 C1010 74 1080 136 1200 100"
            stroke="rgba(99,102,241,0.34)"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.42)_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,white_0.7px,transparent_0.8px)] [background-size:4px_4px]" />
    </div>
  );
}

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative grid place-items-center rounded-[18px] border border-cyan-300/45 bg-cyan-300/[0.06] shadow-[0_0_30px_rgba(34,211,238,0.16)]",
          compact ? "h-10 w-10" : "h-11 w-11 sm:h-12 sm:w-12",
        )}
      >
        <div className="absolute inset-1 rounded-[14px] border border-cyan-300/10" />
        <Icons.Store className="h-5 w-5 text-cyan-300" />
      </div>
      <div>
        <div className="text-sm font-black uppercase leading-none tracking-[0.11em] text-white sm:text-base">ShelfLens</div>
        <div className="mt-1 hidden text-sm text-white/68 min-[420px]:block">Retail Shelf Intelligence</div>
      </div>
    </div>
  );
}

function LiveEyebrow() {
  return (
    <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/24 bg-blue-400/[0.055] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200 shadow-[0_0_34px_rgba(59,130,246,0.12)] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
        <Icons.Sparkles className="h-3.5 w-3.5" />
        AI shelf intelligence
      </div>

      <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-300/24 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200 shadow-[0_0_28px_rgba(16,185,129,0.13)] sm:px-3.5 sm:py-2 sm:text-[11px] sm:tracking-[0.18em]">
        <motion.span
          className="absolute inset-y-0 left-[-45%] w-[42%] bg-emerald-200/20 blur-md"
          animate={{ x: ["0%", "360%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <motion.span
            className="absolute h-2.5 w-2.5 rounded-full bg-emerald-300"
            animate={{ scale: [1, 2.4, 1], opacity: [0.85, 0, 0.85] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <span className="relative h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
        </span>
        Live scan
      </div>
    </motion.div>
  );
}

function TopMetric({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: string;
  tone?: "blue" | "green" | "red";
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1 rounded-xl border border-white/10 bg-[#07111f]/84 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-2.5">
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
          tone === "green" && "border-emerald-400/45 bg-emerald-400/10 text-emerald-300",
          tone === "red" && "border-red-500/45 bg-red-500/10 text-red-400",
          tone === "blue" && "border-cyan-300/45 bg-cyan-300/10 text-cyan-300",
        )}
      >
        {tone === "green" ? (
          <Icons.ShieldCheck className="h-3.5 w-3.5" />
        ) : tone === "red" ? (
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
        ) : (
          <Icons.Activity className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[9px] uppercase tracking-[0.12em] text-white/45 sm:text-[11px]">{label}</span>
        <span className="block text-xs font-semibold leading-tight text-white sm:text-base">{value}</span>
      </span>
    </div>
  );
}

function OverviewCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[#07111f]/74 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      <div className="text-[13px] font-medium text-white/82">{title}</div>
      {children}
    </div>
  );
}

type HudDetails = {
  tone: "green" | "red";
  title: string;
  metric: string;
  body: string;
  rows: Array<[string, string]>;
};

const HUD_DETAILS: Record<HudKey, HudDetails> = {
  "shelf-2": {
    tone: "green",
    title: "Compliant shelf",
    metric: "82% Coverage",
    body: "Shelf 2 is aligned with expected facing coverage. No urgent refill action required.",
    rows: [
      ["Shelf", "02"],
      ["Status", "Pass"],
      ["Risk", "Low"],
      ["Action", "Monitor"],
    ],
  },
  "gap-left": {
    tone: "red",
    title: "OOS gap",
    metric: "High severity",
    body: "Detected empty shelf space in Shelf 4. Prioritise restock or facing correction.",
    rows: [
      ["Shelf", "04"],
      ["Gap", "Left"],
      ["Width", "14.7%"],
      ["Action", "Restock"],
    ],
  },
  "gap-right": {
    tone: "red",
    title: "OOS gap",
    metric: "High severity",
    body: "Second gap detected on the same shelf. This indicates a wider execution issue.",
    rows: [
      ["Shelf", "04"],
      ["Gap", "Right"],
      ["Width", "14.2%"],
      ["Action", "Verify"],
    ],
  },
};

function HudTooltipCard({ tone, title, metric, body, rows }: HudDetails) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-[#03101c]/96 p-3 shadow-2xl backdrop-blur-xl",
        tone === "green" && "border-emerald-300/55 shadow-[0_0_34px_rgba(16,185,129,0.24)]",
        tone === "red" && "border-red-400/60 shadow-[0_0_34px_rgba(239,68,68,0.24)]",
      )}
    >
      <div
        className={cn(
          "mb-2 h-px w-full",
          tone === "green" && "bg-[linear-gradient(90deg,transparent,rgba(52,211,153,0.9),transparent)]",
          tone === "red" && "bg-[linear-gradient(90deg,transparent,rgba(248,113,113,0.95),transparent)]",
        )}
      />

      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em]",
            tone === "green" ? "text-emerald-300" : "text-red-300",
          )}
        >
          {title}
        </div>
        <span
          className={cn(
            "h-2 w-2 rounded-full shadow-[0_0_16px_currentColor]",
            tone === "green" ? "bg-emerald-300 text-emerald-300" : "bg-red-400 text-red-400",
          )}
        />
      </div>

      <div className="mt-2 text-lg font-black tracking-[-0.04em] text-white sm:text-xl">{metric}</div>
      <div className="mt-1 text-[11px] leading-4 text-white/64 sm:text-xs sm:leading-5">{body}</div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-3 sm:gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.045] px-2 py-1.5 sm:px-2.5 sm:py-2">
            <div className="text-[8px] uppercase tracking-[0.14em] text-white/38 sm:text-[9px]">{label}</div>
            <div className="mt-1 text-[11px] font-bold text-white sm:text-xs">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70 sm:mt-3 sm:text-[10px]">
        <span className="h-px flex-1 bg-cyan-200/20" />
        ShelfLens HUD
        <span className="h-px flex-1 bg-cyan-200/20" />
      </div>
    </div>
  );
}

function FloatingHudPortal({ activeHud, anchorEl }: { activeHud: HudKey | null; anchorEl: HTMLElement | null }) {
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState<{ left: number; top: number; width: number } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !activeHud || !anchorEl) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isPhone = viewportWidth < 640;
      const width = Math.min(viewportWidth - 24, isPhone ? 286 : 304);
      const estimatedHeight = isPhone ? 224 : 248;

      let left = rect.left + rect.width / 2 - width / 2;
      left = Math.max(12, Math.min(left, viewportWidth - width - 12));

      let top = isPhone ? rect.bottom + 10 : rect.top + rect.height / 2 - estimatedHeight / 2;

      if (top + estimatedHeight > viewportHeight - 12) {
        top = rect.top - estimatedHeight - 10;
      }

      if (top < 12) {
        top = 12;
      }

      setPosition({ left, top, width });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [activeHud, anchorEl, mounted]);

  if (!mounted || !activeHud || !position) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999] animate-in fade-in-0 zoom-in-95 duration-200"
      style={{ left: position.left, top: position.top, width: position.width }}
    >
      <HudTooltipCard {...HUD_DETAILS[activeHud]} />
    </div>,
    document.body,
  );
}

function HudCorners({ tone, active = false }: { tone: "green" | "red"; active?: boolean }) {
  return (
    <>
      <span
        className={cn(
          "absolute left-[-6px] top-[-6px] h-5 w-5 border-l-2 border-t-2 opacity-0 transition-opacity duration-300",
          active && "opacity-100",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute right-[-6px] top-[-6px] h-5 w-5 border-r-2 border-t-2 opacity-0 transition-opacity duration-300",
          active && "opacity-100",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute bottom-[-6px] left-[-6px] h-5 w-5 border-b-2 border-l-2 opacity-0 transition-opacity duration-300",
          active && "opacity-100",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute bottom-[-6px] right-[-6px] h-5 w-5 border-b-2 border-r-2 opacity-0 transition-opacity duration-300",
          active && "opacity-100",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
    </>
  );
}

function ShelfAnalysisMockup() {
  const [activeHud, setActiveHud] = React.useState<HudKey | null>(null);
  const shelf2Ref = React.useRef<HTMLDivElement | null>(null);
  const gapLeftRef = React.useRef<HTMLDivElement | null>(null);
  const gapRightRef = React.useRef<HTMLDivElement | null>(null);

  const toggleHud = (key: HudKey) => {
    setActiveHud((current) => (current === key ? null : key));
  };

  const showHud = (key: HudKey) => {
    setActiveHud(key);
  };

  const hideHud = (key: HudKey) => {
    setActiveHud((current) => (current === key ? null : current));
  };

  const handleHudKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, key: HudKey) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleHud(key);
    }

    if (event.key === "Escape") {
      setActiveHud(null);
    }
  };

  const activeAnchor =
    activeHud === "shelf-2"
      ? shelf2Ref.current
      : activeHud === "gap-left"
        ? gapLeftRef.current
        : activeHud === "gap-right"
          ? gapRightRef.current
          : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: shelfEase, delay: 0.08 }}
      className="relative mx-auto w-full max-w-[430px] sm:max-w-[760px] lg:max-w-[900px] xl:max-w-[940px]"
    >
      <div
        aria-hidden
        className="absolute -inset-7 rounded-[42px] bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_72%_62%,rgba(124,92,255,0.13),transparent_38%)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/18 bg-[#050d18]/92 p-3 shadow-[0_34px_120px_rgba(0,0,0,0.46),0_0_80px_rgba(34,211,238,0.08)] backdrop-blur-2xl sm:p-4 lg:p-5">
        <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_90%_12%,rgba(124,92,255,0.14),transparent_30%)]" />
        <div className="absolute inset-x-[-35%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.75),rgba(124,92,255,0.6),transparent)]" />

        <div className="relative grid min-w-0 gap-4 min-[820px]:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-w-0">
            <div className="mb-3 grid min-w-0 gap-3 sm:mb-4 sm:gap-4">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-cyan-300/32 bg-cyan-300/8 text-cyan-300 sm:h-10 sm:w-10">
                    <Icons.Store className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white sm:text-lg">Store 014 • Cereal Aisle</div>
                    <div className="mt-0.5 text-[11px] text-white/48 sm:text-xs">Captured 2m ago</div>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-emerald-300/18 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-200 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                  Processing live
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-3 gap-2">
                <TopMetric label="Compliance" value="82%" tone="green" />
                <TopMetric label="OOS risk" value="2 zones" tone="red" />
                <TopMetric label="Severity" value="High" tone="red" />
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-[20px] border border-white/12 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              onClick={() => setActiveHud(null)}
            >
              <img
                src="/shelflens-cereal-aisle.png"
                alt="ShelfLens cereal aisle analysis showing shelf compliance and out of stock gaps"
                className="block aspect-[1.18] w-full object-cover object-[center_42%] sm:aspect-[1.08] min-[820px]:aspect-[0.92]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,13,24,0.02),rgba(5,13,24,0.22))]" />

              <div className="pointer-events-none absolute left-3 top-3 rounded-2xl border border-cyan-300/20 bg-[#06101b]/88 px-3 py-2 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:left-4 sm:top-4">
                <div className="text-[10px] font-black uppercase text-cyan-200">Tracking - Shelf 04</div>
                <div className="mt-1 text-xs font-bold text-white">Gap markers / coverage overlay</div>
              </div>

              <div
                data-overlay="shelf-2-compliant-full-width"
                ref={shelf2Ref}
                role="button"
                tabIndex={0}
                aria-label="View compliant shelf details"
                className="group/shelf absolute cursor-pointer touch-manipulation rounded-xl border-2 border-emerald-400/95 bg-emerald-400/[0.045] shadow-[0_0_0_1px_rgba(16,185,129,0.28),0_0_24px_rgba(16,185,129,0.38)] outline-none transition-all duration-300 hover:bg-emerald-400/[0.075] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.5),0_0_42px_rgba(16,185,129,0.58)] focus-visible:ring-2 focus-visible:ring-emerald-300/80"
                style={{ left: "8.2%", right: "4.2%", top: "21.2%", height: "25.5%" }}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleHud("shelf-2");
                }}
                onMouseEnter={() => showHud("shelf-2")}
                onMouseLeave={() => hideHud("shelf-2")}
                onFocus={() => showHud("shelf-2")}
                onBlur={() => hideHud("shelf-2")}
                onKeyDown={(event) => handleHudKeyDown(event, "shelf-2")}
              >
                <HudCorners tone="green" active={activeHud === "shelf-2"} />
                <div
                  className={cn(
                    "absolute left-0 top-1/2 h-px w-full origin-left scale-x-0 bg-emerald-300/80 shadow-[0_0_14px_rgba(52,211,153,0.8)] transition-transform duration-500 group-hover/shelf:scale-x-100",
                    activeHud === "shelf-2" && "scale-x-100",
                  )}
                />
              </div>

              <div className="absolute left-[6%] right-[8%] top-[29.6%] h-px bg-emerald-300/45" />
              <div className="absolute left-[6%] right-[8%] top-[45.0%] h-px bg-emerald-300/36" />

              <div
                data-overlay="shelf-4-oos-gap-left"
                ref={gapLeftRef}
                role="button"
                tabIndex={0}
                aria-label="View left out of stock gap details"
                className="group/gap absolute cursor-pointer touch-manipulation rounded-lg border-2 border-red-500 bg-red-500/[0.05] shadow-[0_0_22px_rgba(239,68,68,0.34)] outline-none transition-all duration-300 hover:bg-red-500/[0.08] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.42),0_0_42px_rgba(239,68,68,0.55)] focus-visible:ring-2 focus-visible:ring-red-300/80"
                style={{ left: "20.1%", top: "72.4%", width: "14.7%", height: "17.6%" }}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleHud("gap-left");
                }}
                onMouseEnter={() => showHud("gap-left")}
                onMouseLeave={() => hideHud("gap-left")}
                onFocus={() => showHud("gap-left")}
                onBlur={() => hideHud("gap-left")}
                onKeyDown={(event) => handleHudKeyDown(event, "gap-left")}
              >
                <HudCorners tone="red" active={activeHud === "gap-left"} />
                <div
                  className={cn(
                    "absolute left-0 top-1/2 h-px w-[260%] origin-left scale-x-0 bg-red-400/90 shadow-[0_0_14px_rgba(248,113,113,0.9)] transition-transform duration-500 group-hover/gap:scale-x-100",
                    activeHud === "gap-left" && "scale-x-100",
                  )}
                />
              </div>

              <div
                data-overlay="shelf-4-oos-gap-right"
                ref={gapRightRef}
                role="button"
                tabIndex={0}
                aria-label="View right out of stock gap details"
                className="group/gap absolute cursor-pointer touch-manipulation rounded-lg border-2 border-red-500 bg-red-500/[0.05] shadow-[0_0_22px_rgba(239,68,68,0.34)] outline-none transition-all duration-300 hover:bg-red-500/[0.08] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.42),0_0_42px_rgba(239,68,68,0.55)] focus-visible:ring-2 focus-visible:ring-red-300/80"
                style={{ left: "46.6%", top: "72.4%", width: "14.2%", height: "17.6%" }}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleHud("gap-right");
                }}
                onMouseEnter={() => showHud("gap-right")}
                onMouseLeave={() => hideHud("gap-right")}
                onFocus={() => showHud("gap-right")}
                onBlur={() => hideHud("gap-right")}
                onKeyDown={(event) => handleHudKeyDown(event, "gap-right")}
              >
                <HudCorners tone="red" active={activeHud === "gap-right"} />
                <div
                  className={cn(
                    "absolute right-0 top-1/2 h-px w-[220%] origin-right scale-x-0 bg-red-400/90 shadow-[0_0_14px_rgba(248,113,113,0.9)] transition-transform duration-500 group-hover/gap:scale-x-100",
                    activeHud === "gap-right" && "scale-x-100",
                  )}
                />
              </div>

              <div className="pointer-events-none absolute left-[34%] top-[68%] hidden w-[188px] rounded-2xl border border-red-400/34 bg-[#10080b]/90 p-3 shadow-[0_0_34px_rgba(239,68,68,0.22)] backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2 text-xs font-bold text-red-200">
                  <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.9)]" />
                  Gap marker
                </div>
                <div className="mt-1 text-sm font-black text-white">Shelf 04 / 56%</div>
                <div className="mt-1 text-xs leading-5 text-white/54">Two gap zones are driving OOS risk.</div>
              </div>

              <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 sm:hidden">
                <div className="rounded-full border border-emerald-300/24 bg-[#06101b]/82 px-2.5 py-1 text-[10px] font-bold text-emerald-200 backdrop-blur-md">
                  Tap shelves
                </div>
                <div className="rounded-full border border-red-400/24 bg-[#10080b]/82 px-2.5 py-1 text-[10px] font-bold text-red-200 backdrop-blur-md">
                  OOS gaps
                </div>
              </div>
            </div>

            <div className="mt-3 hidden grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-[#07111f]/78 p-3 text-xs text-white/70 sm:flex sm:flex-wrap sm:items-center sm:gap-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-500" />
                OOS
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-500" />
                Moderate coverage
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-yellow-400" />
                Low Facing
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-500" />
                Compliant
              </div>
            </div>
          </div>

          <aside className="hidden min-w-0 rounded-[22px] border border-white/10 bg-[#07111f]/76 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] min-[820px]:mt-[72px] min-[820px]:block">
            <div className="text-lg font-semibold tracking-[-0.02em] text-white">Shelf Overview</div>
            <div className="mt-1 text-xs text-white/48">Key issues at a glance</div>

            <div className="mt-4 grid gap-3 min-[640px]:grid-cols-2 min-[820px]:block min-[820px]:space-y-3">
              <OverviewCard title="Compliance" className="bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(7,17,31,0.78))]">
                <div className="mt-2 text-2xl font-semibold text-white">82%</div>
                <div className="mt-1 text-xs text-red-400">↓ 8% vs last 7 days</div>
                <svg className="mt-3 h-10 w-full" viewBox="0 0 190 42" fill="none" preserveAspectRatio="none">
                  <motion.path
                    d="M2 30 C18 20, 28 36, 42 28 S68 20, 82 26 S104 34, 116 24 S142 21, 154 27 S176 24, 188 8"
                    stroke="rgba(34,197,94,0.95)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0.2 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                  />
                </svg>
              </OverviewCard>

              <OverviewCard title="OOS Risk Zones">
                <div className="mt-2 text-2xl font-semibold text-white">2</div>
                <div className="mt-1 text-xs font-medium text-red-400">High severity</div>
              </OverviewCard>

              <OverviewCard title="Shelf Severity">
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                  <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]" />
                  High
                </div>
                <div className="mt-1 text-xs text-white/54">Needs attention</div>
              </OverviewCard>

              <OverviewCard title="OOS / Gap Summary">
                <div className="mt-1 text-xs text-white/48">Bay-level gap evidence</div>
                <div className="mt-2 text-2xl font-semibold text-white">2</div>
                <div className="mt-1 text-xs text-white/54">Total gaps</div>
                <div className="mt-3 grid h-20 grid-cols-7 grid-rows-3 gap-px rounded-lg border border-white/10 bg-white/10 p-px">
                  {Array.from({ length: 21 }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-[#07111f]/90",
                        (index === 15 || index === 16 || index === 20) && "border border-dashed border-red-500 bg-red-500/12",
                      )}
                    />
                  ))}
                </div>
              </OverviewCard>
            </div>

            <Button className="mt-4 h-12 w-full justify-between px-5 text-slate-950">
              View full report
              <Icons.ArrowRight className="h-4 w-4" />
            </Button>
          </aside>
        </div>
      </div>

      <FloatingHudPortal activeHud={activeHud} anchorEl={activeAnchor} />
    </motion.div>
  );
}

function ProofCard({
  card,
}: {
  card: {
    icon: ({ className }: { className?: string }) => React.ReactNode;
    title: string;
    body: string;
  };
}) {
  const CardIcon = card.icon;

  return (
    <motion.div
      variants={fadeUp}
      className="group flex min-w-0 items-start gap-3 rounded-2xl border border-white/0 p-1.5 transition duration-300 hover:border-white/10 hover:bg-white/[0.035] sm:gap-4 sm:p-2"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cyan-300/22 bg-[#07111f]/78 text-cyan-300 shadow-[0_0_34px_rgba(34,211,238,0.14)] transition duration-300 group-hover:border-cyan-200/36 group-hover:bg-cyan-300/[0.09] sm:h-[52px] sm:w-[52px]">
        <CardIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 pt-1">
        <div className="text-sm font-semibold leading-5 text-white">{card.title}</div>
        <div className="mt-1 text-xs leading-5 text-white/55">{card.body}</div>
      </div>
    </motion.div>
  );
}

function SectionEyebrow({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/[0.055] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/82 sm:px-3.5 sm:py-2 sm:text-[11px] sm:tracking-[0.22em]">
      {icon}
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  icon,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  icon?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-[760px]", align === "center" && "mx-auto text-center")}>
      <SectionEyebrow icon={icon}>{eyebrow}</SectionEyebrow>
      <h2 className="mt-4 text-2xl font-black tracking-[-0.055em] text-white sm:mt-5 sm:text-4xl lg:text-5xl">{title}</h2>
      {body && <p className="mt-3 text-sm leading-7 text-white/54 sm:mt-4 sm:text-base sm:leading-8">{body}</p>}
    </div>
  );
}

function MiniStatusPill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em]",
        tone === "green" && "border-emerald-300/24 bg-emerald-400/[0.10] text-emerald-200",
        tone === "amber" && "border-yellow-300/24 bg-yellow-400/[0.10] text-yellow-200",
        tone === "red" && "border-red-400/28 bg-red-500/[0.12] text-red-200",
        tone === "blue" && "border-blue-300/24 bg-blue-400/[0.10] text-blue-200",
      )}
    >
      {children}
    </span>
  );
}

function ToneDot({ tone }: { tone: StatusTone | string }) {
  return (
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        tone === "green" && "bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.75)]",
        tone === "amber" && "bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.45)]",
        tone === "red" && "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.75)]",
        tone === "blue" && "bg-blue-300 shadow-[0_0_12px_rgba(147,197,253,0.5)]",
        tone === "cyan" && "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.65)]",
      )}
    />
  );
}

function ProgressBar({ value, tone = "cyan" }: { value: number; tone?: StatusTone }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: shelfEase }}
        className={cn(
          "h-full rounded-full",
          tone === "green" && "bg-[linear-gradient(90deg,#10b981,#6ee7b7)]",
          tone === "amber" && "bg-[linear-gradient(90deg,#f59e0b,#fde047)]",
          tone === "red" && "bg-[linear-gradient(90deg,#ef4444,#fb7185)]",
          tone === "blue" && "bg-[linear-gradient(90deg,#3b82f6,#22d3ee)]",
          tone === "cyan" && "bg-[linear-gradient(90deg,#06b6d4,#67e8f9)]",
        )}
      />
    </div>
  );
}

function AppMetric({
  label,
  value,
  detail,
  tone = "cyan",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: StatusTone;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111f]/72 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium text-white/46">{label}</div>
        <ToneDot tone={tone} />
      </div>
      <div className="mt-2 text-xl font-black text-white sm:text-2xl">{value}</div>
      {detail && <div className="mt-1 text-xs leading-5 text-white/42">{detail}</div>}
    </div>
  );
}

function SurfaceCard({
  title,
  eyebrow,
  body,
  children,
  className,
}: {
  title: string;
  eyebrow: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.68, ease: shelfEase }}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#07111f]/76 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:rounded-[28px] sm:p-5",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.65),transparent)]" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase text-cyan-200/80">{eyebrow}</div>
            <h3 className="mt-2 text-lg font-black text-white sm:text-xl">{title}</h3>
          </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-bold text-emerald-200">
            Live UI
          </div>
        </div>
        <p className="mt-2 text-sm leading-6 text-white/52">{body}</p>
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
}

function PampersShelfStatusRow({ row }: { row: PampersShelfRow }) {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)_44px_52px] items-center gap-2 text-xs sm:grid-cols-[30px_minmax(0,1fr)_48px_56px]">
      <div className="font-bold text-white/58">{row.shelf}</div>
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <ToneDot tone={row.tone} />
          <span className="truncate text-white/58">{row.status}</span>
        </div>
        <ProgressBar value={row.coverage} tone={row.tone} />
      </div>
      <div className="text-right font-bold text-white">{row.coverage}%</div>
      <div className="text-right text-[11px] font-semibold text-white/52">{row.gaps}</div>
    </div>
  );
}

function InspectOverlayProductCard() {
  return (
    <SurfaceCard
      eyebrow="Inspect overlay"
      title="Bay scan coverage with eight shelf bands"
      body="A realistic inspection surface for shelf coverage, missing gaps, and bay-level severity."
      className="lg:col-span-2"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.78fr)]">
        <div className="rounded-[22px] border border-white/10 bg-black/40 p-2 sm:p-3">
          <div className="relative mx-auto aspect-[738/859] w-full max-w-[680px] overflow-hidden rounded-[18px] bg-black">
            <img
              src="/shelflens-pampers.png"
              alt="ShelfLens bay scan showing eight baby care shelf bands with visible coverage gaps"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="grid content-start gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#020813]/82 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Bay scan detail</div>
                <div className="mt-1 text-xs text-white/42">Baby care bay / 8 shelf bands</div>
              </div>
              <MiniStatusPill tone="amber">At risk</MiniStatusPill>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <AppMetric label="Coverage" value="66%" tone="amber" />
              <AppMetric label="Shelves" value="8" tone="cyan" />
              <AppMetric label="OOS zones" value="4" tone="red" />
            </div>
            <div className="mt-4 space-y-3">
              {pampersShelfRows.map((row) => (
                <PampersShelfStatusRow key={row.shelf} row={row} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/12 bg-cyan-300/[0.045] p-4">
            <div className="text-sm font-bold text-white">Gap summary</div>
            <div className="mt-3 grid gap-2 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-[#07111f]/72 px-3 py-2">
                <span className="text-white/52">Visible OOS zones</span>
                <span className="font-bold text-red-200">4</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#07111f]/72 px-3 py-2">
                <span className="text-white/52">Lowest coverage</span>
                <span className="font-bold text-red-200">Shelf 8</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#07111f]/72 px-3 py-2">
                <span className="text-white/52">Evidence</span>
                <span className="font-bold text-cyan-200">Bay scan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

function ComplianceDashboardProductCard() {
  return (
    <SurfaceCard
      eyebrow="Dashboard overview"
      title="Compliance, severity mix, and trend in one view"
      body="A manager can read store health without opening every inspection."
    >
      <div className="rounded-[22px] border border-white/10 bg-[#020813]/86 p-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <div className="text-xs text-white/42">Store compliance</div>
            <div className="mt-2 text-4xl font-black text-white">86%</div>
            <div className="mt-2">
              <ProgressBar value={86} tone="green" />
            </div>
          </div>
          <AppMetric label="Critical" value="35" detail="needs action" tone="red" />
          <AppMetric label="Moderate" value="29" detail="watch list" tone="amber" />
          <AppMetric label="OK" value="148" detail="within target" tone="green" />
        </div>

        <div className="mt-5 rounded-2xl border border-white/8 bg-[#07111f]/68 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold text-white">Compliance trend</div>
            <div className="text-xs text-white/42">Last 7 scans</div>
          </div>
          <svg viewBox="0 0 420 118" className="h-28 w-full" fill="none" preserveAspectRatio="none">
            <path d="M0 92H420" stroke="rgba(255,255,255,0.08)" />
            <path d="M0 58H420" stroke="rgba(255,255,255,0.08)" />
            <path d="M0 24H420" stroke="rgba(255,255,255,0.08)" />
            <motion.path
              d="M6 76 C42 66, 68 82, 98 64 S152 35, 190 48 S248 77, 282 52 S340 26, 414 34"
              stroke="rgba(34,211,238,0.95)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <path
              d="M6 76 C42 66, 68 82, 98 64 S152 35, 190 48 S248 77, 282 52 S340 26, 414 34 L414 118 L6 118 Z"
              fill="url(#dashboardTrend)"
            />
            <defs>
              <linearGradient id="dashboardTrend" x1="0" x2="0" y1="0" y2="1">
                <stop stopColor="rgba(34,211,238,0.22)" />
                <stop offset="1" stopColor="rgba(34,211,238,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </SurfaceCard>
  );
}

function CriticalQueueProductCard() {
  return (
    <SurfaceCard
      eyebrow="Critical shelves queue"
      title="Priority bays sorted by severity"
      body="Action rows show where to send staff first, with coverage and bay context."
    >
      <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#020813]/86">
        <div className="grid grid-cols-[minmax(0,1.2fr)_88px_70px] gap-3 border-b border-white/8 px-4 py-3 text-xs font-bold text-white/44 sm:grid-cols-[minmax(0,1.2fr)_96px_80px_100px]">
          <span>Bay</span>
          <span>Severity</span>
          <span className="text-right">Coverage</span>
          <span className="hidden text-right sm:block">Action</span>
        </div>
        {productQueueRows.map(([bay, category, severity, coverage, gaps, tone]) => (
          <div
            key={bay}
            className="grid grid-cols-[minmax(0,1.2fr)_88px_70px] items-center gap-3 border-b border-white/[0.045] px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.2fr)_96px_80px_100px]"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-white">{bay}</div>
              <div className="mt-0.5 truncate text-xs text-white/40">{category} - {gaps}</div>
            </div>
            <MiniStatusPill tone={tone}>{severity}</MiniStatusPill>
            <div className={cn("text-right text-sm font-black", tone === "red" && "text-red-300", tone === "amber" && "text-yellow-200", tone === "green" && "text-emerald-300")}>{coverage}</div>
            <button className="hidden rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/[0.11] sm:block">
              View inspect
            </button>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

function CaptureWorkflowProductCard() {
  const stages = ["Location", "Mode", "Photos", "Assign", "Review"];

  return (
    <SurfaceCard
      eyebrow="Capture flow"
      title="Mobile capture continues into processing"
      body="The app keeps the job visible from photo capture through queue state and review."
    >
      <div className="rounded-[22px] border border-white/10 bg-[#020813]/86 p-4">
        <div className="grid gap-2 sm:grid-cols-5">
          {stages.map((stage, index) => (
            <div key={stage} className="rounded-2xl border border-white/10 bg-[#07111f]/78 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-xl border border-cyan-300/18 bg-cyan-300/[0.08] text-xs font-black text-cyan-200">
                  {index + 1}
                </div>
                <MiniStatusPill tone={index < 3 ? "green" : index === 3 ? "blue" : "amber"}>
                  {index < 3 ? "Done" : index === 3 ? "Live" : "Next"}
                </MiniStatusPill>
              </div>
              <div className="mt-3 text-sm font-bold text-white">{stage}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="rounded-2xl border border-white/8 bg-[#07111f]/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-white">Aisle 1 / Bay 12 upload</span>
              <span className="text-cyan-200">68%</span>
            </div>
            <div className="mt-3">
              <ProgressBar value={68} tone="blue" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl bg-white/[0.045] px-3 py-2 text-white/54">6 photos</div>
              <div className="rounded-xl bg-white/[0.045] px-3 py-2 text-white/54">Bay mode</div>
              <div className="rounded-xl bg-white/[0.045] px-3 py-2 text-white/54">Assigned</div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/12 bg-cyan-300/[0.045] p-4">
            <div className="text-xs font-bold text-cyan-200">Job queue state</div>
            <div className="mt-3 space-y-2">
              {["Capture submitted", "Processing shelves", "Review pending"].map((label, index) => (
                <div key={label} className="flex items-center gap-2 text-xs text-white/58">
                  <ToneDot tone={index === 0 ? "green" : index === 1 ? "blue" : "amber"} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

function ProductSurfaceSection() {
  return (
    <SectionShell id="product-surfaces">
      <div className="mx-auto mb-7 max-w-[820px] text-center sm:mb-10">
        <SectionHeading
          align="center"
          eyebrow="See ShelfLens in action"
          icon={<Icons.Scan className="h-3.5 w-3.5" />}
          title="Concrete product surfaces, not abstract promises."
          body="Inspection overlays, compliance dashboards, critical queues, and capture jobs use the same bay-level context store teams work with."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InspectOverlayProductCard />
        <ComplianceDashboardProductCard />
        <CriticalQueueProductCard />
        <CaptureWorkflowProductCard />
      </div>
    </SectionShell>
  );
}

function ManagerCommandCentreSection() {
  return (
    <SectionShell id="manager-command">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.72, ease: shelfEase }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f]/72 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl sm:rounded-[36px] sm:p-6 lg:p-8"
      >
        <div className="pointer-events-none absolute inset-x-[-20%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.72),rgba(16,185,129,0.54),transparent)]" />
        <div className="relative mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Manager command centre"
            icon={<Icons.Bars className="h-3.5 w-3.5" />}
            title="The store view starts with risk, not reports."
            body="Store managers see compliance, critical bays, aisle risk, and bay history in one operational view."
          />
          <div className="rounded-2xl border border-emerald-300/18 bg-emerald-400/[0.07] px-4 py-3 text-sm font-bold text-emerald-200">
            Updated 4m ago
          </div>
        </div>

        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-[#020813]/82 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">Store 014 compliance overview</div>
                  <div className="mt-1 text-xs text-white/42">Aisles 1-6 / 212 shelves scanned</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white">86%</div>
                  <div className="text-xs font-bold text-emerald-200">store compliance</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <AppMetric label="Critical" value="35" tone="red" />
                <AppMetric label="Moderate" value="29" tone="amber" />
                <AppMetric label="At-risk" value="70%" tone="red" />
                <AppMetric label="OK shelves" value="148" tone="green" />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#020813]/82 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white">Aisle / bay history</div>
                  <div className="mt-1 text-xs text-white/42">Repeat scans keep bay evidence attached.</div>
                </div>
                <MiniStatusPill tone="blue">Bay 12</MiniStatusPill>
              </div>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <svg viewBox="0 0 360 120" className="h-28 w-full rounded-2xl border border-white/8 bg-[#07111f]/70 p-3" preserveAspectRatio="none">
                  <path d="M0 88H360M0 56H360M0 24H360" stroke="rgba(255,255,255,0.08)" />
                  <path d="M10 36 C58 50, 78 64, 116 58 S184 82, 224 74 S292 32, 350 42" stroke="rgba(34,211,238,0.9)" strokeWidth="3" fill="none" />
                  <path d="M10 86 C58 76, 84 86, 122 78 S186 50, 228 58 S288 72, 350 64" stroke="rgba(248,113,113,0.84)" strokeWidth="3" fill="none" />
                </svg>
                <div className="space-y-2 text-xs">
                  {[
                    ["09:12", "Capture complete", "86%", "green"],
                    ["13:46", "Gap found", "61%", "red"],
                    ["14:20", "Refill assigned", "Open", "amber"],
                  ].map(([time, label, value, tone]) => (
                    <div key={time} className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#07111f]/70 px-3 py-2">
                      <div className="min-w-0">
                        <div className="font-bold text-white">{time}</div>
                        <div className="truncate text-white/42">{label}</div>
                      </div>
                      <MiniStatusPill tone={tone}>{value}</MiniStatusPill>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#020813]/82 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Priority queue</div>
                <div className="mt-1 text-xs text-white/42">Critical shelves before routine tasks.</div>
              </div>
              <MiniStatusPill tone="red">35 critical</MiniStatusPill>
            </div>
            <div className="space-y-2">
              {managerQueueRows.map(([bay, severity, coverage, action, tone]) => (
                <div key={bay} className="grid grid-cols-[minmax(0,1fr)_66px] gap-3 rounded-2xl border border-white/8 bg-[#07111f]/74 p-3 sm:grid-cols-[minmax(0,1fr)_86px_82px]">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">{bay}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/42">
                      <ToneDot tone={tone} />
                      {action}
                    </div>
                  </div>
                  <MiniStatusPill tone={tone}>{severity}</MiniStatusPill>
                  <div className={cn("text-right text-sm font-black", tone === "red" ? "text-red-300" : "text-yellow-200")}>{coverage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-4 rounded-[24px] border border-white/10 bg-[#020813]/82 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white">Aisle risk ranking</div>
              <div className="mt-1 text-xs text-white/42">Aisle 1 is the top risk by critical and moderate shelf mix.</div>
            </div>
            <MiniStatusPill tone="red">Aisle 1 top risk</MiniStatusPill>
          </div>
          <div className="grid gap-3 lg:grid-cols-4">
            {aisleRiskRows.map(([aisle, label, score, detail, tone]) => (
              <div key={aisle} className="rounded-2xl border border-white/8 bg-[#07111f]/74 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold text-white">{aisle}</div>
                  <MiniStatusPill tone={tone}>{label}</MiniStatusPill>
                </div>
                <div className="mt-3 text-2xl font-black text-white">{score}</div>
                <div className="mt-2">
                  <ProgressBar value={Number(score.replace("%", ""))} tone={tone as StatusTone} />
                </div>
                <div className="mt-2 text-xs leading-5 text-white/42">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

function MobileExecutionSection() {
  return (
    <SectionShell id="mobile-execution">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.7, ease: shelfEase }}
        >
          <SectionHeading
            eyebrow="In-store execution on mobile"
            icon={<Icons.Scan className="h-3.5 w-3.5" />}
            title="The inspect page becomes a store-floor task surface."
            body="Staff can see the exact aisle, side, bay, shelf overlay state, severity, coverage, count, and shelf chips without switching tools."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <AppMetric label="Active bay" value="Bay 12" detail="Aisle 1 / Left" tone="cyan" />
            <AppMetric label="Shelf focus" value="S0 of 5" detail="overlay enabled" tone="blue" />
            <AppMetric label="Coverage" value="61%" detail="critical shelf" tone="red" />
            <AppMetric label="Bay evidence" value="6 photos" detail="ready for review" tone="green" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.76, ease: shelfEase, delay: 0.08 }}
          className="relative mx-auto w-full max-w-[390px]"
        >
          <div className="absolute -inset-5 rounded-[40px] bg-cyan-300/8 blur-2xl" />
          <div className="relative rounded-[36px] border border-white/14 bg-[#040a13] p-2.5 shadow-[0_34px_120px_rgba(0,0,0,0.5),0_0_70px_rgba(34,211,238,0.12)]">
            <div className="absolute inset-x-[36%] top-3 z-10 h-1.5 rounded-full bg-white/18" />
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f]">
              <div className="flex items-center justify-between border-b border-white/8 bg-[#020813]/88 px-4 py-4">
                <div>
                  <div className="text-xs text-white/42">Inspect</div>
                  <div className="text-sm font-black text-white">Aisle 1 / Left / Bay 12</div>
                </div>
                <MiniStatusPill tone="red">Critical</MiniStatusPill>
              </div>

              <div className="relative h-[430px] overflow-hidden bg-black">
                <img src="/shelflens-cereal-aisle.png" alt="Mobile ShelfLens inspect UI" className="h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,19,0.08),rgba(2,8,19,0.58))]" />
                <div className="absolute left-[8%] right-[8%] top-[20%] h-[18%] rounded-xl border-2 border-emerald-400/90 bg-emerald-400/[0.06]" />
                <div className="absolute left-[12%] right-[10%] top-[44%] h-[16%] rounded-xl border-2 border-yellow-300/90 bg-yellow-300/[0.06]" />
                <div className="absolute left-[20%] top-[69%] h-[17%] w-[18%] rounded-lg border-2 border-red-400 bg-red-500/[0.10]" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  {["View details", "Overlay on", "Shelf 0 of 5"].map((label, index) => (
                    <div key={label} className={cn("rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur-xl", index === 1 ? "border-emerald-300/28 bg-emerald-400/[0.12] text-emerald-100" : "border-cyan-300/22 bg-[#06101b]/82 text-cyan-100")}>
                      {label}
                    </div>
                  ))}
                </div>

                <div className="absolute inset-x-3 bottom-3 rounded-[24px] border border-white/12 bg-[#06101b]/92 p-4 shadow-[0_-18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-white">Shelf detail</div>
                      <div className="text-xs text-white/42">Bay evidence active</div>
                    </div>
                    <MiniStatusPill tone="red">High risk</MiniStatusPill>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      ["Severity", "Critical", "red"],
                      ["Coverage", "61%", "red"],
                      ["Count", "5", "cyan"],
                      ["Bay", "12", "blue"],
                    ].map(([label, value, tone]) => (
                      <div key={label} className="rounded-xl border border-white/8 bg-white/[0.045] p-2">
                        <div className="text-[10px] text-white/40">{label}</div>
                        <div className={cn("mt-1 text-xs font-black", tone === "red" ? "text-red-200" : "text-white")}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {["S0", "S1", "S2", "S3", "S4"].map((chip, index) => (
                      <div key={chip} className={cn("grid h-8 flex-1 place-items-center rounded-xl border text-xs font-black", index === 0 ? "border-red-400/40 bg-red-500/[0.16] text-red-100" : "border-white/10 bg-white/[0.045] text-white/58")}>
                        {chip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

function ProcessingQueueSection() {
  return (
    <SectionShell id="processing-queue">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.72, ease: shelfEase }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f]/74 p-4 shadow-[0_28px_92px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:rounded-[34px] sm:p-6 lg:p-8"
      >
        <div className="pointer-events-none absolute inset-x-[-20%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.7),transparent)]" />
        <div className="relative grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Background processing built for stores"
              icon={<Icons.Activity className="h-3.5 w-3.5" />}
              title="AI jobs keep running while teams keep working."
              body="Capture can be submitted, processed, completed, and restored after navigation without blocking the rest of the app."
            />

            <div className="mt-6 grid gap-3">
              {[
                ["1", "Capture submitted", "Photos and bay metadata enter the queue.", "green"],
                ["2", "Processing", "Shelf coverage, gaps, and OOS risk are analysed in the background.", "blue"],
                ["3", "Analysis complete", "The inspect view and manager dashboard update when results are ready.", "green"],
              ].map(([num, title, body, tone]) => (
                <div key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-[#020813]/78 p-4">
                  <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-black", tone === "green" ? "border-emerald-300/22 bg-emerald-400/[0.10] text-emerald-200" : "border-cyan-300/22 bg-cyan-300/[0.10] text-cyan-200")}>
                    {num}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-sm leading-6 text-white/50">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#020813]/86 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Processing dock</div>
                <div className="mt-1 text-xs text-white/42">Persistent queue restored after navigation</div>
              </div>
              <MiniStatusPill tone="blue">4 active jobs</MiniStatusPill>
            </div>

            <div className="mt-4 space-y-3">
              {processingJobs.map(([store, bay, status, percent, tone]) => (
                <div key={`${store}-${bay}`} className="rounded-2xl border border-white/8 bg-[#07111f]/76 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-white">{store} - {bay}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/42">
                        <ToneDot tone={tone} />
                        {status}
                      </div>
                    </div>
                    <div className="text-sm font-black text-white">{percent}</div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={Number(percent.replace("%", ""))} tone={tone as StatusTone} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.055] p-4">
              <div className="text-sm font-bold text-white">Restore status</div>
              <div className="mt-2 text-sm leading-6 text-white/52">
                User returns to the dashboard and the dock rehydrates the same job states: queued, processing, and completed.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

const lifecycleToneStyles: Record<
  LifecycleTone,
  {
    border: string;
    bg: string;
    halo: string;
    text: string;
    pill: string;
    node: string;
    metric: string;
    stroke: string;
    pulseShadow: string[];
  }
> = {
  cyan: {
    border: "border-cyan-300/26",
    bg: "bg-cyan-300/[0.07]",
    halo: "bg-cyan-300/70",
    text: "text-cyan-200",
    pill: "border-cyan-300/30 bg-cyan-300/[0.10] text-cyan-100",
    node: "border-cyan-300/55 bg-cyan-300/[0.10] text-cyan-100",
    metric: "bg-[linear-gradient(90deg,#06b6d4,#67e8f9)]",
    stroke: "#22d3ee",
    pulseShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 22px rgba(34,211,238,0.56)", "0 0 0 rgba(34,211,238,0)"],
  },
  amber: {
    border: "border-yellow-300/24",
    bg: "bg-yellow-400/[0.07]",
    halo: "bg-yellow-300/75",
    text: "text-yellow-200",
    pill: "border-yellow-300/30 bg-yellow-400/[0.10] text-yellow-100",
    node: "border-yellow-300/55 bg-yellow-400/[0.10] text-yellow-100",
    metric: "bg-[linear-gradient(90deg,#f59e0b,#fde047)]",
    stroke: "#facc15",
    pulseShadow: ["0 0 0 rgba(250,204,21,0)", "0 0 22px rgba(250,204,21,0.48)", "0 0 0 rgba(250,204,21,0)"],
  },
  red: {
    border: "border-red-400/28",
    bg: "bg-red-500/[0.07]",
    halo: "bg-red-400/80",
    text: "text-red-200",
    pill: "border-red-400/42 bg-red-500/[0.14] text-red-100",
    node: "border-red-400/60 bg-red-500/[0.11] text-red-100",
    metric: "bg-[linear-gradient(90deg,#ef4444,#fb7185)]",
    stroke: "#f87171",
    pulseShadow: ["0 0 0 rgba(248,113,113,0)", "0 0 24px rgba(248,113,113,0.62)", "0 0 0 rgba(248,113,113,0)"],
  },
  green: {
    border: "border-emerald-300/28",
    bg: "bg-emerald-400/[0.07]",
    halo: "bg-emerald-300/75",
    text: "text-emerald-200",
    pill: "border-emerald-300/36 bg-emerald-400/[0.12] text-emerald-100",
    node: "border-emerald-300/58 bg-emerald-400/[0.11] text-emerald-100",
    metric: "bg-[linear-gradient(90deg,#22c55e,#86efac)]",
    stroke: "#4ade80",
    pulseShadow: ["0 0 0 rgba(74,222,128,0)", "0 0 24px rgba(74,222,128,0.58)", "0 0 0 rgba(74,222,128,0)"],
  },
};

function LifecycleStatusPill({
  tone,
  children,
  shouldReduceMotion = false,
  pulse = false,
}: {
  tone: LifecycleTone;
  children: React.ReactNode;
  shouldReduceMotion?: boolean;
  pulse?: boolean;
}) {
  const toneStyle = lifecycleToneStyles[tone];
  const shouldPulse = pulse && !shouldReduceMotion;

  return (
    <motion.span
      animate={shouldPulse ? { opacity: [0.84, 1, 0.84], boxShadow: toneStyle.pulseShadow } : undefined}
      transition={shouldPulse ? { duration: tone === "red" ? 1.35 : 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
      className={cn(
        "inline-flex max-w-full shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-center text-[9px] font-black uppercase leading-3 tracking-[0.08em] sm:text-[10px] sm:tracking-[0.12em]",
        toneStyle.pill,
      )}
    >
      {tone === "green" && pulse && <Icons.Check className="h-3 w-3" />}
      {children}
    </motion.span>
  );
}

function LifecycleProgressRail({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="relative px-1 pt-1">
      <div className="absolute left-[12.5%] right-[12.5%] top-[25px] h-4 -translate-y-1/2 overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.35, ease: shelfEase, delay: 0.16 }}
          style={{ originX: 0 }}
          className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#22d3ee_0%,#facc15_34%,#ef4444_64%,#4ade80_100%)] opacity-75 blur-[0.5px] shadow-[0_0_22px_rgba(34,211,238,0.34)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 opacity-80"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1.2px, transparent 1.95px)",
            backgroundSize: "18px 4px",
            backgroundPosition: "0 center",
          }}
        />
        {!shouldReduceMotion && (
          <>
            <motion.span
              aria-hidden
              className="absolute top-1/2 h-3 w-20 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)] blur-[1px]"
              animate={{ left: ["-14%", "100%"], opacity: [0, 0.95, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.28 }}
            />
            {[0, 0.24, 0.48].map((delay) => (
              <motion.span
                key={delay}
                aria-hidden
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.95),0_0_34px_rgba(34,211,238,0.72)]"
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 grid grid-cols-4 gap-1 sm:gap-3">
        {lifecycleProgressStages.map((stage, index) => {
          const toneStyle = lifecycleToneStyles[stage.tone];

          return (
            <div key={stage.number} className="min-w-0 text-center">
              <motion.div
                animate={!shouldReduceMotion ? { scale: [1, 1.055, 1], boxShadow: toneStyle.pulseShadow } : undefined}
                transition={!shouldReduceMotion ? { duration: 2.15, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 } : undefined}
                className={cn(
                  "mx-auto grid h-12 w-12 place-items-center rounded-full border bg-[#04101c] text-sm font-black shadow-[0_0_28px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/5",
                  toneStyle.node,
                )}
              >
                {stage.number}
              </motion.div>
              <div className={cn("mt-3 text-[9px] font-black uppercase leading-3 tracking-[0.04em] sm:text-xs sm:tracking-[0.16em]", toneStyle.text)}>{stage.label}</div>
              <div className="mt-1 hidden truncate text-xs text-white/44 sm:block">{stage.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LifecycleMobileProgressRail({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute bottom-7 left-[22px] top-7 z-0 sm:hidden" aria-hidden>
      <div className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,rgba(34,211,238,0.28),rgba(250,204,21,0.34),rgba(248,113,113,0.34),rgba(74,222,128,0.34))]" />
      <div
        className="absolute inset-y-0 left-[-1px] w-[3px] opacity-65"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1.7px)",
          backgroundSize: "3px 11px",
          color: "rgba(103,232,249,0.72)",
        }}
      />
      {!shouldReduceMotion && (
        <>
          <motion.span
            className="absolute left-[-4px] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.95),0_0_34px_rgba(34,211,238,0.48)]"
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.25 }}
          />
          {[0, 0.28, 0.56].map((delay) => (
            <motion.span
              key={delay}
              className="absolute left-[-3px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]"
              animate={{ top: ["0%", "100%"], opacity: [0, 0.85, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function LifecycleMetricBlock({
  metric,
  tone,
}: {
  metric: LifecycleMetric;
  tone: LifecycleTone;
}) {
  const toneStyle = lifecycleToneStyles[tone];

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-white/8 bg-white/[0.045] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="text-[9px] leading-3 text-white/38 sm:text-[10px]">{metric.label}</div>
      <div className="mt-1 whitespace-nowrap text-[10px] font-black leading-4 text-white sm:text-[11px] min-[1380px]:text-xs">{metric.value}</div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.075]">
        <div className={cn("h-full rounded-full", toneStyle.metric)} style={{ width: `${metric.level}%` }} />
      </div>
    </div>
  );
}

function LifecycleStepCard({
  step,
  number,
  isLast,
}: {
  step: LifecycleStep;
  number: number;
  isLast: boolean;
}) {
  const toneStyle = lifecycleToneStyles[step.tone];

  return (
    <div
      className={cn(
        "group relative ml-12 min-w-0 overflow-visible rounded-[22px] border bg-[#020813]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 sm:ml-0 sm:overflow-hidden min-[1380px]:p-3.5 2xl:p-4",
        toneStyle.border,
        "hover:border-white/22 hover:bg-[#06111f]/94",
      )}
    >
      <span className={cn("pointer-events-none absolute inset-x-6 -top-px h-px rounded-full blur-[1px]", toneStyle.halo)} />
      <span className={cn("pointer-events-none absolute -inset-px rounded-[22px] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30", toneStyle.bg)} />

      {!isLast && (
        <Icons.ArrowRight
          className={cn("pointer-events-none absolute -right-5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 2xl:block", toneStyle.text)}
        />
      )}

      <div
        className={cn(
          "absolute -left-[46px] top-5 z-10 grid h-10 w-10 place-items-center rounded-full border bg-[#04101c] text-xs font-black shadow-[0_0_22px_rgba(34,211,238,0.10),inset_0_1px_0_rgba(255,255,255,0.08)] sm:relative sm:left-auto sm:top-auto sm:mb-4",
          toneStyle.node,
        )}
      >
        {number}
      </div>

      {step.recovered && (
        <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-emerald-300/34 bg-emerald-400/[0.13] text-emerald-200">
          <Icons.Check className="h-4 w-4" />
        </div>
      )}

      <div className="relative">
        <div className="pr-8 sm:pr-0">
          <div className="min-w-0 overflow-hidden">
            <div className="text-xs font-black text-white/42">{step.time}</div>
            <div className="mt-2 text-sm font-black leading-5 text-white sm:text-[15px] xl:text-base">{step.title}</div>
          </div>
          <div className="mt-3">
            <LifecycleStatusPill tone={step.tone}>{step.state}</LifecycleStatusPill>
          </div>
        </div>

        <div className="mt-4 text-xs leading-5 text-white/48">{step.detail}</div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {step.metrics.map((metric) => (
            <LifecycleMetricBlock key={metric.label} metric={metric} tone={step.tone} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LifecycleSummaryMetric({
  label,
  value,
  tone,
  path,
  shouldReduceMotion,
}: {
  label: string;
  value: string;
  tone: LifecycleTone;
  path: string;
  shouldReduceMotion: boolean;
}) {
  const toneStyle = lifecycleToneStyles[tone];

  return (
    <div className={cn("relative min-w-0 overflow-hidden rounded-2xl border p-4", toneStyle.border, toneStyle.bg)}>
      <div className={cn("text-[10px] font-black uppercase tracking-[0.16em]", toneStyle.text)}>{label}</div>
      <div className="mt-2 text-2xl font-black text-white sm:text-3xl">{value}</div>
      <svg className="mt-2 h-8 w-full" viewBox="0 0 120 32" fill="none" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d={path}
          stroke={toneStyle.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: shelfEase }}
        />
        <path d="M2 31 L118 31" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function LifecycleEventTimeline({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="grid gap-2">
      {lifecycleEvents.map((event, index) => {
        const toneStyle = lifecycleToneStyles[event.tone];
        const isLast = index === lifecycleEvents.length - 1;

        return (
          <div key={event.title} className="relative min-w-0 pl-12">
            {!isLast && (
              <div className={cn("absolute bottom-[-12px] left-[17px] top-10 w-[2px] overflow-hidden", toneStyle.text)}>
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-55"
                  style={{
                    backgroundImage: "radial-gradient(circle, currentColor 1.2px, transparent 1.8px)",
                    backgroundSize: "2px 9px",
                  }}
                />
                {!shouldReduceMotion &&
                  [0, 0.33, 0.66].map((delay) => (
                    <motion.span
                      key={delay}
                      aria-hidden
                      className={cn("absolute left-[-2px] h-1.5 w-1.5 rounded-full shadow-[0_0_14px_currentColor]", toneStyle.halo)}
                      animate={{ top: ["0%", "92%"], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 + delay }}
                    />
                  ))}
              </div>
            )}

            <div className={cn("absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-xl border bg-[#06101b]", toneStyle.node)}>
              {event.complete ? <Icons.Check className="h-4 w-4" /> : <ToneDot tone={event.tone} />}
            </div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.44, ease: shelfEase, delay: index * 0.055 }}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)_54px] items-center gap-3 rounded-2xl border border-white/8 bg-[#07111f]/74 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
            >
              <div className="min-w-0 text-sm font-semibold leading-5 text-white/82">{event.title}</div>
              <div className="text-right text-xs font-medium text-white/46">{event.time}</div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function LifecycleStoreSummary({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="relative mt-5 overflow-hidden rounded-[26px] border border-white/10 bg-[#020813]/84 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.52),rgba(74,222,128,0.5),transparent)]" />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xl font-black text-white sm:text-2xl">Store 014</div>
          <div className="mt-1 text-sm text-white/48">Aisle 3 / Bay 1 - last scanned 14:32</div>
        </div>
        <LifecycleStatusPill tone="green" shouldReduceMotion={shouldReduceMotion} pulse>
          Recovered
        </LifecycleStatusPill>
      </div>

      <div className="relative mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {lifecycleSummaryStats.map((stat) => (
              <LifecycleSummaryMetric key={stat.label} {...stat} shouldReduceMotion={shouldReduceMotion} />
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-white/56">Severity transition</span>
              <span className="font-bold text-emerald-200">red to amber to cyan/green</span>
            </div>
            <div className="relative h-2 overflow-visible rounded-full bg-white/[0.07]">
              <motion.div
                initial={shouldReduceMotion ? false : { width: "16%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.35, ease: shelfEase, delay: 0.14 }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#ef4444_0%,#f59e0b_35%,#22d3ee_68%,#34d399_100%)] shadow-[0_0_22px_rgba(34,211,238,0.18)]"
              />
              <motion.span
                aria-hidden
                animate={!shouldReduceMotion ? { scale: [1, 1.35, 1], boxShadow: lifecycleToneStyles.green.pulseShadow } : undefined}
                transition={!shouldReduceMotion ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
                className="absolute right-[-2px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-emerald-100/60 bg-emerald-300"
              />
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1 text-[10px] text-white/46 sm:text-xs">
              {["critical", "high", "medium", "low", "recovered"].map((label, index) => (
                <div key={label} className={cn("truncate", index === 4 && "text-right font-bold text-emerald-200")}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <LifecycleEventTimeline shouldReduceMotion={shouldReduceMotion} />
      </div>

      <div className="relative mt-6 grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Time to action", "11m", "cyan"],
          ["Time to recovery", "14m", "cyan"],
          ["Total gap reduction", "22%", "green"],
          ["Bay status", "Recovered", "green"],
          ["Last updated", "14:46:21", "cyan"],
        ].map(([label, value, tone]) => (
          <div key={label} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#07111f]/62 px-3 py-3">
            <span className="min-w-0 truncate text-white/48">{label}</span>
            <span className="flex shrink-0 items-center gap-2 font-semibold text-white">
              <ToneDot tone={tone} />
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveIssueLifecycleSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <SectionShell id="live-issue-lifecycle">
      <div className="relative overflow-hidden rounded-[30px] border border-cyan-300/14 bg-[#07111f]/76 p-4 shadow-[0_32px_110px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl sm:rounded-[38px] sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(34,211,238,0.13),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(250,204,21,0.08),transparent_28%),radial-gradient(circle_at_86%_78%,rgba(16,185,129,0.11),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-x-[-20%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.78),rgba(250,204,21,0.48),rgba(16,185,129,0.58),transparent)]" />

        <div className="relative grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start xl:gap-7 2xl:grid-cols-[320px_minmax(0,1fr)] 2xl:gap-8">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="Live issue lifecycle"
              icon={<Icons.Activity className="h-3.5 w-3.5" />}
              title="One bay issue moving from scan to recovery."
              body="ShelfLens keeps the operational record alive as an issue moves through capture, detection, escalation, refill, and verified recovery."
            />

            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["5", "Active", "cyan"],
                ["3", "At risk", "amber"],
                ["2", "Critical", "red"],
              ].map(([value, label, tone]) => {
                const toneStyle = lifecycleToneStyles[tone as LifecycleTone];

                return (
                  <div key={label} className={cn("rounded-2xl border p-3 text-center sm:p-4", toneStyle.border, toneStyle.bg)}>
                    <div className={cn("text-3xl font-black sm:text-4xl", toneStyle.text)}>{value}</div>
                    <div className="mt-1 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.08em] text-white/70 sm:text-[10px]">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#020813]/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] sm:p-4 lg:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_72%_5%,rgba(250,204,21,0.10),transparent_26%),radial-gradient(circle_at_100%_28%,rgba(239,68,68,0.08),transparent_24%),radial-gradient(circle_at_92%_82%,rgba(74,222,128,0.10),transparent_28%)]" />
              <div className="relative">
                <div className="hidden sm:block">
                  <LifecycleProgressRail shouldReduceMotion={shouldReduceMotion} />
                </div>

                <div className="relative mt-6">
                  <LifecycleMobileProgressRail shouldReduceMotion={shouldReduceMotion} />
                  <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {lifecycleSteps.map((step, index) => (
                      <LifecycleStepCard key={step.title} step={step} number={index + 1} isLast={index === lifecycleSteps.length - 1} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LifecycleStoreSummary shouldReduceMotion={shouldReduceMotion} />
      </div>
    </SectionShell>
  );
}

function RoiSnapshotSection() {
  return (
    <SectionShell id="roi-snapshot" narrow>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.7, ease: shelfEase }}
        className="grid gap-4 rounded-[28px] border border-white/10 bg-[#07111f]/74 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:rounded-[34px] sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8"
      >
        <div>
          <SectionHeading
            eyebrow="ROI and loss snapshot"
            icon={<Icons.Bars className="h-3.5 w-3.5" />}
            title="Estimate the value of acting on critical shelves first."
            body="Use store inputs to model at-risk shelf coverage, missed checks, and labour saved. The panel stays framed around gaps, OOS risk, and bay-level evidence."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <AppMetric label="At-risk shelves" value="70%" detail="critical plus moderate mix" tone="red" />
            <AppMetric label="Critical bays" value="35" detail="priority queue" tone="red" />
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#020813]/84 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white">Loss calculator style panel</div>
              <div className="mt-1 text-xs text-white/42">Illustrative static inputs for a store pilot.</div>
            </div>
            <MiniStatusPill tone="cyan">Snapshot</MiniStatusPill>
          </div>
          <div className="grid gap-3">
            {[
              ["Bays scanned this week", "212", "green"],
              ["Critical shelf gaps", "35", "red"],
              ["Avg minutes to verify bay", "2.4", "cyan"],
              ["Manual checks avoided", "8.5 hrs", "blue"],
            ].map(([label, value, tone]) => (
              <div key={label} className="grid grid-cols-[minmax(0,1fr)_86px] items-center gap-3 rounded-2xl border border-white/8 bg-[#07111f]/74 px-4 py-3">
                <div className="min-w-0 text-sm text-white/58">{label}</div>
                <div className={cn("text-right text-sm font-black", tone === "red" ? "text-red-300" : tone === "green" ? "text-emerald-300" : "text-cyan-200")}>{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-300/14 bg-emerald-400/[0.06] p-4">
            <div className="text-xs font-bold text-emerald-200">Operational impact</div>
            <div className="mt-2 text-2xl font-black text-white">Prioritise 35 bays first</div>
            <div className="mt-1 text-sm leading-6 text-white/52">Focus teams on the highest OOS risk and verify recovery with the next scan.</div>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

function WorkspaceShowcaseSection() {
  return (
    <SectionShell id="workspace" className="pb-10 sm:pb-14 lg:pb-16">
      <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/14 bg-white/[0.028] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl sm:rounded-[36px] sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_88%_74%,rgba(124,92,255,0.13),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_44%)]" />
        <div className="pointer-events-none absolute inset-x-[-30%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.78),rgba(124,92,255,0.62),transparent)]" />

        <div className="relative grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.72, ease: shelfEase }}
            className="min-w-0"
          >
            <SectionHeading
              eyebrow="Operator workspace"
              icon={<Icons.Scan className="h-3.5 w-3.5" />}
              title={
                <>
                  Full shelf inspection on desktop.{' '}
                  <span className="bg-[linear-gradient(100deg,#7657ff_0%,#2788ff_48%,#28e2f3_100%)] bg-clip-text text-transparent">
                    Fast action on mobile.
                  </span>
                </>
              }
              body="ShelfLens keeps the same context across web and phone: managers inspect evidence, while store teams review severity, coverage, and bay details on site."
            />

            <div className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
              {workspaceFeatures.map(([title, body]) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-white/10 bg-[#07111f]/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-cyan-300/[0.035] sm:p-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.75)] transition duration-300 group-hover:bg-emerald-300" />
                    {title}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-white/45">{body}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-white/44 sm:mt-6 sm:gap-3">
              <div className="rounded-full border border-emerald-300/18 bg-emerald-400/[0.07] px-3 py-1.5 font-semibold text-emerald-200">
                Shared context
              </div>
              <div className="rounded-full border border-cyan-300/18 bg-cyan-300/[0.06] px-3 py-1.5 font-semibold text-cyan-200">
                Web + mobile
              </div>
              <div className="rounded-full border border-red-400/18 bg-red-500/[0.06] px-3 py-1.5 font-semibold text-red-200">
                Critical first
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.985 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.78, ease: shelfEase, delay: 0.08 }}
            className="relative min-w-0"
          >
            <div
              aria-hidden
              className="absolute -inset-5 rounded-[36px] bg-[radial-gradient(circle_at_32%_18%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_78%_78%,rgba(124,92,255,0.14),transparent_38%)] blur-2xl sm:-inset-8 sm:rounded-[46px]"
            />

            <div className="relative rounded-[24px] border border-cyan-300/16 bg-[#050d18]/92 p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.36),0_0_56px_rgba(34,211,238,0.08)] backdrop-blur-2xl sm:rounded-[32px] sm:p-4 lg:pb-4">
              <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_13%_0%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_92%_12%,rgba(124,92,255,0.14),transparent_30%)] sm:rounded-[32px]" />
              <div className="absolute inset-x-[-35%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.75),rgba(124,92,255,0.6),transparent)]" />

              <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-[#07111f]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:rounded-[24px]">
                <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-white/[0.035] px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/85 shadow-[0_0_12px_rgba(248,113,113,0.38)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/85 shadow-[0_0_12px_rgba(253,224,71,0.25)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/85 shadow-[0_0_12px_rgba(52,211,153,0.28)]" />
                  </div>

                  <div className="rounded-full border border-cyan-300/14 bg-cyan-300/[0.055] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                    Web workspace
                  </div>
                </div>

                <div className="relative aspect-[1834/866] overflow-hidden bg-[#020813]">
                  <img
                    src="/workspace-web.png"
                    alt="ShelfLens desktop shelf inspection workspace"
                    draggable={false}
                    className="h-full w-full select-none object-cover object-left-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,19,0)_68%,rgba(2,8,19,0.2)_100%)]" />
                  <div className="pointer-events-none absolute left-3 top-3 hidden rounded-2xl border border-emerald-300/24 bg-[#06101b]/88 px-3 py-2 shadow-[0_0_28px_rgba(16,185,129,0.18)] backdrop-blur-xl sm:block">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">Inspection ready</div>
                    <div className="mt-1 text-xs font-bold text-white">Overlay, debug, clean</div>
                  </div>
                </div>
              </div>

              <div className="relative mt-3 grid grid-cols-2 gap-2 lg:hidden">
                <div className="rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.055] px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">Web</div>
                  <div className="mt-1 text-xs text-white/55">Full inspection view</div>
                </div>
                <div className="rounded-2xl border border-red-400/16 bg-red-500/[0.055] px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">Mobile</div>
                  <div className="mt-1 text-xs text-white/55">Critical actions</div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 28, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.72, ease: shelfEase, delay: 0.22 }}
                className="relative mx-auto mt-4 hidden w-[54%] max-w-[220px] rounded-[28px] border border-white/14 bg-[#050b15] p-1.5 shadow-[0_28px_90px_rgba(0,0,0,0.5),0_0_54px_rgba(34,211,238,0.12)] lg:absolute lg:-bottom-10 lg:right-3 lg:mt-0 lg:block lg:w-[31%] lg:min-w-[215px] lg:max-w-[320px] lg:rounded-[34px] lg:p-2 xl:-right-4"
              >
                <div className="absolute inset-x-[34%] top-2 z-10 h-1.5 rounded-full bg-white/16" />
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#07111f] sm:rounded-[28px]">
                  <img
                    src="/workspace-phone.png"
                    alt="ShelfLens mobile shelf inspection workspace"
                    draggable={false}
                    className="block h-full w-full select-none object-cover object-top"
                  />
                </div>

                <div className="absolute -left-3 top-10 hidden rounded-2xl border border-red-400/45 bg-[#10080b]/94 px-3 py-2 shadow-[0_0_28px_rgba(239,68,68,0.22)] backdrop-blur-xl lg:block">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-300">Critical shelf</div>
                  <div className="mt-1 text-sm font-bold text-white">55.2%</div>
                </div>
              </motion.div>
            </div>

            <div className="mt-5 hidden grid-cols-3 gap-3 sm:grid lg:mt-14">
              {workspaceProof.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/8 bg-[#07111f]/64 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
                  <div className="text-xs font-bold text-white">{title}</div>
                  <div className="mt-1 text-[11px] leading-5 text-white/42">{body}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}

function EarlyAccessPilotSection() {
  return (
    <SectionShell id="early-access">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.7, ease: shelfEase }}
        className="relative overflow-hidden rounded-[26px] border border-cyan-300/14 bg-white/[0.035] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl sm:rounded-[32px] sm:p-7 lg:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_88%_64%,rgba(16,185,129,0.09),transparent_34%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-8">
          <SectionHeading
            eyebrow="Free pilot account"
            icon={<Icons.Sparkles className="h-3.5 w-3.5" />}
            title={
              <>
                Start with up to{" "}
                <span className="bg-[linear-gradient(100deg,#7657ff_0%,#2788ff_48%,#28e2f3_100%)] bg-clip-text text-transparent">
                  100 bay scans.
                </span>
              </>
            }
            body="Request a free ShelfLens pilot account for your first store. No payment flow, no setup cost, and no extra backend work."
          />

          <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
            {[
              ["1", "Submit details", "Name, business, email, phone, and store count."],
              ["2", "You review it", "Only approve serious operators."],
              ["3", "Pilot account", "Create their free account with 100 scans."],
            ].map(([num, title, body], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: shelfEase, delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-[#07111f]/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-4"
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-300/22 bg-cyan-300/[0.08] text-xs font-black text-cyan-200 sm:h-9 sm:w-9 sm:text-sm">
                  {num}
                </div>
                <div className="mt-3 text-sm font-semibold text-white sm:mt-4">{title}</div>
                <div className="mt-1 text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">{body}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
          <Button className="h-[50px] px-6 text-sm text-slate-950 sm:h-[52px] sm:px-7 sm:text-base" onClick={openRequestAccess}>
            Get early access
            <Icons.ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="text-xs leading-5 text-white/48 sm:text-sm sm:leading-6">Submit store details through the ShelfLens access form. We will review fit before sending platform access.</div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works">
      <div className="mx-auto mb-7 max-w-[760px] text-center sm:mb-10">
        <SectionHeading
          align="center"
          eyebrow="Three steps to shelf intelligence"
          icon={<Icons.Scan className="h-3.5 w-3.5" />}
          title="Understand your shelves in minutes, not days."
          body="No specialist hardware. No complex integrations. Just aisle photos and a workflow store teams can actually follow."
        />
      </div>

      <div className="relative grid gap-3 lg:grid-cols-3 lg:gap-4">
        <div className="absolute left-[18%] right-[18%] top-[60px] hidden h-px bg-[linear-gradient(90deg,rgba(34,211,238,0.35),rgba(99,102,241,0.35))] lg:block" />

        {howItWorksSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.64, ease: shelfEase, delay: index * 0.08 }}
            className="relative rounded-[22px] border border-white/10 bg-[#07111f]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_24px_70px_rgba(0,0,0,0.28),0_0_40px_rgba(34,211,238,0.06)] sm:rounded-[26px] sm:p-6"
          >
            <div className="flex items-start gap-3 sm:block">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-300/22 bg-cyan-300/[0.08] text-xs font-black tracking-[0.12em] text-cyan-200 sm:h-10 sm:w-10">
                {step.step}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white sm:mt-5 sm:text-lg">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/50 sm:mt-2 sm:leading-7">{step.body}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/8 bg-[#020813]/86 p-2.5 font-mono text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:mt-5 sm:p-3">
              {step.rows.map(([label, value, tone]) => (
                <div key={label} className="flex items-center gap-2 border-b border-white/[0.04] py-1.5 last:border-b-0 sm:py-2">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      tone === "green" && "bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.65)]",
                      tone === "amber" && "bg-yellow-300",
                      tone === "red" && "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.65)]",
                      tone === "blue" && "bg-blue-300",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-white/58">{label}</span>
                  <MiniStatusPill tone={tone}>{value}</MiniStatusPill>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

function OperatorsSection() {
  return (
    <SectionShell id="operators">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.7, ease: shelfEase }}
        >
          <SectionHeading
            eyebrow="For multi-store operators"
            icon={<Icons.Store className="h-3.5 w-3.5" />}
            title={
              <>
                One view across{" "}
                <span className="bg-[linear-gradient(100deg,#7657ff_0%,#2788ff_48%,#28e2f3_100%)] bg-clip-text text-transparent">
                  every store
                </span>{" "}
                you run.
              </>
            }
            body="For Spar, Nisa, convenience groups, and independent chains — ShelfLens gives area managers a live execution view without waiting for manual audits."
          />

          <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
            {operatorFeatures.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-[#07111f]/66 p-3 transition duration-300 hover:border-cyan-300/18 sm:p-4">
                <div className="text-xs font-semibold text-white sm:text-sm">{title}</div>
                <div className="mt-1 text-[11px] leading-4 text-white/42 sm:text-xs sm:leading-5">{body}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.7, ease: shelfEase, delay: 0.08 }}
          className="rounded-[24px] border border-white/10 bg-[#07111f]/78 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:rounded-[28px] sm:p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Area Manager View</div>
              <div className="mt-1 text-xs text-white/38">8 stores · Updated 4m ago</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/22 bg-emerald-400/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              Live
            </div>
          </div>

          <div className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
            {storeRows.map(([store, location, score, tone]) => (
              <div key={store} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-2xl border border-transparent px-2.5 py-2.5 transition duration-200 hover:border-cyan-300/12 hover:bg-cyan-300/[0.03] sm:px-3 sm:py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white/82">{store}</div>
                  <div className="mt-0.5 truncate text-xs text-white/36">{location}</div>
                </div>
                <div
                  className={cn(
                    "text-sm font-black",
                    tone === "green" && "text-emerald-300",
                    tone === "amber" && "text-yellow-300",
                    tone === "red" && "text-red-400",
                  )}
                >
                  {score}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-white/8 pt-4 sm:mt-5 sm:pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/42">Avg compliance</span>
              <span className="font-black text-white">74%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "74%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: shelfEase, delay: 0.25 }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#6366f1,#22d3ee)]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

function BeforeAfterSection() {
  return (
    <SectionShell id="before-after" narrow>
      <div className="mx-auto mb-7 max-w-[760px] text-center sm:mb-8">
        <SectionHeading
          align="center"
          eyebrow="The difference"
          icon={<Icons.Scan className="h-3.5 w-3.5" />}
          title="What changes when you can see your shelves."
          body="The shift from reactive shelf checks to visible execution turns missed problems into prioritised action."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.7, ease: shelfEase }}
        className="grid gap-3 md:grid-cols-2 md:gap-4"
      >
        <div className="relative overflow-hidden rounded-[24px] border border-red-400/18 bg-red-500/[0.04] p-4 sm:rounded-[28px] sm:p-7">
          <div className="absolute right-[-28%] top-[-40%] h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="relative mb-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.14em] text-red-200 sm:mb-5 sm:text-xs sm:tracking-[0.16em]">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-red-400/22 bg-red-500/[0.10] text-red-200 sm:h-9 sm:w-9">✕</span>
            Without ShelfLens
          </div>
          <div className="relative space-y-2.5 sm:space-y-3">
            {beforeItems.map((item) => (
              <div key={item} className="flex gap-3 border-b border-white/[0.045] pb-2.5 last:border-b-0 last:pb-0 sm:pb-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-red-400/20 bg-red-500/[0.10] text-[10px] font-black text-red-200">✕</span>
                <span className="text-sm leading-6 text-white/62">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-emerald-300/18 bg-emerald-400/[0.04] p-4 sm:rounded-[28px] sm:p-7">
          <div className="absolute right-[-28%] top-[-40%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative mb-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-200 sm:mb-5 sm:text-xs sm:tracking-[0.16em]">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-emerald-300/22 bg-emerald-400/[0.10] text-emerald-200 sm:h-9 sm:w-9">✓</span>
            With ShelfLens
          </div>
          <div className="relative space-y-2.5 sm:space-y-3">
            {afterItems.map((item) => (
              <div key={item} className="flex gap-3 border-b border-white/[0.045] pb-2.5 last:border-b-0 last:pb-0 sm:pb-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-emerald-300/20 bg-emerald-400/[0.10] text-[10px] font-black text-emerald-200">✓</span>
                <span className="text-sm leading-6 text-white/62">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

function FinalCtaSection() {
  return (
    <SectionShell id="cta" narrow className="pb-16 text-center sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.7, ease: shelfEase }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] px-4 py-9 shadow-[0_24px_90px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl sm:rounded-[34px] sm:px-8 sm:py-14"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.12),transparent_36%)]" />
        <div className="relative">
          <SectionEyebrow icon={<Icons.Zap className="h-3.5 w-3.5" />}>Ready to see your shelves?</SectionEyebrow>
          <h2 className="mx-auto mt-4 max-w-[760px] text-3xl font-black tracking-[-0.065em] text-white sm:mt-5 sm:text-5xl lg:text-6xl">
            What are your shelves missing{" "}
            <span className="bg-[linear-gradient(100deg,#7657ff_0%,#2788ff_48%,#28e2f3_100%)] bg-clip-text text-transparent">
              right now?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-sm leading-7 text-white/54 sm:mt-5 sm:text-base sm:leading-8">
            Request a free ShelfLens pilot account with up to 100 bay scans for your first store.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row">
            <Button className="h-[50px] px-6 text-sm text-slate-950 sm:h-[52px] sm:px-7 sm:text-base" onClick={openRequestAccess}>
              Get early access
              <Icons.ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" className="h-[50px] px-6 text-sm sm:h-[52px] sm:px-8 sm:text-base">
              View product walkthrough
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/38 sm:mt-8 sm:gap-x-6 sm:gap-y-3 sm:text-sm">
            <span>No setup cost</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Live results in under 2 min</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Works in any store format</span>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}

export default function ShelfLensLandingPage() {
  return (
    <div
      className="relative isolate min-h-screen overflow-hidden text-white antialiased"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <AnimatedBackground />

      <header className="relative z-20">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-10 xl:px-12">
          <LogoMark />

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {nav.map((item) => (
              <a
                key={item}
                href={
                  item === "Product"
                    ? "#product-surfaces"
                    : item === "How it works"
                      ? "#how-it-works"
                      : item === "Operators"
                        ? "#operators"
                        : "#early-access"
                }
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/72 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={APP_SIGN_IN_URL}
              className="group relative isolate inline-flex min-h-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2 text-xs font-semibold whitespace-nowrap text-white/74 transition-all duration-300 hover:border-cyan-300/20 hover:bg-white/[0.06] hover:text-white max-[420px]:px-2 max-[420px]:text-[11px] sm:min-h-[48px] sm:px-5 sm:py-3 sm:text-sm"
            >
              Sign in
            </a>
            <Button className="h-11 px-4 text-xs max-[420px]:px-3 max-[420px]:text-[11px] sm:h-12 sm:px-7 sm:text-sm" onClick={openRequestAccess}>
              Get early access
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-[1480px] items-center gap-7 px-5 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-14 min-[1180px]:grid-cols-[0.72fr_1.28fr] min-[1180px]:gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:gap-14 xl:px-12">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 min-w-0 max-w-[620px] min-[1180px]:max-w-[560px] xl:max-w-[620px]"
          >
            <LiveEyebrow />

            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-[9.5ch] text-[clamp(2.75rem,13vw,4.9rem)] font-black leading-[0.97] tracking-[-0.065em] text-white sm:mt-10 min-[1180px]:text-[clamp(3.35rem,4.45vw,5.05rem)] xl:text-[clamp(4.4rem,5.15vw,5.9rem)]"
            >
              Retail compliance,
              <span className="block">
                made{" "}
                <span className="bg-[linear-gradient(100deg,#7657ff_0%,#2788ff_48%,#28e2f3_100%)] bg-clip-text text-transparent">
                  visible.
                </span>
              </span>
              <span className="block">Performance,</span>
              <span className="block">
                made{" "}
                <span className="bg-[linear-gradient(100deg,#7657ff_0%,#2788ff_44%,#28e2f3_100%)] bg-clip-text text-transparent">
                  actionable.
                </span>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-[600px] text-sm leading-7 text-white/66 sm:mt-6 sm:text-lg sm:leading-8">
              ShelfLens helps retail teams and CPG brands improve in-store execution, stay compliant, and protect shelf availability with real-time shelf intelligence.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-3 max-w-[560px] text-sm leading-6 text-cyan-100/62 sm:mt-4 sm:leading-7">
              Request a free ShelfLens pilot account with up to 100 bay scans for your first store.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Button className="h-[50px] min-h-[50px] px-6 text-sm text-slate-950 sm:h-[52px] sm:min-h-[52px] sm:px-7 sm:text-base" onClick={openRequestAccess}>
                Get early access
                <Icons.ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="h-[50px] min-h-[50px] px-6 text-sm sm:h-[52px] sm:min-h-[52px] sm:px-8 sm:text-base">
                Explore the platform
              </Button>
            </motion.div>

            <div className="mt-7 grid gap-3 min-[720px]:grid-cols-3 min-[1180px]:grid-cols-1 min-[1350px]:grid-cols-3 lg:max-w-[660px]">
              {proof.map((card) => (
                <ProofCard key={card.title} card={card} />
              ))}
            </div>
          </motion.div>

          <ShelfAnalysisMockup />
        </section>

        <ProductSurfaceSection />
        <LiveIssueLifecycleSection />
        <HowItWorksSection />
        <OperatorsSection />
        <BeforeAfterSection />
        <EarlyAccessPilotSection />
        <FinalCtaSection />
      </main>

      <RequestAccessModal />
    </div>
  );
}
