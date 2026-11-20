import React, { useEffect, useMemo, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  Captions,
  MessageSquare,
  PanelRight,
  Users,
  HelpCircle,
  BarChart3,
  PhoneOff,
  Pin,
  X,
  Radio,
  Clock3,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  MoreHorizontal,
  ChevronDown,
  Send,
  ThumbsUp,
  MoreVertical,
  Sparkles,
} from "lucide-react";

/* =========================================================
   LIGHT THEME
========================================================= */

const THEME = {
  page: "#F6F8FB",
  surface: "#FFFFFF",
  surface2: "#F9FAFC",
  border: "#E4E9EF",
  primary: "#18B98A",
  primaryLight: "#E9FBF5",
  text: "#17212B",
  muted: "#71808E",
};

/* =========================================================
   MOCK DATA
========================================================= */

const students = [
  {
    name: "Instructor",
    role: "Host",
    initials: "IN",
    type: "instructor",
    online: true,
  },
  {
    name: "Anjali S.",
    initials: "AS",
    hand: true,
    online: true,
  },
  {
    name: "Rohan M.",
    initials: "RM",
    online: true,
  },
  {
    name: "Neha K.",
    initials: "NK",
    online: true,
  },
  {
    name: "Imran A.",
    initials: "IA",
    online: true,
  },
  {
    name: "Kuldeep T.",
    initials: "KT",
    you: true,
    online: true,
  },
];

const agenda = [
  {
    status: "COMPLETED",
    title: "Recap of Lesson 4.2",
    time: "00:00 — 15:00",
  },
  {
    status: "LIVE NOW",
    title: "Pipeline behaviors walkthrough",
    time: "15:00 — 55:00",
    active: true,
  },
  {
    status: "UP NEXT",
    title: "Hands-on: write your own behavior",
    time: "55:00 — 01:15:00",
  },
  {
    status: "UP NEXT",
    title: "Open Q&A",
    time: "01:15:00 — 01:30:00",
  },
];

const chatMessages = [
  {
    name: "Anjali S.",
    initials: "AS",
    message:
      "Can you explain why validation runs before transaction?",
    time: "2m",
  },
  {
    name: "Rohan M.",
    initials: "RM",
    message:
      "This pipeline behavior approach is really clean.",
    time: "1m",
  },
  {
    name: "Neha K.",
    initials: "NK",
    message:
      "Will this be included in the assignment?",
    time: "Now",
  },
];

const questions = [
  "Why does logging execute before validation?",
  "Can we have multiple pipeline behaviors?",
  "Where should transaction behavior be registered?",
];

const pollOptions = [
  ["Logging", 32],
  ["Validation", 48],
  ["Transaction", 20],
];

/* =========================================================
   HELPERS
========================================================= */

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({
  initials,
  type = "student",
  size = "md",
}) {
  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  const bg =
    type === "instructor"
      ? "bg-blue-100 text-blue-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-full font-bold",
        sizes[size],
        bg,
      ].join(" ")}
    >
      {initials}
    </div>
  );
}

/* =========================================================
   LIVE BADGE
========================================================= */

function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
      <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
      LIVE
    </div>
  );
}

/* =========================================================
   CONTROL BUTTON
========================================================= */

