"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import "./shelflens-landing.css";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const REQUEST_ACCESS_EVENT = "shelflens:open-request-access";

function openRequestAccess() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REQUEST_ACCESS_EVENT));
}

function Icon({ children, className = "h-5 w-5" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden="true"
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
  Scan: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M7 3H5a2 2 0 0 0-2 2v2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M17 21h2a2 2 0 0 0 2-2v-2" />
      <path d="M7 12h10" />
    </Icon>
  ),
  Arrow: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Icon>
  ),
  Check: ({ className }: { className?: string }) => (
    <Icon className={className}>
      <path d="m5 12 4 4L19 6" />
    </Icon>
  ),
};

type Tone = "cyan" | "green" | "red";
type HeroCardGraphic = "bars" | "scan" | "check" | "trend" | "alert";
type HeroCard = {
  id: string;
  title: string;
  subtitle: string;
  pill: string;
  tone: Tone;
  label: string;
  value?: string;
  status?: string;
  detail: string;
  graphic: HeroCardGraphic;
  className: string;
};

const cards: HeroCard[] = [
  {
    id: "overview",
    title: "Store compliance",
    subtitle: "+5% vs last 7 days",
    pill: "Good",
    tone: "cyan",
    label: "Store compliance",
    value: "92%",
    status: "Good",
    detail: "+5% vs last 7 days",
    graphic: "bars",
    className: "sl-card-overview",
  },
  {
    id: "ai-scan",
    title: "AI Scan Active",
    subtitle: "Detecting gaps & compliance issues",
    pill: "Scanning",
    tone: "cyan",
    label: "AI Scan Active",
    detail: "Detecting gaps & compliance issues",
    graphic: "scan",
    className: "sl-card-ai",
  },
  {
    id: "coverage",
    title: "Coverage",
    subtitle: "+8% vs last scan",
    pill: "96% covered",
    tone: "green",
    label: "Coverage",
    value: "96%",
    detail: "+8% vs last scan",
    graphic: "trend",
    className: "sl-card-coverage",
  },
  {
    id: "health",
    title: "Shelf health",
    subtitle: "+8% vs last scan",
    pill: "86% health",
    tone: "green",
    label: "Shelf health",
    value: "86%",
    detail: "+8% vs last scan",
    graphic: "trend",
    className: "sl-card-health",
  },
  {
    id: "critical-shelf",
    title: "Critical shelf",
    subtitle: "Shelf 5 - Bay 6",
    pill: "3 empty zones",
    tone: "red",
    label: "Shelf 5 - Bay 6",
    value: "66.3%",
    detail: "3 empty zones",
    graphic: "alert",
    className: "sl-card-critical-shelf",
  },
  {
    id: "critical-bays",
    title: "Critical bays",
    subtitle: "Two bays require action",
    pill: "2 priority",
    tone: "red",
    label: "Critical bays",
    value: "2",
    detail: "Two bays require action",
    graphic: "alert",
    className: "sl-card-critical-bays",
  },
  {
    id: "expected",
    title: "Expected facings",
    subtitle: "Facings stocked",
    pill: "12 / 12 stocked",
    tone: "green",
    label: "Expected facings",
    value: "12 / 12",
    detail: "Facings stocked",
    graphic: "check",
    className: "sl-card-expected",
  },
];

type ExpectedZoneId = "red-bistro" | "green-bistro" | "orange-bistro" | "sainsburys-gravy";

const expectedFacingRows = [
  { id: "red-bistro", zone: "red bistro", expected: 3, facings: "3 / 3 facings stocked", missing: 0 },
  { id: "green-bistro", zone: "green bistro", expected: 3, facings: "3 / 3 facings stocked", missing: 0 },
  { id: "orange-bistro", zone: "orange bistro", expected: 3, facings: "3 / 3 facings stocked", missing: 0 },
  { id: "sainsburys-gravy", zone: "Sainsbury's gravy", expected: 3, facings: "3 / 3 facings stocked", missing: 0 },
] as const satisfies ReadonlyArray<{
  id: ExpectedZoneId;
  zone: string;
  expected: number;
  facings: string;
  missing: number;
}>;

const heroZoneOverlays = [
  { id: "red-bistro", label: "red bistro", points: "356,1468 572,1468 570,1630 374,1630" },
  { id: "green-bistro", label: "green bistro", points: "572,1468 765,1468 761,1630 570,1630" },
  { id: "orange-bistro", label: "orange bistro", points: "765,1468 965,1469 956,1630 761,1630" },
  { id: "sainsburys-gravy", label: "Sainsbury's gravy", points: "965,1469 1204,1469 1159,1630 956,1630" },
] as const;

type HeroBay = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  bayTitle: string;
  shelfLabel: string;
  statusLine: string;
  time: string;
  viewBox: string;
  defaultZoneId: string;
  expected: {
    stocked: string;
    missing: string;
    loaded: number;
  };
  rows: ReadonlyArray<{
    id: string;
    zone: string;
    expected: number;
    facings: string;
    missing: number;
  }>;
  zones: ReadonlyArray<{
    id: string;
    label: string;
    points: string;
  }>;
  cards: HeroCard[];
};

