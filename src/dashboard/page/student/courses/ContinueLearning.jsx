
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Play,
  PlayCircle,
  ArrowUpRight,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Video,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  Layers,
  BookMarked,
  Target,
  TrendingUp,
  CalendarDays,
  Zap,
  Trophy,
} from "lucide-react";

import { useContinueLearning } from "../../../hooks/student/useContinueLearning";

/* =========================================================
   HELPERS
========================================================= */

const accents = [
  {
    color: "#8B5CF6",
    light: "bg-violet-50",
    text: "text-violet-600",
    gradient: "from-violet-500 to-indigo-600",
  },
  {
    color: "#0EA5E9",
    light: "bg-sky-50",
    text: "text-sky-600",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    color: "#10B981",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    color: "#F59E0B",
    light: "bg-amber-50",
    text: "text-amber-600",
    gradient: "from-amber-500 to-orange-600",
  },
];

const getPercentage = (value) => {
  if (value === null || value === undefined) return 0;

  const parsed = Number(String(value).replace("%", "").trim());

  if (!Number.isFinite(parsed)) return 0;

  return Math.min(100, Math.max(0, parsed));
};

const getClassProgress = (item) => {
  const completed = Number(item?.progressClass ?? 0);
  const total = Number(item?.totalClass ?? 0);

  if (!total) return 0;

  return Math.min(100, Math.round((completed / total) * 100));
};

const formatLastWatched = (dateValue) => {
  if (!dateValue) return "Not watched yet";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Recently watched";

  const diff = Date.now() - date.getTime();

  if (diff < 0) return "Recently watched";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   ANIMATION
========================================================= */

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* =========================================================
   PROGRESS BAR
========================================================= */

function ProgressBar({ value = 0, color = "#8B5CF6", dark = false }) {
  const percentage = getPercentage(value);

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full ${
        dark ? "bg-white/15" : "bg-slate-100"
      }`}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        }}
      />
    </div>
  );
}

/* =========================================================
   CIRCULAR PROGRESS
========================================================= */

function ProgressRing({
  value = 0,
  size = 132,
  stroke = 10,
  color = "#A78BFA",
}) {
  const percentage = getPercentage(value);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.13)"
          strokeWidth={stroke}
          fill="none"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tracking-tight text-white">
          {percentage}%
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">
          Completed
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon: Icon, label, value, subtitle, color, bg }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </h3>
          <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${color} transition-transform group-hover:scale-110`}
        >
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MODULE PREVIEW
========================================================= */

function ModulePreview({ module }) {
  if (!module) {
    return (
      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-white/50">
          No module progress available yet.
        </p>
      </div>
    );
  }

  const percentage = getPercentage(module.completePercentage);

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-200/70">
            Continue your module
          </p>

          <h3 className="mt-1.5 truncate text-sm font-bold text-white">
            {module.moduleName || "Untitled module"}
          </h3>
        </div>

        <span className="shrink-0 rounded-lg bg-violet-400/15 px-2.5 py-1 text-xs font-bold text-violet-200">
          {percentage}%
        </span>
      </div>

      <div className="mt-3">
        <ProgressBar value={percentage} color="#A78BFA" dark />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/50">
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {module.currentLeftCompleteDuration || "0 min"} remaining
        </span>

        <span>{formatLastWatched(module.lastWatchAt)}</span>
      </div>
    </div>
  );
}

/* =========================================================
   FEATURED LEARNING CARD
========================================================= */