function ControlButton({
  icon: Icon,
  children,
  active = false,
  danger = false,
  onClick,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-3 sm:px-4",
        "text-sm font-semibold transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        danger
          ? "border-red-200 bg-red-500 text-white hover:bg-red-600"
          : active
          ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900",
        className,
      ].join(" ")}
    >
      <Icon size={17} />
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function LiveClass() {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [rightPanel, setRightPanel] = useState(true);
  const [activeTab, setActiveTab] = useState("People");
  const [muted, setMuted] = useState(false);

  const [elapsed, setElapsed] = useState(
    49 * 60 + 43
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onlineCount = useMemo(() => 128, []);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#17212B]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[64px] max-w-[1900px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-7">

          {/* COURSE BREADCRUMB */}

          <div className="flex min-w-0 flex-1 items-center gap-3">

            <span className="truncate text-xs font-medium text-gray-500 lg:text-sm">
              ASP.NET Core Mastery
            </span>

            <span className="text-gray-300">
              /
            </span>

            <span className="truncate text-xs font-semibold text-gray-800 lg:text-sm">
              Live Class · Pipeline Behaviors in Practice
            </span>

          </div>

          {/* RIGHT HEADER */}

          <div className="flex shrink-0 items-center gap-2">

            <LiveBadge />

            <span className="hidden font-mono text-xs font-bold text-gray-600 sm:block">
              {formatTime(elapsed)}
            </span>

            <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 lg:flex">
              <Users size={14} />
              {onlineCount} watching
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 xl:flex">
              <CheckCircle2 size={14} />
              Attendance marked
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1900px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-7">

        <div
          className={[
            "grid gap-5",
            rightPanel
              ? "xl:grid-cols-[minmax(0,1fr)_360px]"
              : "grid-cols-1",
          ].join(" ")}
        >

          {/* =================================================
              LEFT
          ================================================= */}

          <section className="min-w-0 space-y-4">

            {/* MOBILE TITLE */}

            <div className="flex items-center justify-between gap-3 md:hidden">

              <div className="min-w-0">

                <p className="truncate text-[11px] font-medium text-gray-500">
                  ASP.NET Core Mastery
                </p>

                <h1 className="truncate text-sm font-bold text-gray-900">
                  Pipeline Behaviors in Practice
                </h1>

              </div>

              <button
                onClick={() => setRightPanel(!rightPanel)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600"
              >
                <PanelRight size={17} />
              </button>

            </div>

            {/* =================================================
                PINNED MESSAGE
            ================================================= */}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 sm:p-4">

              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <Pin size={15} fill="currentColor" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-xs leading-5 sm:text-sm">

                    <span className="font-bold text-amber-700">
                      Pinned by instructor:
                    </span>{" "}

                    <span className="text-gray-600">
                      Assignment 4 is due Friday. Source code for today's
                      lesson is available in the Resources tab.
                    </span>

                  </p>

                </div>

                <button className="shrink-0 text-gray-400 hover:text-gray-700">
                  <X size={16} />
                </button>

              </div>
            </div>

            {/* =================================================
                PLAYER
            ================================================= */}

            <LivePlayer
              captions={captions}
              muted={muted}
              elapsed={elapsed}
              onMute={() => setMuted(!muted)}
            />

            {/* =================================================
                CONTROLS
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">

              <div className="flex flex-wrap items-center gap-2">

                <ControlButton
                  icon={micOn ? Mic : MicOff}
                  active={micOn}
                  onClick={() => setMicOn(!micOn)}
                >
                  {micOn ? "Mic is on" : "Mic is off"}
                </ControlButton>

                <ControlButton
                  icon={cameraOn ? Video : VideoOff}
                  active={cameraOn}
                  onClick={() => setCameraOn(!cameraOn)}
                >
                  {cameraOn
                    ? "Camera is on"
                    : "Camera is off"}
                </ControlButton>

                <ControlButton
                  icon={Hand}
                  active={handRaised}
                  onClick={() =>
                    setHandRaised(!handRaised)
                  }
                >
                  {handRaised
                    ? "Hand raised"
                    : "Raise hand"}
                </ControlButton>

                <div className="ml-auto flex gap-2">

                  <ControlButton
                    icon={Captions}
                    active={captions}
                    onClick={() =>
                      setCaptions(!captions)
                    }
                  >
                    Captions
                  </ControlButton>

                  <ControlButton
                    icon={PanelRight}
                    active={rightPanel}
                    onClick={() =>
                      setRightPanel(!rightPanel)
                    }
                  >
                    Panel
                  </ControlButton>

                  <ControlButton
                    icon={PhoneOff}
                    danger
                  >
                    Leave
                  </ControlButton>

                </div>
              </div>
            </div>

            {/* =================================================
                PACE FEEDBACK
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={15}
                      className="text-emerald-500"
                    />

                    <h2 className="text-sm font-bold text-gray-900">
                      How is the pace?
                    </h2>

                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Your answer is anonymous. Instructor sees only totals.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">

                  <button className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-900">
                    Slow down
                    <span className="ml-2 text-gray-400">
                      3
                    </span>
                  </button>

                  <button className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-600">
                    Just right
                    <span className="ml-2">
                      41
                    </span>
                  </button>

                  <button className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-900">
                    Speed up
                    <span className="ml-2 text-gray-400">
                      5
                    </span>
                  </button>

                </div>

              </div>
            </div>

            {/* =================================================
                AGENDA
            ================================================= */}

            <Agenda />

            {/* =================================================
                MOBILE PANEL
            ================================================= */}

            <div className="xl:hidden">

              {rightPanel && (
                <LiveSidePanel
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}

            </div>

          </section>

          {/* =================================================
              DESKTOP SIDE PANEL
          ================================================= */}

          {rightPanel && (
            <aside className="hidden min-w-0 xl:block">

              <div className="sticky top-[84px]">

                <LiveSidePanel
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

              </div>

            </aside>
          )}

        </div>
      </main>
    </div>
  );
}

/* =========================================================
   LIVE PLAYER
========================================================= */

function LivePlayer({
  captions,
  muted,
  elapsed,
  onMute,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* TOP BAR */}

      <div className="flex h-12 items-center gap-2 overflow-x-auto border-b border-gray-200 bg-gray-50 px-3 sm:px-4">

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        </div>

        <div className="ml-2 shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-gray-700 sm:ml-3 sm:text-xs">
          ValidationBehavior.cs
        </div>

        <div className="shrink-0 px-2 py-1.5 font-mono text-[11px] text-gray-500 sm:text-xs">
          CreateOrderCommand.cs
        </div>

        <div className="ml-auto hidden items-center gap-1 sm:flex">

          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700">
            <MoreHorizontal size={17} />
          </button>

          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700">
            <Maximize2 size={16} />
          </button>

        </div>
      </div>

      {/* CODE AREA */}

      <div className="relative min-h-[330px] overflow-hidden bg-[#F8FAFC] sm:min-h-[450px] lg:min-h-[560px]">

        <div className="absolute inset-0 overflow-hidden p-4 font-mono text-[10px] leading-6 text-gray-500 sm:p-7 sm:text-sm lg:p-8 lg:text-base">

          <div>
            <span className="text-blue-600">
              public sealed class
            </span>{" "}

            <span className="text-gray-800">
              ValidationBehavior
            </span>

            <span className="text-gray-500">
              {"<TRequest, TResponse>"}
            </span>
          </div>

          <div className="pl-5">
            <span className="text-gray-500">
              : IPipelineBehavior
            </span>

            <span className="text-gray-500">
              {"<TRequest, TResponse>"}
            </span>
          </div>

          <div className="mt-5">
            {"{"}
          </div>

          <div className="mt-2 pl-5">

            <span className="text-blue-600">
              public async
            </span>{" "}

            <span className="text-gray-700">
              Task&lt;TResponse&gt;
            </span>{" "}

            <span className="text-amber-600">
              Handle
            </span>

            <span className="text-gray-700">
              {"("}
            </span>

          </div>

          <div className="pl-10 text-gray-600">
            TRequest request,
            RequestHandlerDelegate&lt;TResponse&gt; next,
          </div>

          <div className="pl-10 text-gray-600">
            CancellationToken ct
          </div>

          <div className="pl-5">
            {"{"}
          </div>

          {/* HIGHLIGHT */}

          <div className="relative my-2 -mx-4 border-l-2 border-emerald-500 bg-emerald-50 py-1 pl-9 sm:-mx-7 sm:pl-14 lg:-mx-8 lg:pl-16">

            <span className="text-gray-600">
              var failures ={" "}
            </span>

            <span className="text-amber-600">
              validators
            </span>

            <span className="text-gray-600">
              .SelectMany(v =&gt; v.Validate(request).Errors);
            </span>

          </div>

          <div className="pl-10">

            <span className="text-blue-600">
              if
            </span>

            <span className="text-gray-600">
              {" (failures.Any()) "}
            </span>

            <span className="text-blue-600">
              throw new
            </span>

            <span className="text-gray-600">
              {" ValidationException(failures);"}
            </span>

          </div>

          <div className="pl-10">

            <span className="text-blue-600">
              return await
            </span>{" "}

            <span className="text-gray-600">
              next();
            </span>

          </div>

          <div className="pl-5">
            {"}"}
          </div>

          <div>
            {"}"}
          </div>

        </div>

        {/* INSTRUCTOR VIDEO */}

        <div className="absolute bottom-[68px] right-3 w-[130px] overflow-hidden rounded-xl border border-emerald-300 bg-white shadow-xl sm:bottom-[70px] sm:right-5 sm:w-[175px]">

          <div className="flex h-[75px] items-center justify-center bg-gray-100 sm:h-[100px]">

            <Avatar
              initials="IN"
              type="instructor"
              size="lg"
            />

          </div>

          <div className="flex items-center justify-between px-3 py-2">

            <span className="text-[10px] font-semibold text-gray-700">
              Instructor
            </span>

            <Mic
              size={13}
              className="text-emerald-500"
            />

          </div>

        </div>

        {/* CAPTION */}

        {captions && (
          <div className="absolute bottom-[68px] left-1/2 w-[78%] max-w-2xl -translate-x-1/2 rounded-xl border border-gray-200 bg-white/95 px-3 py-2.5 text-center text-[11px] font-medium leading-5 text-gray-800 shadow-lg backdrop-blur-xl sm:px-5 sm:py-3 sm:text-sm">

            Order matters. Logging first, then validation,
            then the transaction behavior.

          </div>
        )}

        {/* PLAYER CONTROL BAR */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 px-3 py-2.5 backdrop-blur-xl sm:px-4">

          <div className="flex items-center gap-3">

            <span className="hidden text-[10px] text-gray-500 sm:block">
              Live now
            </span>

            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">

              <div className="absolute inset-y-0 left-0 w-[72%] rounded-full bg-emerald-500" />

              <div className="absolute left-[72%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />

            </div>

            <span className="font-mono text-[10px] text-gray-500">
              {formatTime(elapsed)}
            </span>

            <button
              onClick={onMute}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              {muted ? (
                <VolumeX size={15} />
              ) : (
                <Volume2 size={15} />
              )}
            </button>

            <Radio
              size={14}
              className="animate-pulse text-red-500"
            />

          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   AGENDA
========================================================= */

function Agenda() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

        <h2 className="text-lg font-bold text-gray-900">
          Today's agenda
        </h2>

        <div className="flex items-center gap-2 text-xs text-gray-500">

          <Clock3 size={14} />

          <span>
            Class ends in
          </span>

          <span className="font-mono font-bold text-gray-700">
            40:17
          </span>

        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {agenda.map((item) => (

          <div
            key={item.title}
            className={[
              "rounded-xl border p-4 transition-all",
              item.active
                ? "border-emerald-200 bg-emerald-50 shadow-sm"
                : "border-gray-200 bg-gray-50 hover:border-gray-300",
            ].join(" ")}
          >

            <div
              className={[
                "text-[10px] font-bold tracking-[0.12em]",
                item.active
                  ? "text-emerald-600"
                  : item.status === "COMPLETED"
                  ? "text-gray-400"
                  : "text-blue-600",
              ].join(" ")}
            >
              {item.status}
            </div>

            <h3 className="mt-2 min-h-[42px] text-sm font-semibold leading-5 text-gray-800">
              {item.title}
            </h3>

            <p className="mt-3 font-mono text-[10px] text-gray-500">
              {item.time}
            </p>

          </div>

        ))}

      </div>
    </div>
  );
}

/* =========================================================
   SIDE PANEL
========================================================= */

function LiveSidePanel({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      name: "Chat",
      icon: MessageSquare,
    },
    {
      name: "Q&A",
      icon: HelpCircle,
      count: 3,
    },
    {
      name: "Poll",
      icon: BarChart3,
    },
    {
      name: "People",
      icon: Users,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* TABS */}

      <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50">

        {tabs.map((tab) => {

          const Icon = tab.icon;
          const active = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={[
                "relative flex min-h-[56px] items-center justify-center gap-1.5 px-1 text-[11px] font-semibold transition sm:text-xs",
                active
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-700",
              ].join(" ")}
            >

              <Icon
                size={14}
                className="hidden sm:block"
              />

              {tab.name}

              {tab.count && (
                <span className="text-[10px] text-gray-400">
                  ({tab.count})
                </span>
              )}

              {active && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-500" />
              )}

            </button>
          );
        })}

      </div>

      {/* CONTENT */}

      <div className="min-h-[480px] p-4">

        {activeTab === "People" && (
          <PeoplePanel />
        )}

        {activeTab === "Chat" && (
          <ChatPanel />
        )}

        {activeTab === "Q&A" && (
          <QAPanel />
        )}

        {activeTab === "Poll" && (
          <PollPanel />
        )}

      </div>
    </div>
  );
}