const cerealCards: HeroCard[] = [
  {
    id: "overview",
    title: "Store compliance",
    subtitle: "OK - 100.0%",
    pill: "Good",
    tone: "cyan",
    label: "Store compliance",
    value: "100%",
    status: "Good",
    detail: "OK - 100.0%",
    graphic: "bars",
    className: "sl-card-overview",
  },
  {
    id: "ai-scan",
    title: "AI Scan Active",
    subtitle: "Detecting full shelf coverage",
    pill: "Scanning",
    tone: "cyan",
    label: "AI Scan Active",
    detail: "Detecting full shelf coverage",
    graphic: "scan",
    className: "sl-card-ai",
  },
  {
    id: "coverage",
    title: "Coverage",
    subtitle: "Full coverage",
    pill: "100% covered",
    tone: "green",
    label: "Coverage",
    value: "100%",
    detail: "Full coverage",
    graphic: "trend",
    className: "sl-card-coverage",
  },
  {
    id: "health",
    title: "Shelf health",
    subtitle: "OK - 100.0%",
    pill: "100% health",
    tone: "green",
    label: "Shelf health",
    value: "100%",
    detail: "OK - 100.0%",
    graphic: "trend",
    className: "sl-card-health",
  },
  {
    id: "critical-shelf",
    title: "Critical shelf",
    subtitle: "Shelf 1 - Bay 4",
    pill: "No empty zones",
    tone: "green",
    label: "Shelf 1 - Bay 4",
    value: "0",
    detail: "No empty zones",
    graphic: "check",
    className: "sl-card-critical-shelf",
  },
  {
    id: "critical-bays",
    title: "Critical bays",
    subtitle: "No priority action",
    pill: "0 priority",
    tone: "green",
    label: "Critical bays",
    value: "0",
    detail: "No priority action",
    graphic: "check",
    className: "sl-card-critical-bays",
  },
  {
    id: "expected",
    title: "Expected facings",
    subtitle: "Facings stocked",
    pill: "5 / 5 stocked",
    tone: "green",
    label: "Expected facings",
    value: "5 / 5",
    detail: "Facings stocked",
    graphic: "check",
    className: "sl-card-expected",
  },
];

const heroBays: HeroBay[] = [
  {
    id: "bistro",
    imageSrc: "/shelflens-expected-facing.png",
    imageAlt: "ShelfLens expected-facing Inspect mockup for a Bistro shelf bay.",
    bayTitle: "Aisle 1 - Left - Bay 2",
    shelfLabel: "Shelf 2",
    statusLine: "OK - 100.0%",
    time: "12:47 PM",
    viewBox: "0 0 1449 2254",
    defaultZoneId: "red-bistro",
    expected: {
      stocked: "12 / 12",
      missing: "0",
      loaded: 4,
    },
    rows: expectedFacingRows,
    zones: heroZoneOverlays,
    cards,
  },
  {
    id: "cereal",
    imageSrc: "/shelflens-cereal-bay.png",
    imageAlt: "ShelfLens expected-facing Inspect mockup for a fully stocked Kellogg's cereal bay.",
    bayTitle: "Aisle 1 - Right - Bay 4",
    shelfLabel: "Shelf 1",
    statusLine: "OK - 100.0%",
    time: "12:47 PM",
    viewBox: "0 0 1179 1834",
    defaultZoneId: "kelloggs-fruit-n-fibre",
    expected: {
      stocked: "5 / 5",
      missing: "0",
      loaded: 4,
    },
    rows: [
      { id: "kelloggs-fruit-n-fibre", zone: "kelloggs fruit n fibre", expected: 1, facings: "1 / 1 facing stocked", missing: 0 },
      { id: "shredded-wheat", zone: "shredded wheat", expected: 1, facings: "1 / 1 facing stocked", missing: 0 },
      { id: "crunchy-nut", zone: "crunchy nut", expected: 2, facings: "2 / 2 facings stocked", missing: 0 },
      { id: "krave", zone: "krave", expected: 1, facings: "1 / 1 facing stocked", missing: 0 },
    ],
    zones: [
      { id: "kelloggs-fruit-n-fibre", label: "kelloggs fruit n fibre", points: "118,1210 318,1208 347,1476 167,1475" },
      { id: "shredded-wheat", label: "shredded wheat", points: "318,1208 491,1207 496,1476 347,1476" },
      { id: "crunchy-nut", label: "crunchy nut", points: "491,1207 843,1210 813,1476 496,1476" },
      { id: "krave", label: "krave", points: "843,1210 1062,1210 1016,1475 813,1476" },
    ],
    cards: cerealCards,
  },
];

function toneClasses(tone: Tone) {
  if (tone === "red") return "border-red-400/28 text-red-200";
  if (tone === "green") return "border-emerald-300/24 text-emerald-200";
  return "border-cyan-300/20 text-cyan-100";
}

