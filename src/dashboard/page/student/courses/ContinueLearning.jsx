import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  Play,
  PlayCircle,
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
  Flame,
  TrendingUp,
  Target,
  CheckCircle,
  Star,
  ChevronRight,
  Zap,
  Award,
  Timer,
  Video,
  BarChart3,
} from 'lucide-react';

/* =========================================================
   STYLES — CSS-first animations (background-tab safe)
========================================================= */
const PageStyles = () => (
  <style>{`
    @keyframes auroraA {
      0%,100% { transform: translate(0,0) scale(1); }
      50%     { transform: translate(30px,-25px) scale(1.12); }
    }
    @keyframes auroraB {
      0%,100% { transform: translate(0,0) scale(1); }
      50%     { transform: translate(-35px,-22px) scale(1.15); }
    }
    @keyframes shimmerTitle {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes playPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(124,106,221,0.7), 0 8px 30px -8px rgba(124,106,221,0.6); }
      50%     { box-shadow: 0 0 0 12px rgba(124,106,221,0), 0 8px 30px -8px rgba(124,106,221,0.6); }
    }
    @keyframes flameFlicker {
      0%,100% { transform: scale(1) rotate(0); }
      50%     { transform: scale(1.08) rotate(-4deg); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes barFill {
      from { width: 0; }
    }
    @keyframes ringFill {
      from { stroke-dashoffset: var(--ring-from); }
    }

    .aurora-a { animation: auroraA 18s ease-in-out infinite; }
    .aurora-b { animation: auroraB 24s ease-in-out infinite; }

    .shimmer-title {
      background: linear-gradient(90deg,#5145A0 0%,#7C6ADD 20%,#7dd3fc 45%,#F472B6 65%,#7C6ADD 85%,#5145A0 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerTitle 8s linear infinite;
    }
    .play-pulse { animation: playPulse 2s ease-in-out infinite; }
    .flame-flicker { animation: flameFlicker 2.5s ease-in-out infinite; }

    /* Fast entrance — CSS, will never get stuck on tab switch */
    .anim-fade-up { animation: fadeUp 0.28s cubic-bezier(0.16,1,0.3,1) both; }
    .anim-fade-in { animation: fadeIn 0.22s ease-out both; }
    .bar-fill     { animation: barFill 0.55s cubic-bezier(0.16,1,0.3,1) both; }
    .ring-fill    { animation: ringFill 0.7s cubic-bezier(0.16,1,0.3,1) both; }

    .dot-grid {
      background-image: radial-gradient(circle, #6D5BD0 1px, transparent 1px);
      background-size: 22px 22px;
    }
    .no-scrollbar::-webkit-scrollbar { height: 0; }
    .snap-x-mandatory { scroll-snap-type: x mandatory; }
    .snap-start { scroll-snap-align: start; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    /* Respect user preference for reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .anim-fade-up, .anim-fade-in, .bar-fill, .ring-fill,
      .aurora-a, .aurora-b, .shimmer-title, .play-pulse, .flame-flicker {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `}</style>
);

/* =========================================================
   DATA
========================================================= */
const resumeItems = [
  { id: 1, title: 'Advanced Database Systems', code: 'MCA-24-A', instructor: 'Dr. Rajesh Verma', module: 'Module 8 — Normalization', lesson: '3NF & BCNF Deep Dive', progress: 78, minutesLeft: 24, totalLessons: 40, completedLessons: 31, accent: '#7C6ADD', gradient: 'from-violet-200 via-purple-100 to-indigo-200', lastWatched: '2 hours ago' },
  { id: 2, title: 'Data Structures & Algorithms', code: 'MCA-24-A', instructor: 'Prof. Anita Gupta', module: 'Module 5 — Graph Theory', lesson: 'BFS & DFS Traversal', progress: 62, minutesLeft: 38, totalLessons: 36, completedLessons: 22, accent: '#3B82F6', gradient: 'from-sky-200 via-blue-100 to-indigo-200', lastWatched: 'Yesterday' },
  { id: 3, title: 'Operating Systems', code: 'BCA-23-B', instructor: 'Prof. Meera Singh', module: 'Module 6 — Deadlocks', lesson: 'Deadlock Detection Algorithms', progress: 88, minutesLeft: 12, totalLessons: 42, completedLessons: 37, accent: '#10B981', gradient: 'from-emerald-200 via-teal-100 to-cyan-200', lastWatched: '3 days ago' },
  { id: 4, title: 'Web Technologies', code: 'BCA-23-B', instructor: 'Dr. Suresh Kumar', module: 'Module 4 — React', lesson: 'useEffect & Cleanup', progress: 45, minutesLeft: 42, totalLessons: 30, completedLessons: 14, accent: '#F59E0B', gradient: 'from-amber-200 via-orange-100 to-yellow-200', lastWatched: '5 days ago' },
];