/* =========================================================
   PEOPLE
========================================================= */

function PeoplePanel() {
  return (
    <div>

      <div className="mb-4 flex items-center justify-between">

        <div>
          <h3 className="text-sm font-bold text-gray-900">
            People in this class
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            128 participants
          </p>
        </div>

        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <ChevronDown size={16} />
        </button>

      </div>

      <div className="space-y-1">

        {students.map((student) => (

          <div
            key={student.name}
            className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-gray-50"
          >

            <div className="relative">

              <Avatar
                initials={student.initials}
                type={student.type || "student"}
              />

              {student.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              )}

            </div>

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-2">

                <p className="truncate text-sm font-semibold text-gray-800">
                  {student.name}
                </p>

                {student.you && (
                  <span className="text-[10px] font-semibold text-emerald-600">
                    You
                  </span>
                )}

              </div>

              {student.role && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {student.role}
                </p>
              )}

            </div>

            {student.hand && (
              <span className="hidden rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600 sm:block">
                Hand raised
              </span>
            )}

            {student.name !== "Instructor" ? (
              <MicOff
                size={15}
                className="text-gray-300 group-hover:text-gray-500"
              />
            ) : (
              <Mic
                size={15}
                className="text-emerald-500"
              />
            )}

          </div>

        ))}

      </div>

      <button className="mt-5 w-full rounded-xl border border-gray-200 py-3 text-xs font-semibold text-gray-500 transition hover:bg-gray-50 hover:text-gray-800">
        and 121 more students
      </button>

    </div>
  );
}

