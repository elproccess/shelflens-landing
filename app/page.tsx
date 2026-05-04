"use client";

import React from "react";
import { motion } from "framer-motion";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const shelfEase = [0.22, 1, 0.36, 1] as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

function Button({ children, className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
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

const nav = ["Capabilities", "Product", "How it works", "Pricing", "Resources"];

const proof = [
  {
    icon: Icons.Bars,
    title: "Real-time visibility",
    body: "Across stores and shelves",
  },
  {
    icon: Icons.ShieldCheck,
    title: "AI-powered insights",
    body: "Detect issues before they impact sales",
  },
  {
    icon: Icons.Zap,
    title: "Action-driven",
    body: "Prioritise, fix, and measure impact",
  },
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
        className="absolute bottom-[5rem] left-[-7rem] h-[15rem] w-[88rem] opacity-35"
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
          compact ? "h-10 w-10" : "h-12 w-12",
        )}
      >
        <div className="absolute inset-1 rounded-[14px] border border-cyan-300/10" />
        <Icons.Store className="h-5 w-5 text-cyan-300" />
      </div>
      <div>
        <div className="text-base font-black uppercase leading-none tracking-[0.11em] text-white">ShelfLens</div>
        <div className="mt-1 text-sm text-white/68">Retail Shelf Intelligence</div>
      </div>
    </div>
  );
}