const weekActivity = [
  { day: 'M', mins: 45 }, { day: 'T', mins: 62 }, { day: 'W', mins: 38 },
  { day: 'T', mins: 75 }, { day: 'F', mins: 55 }, { day: 'S', mins: 20 }, { day: 'S', mins: 0 },
];

const recommended = [
  { id: 1, title: 'Machine Learning Foundations', instructor: 'Dr. Neha Sharma', rating: 4.9, hours: 28, gradient: 'from-purple-200 via-fuchsia-100 to-pink-200', badge: 'New' },
  { id: 2, title: 'Cloud & DevOps Essentials', instructor: 'Rohit Malhotra', rating: 4.7, hours: 16, gradient: 'from-cyan-200 via-teal-100 to-sky-200', badge: 'Trending' },
  { id: 3, title: 'System Design Masterclass', instructor: 'Dr. Kavita Rao', rating: 4.8, hours: 22, gradient: 'from-rose-200 via-pink-100 to-purple-200', badge: 'Popular' },
  { id: 4, title: 'Cyber Security Basics', instructor: 'Aditya Nair', rating: 4.6, hours: 14, gradient: 'from-indigo-200 via-blue-100 to-sky-200', badge: 'New' },
];

const WEEK_GOAL_MINS = 300;

/* =========================================================
   PROGRESS RING — pure CSS animation
========================================================= */
function ProgressRing({ value, color = '#7C6ADD', size = 120, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="ring-fill"
          style={{ '--ring-from': c }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-gray-800">{value}%</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
          Complete
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   PROGRESS BAR — pure CSS animation
========================================================= */
function ProgressBar({ value, color = '#7C6ADD', delay = 0 }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-white/60">
      <div
        className="bar-fill h-full rounded-full"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          animationDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

/* =========================================================
   FEATURED RESUME CARD
========================================================= */
function FeaturedResume({ item, onResume }) {
  return (
    <div className="anim-fade-up relative overflow-hidden rounded-[24px] border border-white/60 bg-white/60 shadow-[0_20px_60px_-25px_rgba(109,91,208,0.5)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
        <div className="aurora-a absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#a58bfa]/45 to-transparent blur-3xl" />
        <div className="aurora-b absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gradient-to-tr from-[#7dd3fc]/40 to-transparent blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.03] rounded-[24px]" />

      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#6D5BD0] backdrop-blur">
            <Sparkles size={11} />
            RESUME WHERE YOU LEFT OFF
          </span>

          <h2 className="mt-3 text-xl font-black leading-tight text-gray-800 sm:text-2xl lg:text-3xl">
            {item.title}
          </h2>
          <p className="mt-1.5 text-xs font-semibold text-gray-600 sm:text-sm">
            {item.module}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
            <Video size={12} className="text-[#8D7AE8]" />
            <span className="truncate">{item.lesson}</span>
            <span className="text-gray-300">•</span>
            <Clock size={11} className="text-[#8D7AE8]" />
            <span>{item.minutesLeft}m left</span>
          </div>

          <div className="mt-4 max-w-md">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
              <span className="text-gray-600">
                {item.completedLessons}/{item.totalLessons} lessons
              </span>
              <span className="text-[#6D5BD0]">{item.progress}%</span>
            </div>
            <ProgressBar value={item.progress} color={item.accent} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <motion.button
              onClick={() => onResume(item)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="play-pulse inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#5B48BE] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-300/50"
            >
              <Play size={14} fill="currentColor" />
              Resume Learning
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/70 bg-white/70 px-4 py-2.5 text-xs font-bold text-gray-700 backdrop-blur transition hover:bg-white/90"
            >
              <BookOpen size={13} className="text-[#8D7AE8]" />
              View Syllabus
            </motion.button>
            <span className="ml-auto hidden items-center gap-1 text-[10px] font-semibold text-gray-500 sm:inline-flex">
              <Timer size={11} />
              Last watched {item.lastWatched}
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex items-center justify-center lg:mx-0">
          <div className="relative">
            <ProgressRing value={item.progress} color={item.accent} size={130} stroke={9} />
            <motion.button
              onClick={() => onResume(item)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Resume learning"
              className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#6D5BD0] shadow-lg shadow-violet-300/50 ring-2 ring-white/80"
            >
              <Play size={18} fill="currentColor" className="ml-0.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONTINUE ROW
========================================================= */
function ContinueRow({ item, index, onResume }) {
  return (
    <div
      className="anim-fade-up group relative px-4 py-3.5 transition-colors hover:bg-white/50 sm:px-5"
      style={{ animationDelay: `${Math.min(index, 5) * 30}ms` }}
    >
      <span className="pointer-events-none absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#7C6ADD] to-[#5B48BE] opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 320 }}
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${item.gradient} shadow-sm ring-1 ring-white/70`}
        >
          <Play size={16} fill="white" className="text-white drop-shadow" />
          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/40 px-1 py-0.5 text-[8px] font-bold text-white">
            {item.minutesLeft}m
          </span>
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 ring-1 ring-white/70">
              {item.code}
            </span>
            <span className="text-[10px] font-semibold text-gray-400">
              {item.lastWatched}
            </span>
          </div>
          <h3 className="mt-1 truncate text-sm font-bold text-gray-800 sm:text-base">
            {item.title}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-gray-500">{item.lesson}</p>
        </div>

        <div className="w-full sm:w-[26%] lg:w-[22%]">
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
            <span className="text-gray-500">
              {item.completedLessons}/{item.totalLessons}
            </span>
            <span style={{ color: item.accent }}>{item.progress}%</span>
          </div>
          <ProgressBar value={item.progress} color={item.accent} />
        </div>

        <div className="w-full sm:w-auto sm:shrink-0">
          <motion.button
            onClick={() => onResume(item)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#5B48BE] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-violet-300/40 transition hover:shadow-lg hover:shadow-violet-300/60 sm:w-auto"
          >
            <PlayCircle size={13} />
            Resume
            <ChevronRight
              size={12}
              className="transition-transform group-hover/btn:translate-x-0.5"
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STREAK WIDGET
========================================================= */
function StreakWidget() {
  const totalMins = weekActivity.reduce((s, d) => s + d.mins, 0);
  const pct = Math.min(100, Math.round((totalMins / WEEK_GOAL_MINS) * 100));
  const max = Math.max(...weekActivity.map((d) => d.mins), 1);

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_40px_-20px_rgba(109,91,208,0.4)] backdrop-blur-2xl sm:p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-amber-200/40 to-transparent blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flame-flicker flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-300/50">
            <Flame size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Streak
            </p>
            <p className="text-base font-black text-gray-800">12 days 🔥</p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          On track
        </span>
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-1.5">
        {weekActivity.map((d, i) => {
          const h = Math.max(6, (d.mins / max) * 48);
          const isActive = d.mins > 0;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`anim-fade-in w-full rounded-md ${
                  isActive
                    ? 'bg-gradient-to-t from-[#7C6ADD] to-[#a58bfa]'
                    : 'bg-white/60 ring-1 ring-white/70'
                }`}
                style={{
                  height: h,
                  animationDelay: `${Math.min(i, 6) * 40}ms`,
                }}
                title={`${d.mins} min`}
              />
              <span className="text-[9px] font-bold text-gray-400">{d.day}</span>
            </div>
          );
        })}
      </div>

      <div className="relative mt-3 flex items-center justify-between border-t border-white/50 pt-2.5 text-[11px]">
        <span className="font-semibold text-gray-500">
          {totalMins}/{WEEK_GOAL_MINS} min this week
        </span>
        <span className="font-black text-[#6D5BD0]">{pct}%</span>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK STATS
========================================================= */
function QuickStats() {
  const items = [
    { Icon: BookOpen, v: '4', l: 'Active Batches', tone: 'from-violet-500 to-indigo-500' },
    { Icon: CheckCircle, v: '24', l: 'Lessons Done', tone: 'from-emerald-500 to-teal-500' },
    { Icon: Award, v: '2', l: 'Certificates', tone: 'from-amber-500 to-orange-500' },
    { Icon: Target, v: '78%', l: 'Avg Score', tone: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((it, i) => (
        <motion.div
          key={it.l}
          whileHover={{ y: -2 }}
          className="group relative flex items-center gap-2.5 overflow-hidden rounded-[16px] border border-white/60 bg-white/60 p-3 backdrop-blur-xl"
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${it.tone} text-white shadow-sm`}
          >
            <it.Icon size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black leading-tight text-gray-800">{it.v}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
              {it.l}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* =========================================================
   RECOMMENDED CARD
========================================================= */
function RecommendedCard({ item, index }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative w-[240px] shrink-0 snap-start overflow-hidden rounded-[18px] border border-white/60 bg-white/60 shadow-md shadow-purple-200/20 backdrop-blur-xl transition-shadow hover:shadow-xl hover:shadow-purple-200/50 sm:w-[260px]"
    >
      <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${item.gradient}`}>
        <div className="absolute inset-0 dot-grid opacity-[0.06]" />
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/50 blur-2xl transition-transform duration-500 group-hover:scale-125" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#6D5BD0] backdrop-blur">
          {item.badge}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#6D5BD0] shadow-md ring-2 ring-white">
            <BookOpen size={18} />
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-gray-800">
          {item.title}
        </h3>
        <p className="mt-1 truncate text-[11px] text-gray-500">{item.instructor}</p>
        <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {item.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} className="text-[#8D7AE8]" />
            {item.hours}h
          </span>
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-[11px] font-bold text-gray-700 backdrop-blur transition hover:bg-white/90"
        >
          <Zap size={11} className="text-[#8D7AE8]" />
          Explore
          <ArrowRight size={11} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN
========================================================= */
export default function ContinueLearning() {
  const [lastAction, setLastAction] = useState(null);

  const featured = resumeItems[0];
  const others = useMemo(() => resumeItems.slice(1), []);

  const handleResume = (item) => {
    setLastAction(item);
    // navigate(`/student/batches/${item.id}/learn`)
    setTimeout(() => setLastAction(null), 2400);
  };

  return (
    <>
      <PageStyles />

      <div className="relative space-y-5">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#a58bfa]/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-gradient-to-tr from-[#7dd3fc]/25 to-transparent blur-3xl" />

        {/* ===== PAGE HEADING ===== */}
        <div className="anim-fade-up relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#6D5BD0] backdrop-blur">
              <Sparkles size={10} />
              PICK UP WHERE YOU LEFT OFF
            </span>
            <h1 className="mt-2 text-xl font-black tracking-tight text-gray-800 sm:text-2xl lg:text-3xl">
              <span className="shimmer-title">Continue</span>{' '}
              <span className="bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#7dd3fc] bg-clip-text text-transparent">
                Learning.
              </span>
            </h1>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Your next step is just one click away. Keep the momentum going.
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-bold text-emerald-700 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              4 in progress
            </span>
          </div>
        </div>

        {/* ===== FEATURED RESUME ===== */}
        <FeaturedResume item={featured} onResume={handleResume} />

        {/* ===== CONTINUE WATCHING CARD ===== */}
        <div
          className="anim-fade-up relative overflow-hidden rounded-[24px] border border-white/60 bg-white/60 shadow-[0_20px_60px_-25px_rgba(109,91,208,0.45)] backdrop-blur-2xl"
          style={{ animationDelay: '40ms' }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
            <div className="aurora-a absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-[#a58bfa]/35 to-transparent blur-3xl" />
            <div className="aurora-b absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-gradient-to-tr from-[#7dd3fc]/30 to-transparent blur-3xl" />
          </div>
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.03]" />

          <div className="relative flex items-center justify-between gap-3 border-b border-white/50 px-4 py-3 sm:px-5 sm:py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C6ADD] to-[#5B48BE] text-white shadow-md shadow-violet-300/50 ring-1 ring-white/70">
                <PlayCircle size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 sm:text-base">
                  Continue Watching
                </h2>
                <p className="text-[10px] text-gray-500 sm:text-xs">
                  {others.length} lessons waiting for you
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6D5BD0] hover:text-[#5B48BE]"
            >
              See all
              <ArrowRight size={12} />
            </motion.button>
          </div>

          <div className="relative divide-y divide-white/40">
            {others.map((item, i) => (
              <ContinueRow key={item.id} item={item} index={i} onResume={handleResume} />
            ))}
          </div>
        </div>

        {/* ===== STREAK + STATS ===== */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="anim-fade-up" style={{ animationDelay: '80ms' }}>
            <StreakWidget />
          </div>
          <div
            className="anim-fade-up relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_40px_-20px_rgba(109,91,208,0.4)] backdrop-blur-2xl sm:p-5"
            style={{ animationDelay: '80ms' }}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-violet-200/40 to-transparent blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C6ADD] to-[#5B48BE] text-white shadow-md">
                  <BarChart3 size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Overview
                  </p>
                  <p className="text-base font-black text-gray-800">Your learning</p>
                </div>
              </div>
            </div>
            <div className="relative mt-3">
              <QuickStats />
            </div>
          </div>
        </div>

        {/* ===== RECOMMENDED ===== */}
        <section
          className="anim-fade-up relative overflow-hidden rounded-[24px] border border-white/60 bg-white/50 p-4 shadow-[0_15px_40px_-20px_rgba(109,91,208,0.35)] backdrop-blur-xl sm:p-5"
          style={{ animationDelay: '40ms' }}
        >
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F472B6] to-[#EC4899] text-white shadow-md shadow-pink-300/50 ring-1 ring-white/70">
                <TrendingUp size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 sm:text-base">
                  Recommended for you
                </h2>
                <p className="text-[10px] text-gray-500 sm:text-xs">
                  Trending in your program
                </p>
              </div>
            </div>
          </div>

          <div className="no-scrollbar snap-x-mandatory relative mt-4 flex gap-3 overflow-x-auto pb-2">
            {recommended.map((r, i) => (
              <RecommendedCard key={r.id} item={r} index={i} />
            ))}
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
        <section
          className="anim-fade-up relative overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-r from-violet-100/70 via-white/60 to-cyan-100/70 px-5 py-6 shadow-[0_15px_40px_-20px_rgba(109,91,208,0.4)] backdrop-blur-xl sm:px-7"
          style={{ animationDelay: '40ms' }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-[.16em] text-[#6D5BD0]">
                KEEP THE STREAK ALIVE
              </span>
              <h2 className="mt-1 text-base font-black text-gray-800 sm:text-lg">
                One more lesson today keeps you on track.
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                You're 78% done with your top course — finish strong!
              </p>
            </div>
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleResume(featured)}
              className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#5B48BE] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-300/50 sm:self-center"
            >
              <Play size={13} fill="currentColor" />
              Resume Now
            </motion.button>
          </div>
        </section>

        {/* ===== TOAST ===== */}
        <AnimatePresence>
          {lastAction && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2"
            >
              <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-4 py-2.5 shadow-xl shadow-purple-300/30 backdrop-blur-xl">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C6ADD] to-[#5B48BE] text-white">
                  <Play size={12} fill="currentColor" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-800">
                    Resuming: {lastAction.lesson}
                  </p>
                  <p className="truncate text-[10px] text-gray-500">
                    {lastAction.title}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>    
    </>
  );
}