function HeroCardGraphic({ graphic, tone }: { graphic: HeroCardGraphic; tone: Tone }) {
  if (graphic === "bars") {
    return (
      <span className="sl-card-graphic sl-card-bars" aria-hidden="true">
        {[36, 58, 46, 72].map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} />
        ))}
      </span>
    );
  }

  if (graphic === "scan") {
    return (
      <span className="sl-card-graphic sl-card-scan" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (graphic === "check") {
    return (
      <span className="sl-card-graphic sl-card-check" aria-hidden="true">
        <Icons.Check className="h-4 w-4" />
      </span>
    );
  }

  if (graphic === "alert") {
    return (
      <span className="sl-card-graphic sl-card-alert" aria-hidden="true">
        <Icon className="h-4 w-4">
          <path d="M12 7v6" />
          <path d="M12 17h.01" />
          <path d="M10.4 4.2 3.4 17a2 2 0 0 0 1.8 3h13.6a2 2 0 0 0 1.8-3l-7-12.8a1.8 1.8 0 0 0-3.2 0Z" />
        </Icon>
      </span>
    );
  }

  return (
    <span className={cn("sl-card-graphic sl-card-trend", tone === "red" && "sl-card-trend-red")} aria-hidden="true">
      <svg viewBox="0 0 52 34" fill="none">
        <path d="M5 25.5 17.5 19l9 4.5L47 8" />
        <path d="M39 8h8v8" />
      </svg>
    </span>
  );
}

function FloatingCard({
  card,
  active,
  onActivate,
}: {
  card: HeroCard;
  active: boolean;
  onActivate: () => void;
}) {

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Show ${card.title}`}
      onClick={onActivate}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "sl-opus-float absolute z-30 appearance-none overflow-hidden rounded-[22px] border bg-[#07111f]/90 text-left shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
        toneClasses(card.tone),
        active && "is-active",
        "sl-opus-analytic-card",
        `sl-card-tone-${card.tone}`,
        card.className,
      )}
    >
      <span className="sl-card-content">
        <span className="sl-card-topline">
          <span className="sl-card-title sl-card-label">{card.label}</span>
          {card.status && <span className="sl-card-status">{card.status}</span>}
        </span>

        <span className="sl-card-main">
          <span className="sl-card-metric-copy">
            {card.value ? (
              <span
                className={cn(
                  "sl-card-value",
                  card.tone === "red" && "text-red-300",
                  card.tone === "green" && "text-emerald-300",
                  card.tone === "cyan" && "text-cyan-200",
                )}
              >
                {card.value}
              </span>
            ) : (
              <span className="sl-card-copy">{card.detail}</span>
            )}
            {card.value && <span className="sl-card-detail">{card.detail}</span>}
          </span>
          <HeroCardGraphic graphic={card.graphic} tone={card.tone} />
        </span>
      </span>
    </button>
  );
}



type FlowStep = {
  id: number;
  title: string;
  body: string;
  tone: "cyan" | "red";
  icon: React.ReactNode;
};

const flowSteps: FlowStep[] = [
  {
    id: 0,
    title: "Define expected zones",
    body: "Mark the shelf areas that should stay stocked.",
    tone: "cyan",
    icon: (
      <Icon className="h-8 w-8">
        <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" />
        <rect x="14" y="14" width="6.5" height="6.5" rx="1.2" />
      </Icon>
    ),
  },
  {
    id: 1,
    title: "Scan the bay",
    body: "Store teams capture normal aisle photos.",
    tone: "cyan",
    icon: (
      <Icon className="h-8 w-8">
        <path d="M8 7.5 9.4 5h5.2L16 7.5" />
        <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
        <circle cx="12" cy="13.5" r="3.4" />
        <path d="M17.5 10.5h.01" />
      </Icon>
    ),
  },
  {
    id: 2,
    title: "Act on empty zones",
    body: "ShelfLens highlights missing stock and prioritises what needs attention.",
    tone: "red",
    icon: (
      <Icon className="h-8 w-8">
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </Icon>
    ),
  },
];

const flowSequence = [0, 1, 2];
const flowStepHoldMs = 1450;
const flowTravelMs = 850;
const flowManualHoldMs = 1800;

function getNextFlowStep(current: number) {
  const currentIndex = flowSequence.indexOf(current);
  return flowSequence[(currentIndex + 1) % flowSequence.length];
}

function ExpectedFacingsFlow() {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeStep, setActiveStep] = React.useState(0);
  const [energyStep, setEnergyStep] = React.useState(0);
  const [flowMode, setFlowMode] = React.useState<"auto" | "hover" | "hold">("auto");
  const timerRef = React.useRef<number[]>([]);
  const manual = flowMode !== "auto";

  const clearFlowTimer = React.useCallback(() => {
    timerRef.current.forEach((timer) => window.clearTimeout(timer));
    timerRef.current = [];
  }, []);

  React.useEffect(() => {
    clearFlowTimer();

    if (reduceMotion || flowMode === "hover") return;

    const nextStep = getNextFlowStep(activeStep);
    const holdMs = flowMode === "hold" ? flowManualHoldMs : flowStepHoldMs;
    const travelMs = reduceMotion ? 0 : flowTravelMs;

    const moveTimer = window.setTimeout(() => {
      setFlowMode("auto");
      setEnergyStep(nextStep);

      const arrivalTimer = window.setTimeout(() => {
        setActiveStep(nextStep);
      }, travelMs);

      timerRef.current.push(arrivalTimer);
    }, holdMs);

    timerRef.current.push(moveTimer);

    return clearFlowTimer;
  }, [activeStep, clearFlowTimer, flowMode, reduceMotion]);

  React.useEffect(() => clearFlowTimer, [clearFlowTimer]);

  const activateStep = (id: number, mode: "hover" | "hold") => {
    clearFlowTimer();
    setFlowMode(mode);
    setEnergyStep(id);
    setActiveStep(id);
  };

  const releaseHover = () => {
    setFlowMode((current) => (current === "hover" ? "auto" : current));
  };

  return (
    <section className="sl-flow-section relative isolate overflow-hidden bg-[#050b15] px-4 pb-20 pt-4 text-white sm:px-7 sm:pb-24 lg:px-9 xl:px-12">
      <div className="sl-flow-shell relative mx-auto max-w-[1480px] overflow-hidden rounded-[32px] border border-cyan-300/14 bg-[#07111f]/72 px-5 py-9 shadow-[0_30px_100px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.11),transparent_38%),radial-gradient(circle_at_90%_80%,rgba(16,185,129,0.055),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-x-[8%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.78),transparent)]" />

        <div className="relative text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/62 sm:text-[11px]">
            From shelf expectation to store action
          </div>
          <h2 className="mx-auto mt-3 max-w-[900px] text-3xl font-black tracking-[-0.055em] text-white sm:text-4xl lg:text-5xl">
            Expected facings,{' '}
            <span className="bg-[linear-gradient(100deg,#2788ff_0%,#28e2f3_55%,#5eead4_100%)] bg-clip-text text-transparent">
              made visible.
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-[650px] text-sm leading-7 text-white/48 sm:text-base">
            A clear operational path from defining shelf expectations to prioritising the zones that need attention.
          </p>
        </div>

        <div
          className="sl-flow-stage relative mt-9 sm:mt-11"
          data-active-step={activeStep}
          data-energy-step={energyStep}
          data-manual={manual ? "true" : "false"}
        >
          <div className="sl-flow-rail pointer-events-none absolute" aria-hidden="true">
            <div className="sl-flow-rail-line" />
            {!reduceMotion && <span className="sl-flow-energy" />}
          </div>

          <div className="sl-flow-grid relative z-10 grid gap-5 md:grid-cols-3 md:gap-8">
            {flowSteps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => activateStep(step.id, "hold")}
                  onMouseEnter={() => activateStep(step.id, "hover")}
                  onFocus={() => activateStep(step.id, "hover")}
                  onMouseLeave={releaseHover}
                  onBlur={releaseHover}
                  className={cn(
                    "sl-flow-card group relative flex min-h-[230px] flex-col items-center rounded-[24px] border border-white/[0.075] bg-[#06101b]/58 px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,background-color,transform,box-shadow] duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55 sm:min-h-[250px] sm:px-7 sm:py-7",
                    isActive && "is-active",
                    step.tone === "red" && "sl-flow-card-red",
                  )}
                >
                  <span className="sl-flow-number absolute left-4 top-4 grid h-7 w-7 place-items-center rounded-full border border-cyan-300/16 bg-[#020813]/72 text-[10px] font-black text-cyan-200/74">
                    {step.id + 1}
                  </span>

                  <span className={cn("sl-flow-icon-shell relative grid h-[88px] w-[88px] place-items-center rounded-[24px] border bg-[#07111f]/92", step.tone === "red" ? "text-red-300" : "text-cyan-300")}>
                    <span className="sl-flow-icon-halo absolute inset-[-14px] rounded-[30px] opacity-0 blur-xl transition-opacity duration-1000" />
                    <span className="relative">{step.icon}</span>
                  </span>

                  <h3 className="mt-5 text-lg font-black tracking-[-0.025em] text-white sm:text-xl">{step.title}</h3>
                  <p className="mt-2 max-w-[285px] text-sm leading-6 text-white/48">{step.body}</p>

                  <span className="sl-flow-status mt-auto pt-5 text-[10px] font-black uppercase tracking-[0.16em] text-white/28 transition-colors duration-700">
                    {isActive ? (step.id === 2 ? "Priority identified" : step.id === 1 ? "Bay processing" : "Expectation set") : "Ready"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


function ProductPreviewSection() {
  const reduceMotion = Boolean(useReducedMotion());
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(!reduceMotion);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    void video.play().catch(() => {
      setIsPlaying(false);
    });
  }, [reduceMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  const previewSignals = [
    ["Expected-facing zones", "Define what should be stocked.", "cyan"],
    ["Shelf health", "Review coverage after every scan.", "green"],
    ["Critical action", "Prioritise shelves that need attention.", "red"],
  ] as const;

  return (
    <section
      id="demo"
      className="relative isolate overflow-hidden bg-[#050b15] px-4 py-20 text-white sm:px-7 sm:py-24 lg:px-9 xl:px-12"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="sl-preview-grid relative mx-auto max-w-[1180px]"
      >
        <div className="sl-preview-copy">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/[0.055] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200/76 sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
            Product walkthrough
          </div>

          <h2 className="mt-5 max-w-[620px] text-3xl font-black leading-[1.04] tracking-[-0.055em] text-white sm:text-4xl lg:text-5xl">
            See ShelfLens work on a real shelf.
          </h2>

          <p className="mt-4 max-w-[560px] text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
            Watch a phone scan move from expected-facing visibility to shelf health and prioritised action.
          </p>
        </div>

        <div className="sl-preview-phone-column">
          <div className="sl-preview-phone-frame">
            <div className="sl-preview-phone-speaker" />

            <div className="sl-preview-phone-screen group/video">
              <video
                ref={videoRef}
                className="sl-preview-phone-video block"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/shelflens-expected-facing.png"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlayback}
                aria-label="ShelfLens expected-facing workflow demonstration"
              >
                <source src="/shelflens-expected-facing-demo.mp4" type="video/mp4" />
              </video>

              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause product preview" : "Play product preview"}
                className={cn(
                  "absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-100/26 bg-[#020813]/78 text-white shadow-[0_14px_44px_rgba(0,0,0,0.45),0_0_32px_rgba(34,211,238,0.18)] backdrop-blur-xl transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:h-16 sm:w-16",
                  isPlaying
                    ? "opacity-0 group-hover/video:opacity-100 group-focus-within/video:opacity-100"
                    : "opacity-100",
                )}
              >
                {isPlaying ? (
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6">
                    <path d="M9 5v14" />
                    <path d="M15 5v14" />
                  </Icon>
                ) : (
                  <Icon className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6">
                    <path d="m8 5 11 7-11 7z" />
                  </Icon>
                )}
              </button>
            </div>

          </div>
        </div>

        <div className="sl-preview-details">
          <div className="grid gap-3">
              {previewSignals.map(([title, body, tone]) => (
                <div
                  key={title}
                  className={cn(
                    "rounded-2xl border bg-[#07111f]/76 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]",
                    tone === "cyan" && "border-cyan-300/13",
                    tone === "green" && "border-emerald-300/13",
                    tone === "red" && "border-red-400/14",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        tone === "cyan" && "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.65)]",
                        tone === "green" && "bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.65)]",
                        tone === "red" && "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.62)]",
                      )}
                    />
                    <div className="text-sm font-black text-white">{title}</div>
                  </div>
                  <div className="mt-1.5 text-xs leading-5 text-white/42">{body}</div>
                </div>
              ))}
          </div>

          <div className="sl-preview-actions">
            <button
              type="button"
              onClick={openRequestAccess}
              className="group inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-cyan-100/25 bg-[linear-gradient(135deg,#6f55ff_0%,#3b82f6_46%,#20d5ef_100%)] px-6 py-3 text-sm font-black text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.24),inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:-translate-y-0.5 sm:w-auto"
            >
              Request pilot
              <Icons.Arrow className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}


const heroHeadlineWords = ["fix.", "restock.", "review.", "prioritise."] as const;
const HERO_WORD_VISIBLE_MS = 2200;
const HERO_WORD_LOCK_MS = 300;
const HERO_WORD_SNAP_MS = 90;
const HERO_WORD_SCAN_MS = 450;
const HERO_WORD_SWAP_MS = 180;
const HERO_WORD_CONFIRM_MS = 300;
type HeroWordPhase = "idle" | "locking" | "snap" | "scanning" | "confirming";

function AnimatedHeroWord({ reduceMotion }: { reduceMotion: boolean }) {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<HeroWordPhase>("idle");

  React.useEffect(() => {
    if (reduceMotion) {
      setWordIndex(heroHeadlineWords.length - 1);
      setPhase("idle");
      return;
    }

    const timers: number[] = [];
    let cancelled = false;

    const queue = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
    };

    const runCycle = () => {
      if (cancelled) return;

      setPhase("idle");
      queue(() => setPhase("locking"), HERO_WORD_VISIBLE_MS);
      queue(() => setPhase("snap"), HERO_WORD_VISIBLE_MS + HERO_WORD_LOCK_MS);
      queue(() => setPhase("scanning"), HERO_WORD_VISIBLE_MS + HERO_WORD_LOCK_MS + HERO_WORD_SNAP_MS);
      queue(
        () => setWordIndex((current) => (current + 1) % heroHeadlineWords.length),
        HERO_WORD_VISIBLE_MS + HERO_WORD_LOCK_MS + HERO_WORD_SNAP_MS + HERO_WORD_SWAP_MS,
      );
      queue(
        () => setPhase("confirming"),
        HERO_WORD_VISIBLE_MS + HERO_WORD_LOCK_MS + HERO_WORD_SNAP_MS + HERO_WORD_SCAN_MS,
      );
      queue(
        runCycle,
        HERO_WORD_VISIBLE_MS + HERO_WORD_LOCK_MS + HERO_WORD_SNAP_MS + HERO_WORD_SCAN_MS + HERO_WORD_CONFIRM_MS,
      );
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return <span className="sl-hero-word-static">prioritise.</span>;
  }

  return (
    <span className={cn("sl-hero-word-shell", `is-${phase}`)} aria-hidden="true">
      <span className="sl-hero-word-target">
        <span className="sl-hero-word-corners" aria-hidden="true">
          <span className="sl-hero-word-corner sl-hero-word-corner-tl" />
          <span className="sl-hero-word-corner sl-hero-word-corner-tr" />
          <span className="sl-hero-word-corner sl-hero-word-corner-bl" />
          <span className="sl-hero-word-corner sl-hero-word-corner-br" />
        </span>
        <span className="sl-hero-word-scan" aria-hidden="true" />
        <span className="sl-hero-word-status" aria-hidden="true" />
        <span className="sl-hero-word-stack">
          <span className="sl-hero-word is-active">{heroHeadlineWords[wordIndex]}</span>
        </span>
      </span>
    </span>
  );
}


function ShelfLensHeroStage() {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeBayIndex, setActiveBayIndex] = React.useState(0);
  const [activeId, setActiveId] = React.useState("expected");
  const [selectedZoneId, setSelectedZoneId] = React.useState(heroBays[0].defaultZoneId);
  const [hoveredZoneId, setHoveredZoneId] = React.useState<string | null>(null);
  const activeBay = heroBays[activeBayIndex];
  const activeCards = activeBay.cards;
  const activeCard = activeCards.find((card) => card.id === activeId) ?? activeCards[5];
  const displayedZoneId = hoveredZoneId ?? selectedZoneId;
  const showBay = (direction: -1 | 1) => {
    const nextIndex = (activeBayIndex + direction + heroBays.length) % heroBays.length;
    const nextBay = heroBays[nextIndex];

    setActiveBayIndex(nextIndex);
    setSelectedZoneId(nextBay.defaultZoneId);
    setHoveredZoneId(null);
  };

  return (
    <section className="sl-opus-hero relative isolate overflow-hidden bg-[#050b15] px-4 pb-16 pt-2 text-white sm:px-7 lg:px-9 xl:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_12%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_18%_62%,rgba(99,102,241,0.14),transparent_34%),linear-gradient(180deg,#060d1a_0%,#050b15_55%,#020713_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.10] [background-image:radial-gradient(circle,rgba(255,255,255,0.55)_0.7px,transparent_0.8px)] [background-size:5px_5px]" />

      <header className="sl-opus-header mx-auto flex max-w-[1480px] items-center justify-between py-4 sm:py-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[17px] border border-cyan-300/40 bg-cyan-300/[0.055] text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.14)]">
            <Icons.Store className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-black uppercase tracking-[0.12em]">ShelfLens</div>
            <div className="hidden text-sm text-white/56 sm:block">Retail shelf intelligence</div>
          </div>
        </div>
        <button
          type="button"
          onClick={openRequestAccess}
          className="rounded-2xl border border-cyan-100/25 bg-[linear-gradient(135deg,#6f55ff_0%,#3b82f6_46%,#20d5ef_100%)] px-4 py-3 text-xs font-black text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.26),inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:-translate-y-0.5 sm:px-5 sm:text-sm"
        >
          Request pilot
        </button>
      </header>

      <div className="sl-opus-grid mx-auto grid max-w-[1480px] items-center pt-6 sm:pt-8">
        <div className="relative z-20 max-w-[740px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.62 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/[0.055] px-3 py-2 text-[9px] font-black uppercase tracking-[0.17em] text-cyan-200/86 sm:px-4 sm:text-[11px] sm:tracking-[0.22em]"
          >
            <Icons.Scan className="h-3.5 w-3.5" /> Phone-based shelf visibility
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.76, delay: reduceMotion ? 0 : 0.06 }}
            aria-label="Scan every aisle. Know what to prioritise."
            className="sl-opus-heading mt-6 max-w-[780px] font-black leading-[0.92] tracking-[-0.075em] text-white"
          >
            <span className="sl-hero-headline-visual" aria-hidden="true">
              <span className="sl-hero-headline-line">Scan every aisle.</span>
              <span className="sl-hero-headline-line sl-hero-headline-lock">
                <span>Know what to</span>
                <AnimatedHeroWord reduceMotion={reduceMotion} />
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.13 }}
            className="mt-5 max-w-[640px] text-base leading-7 text-white/62 sm:mt-6 sm:text-lg sm:leading-8"
          >
            Scan shelves with a phone. ShelfLens detects empty expected-facing zones, compliance issues and critical shelves&mdash;so teams know exactly where to act.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.18 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={openRequestAccess}
              className="group inline-flex min-h-12 items-center justify-center rounded-2xl border border-cyan-100/25 bg-[linear-gradient(135deg,#6f55ff_0%,#3b82f6_46%,#20d5ef_100%)] px-6 py-3 text-sm font-black text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.26),inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:-translate-y-0.5"
            >
              Request pilot <Icons.Arrow className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#demo"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.035] px-6 py-3 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.065]"
            >
              Watch demo
            </a>
          </motion.div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-white/50 sm:mt-8 sm:text-sm">
            {["Expected zones", "Gap detection", "Store visibility"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-cyan-300/18 bg-cyan-300/[0.055] text-cyan-300">
                  <Icons.Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="sl-opus-stage relative mx-auto w-full overflow-visible">
          {!reduceMotion && <div className="sl-opus-orbit pointer-events-none absolute inset-[-6%] rounded-[50px]" />}

          {activeCards.map((card) => (
            <FloatingCard
              key={card.id}
              card={card}
              active={activeId === card.id}
              onActivate={() => setActiveId(card.id)}
            />
          ))}

          <button
            type="button"
            aria-label="Previous bay"
            className="sl-bay-nav sl-bay-nav-prev"
            onClick={() => showBay(-1)}
          >
            <Icons.Arrow className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next bay"
            className="sl-bay-nav sl-bay-nav-next"
            onClick={() => showBay(1)}
          >
            <Icons.Arrow className="h-4 w-4" />
          </button>

          <div className="sl-opus-phone-mockup" aria-hidden="true">
            <img src="/shelflens-gap-detection.png" alt="" />
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.84, delay: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="sl-opus-main-frame relative z-20 mx-auto rounded-[34px] border border-cyan-300/18 bg-[#06101b]/82 p-3 shadow-[0_42px_150px_rgba(0,0,0,0.56),0_0_95px_rgba(34,211,238,0.12)] backdrop-blur-2xl"
          >
            <div className="absolute -inset-10 -z-10 rounded-[54px] bg-[radial-gradient(circle_at_48%_30%,rgba(34,211,238,0.20),transparent_42%),radial-gradient(circle_at_76%_74%,rgba(16,185,129,0.12),transparent_40%)] blur-2xl" />
            <div className="flex items-center justify-between border-b border-white/8 px-3 pb-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
              </div>
              <div className="rounded-full border border-emerald-300/18 bg-emerald-400/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
                Live inspect
              </div>
            </div>

            <div className="sl-opus-screen relative mt-3 overflow-hidden rounded-[24px] border border-white/10 bg-black">
              <motion.img
                key={activeBay.id}
                src={activeBay.imageSrc}
                alt={`${activeBay.bayTitle}. ${activeBay.shelfLabel} ${activeBay.statusLine}. ${activeBay.imageAlt}`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.34, ease: "easeOut" }}
                className="sl-opus-video sl-opus-hero-screen"
              />

              <motion.svg
                key={`${activeBay.id}-zones`}
                className={cn("sl-hero-zone-overlay", `sl-hero-zone-overlay-${activeBay.id}`)}
                viewBox={activeBay.viewBox}
                preserveAspectRatio="none"
                role="group"
                aria-label="Shelf expected-facing zones"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.34, ease: "easeOut" }}
              >
                {activeBay.zones.map((zone) => (
                  <g
                    key={zone.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${zone.label} zone`}
                    aria-pressed={selectedZoneId === zone.id}
                    className="sl-hero-zone-control"
                    onClick={() => setSelectedZoneId(zone.id)}
                    onFocus={() => setHoveredZoneId(zone.id)}
                    onBlur={() => setHoveredZoneId(null)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedZoneId(zone.id);
                      }
                    }}
                  >
                    <polygon points={zone.points} className="sl-hero-zone-hit" />
                    <polygon
                      points={zone.points}
                      className={cn("sl-hero-zone", zone.id === displayedZoneId && "is-selected")}
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                    />
                  </g>
                ))}
              </motion.svg>

              <motion.div
                key={activeCard.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
                className="sl-opus-status pointer-events-none absolute inset-x-4 bottom-4 rounded-[22px] border border-white/12 bg-[#06101b]/89 p-4 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-white">{activeCard.title}</div>
                    <div className="mt-1 truncate text-xs text-white/48">
                      {activeCard.subtitle}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-black",
                      activeCard.tone === "red" && "border-red-400/28 bg-red-500/[0.12] text-red-100",
                      activeCard.tone === "green" && "border-emerald-300/24 bg-emerald-400/[0.10] text-emerald-100",
                      activeCard.tone === "cyan" && "border-cyan-300/24 bg-cyan-300/[0.09] text-cyan-100",
                    )}
                  >
                    {activeCard.pill}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="sl-opus-expected-panel" role="group" aria-label="Expected facing zone selection">
              <div className="sl-opus-expected-titlebar">
                <span>Expected facings</span>
                <span>{activeBay.time}</span>
              </div>

              <motion.div
                key={`${activeBay.id}-expected-panel`}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: "easeOut" }}
              >
                <div className="sl-opus-expected-panel-top">
                  <div className="sl-opus-expected-pill sl-opus-expected-pill-primary">
                    <span>{activeBay.expected.stocked}</span>
                    <small>facings stocked</small>
                  </div>
                  <div className="sl-opus-expected-pill">
                    <span>{activeBay.expected.missing}</span>
                    <small>Missing</small>
                  </div>
                </div>

                <div className="sl-opus-expected-loaded">Expected zones loaded: {activeBay.expected.loaded}</div>

                <div className="sl-opus-expected-rows">
                  {activeBay.rows.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      aria-pressed={selectedZoneId === row.id}
                      className={cn("sl-opus-expected-row", displayedZoneId === row.id && "is-selected")}
                      onClick={() => setSelectedZoneId(row.id)}
                      onFocus={() => setHoveredZoneId(row.id)}
                      onBlur={() => setHoveredZoneId(null)}
                      onMouseEnter={() => setHoveredZoneId(row.id)}
                      onMouseLeave={() => setHoveredZoneId(null)}
                    >
                      <div className="sl-opus-expected-row-head">
                        <span>{row.zone}</span>
                        <span className="sl-opus-expected-stocked">Stocked</span>
                      </div>
                      <div className="sl-opus-expected-row-meta">
                        <span>Expected {row.expected}</span>
                        <span>{row.facings}</span>
                        <span>Missing {row.missing}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
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
  "Expected-facing compliance",
  "Staff visibility",
  "Multi-store monitoring",
  "Other",
];