function LiveEyebrow() {
  return (
    <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/24 bg-blue-400/[0.055] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200 shadow-[0_0_34px_rgba(59,130,246,0.12)] sm:text-xs">
        <Icons.Sparkles className="h-3.5 w-3.5" />
        AI-powered shelf intelligence
      </div>

      <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-300/24 bg-emerald-400/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200 shadow-[0_0_28px_rgba(16,185,129,0.13)]">
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
        Live shelf scan active
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
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#07111f]/84 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-4">
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
        <span className="block text-[10px] uppercase tracking-[0.12em] text-white/45 sm:text-[11px]">{label}</span>
        <span className="block text-sm font-semibold leading-tight text-white sm:text-base">{value}</span>
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

function HudTooltip({
  tone,
  title,
  metric,
  body,
  rows,
  className,
}: {
  tone: "green" | "red";
  title: string;
  metric: string;
  body: string;
  rows: Array<[string, string]>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-40 w-[218px] translate-y-3 scale-[0.96] rounded-2xl border bg-[#03101c]/96 p-3 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300",
        tone === "green" && "border-emerald-300/55 shadow-[0_0_34px_rgba(16,185,129,0.24)]",
        tone === "red" && "border-red-400/60 shadow-[0_0_34px_rgba(239,68,68,0.24)]",
        className,
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

      <div className="mt-2 text-xl font-black tracking-[-0.04em] text-white">{metric}</div>
      <div className="mt-1 text-xs leading-5 text-white/64">{body}</div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.045] px-2.5 py-2">
            <div className="text-[9px] uppercase tracking-[0.14em] text-white/38">{label}</div>
            <div className="mt-1 text-xs font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
        <span className="h-px flex-1 bg-cyan-200/20" />
        ShelfLens HUD
        <span className="h-px flex-1 bg-cyan-200/20" />
      </div>
    </div>
  );
}

function HudCorners({ tone }: { tone: "green" | "red" }) {
  return (
    <>
      <span
        className={cn(
          "absolute left-[-6px] top-[-6px] h-5 w-5 border-l-2 border-t-2 opacity-0 transition-opacity duration-300",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute right-[-6px] top-[-6px] h-5 w-5 border-r-2 border-t-2 opacity-0 transition-opacity duration-300",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute bottom-[-6px] left-[-6px] h-5 w-5 border-b-2 border-l-2 opacity-0 transition-opacity duration-300",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute bottom-[-6px] right-[-6px] h-5 w-5 border-b-2 border-r-2 opacity-0 transition-opacity duration-300",
          tone === "green" ? "border-emerald-300 group-hover/shelf:opacity-100" : "border-red-400 group-hover/gap:opacity-100",
        )}
      />
    </>
  );
}

function ShelfAnalysisMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: shelfEase, delay: 0.08 }}
      className="relative mx-auto w-full max-w-[820px] lg:max-w-[900px] xl:max-w-[940px]"
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
            <div className="mb-4 grid min-w-0 gap-4">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cyan-300/32 bg-cyan-300/8 text-cyan-300">
                    <Icons.Store className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-white sm:text-lg">Store 014 • Cereal Aisle</div>
                    <div className="mt-0.5 text-xs text-white/48">Captured 2m ago</div>
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-emerald-300/18 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-200 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                  Processing live
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-2 min-[520px]:grid-cols-3">
                <TopMetric label="Compliance" value="82%" tone="green" />
                <TopMetric label="OOS" value="2" tone="red" />
                <TopMetric label="Shelf Severity" value="High" tone="red" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[20px] border border-white/12 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <img
                src="/shelflens-cereal-aisle.png"
                alt="ShelfLens cereal aisle analysis showing shelf compliance and out of stock gaps"
                className="block aspect-[0.82] w-full object-cover min-[520px]:aspect-[1.04] min-[820px]:aspect-[0.92]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,13,24,0.02),rgba(5,13,24,0.22))]" />

              <div
                data-overlay="shelf-2-compliant-full-width"
                className="group/shelf absolute cursor-crosshair rounded-xl border-2 border-emerald-400/95 bg-emerald-400/[0.045] shadow-[0_0_0_1px_rgba(16,185,129,0.28),0_0_24px_rgba(16,185,129,0.38)] transition-all duration-300 hover:bg-emerald-400/[0.075] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.5),0_0_42px_rgba(16,185,129,0.58)]"
                style={{ left: "8.2%", right: "4.2%", top: "21.2%", height: "25.5%" }}
              >
                <HudCorners tone="green" />
                <div className="absolute left-0 top-1/2 h-px w-full origin-left scale-x-0 bg-emerald-300/80 shadow-[0_0_14px_rgba(52,211,153,0.8)] transition-transform duration-500 group-hover/shelf:scale-x-100" />
                <HudTooltip
                  tone="green"
                  title="Compliant shelf"
                  metric="82% Coverage"
                  body="Shelf 2 is aligned with expected facing coverage. No urgent refill action required."
                  rows={[
                    ["Shelf", "02"],
                    ["Status", "Pass"],
                    ["Risk", "Low"],
                    ["Action", "Monitor"],
                  ]}
                  className="right-3 top-3 group-hover/shelf:translate-y-0 group-hover/shelf:scale-100 group-hover/shelf:opacity-100"
                />
              </div>

              <div className="absolute left-[6%] right-[8%] top-[29.6%] h-px bg-emerald-300/45" />
              <div className="absolute left-[6%] right-[8%] top-[45.0%] h-px bg-emerald-300/36" />

              <div
                data-overlay="shelf-4-oos-gap-left"
                className="group/gap absolute cursor-crosshair rounded-lg border-2 border-red-500 bg-red-500/[0.05] shadow-[0_0_22px_rgba(239,68,68,0.34)] transition-all duration-300 hover:bg-red-500/[0.08] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.42),0_0_42px_rgba(239,68,68,0.55)]"
                style={{ left: "20.2%", top: "67.4%", width: "14.2%", height: "14.5%" }}
              >
                <HudCorners tone="red" />
                <div className="absolute left-0 top-1/2 h-px w-[260%] origin-left scale-x-0 bg-red-400/90 shadow-[0_0_14px_rgba(248,113,113,0.9)] transition-transform duration-500 group-hover/gap:scale-x-100" />
                <HudTooltip
                  tone="red"
                  title="OOS gap"
                  metric="High severity"
                  body="Detected empty shelf space in Shelf 4. Prioritise restock or facing correction."
                  rows={[
                    ["Shelf", "04"],
                    ["Gap", "Left"],
                    ["Width", "14.2%"],
                    ["Action", "Restock"],
                  ]}
                  className="left-[105%] top-[-34px] group-hover/gap:translate-y-0 group-hover/gap:scale-100 group-hover/gap:opacity-100"
                />
              </div>

              <div
                data-overlay="shelf-4-oos-gap-right"
                className="group/gap absolute cursor-crosshair rounded-lg border-2 border-red-500 bg-red-500/[0.05] shadow-[0_0_22px_rgba(239,68,68,0.34)] transition-all duration-300 hover:bg-red-500/[0.08] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.42),0_0_42px_rgba(239,68,68,0.55)]"
                style={{ left: "46.6%", top: "67.4%", width: "14.0%", height: "14.5%" }}
              >
                <HudCorners tone="red" />
                <div className="absolute right-0 top-1/2 h-px w-[220%] origin-right scale-x-0 bg-red-400/90 shadow-[0_0_14px_rgba(248,113,113,0.9)] transition-transform duration-500 group-hover/gap:scale-x-100" />
                <HudTooltip
                  tone="red"
                  title="OOS gap"
                  metric="High severity"
                  body="Second gap detected on the same shelf. This indicates a wider execution issue."
                  rows={[
                    ["Shelf", "04"],
                    ["Gap", "Right"],
                    ["Width", "14.0%"],
                    ["Action", "Verify"],
                  ]}
                  className="right-[105%] top-[-34px] group-hover/gap:translate-y-0 group-hover/gap:scale-100 group-hover/gap:opacity-100"
                />
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute hidden min-[820px]:block"
                style={{
                  left: "55%",
                  top: "34.8%",
                  width: "37%",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, rgba(52,211,153,0.0), rgba(52,211,153,0.95) 58%, rgba(52,211,153,0.95))",
                  boxShadow: "0 0 14px rgba(52,211,153,0.42)",
                  transform: "rotate(-9deg)",
                  transformOrigin: "left center",
                }}
              />

              <div className="pointer-events-none absolute right-3 top-[34.7%] hidden w-[128px] rounded-xl border border-emerald-400 bg-[#06101b]/94 px-3 py-2 shadow-[0_0_28px_rgba(16,185,129,0.25)] min-[820px]:block">
                <div className="text-sm font-bold text-emerald-300">Shelf 2</div>
                <div className="mt-1 text-xs leading-5 text-white">Shelf fully compliant</div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute hidden min-[820px]:block"
                style={{
                  left: "33%",
                  top: "75.8%",
                  width: "50%",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, rgba(239,68,68,0.0), rgba(239,68,68,0.95) 22%, rgba(239,68,68,0.95) 72%, rgba(239,68,68,0.16))",
                  boxShadow: "0 0 14px rgba(239,68,68,0.42)",
                  transform: "rotate(-5deg)",
                  transformOrigin: "left center",
                }}
              />

              <div className="pointer-events-none absolute right-3 top-[72.0%] hidden w-[136px] rounded-xl border border-red-500 bg-[#10080b]/96 px-3 py-2 shadow-[0_0_28px_rgba(239,68,68,0.25)] min-[820px]:block">
                <div className="text-sm font-bold text-red-400">OOS Detected</div>
                <div className="mt-1 text-xs leading-5 text-red-100">in Shelf 4</div>
                <div className="mt-2 text-xs font-medium text-red-400">High severity</div>
              </div>

              <div className="absolute inset-x-3 bottom-3 grid grid-cols-1 gap-2 min-[520px]:grid-cols-2 min-[820px]:hidden">
                <div className="rounded-xl border border-emerald-400 bg-[#06101b]/92 px-3 py-2 shadow-[0_0_24px_rgba(16,185,129,0.18)]">
                  <div className="text-xs font-bold text-emerald-300">Shelf 2</div>
                  <div className="text-[11px] text-white/82">Shelf fully compliant</div>
                </div>
                <div className="rounded-xl border border-red-500 bg-[#10080b]/94 px-3 py-2 shadow-[0_0_24px_rgba(239,68,68,0.18)]">
                  <div className="text-xs font-bold text-red-400">OOS Detected</div>
                  <div className="text-[11px] text-red-100">in Shelf 4 · High severity</div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-[#07111f]/78 p-3 text-xs text-white/70 sm:flex sm:flex-wrap sm:items-center sm:gap-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-500" />
                OOS
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-500" />
                Compliance Issue
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

          <aside className="min-w-0 rounded-[22px] border border-white/10 bg-[#07111f]/76 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] min-[820px]:mt-[72px]">
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

              <OverviewCard title="Out of Stock (OOS)">
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

              <OverviewCard title="Gaps">
                <div className="mt-1 text-xs text-white/48">Detected shelf gaps</div>
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
      className="group flex min-w-0 items-start gap-4 rounded-2xl border border-white/0 p-2 transition duration-300 hover:border-white/10 hover:bg-white/[0.035]"
    >
      <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-cyan-300/22 bg-[#07111f]/78 text-cyan-300 shadow-[0_0_34px_rgba(34,211,238,0.14)] transition duration-300 group-hover:border-cyan-200/36 group-hover:bg-cyan-300/[0.09]">
        <CardIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 pt-1">
        <div className="text-sm font-semibold leading-5 text-white">{card.title}</div>
        <div className="mt-1 text-xs leading-5 text-white/55">{card.body}</div>
      </div>
    </motion.div>
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
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
          <LogoMark />

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {nav.map((item) => (
              <a
                key={item}
                href="#"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/72 transition hover:text-white"
              >
                {item}
                {item === "Resources" && (
                  <Icons.ChevronDown className="h-3.5 w-3.5 text-white/42 transition group-hover:text-white/80" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button className="h-12 px-5 sm:px-7">Book a demo</Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-[1480px] items-center gap-10 px-5 pb-14 pt-10 sm:px-8 sm:pb-[4.5rem] lg:px-10 lg:pb-24 lg:pt-16 min-[1180px]:grid-cols-[0.72fr_1.28fr] min-[1180px]:gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:gap-14 xl:px-12">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 min-w-0 max-w-[620px] min-[1180px]:max-w-[560px] xl:max-w-[620px]"
          >
            <LiveEyebrow />

            <motion.h1
              variants={fadeUp}
              className="mt-8 max-w-[9.5ch] text-[clamp(3rem,10vw,5.3rem)] font-black leading-[0.97] tracking-[-0.065em] text-white sm:mt-10 min-[1180px]:text-[clamp(3.35rem,4.45vw,5.05rem)] xl:text-[clamp(4.4rem,5.15vw,5.9rem)]"
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

            <motion.p variants={fadeUp} className="mt-6 max-w-[600px] text-base leading-8 text-white/66 sm:text-lg">
              ShelfLens helps retail teams and CPG brands boost in-store execution, stay compliant, and drive revenue with real-time shelf intelligence.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="h-[52px] min-h-[52px] px-7 text-base text-slate-950">
                Book a demo
                <Icons.ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="h-[52px] min-h-[52px] px-8 text-base">
                Explore the platform
              </Button>
            </motion.div>

            <div className="mt-10 grid gap-5 min-[720px]:grid-cols-3 min-[1180px]:grid-cols-1 min-[1350px]:grid-cols-3 lg:max-w-[660px]">
              {proof.map((card) => (
                <ProofCard key={card.title} card={card} />
              ))}
            </div>
          </motion.div>

          <ShelfAnalysisMockup />
        </section>

        <section className="mx-auto max-w-[1480px] px-5 pb-16 sm:px-8 lg:px-10 xl:px-12">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl sm:p-6 lg:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(34,211,238,0.10),transparent_32%),radial-gradient(circle_at_84%_70%,rgba(16,185,129,0.08),transparent_35%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/[0.055] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/78">
                  <Icons.Scan className="h-3.5 w-3.5" />
                  Built for multi-store retail operators
                </div>
                <h2 className="mt-4 max-w-[680px] text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                  Operational shelf intelligence without fake social proof.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Capture", "Upload aisle and bay sessions"],
                  ["Detect", "Find OOS, gaps, and shelf severity"],
                  ["Act", "Prioritise the shelves that need attention"],
                ].map(([title, body], index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, ease: shelfEase, delay: index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-[#07111f]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  >
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="mt-1 text-sm leading-6 text-white/52">{body}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}