function FeaturedResume({ item, onResume }) {
  const progress = getClassProgress(item);
  const module = item.moduleList?.[0];

  return (
    <motion.section
      variants={fadeUp}
      className="relative isolate overflow-hidden rounded-[28px] bg-[#17132F] shadow-[0_20px_60px_-20px_rgba(55,40,120,0.35)]"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-violet-500/25 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-9">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">
            <Sparkles size={12} />
            Your learning journey
          </div>

          <h2 className="mt-5 max-w-2xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-[36px]">
            Welcome back to your
            <span className="block bg-gradient-to-r from-violet-300 via-purple-200 to-sky-300 bg-clip-text text-transparent">
              learning journey.
            </span>
          </h2>

          <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/55 sm:text-sm">
            Keep learning, stay consistent and take one more step towards
            your goals.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-violet-200">
              <GraduationCap size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {item.batchName || "Your Learning Batch"}
              </p>
              <p className="mt-0.5 text-[11px] text-white/50">
                {item.courseName || "Course"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-white/65">
              <Layers size={12} />
              {item.batchCode || `Batch #${item.batchId}`}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-white/65">
              <BookOpen size={12} />
              {item.moduleList?.length || 0} modules
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-white/65">
              <CheckCircle2 size={12} />
              {item.progressClass ?? 0}/{item.totalClass ?? 0} classes
            </span>
          </div>

          <div className="mt-6 max-w-lg">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-white/60">
                Overall class progress
              </span>
              <span className="font-bold text-violet-200">
                {progress}%
              </span>
            </div>

            <ProgressBar value={progress} color="#A78BFA" dark />
          </div>

          <ModulePreview module={module} />

          <motion.button
            onClick={() => onResume(item)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-extrabold text-[#211944] shadow-lg shadow-black/10 transition hover:bg-violet-50 sm:text-sm"
          >
            <Play size={15} fill="currentColor" />
            Resume Learning
            <ArrowUpRight size={15} />
          </motion.button>
        </div>

        <div className="flex items-center justify-center lg:px-5">
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 scale-125 rounded-full bg-violet-500/10 blur-3xl" />

            <ProgressRing value={progress} />

            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2">
              <Zap size={13} className="text-amber-300" />
              <span className="text-[10px] font-semibold text-white/70">
                Keep your momentum going
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* =========================================================
   BATCH CARD
========================================================= */

function BatchCard({ item, index, onResume }) {
  const progress = getClassProgress(item);
  const module = item.moduleList?.[0];
  const accent = accents[index % accents.length];

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/50 sm:p-5"
    >
      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full ${accent.light} opacity-70 transition-transform duration-300 group-hover:scale-125`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent.gradient} text-white shadow-lg`}
          >
            <BookOpen size={21} />
          </div>

          <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
            {item.batchCode || `BATCH-${item.batchId}`}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-1 text-base font-extrabold text-slate-900">
          {item.batchName || "Learning Batch"}
        </h3>

        <p className="mt-1 truncate text-xs font-medium text-slate-500">
          {item.courseName || "Course"}
        </p>

        {module && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Continue module
            </p>

            <p className="mt-1 truncate text-xs font-bold text-slate-700">
              {module.moduleName || "Untitled module"}
            </p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock size={11} />
                {module.currentLeftCompleteDuration || "0 min"} left
              </span>

              <span className={`text-[10px] font-bold ${accent.text}`}>
                {getPercentage(module.completePercentage)}%
              </span>
            </div>
          </div>
        )}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">
              Class progress
            </span>
            <span className={`text-xs font-extrabold ${accent.text}`}>
              {progress}%
            </span>
          </div>

          <ProgressBar value={progress} color={accent.color} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400">
            {item.progressClass ?? 0} of {item.totalClass ?? 0} classes
          </span>

          <span className="text-[10px] text-slate-400">
            {module ? formatLastWatched(module.lastWatchAt) : "No activity"}
          </span>
        </div>

        <button
          onClick={() => onResume(item)}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${accent.gradient} px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105`}
        >
          <PlayCircle size={15} />
          Continue Learning
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MODULE CARD
========================================================= */

function ModuleCard({ module, index }) {
  const percentage = getPercentage(module.completePercentage);
  const accent = accents[index % accents.length];

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-violet-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.light} ${accent.text}`}
        >
          <BookMarked size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-xs font-bold text-slate-800">
            {module.moduleName || "Untitled module"}
          </h4>

          <p className="mt-1 text-[10px] text-slate-400">
            {module.currentLeftCompleteDuration || "0 min"} remaining
          </p>
        </div>

        <span className={`text-xs font-extrabold ${accent.text}`}>
          {percentage}%
        </span>
      </div>

      <div className="mt-4">
        <ProgressBar value={percentage} color={accent.color} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-slate-400">
        <span>Video progress</span>
        <span>{formatLastWatched(module.lastWatchAt)}</span>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ERROR STATE
========================================================= */

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-white px-5 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertCircle size={25} />
      </div>

      <h3 className="mt-4 text-lg font-extrabold text-slate-900">
        Unable to load your learning
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white px-5 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600">
        <BookOpen size={34} />
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-slate-900">
        Your learning journey starts here!
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        You haven't started learning in any batch yet. Enroll in a course
        and your learning progress will appear here.
      </p>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ContinueLearning() {
  const navigate = useNavigate();

  const {
    batches = [],
    isLoading,
    error,
    fetchContinueLearning,
  } = useContinueLearning();

  const featured = useMemo(
    () => batches[0] || null,
    [batches]
  );

  const others = useMemo(
    () => batches.slice(1),
    [batches]
  );

  const stats = useMemo(() => {
    const totalClasses = batches.reduce(
      (sum, item) => sum + Number(item.totalClass || 0),
      0
    );

    const completedClasses = batches.reduce(
      (sum, item) => sum + Number(item.progressClass || 0),
      0
    );

    const totalModules = batches.reduce(
      (sum, item) => sum + (item.moduleList?.length || 0),
      0
    );

    const averageProgress = totalClasses
      ? Math.round((completedClasses / totalClasses) * 100)
      : 0;

    return {
      totalBatches: batches.length,
      totalClasses,
      completedClasses,
      totalModules,
      averageProgress,
    };
  }, [batches]);

  const handleResume = (item) => {
    if (!item?.batchId) return;

    // Change this route according to your actual classroom route.
    navigate(`/student/batches/${item.batchId}/learn`);
  };

  return (
    <div className="min-h-full bg-[#F8F9FD] px-3 py-5 sm:px-5 lg:px-7 lg:py-7">
      <div className="mx-auto max-w-[1450px] space-y-6">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <motion.div variants={fadeUp}>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-violet-700">
              <Sparkles size={12} />
              Student Learning Space
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
              Continue Learning
              <span className="ml-2 text-violet-600">.</span>
            </h1>

            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
              Pick up where you left off and keep moving forward.
            </p>
          </motion.div>

          {!isLoading && !error && batches.length > 0 && (
            <motion.button
              variants={fadeUp}
              onClick={fetchContinueLearning}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-700 sm:self-auto"
            >
              <RefreshCw size={14} />
              Refresh Progress
            </motion.button>
          )}
        </motion.div>

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && <LoadingState />}

        {/* =================================================
            ERROR
        ================================================= */}

        {!isLoading && error && (
          <ErrorState
            message={error}
            onRetry={fetchContinueLearning}
          />
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!isLoading && !error && batches.length === 0 && (
          <EmptyState />
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        {!isLoading && !error && batches.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-7"
          >
            {/* FEATURED */}
            {featured && (
              <FeaturedResume
                item={featured}
                onResume={handleResume}
              />
            )}

            {/* OVERVIEW */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                    Your Learning Overview
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-500">
                    A quick look at your learning activity.
                  </p>
                </div>

                <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:inline-flex">
                  <TrendingUp size={12} />
                  Learning Progress
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                  icon={GraduationCap}
                  label="Enrolled Batches"
                  value={stats.totalBatches}
                  subtitle="Your active learning batches"
                  color="text-violet-600"
                  bg="bg-violet-50"
                />

                <StatCard
                  icon={CheckCircle2}
                  label="Classes Completed"
                  value={stats.completedClasses}
                  subtitle={`Out of ${stats.totalClasses} total classes`}
                  color="text-emerald-600"
                  bg="bg-emerald-50"
                />

                <StatCard
                  icon={Layers}
                  label="Learning Modules"
                  value={stats.totalModules}
                  subtitle="Modules with progress data"
                  color="text-sky-600"
                  bg="bg-sky-50"
                />

                <StatCard
                  icon={Target}
                  label="Class Progress"
                  value={`${stats.averageProgress}%`}
                  subtitle="Overall class completion"
                  color="text-amber-600"
                  bg="bg-amber-50"
                />
              </div>
            </section>

            {/* OTHER BATCHES */}
            {others.length > 0 && (
              <section>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <PlayCircle size={17} />
                      </div>

                      <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                        Your Other Batches
                      </h2>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-500">
                      Continue learning from your enrolled batches.
                    </p>
                  </div>

                  <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500 shadow-sm">
                    {others.length} batches
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {others.map((item, index) => (
                    <BatchCard
                      key={item.batchId}
                      item={item}
                      index={index}
                      onResume={handleResume}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* MODULE PROGRESS */}
            <section>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                      <Video size={17} />
                    </div>

                    <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                      Your Module Progress
                    </h2>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Track your watched video progress module by module.
                  </p>
                </div>

                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                  <CalendarDays size={12} />
                  Based on your learning activity
                </span>
              </div>

              <div className="space-y-4">
                {batches.map((batch) => (
                  <div
                    key={batch.batchId}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-extrabold text-slate-800">
                          {batch.batchName || "Learning Batch"}
                        </h3>

                        <p className="mt-1 truncate text-[11px] text-slate-500">
                          {batch.courseName || "Course"} ·{" "}
                          {batch.batchCode || `Batch #${batch.batchId}`}
                        </p>
                      </div>

                      <span className="flex w-fit items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-700">
                        <BookOpen size={12} />
                        {batch.moduleList?.length || 0} modules
                      </span>
                    </div>

                    <div className="p-4 sm:p-5">
                      {batch.moduleList?.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {batch.moduleList.map((module, index) => (
                            <ModuleCard
                              key={module.moduleId}
                              module={module}
                              index={index}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                          <BookOpen
                            size={22}
                            className="mx-auto text-slate-300"
                          />
                          <p className="mt-2 text-xs font-medium text-slate-500">
                            No module progress available yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* BOTTOM MOTIVATION */}
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-5 sm:p-6"
            >
              <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200">
                    <Trophy size={22} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Every lesson takes you closer to your goal.
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Stay consistent. Your progress matters!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
                  <Zap size={15} />
                  Keep learning
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