const requestAccessInputClass =
  "min-h-[52px] w-full min-w-0 rounded-2xl border border-cyan-400/20 bg-slate-950/72 px-4 py-3 text-[15px] font-semibold leading-6 text-white outline-none transition duration-200 placeholder:text-slate-500 hover:border-cyan-300/35 hover:bg-slate-950/84 focus:border-cyan-300/70 focus:bg-slate-950/90 focus:ring-2 focus:ring-cyan-300/20";

function RequestAccessLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-2.5 block text-xs font-black uppercase leading-none tracking-[0.16em] text-cyan-100/76">
      {children}
      {required && <span className="ml-1 text-cyan-200">*</span>}
    </span>
  );
}

function RequestAccessModal() {
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [form, setForm] = React.useState<RequestAccessFormState>(requestAccessInitialForm);
  const [submitState, setSubmitState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const firstInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setMounted(true);

    const handleOpen = () => {
      setIsOpen(true);
      setSubmitState("idle");
      setErrorMessage("");
      window.setTimeout(() => firstInputRef.current?.focus(), 80);
    };

    window.addEventListener(REQUEST_ACCESS_EVENT, handleOpen);
    return () => window.removeEventListener(REQUEST_ACCESS_EVENT, handleOpen);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && submitState !== "loading") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
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
    if (submitState !== "loading") setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (requestAccessRequiredFields.some((field) => !form[field].trim())) {
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
      className="fixed inset-0 z-[10000] overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.14),transparent_36%),rgba(2,7,19,0.90)] px-3 py-5 backdrop-blur-2xl sm:px-6 sm:py-8"
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
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-[780px] overflow-hidden rounded-[30px] border border-cyan-400/20 bg-slate-950/92 p-5 shadow-[0_34px_130px_rgba(0,0,0,0.64),0_0_90px_rgba(34,211,238,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_90%_16%,rgba(99,102,241,0.12),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-x-[-20%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.88),rgba(16,185,129,0.48),transparent)]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/[0.055] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200/86">
                Request pilot
              </div>
              <h2 id="request-access-title" className="mt-4 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
                Tell us about your store.
              </h2>
              <p className="mt-3 max-w-[620px] text-sm leading-6 text-white/54 sm:text-base sm:leading-7">
                Share the shelf visibility problem you want ShelfLens to help with. We will review your details and follow up directly.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close request pilot form"
              onClick={closeModal}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/[0.035] text-white/70 transition hover:border-cyan-300/28 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
            >
              <Icon className="h-4 w-4">
                <path d="m6 6 12 12" />
                <path d="M18 6 6 18" />
              </Icon>
            </button>
          </div>

          {submitState === "success" ? (
            <div className="mt-7 rounded-[24px] border border-emerald-300/24 bg-emerald-400/[0.075] p-5 shadow-[0_0_48px_rgba(16,185,129,0.10)]">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-300/24 bg-emerald-400/[0.12] text-emerald-200">
                  <Icons.Check className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-lg font-black text-white">Request received</div>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/72">
                    We will review your store details and follow up with access information.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl border border-cyan-100/25 bg-[linear-gradient(135deg,#6f55ff_0%,#3b82f6_46%,#20d5ef_100%)] px-6 py-3 text-sm font-black text-slate-950"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-7 grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block min-w-0">
                  <RequestAccessLabel required>Full name</RequestAccessLabel>
                  <input ref={firstInputRef} name="fullName" autoComplete="name" required value={form.fullName} placeholder="Your name" onChange={(event) => updateField("fullName", event.target.value)} className={requestAccessInputClass} />
                </label>
                <label className="block min-w-0">
                  <RequestAccessLabel required>Email</RequestAccessLabel>
                  <input name="email" type="email" autoComplete="email" required value={form.email} placeholder="you@store.co.uk" onChange={(event) => updateField("email", event.target.value)} className={requestAccessInputClass} />
                </label>
                <label className="block min-w-0">
                  <RequestAccessLabel required>Phone number</RequestAccessLabel>
                  <input name="phoneNumber" type="tel" autoComplete="tel" required value={form.phoneNumber} placeholder="+44 7000 000000" onChange={(event) => updateField("phoneNumber", event.target.value)} className={requestAccessInputClass} />
                </label>
                <label className="block min-w-0">
                  <RequestAccessLabel required>Store / business name</RequestAccessLabel>
                  <input name="businessName" autoComplete="organization" required value={form.businessName} placeholder="Store or group name" onChange={(event) => updateField("businessName", event.target.value)} className={requestAccessInputClass} />
                </label>
                <label className="block min-w-0">
                  <RequestAccessLabel required>Number of stores</RequestAccessLabel>
                  <input name="storeCount" inputMode="numeric" required value={form.storeCount} placeholder="1, 5, 20..." onChange={(event) => updateField("storeCount", event.target.value)} className={requestAccessInputClass} />
                </label>
                <label className="block min-w-0">
                  <RequestAccessLabel required>Location / city</RequestAccessLabel>
                  <input name="location" autoComplete="address-level2" required value={form.location} placeholder="London, Manchester..." onChange={(event) => updateField("location", event.target.value)} className={requestAccessInputClass} />
                </label>
              </div>

              <label className="block min-w-0">
                <RequestAccessLabel required>Current issue</RequestAccessLabel>
                <select name="currentIssue" required value={form.currentIssue} onChange={(event) => updateField("currentIssue", event.target.value)} className={cn(requestAccessInputClass, "appearance-none", form.currentIssue ? "text-white" : "text-slate-500")}>
                  <option value="" className="bg-slate-950 text-slate-400">Choose the closest issue</option>
                  {requestAccessIssueOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-950 text-white">{option}</option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0">
                <RequestAccessLabel>Message / notes</RequestAccessLabel>
                <textarea name="message" rows={4} value={form.message} placeholder="Tell us what shelf gaps, locations, or store workflows you want to monitor." onChange={(event) => updateField("message", event.target.value)} className={cn(requestAccessInputClass, "min-h-[128px] resize-y")} />
              </label>

              {submitState === "error" && (
                <div role="alert" className="rounded-2xl border border-red-400/28 bg-red-500/[0.085] px-4 py-3 text-sm font-semibold leading-6 text-red-100">
                  {errorMessage || "Something went wrong. Please try again."}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="group inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-cyan-100/25 bg-[linear-gradient(135deg,#6f55ff_0%,#3b82f6_46%,#20d5ef_100%)] px-7 py-3 text-sm font-black text-slate-950 shadow-[0_18px_48px_rgba(34,211,238,0.28),inset_0_1px_0_rgba(255,255,255,0.42)] transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-55"
                >
                  {submitState === "loading" ? "Sending request..." : "Request pilot"}
                  {submitState !== "loading" && <Icons.Arrow className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>
                <p className="text-xs leading-5 text-white/38">Your details are sent securely through the ShelfLens server.</p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

export default function ShelfLensLandingPage() {
  return (
    <div className="sl-landing-root">
      <ShelfLensHeroStage />
      <ExpectedFacingsFlow />
      <ProductPreviewSection />
      <RequestAccessModal />
    </div>
  );
}