/* =========================================================
   CHAT
========================================================= */

function ChatPanel() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex min-h-[450px] flex-col">

      <div className="mb-4 flex items-center justify-between">

        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Class chat
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Messages are visible to everyone
          </p>
        </div>

        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <MoreVertical size={16} />
        </button>

      </div>

      <div className="flex-1 space-y-4 overflow-auto pr-1">

        {chatMessages.map((item) => (

          <div
            key={item.name}
            className="flex gap-3"
          >

            <Avatar
              initials={item.initials}
              size="sm"
            />

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <span className="text-xs font-bold text-gray-700">
                  {item.name}
                </span>

                <span className="text-[10px] text-gray-400">
                  {item.time}
                </span>

              </div>

              <div className="mt-1.5 rounded-xl rounded-tl-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs leading-5 text-gray-600">
                {item.message}
              </div>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4">

        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setMessage("");
            }
          }}
          placeholder="Send a message..."
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white"
        />

        <button
          onClick={() => setMessage("")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-600"
        >
          <Send size={15} />
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   Q&A
========================================================= */

function QAPanel() {
  return (
    <div>

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Questions & answers
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Ask questions during the live class
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
          3 open
        </span>

      </div>

      <div className="space-y-3">

        {questions.map((question, index) => (

          <div
            key={question}
            className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 transition hover:border-gray-300"
          >

            <div className="flex gap-3">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-gray-500">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-xs leading-5 text-gray-600">
                  {question}
                </p>

                <div className="mt-3 flex items-center gap-2">

                  <button className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 hover:text-emerald-600">
                    <ThumbsUp size={12} />
                    12
                  </button>

                  <span className="text-gray-300">
                    •
                  </span>

                  <span className="text-[10px] text-gray-400">
                    Waiting for instructor
                  </span>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

/* =========================================================
   POLL
========================================================= */

function PollPanel() {
  return (
    <div>

      <div className="mb-5">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">
            Live poll
          </p>

        </div>

        <h3 className="mt-2 text-sm font-bold leading-5 text-gray-900">
          Which behavior should execute first?
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Results update in real time
        </p>

      </div>

      <div className="space-y-2.5">

        {pollOptions.map(([name, percentage]) => (

          <button
            key={name}
            className="group relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-3.5 text-left transition hover:border-emerald-200"
          >

            <div
              className="absolute inset-y-0 left-0 bg-emerald-50 transition-all group-hover:bg-emerald-100"
              style={{
                width: `${percentage}%`,
              }}
            />

            <div className="relative flex items-center justify-between">

              <span className="text-xs font-semibold text-gray-700">
                {name}
              </span>

              <span className="text-xs font-bold text-emerald-600">
                {percentage}%
              </span>

            </div>

          </button>

        ))}

      </div>

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-3">

        <p className="text-[10px] leading-4 text-gray-500">
          128 students have responded to this poll.
        </p>

      </div>

    </div>
  );
}