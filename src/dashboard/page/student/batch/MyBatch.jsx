import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import {
  Search,
  X,
  ChevronRight,
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  PlayCircle,
  Radio,
  CheckCircle,
  Trophy,
  Download,
  TrendingUp,
  GraduationCap,
  Video,
} from 'lucide-react';

/* =========================================================
   STYLES — CSS-first (background-tab safe)
========================================================= */
const BatchStyles = () => (
  <style>{`
    @keyframes auroraA {
      0%,100% { transform: translate(0,0) scale(1); }
      50%     { transform: translate(28px,-24px) scale(1.12); }
    }
    @keyframes auroraB {
      0%,100% { transform: translate(0,0) scale(1); }
      50%     { transform: translate(-32px,-20px) scale(1.15); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes barFill {
      from { width: 0; }
    }
    @keyframes livePulse {
      0%,100% { transform: scale(1); }
      50%     { transform: scale(1.05); }
    }
    @keyframes iconPop {
      from { transform: rotate(-6deg) scale(0.9); opacity: 0; }
      to   { transform: rotate(0) scale(1); opacity: 1; }
    }

    /* Keep route navigation immediate: avoid mount-time and infinite animations. */
    .anim-fade-up, .anim-fade-in, .bar-fill, .live-pulse, .icon-pop,
    .aurora-a, .aurora-b {
      animation: none !important;
      opacity: 1;
      transform: none;
    }

    .dot-grid {
      background-image: radial-gradient(circle, #6D5BD0 1px, transparent 1px);
      background-size: 22px 22px;
    }
    .no-scrollbar::-webkit-scrollbar { height: 0; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
      }
    }
  `}</style>
);

/* =========================================================
   DATA
========================================================= */
const studentBatches = [
  {
    id: 1, code: 'MCA-24-A', title: 'Advanced Database Systems',
    faculty: 'Dr. Rajesh Verma', initials: 'RV',
    facultyColor: 'from-violet-500 to-indigo-500',
    mode: 'Offline', room: 'Lab 204, Block B',
    schedule: 'Mon, Wed, Fri', time: '10:00 – 11:30 AM',
    progress: 78, totalClasses: 40, attendedClasses: 31, status: 'active',
    nextClass: { topic: 'Normalization & Indexing', when: 'Today', time: '10:00 AM', minutesFromNow: 45 },
  },
  {
    id: 2, code: 'MCA-24-A', title: 'Data Structures & Algorithms',
    faculty: 'Prof. Anita Gupta', initials: 'AG',
    facultyColor: 'from-sky-500 to-blue-500',
    mode: 'Hybrid', room: 'Room 301',
    schedule: 'Tue, Thu', time: '2:00 – 3:30 PM',
    progress: 62, totalClasses: 36, attendedClasses: 22, status: 'active',
    nextClass: { topic: 'Graphs — BFS & DFS', when: 'Tomorrow', time: '2:00 PM', minutesFromNow: 24 * 60 },
  },
  {
    id: 3, code: 'BCA-23-B', title: 'Operating Systems',
    faculty: 'Prof. Meera Singh', initials: 'MS',
    facultyColor: 'from-emerald-500 to-teal-500',
    mode: 'Offline', room: 'Room 205',
    schedule: 'Tue, Thu, Sat', time: '9:00 – 10:30 AM',
    progress: 88, totalClasses: 42, attendedClasses: 37, status: 'active',
    nextClass: { topic: 'Deadlock Detection', when: 'Today', time: '9:00 AM', minutesFromNow: 15 },
  },
  {
    id: 4, code: 'BCA-23-B', title: 'Web Technologies',
    faculty: 'Dr. Suresh Kumar', initials: 'SK',
    facultyColor: 'from-orange-500 to-amber-500',
    mode: 'Online', room: 'Microsoft Teams',
    schedule: 'Mon, Wed', time: '4:00 – 5:30 PM',
    progress: 45, totalClasses: 30, attendedClasses: 14, status: 'active',
    nextClass: { topic: 'React Hooks Deep Dive', when: 'Wed', time: '4:00 PM', minutesFromNow: 2 * 24 * 60 },
  },
  {
    id: 5, code: 'MCA-23-C', title: 'Computer Networks',
    faculty: 'Dr. Amit Patel', initials: 'AP',
    facultyColor: 'from-pink-500 to-rose-500',
    mode: 'Offline', room: 'Lab 302',
    schedule: 'Wed, Fri', time: '11:00 – 12:30 PM',
    progress: 100, totalClasses: 32, attendedClasses: 32, status: 'completed',
    nextClass: null,
  },
  {
    id: 6, code: 'MCA-24-A', title: 'Machine Learning Foundations',
    faculty: 'Dr. Neha Sharma', initials: 'NS',
    facultyColor: 'from-purple-500 to-fuchsia-500',
    mode: 'Hybrid', room: 'Room 401',
    schedule: 'Mon, Thu', time: '3:00 – 4:30 PM',
    progress: 0, totalClasses: 28, attendedClasses: 0, status: 'upcoming',
    nextClass: { topic: 'Orientation & Kickoff', when: 'Apr 01', time: '3:00 PM', minutesFromNow: 6 * 24 * 60 },
  },
];

const statusMeta = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80',
  },
  completed: {
    label: 'Completed',
    dot: 'bg-blue-500',
    chip: 'bg-blue-50/80 text-blue-700 border-blue-200/80',
  },
  upcoming: {
    label: 'Upcoming',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50/80 text-amber-700 border-amber-200/80',
  },
};

/* =========================================================
   PROGRESS BAR — pure CSS animation
========================================================= */
function ProgressBar({ value }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-white/60">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#7C6ADD] to-[#5B48BE]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* =========================================================
   DETAIL MODAL (glass — user-triggered, safe with motion)
========================================================= */
function BatchDetailModal({ batch, onClose }) {
  const meta = statusMeta[batch.status];

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#120a24]/60 p-3 backdrop-blur-sm sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.25, type: 'spring', stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-white/60 bg-white/85 p-5 shadow-[0_30px_80px_-20px_rgba(109,91,208,0.55)] backdrop-blur-sm sm:p-6"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/80 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${batch.facultyColor} text-sm font-bold text-white shadow-sm ring-2 ring-white/70`}
          >
            {batch.initials}
          </div>
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 ring-1 ring-white/70">
                {batch.code}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold ${meta.chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-800">{batch.title}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{batch.faculty}</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-white/70 bg-white/60 p-3 backdrop-blur">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span className="text-gray-600">Attendance Progress</span>
            <span className="text-[#6D5BD0]">{batch.progress}%</span>
          </div>
          <ProgressBar value={batch.progress} />
          <p className="mt-1.5 text-[10px] text-gray-500">
            {batch.attendedClasses} of {batch.totalClasses} classes attended
          </p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { l: 'Mode', v: batch.mode },
            { l: 'Room', v: batch.room.split(',')[0] },
            { l: 'Schedule', v: batch.schedule.split(',')[0] },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-lg border border-white/70 bg-white/70 p-2 text-center backdrop-blur"
            >
              <p className="truncate text-xs font-bold text-gray-700">{s.v}</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                {s.l}
              </p>
            </div>
          ))}
        </div>

        {batch.nextClass ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-violet-200/70 bg-gradient-to-r from-violet-50/80 to-cyan-50/60 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6D5BD0] shadow-sm">
              <Radio size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-800">{batch.nextClass.topic}</p>
              <p className="mt-0.5 text-[10px] text-gray-500">
                {batch.nextClass.when} • {batch.nextClass.time}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/70 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
              <Trophy size={14} />
            </div>
            <p className="text-xs font-bold text-emerald-700">
              Batch completed — Certificate ready
            </p>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#5B48BE] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-300/40"
          >
            <PlayCircle size={15} />
            {batch.status === 'completed' ? 'Rewatch' : 'Continue'}
          </motion.button>
          {batch.status === 'completed' && (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Download size={15} />
              Certificate
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   ROW — CSS entrance, no motion at mount
========================================================= */
function BatchRow({ batch, index, onOpen }) {
  const meta = statusMeta[batch.status];
  const isLive =
    batch.nextClass &&
    batch.nextClass.minutesFromNow <= 60 &&
    batch.nextClass.minutesFromNow > 0;

  const countdown = !batch.nextClass
    ? ''
    : batch.nextClass.minutesFromNow >= 60
    ? `${Math.floor(batch.nextClass.minutesFromNow / 60)}h`
    : `${batch.nextClass.minutesFromNow}m`;

  return (
    <div
      className="group relative px-4 py-4 transition-colors duration-200 hover:bg-white/50 sm:px-5"
    >
      <span className="pointer-events-none absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#7C6ADD] to-[#5B48BE] opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* LEFT — identity */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${batch.facultyColor} text-xs font-bold text-white shadow-sm ring-2 ring-white/70`}
          >
            {batch.initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 ring-1 ring-white/70">
                {batch.code}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold ${meta.chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              {isLive && (
                <span className="inline-flex items-center gap-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-red-300">
                  <Radio size={8} /> LIVE
                </span>
              )}
            </div>

            <h3 className="truncate text-sm font-bold text-gray-800 sm:text-base">
              {batch.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-gray-500">{batch.faculty}</p>
          </div>
        </div>

        {/* MIDDLE — schedule meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600 lg:w-[22%] lg:flex-col lg:gap-y-1.5">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} className="shrink-0 text-[#8D7AE8]" />
            <span className="truncate">{batch.schedule}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} className="shrink-0 text-[#8D7AE8]" />
            <span className="truncate">{batch.time}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-[#8D7AE8]" />
            <span className="truncate">{batch.room}</span>
          </span>
        </div>

        {/* PROGRESS */}
        <div className="w-full lg:w-[18%]">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
            <span className="text-gray-500">Progress</span>
            <span className="text-[#6D5BD0]">{batch.progress}%</span>
          </div>
          <ProgressBar value={batch.progress} />
          <p className="mt-1 text-[10px] text-gray-400">
            {batch.attendedClasses}/{batch.totalClasses} classes
          </p>
        </div>

        {/* NEXT CLASS */}
        <div className="w-full lg:w-[15%]">
          {batch.nextClass ? (
            <div
              className={`rounded-lg border px-2.5 py-2 backdrop-blur ${
                isLive
                  ? 'border-red-200/80 bg-red-50/70'
                  : 'border-violet-200/60 bg-gradient-to-br from-violet-50/70 to-cyan-50/50'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {isLive ? 'Live now' : 'Next class'}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-gray-800">
                {batch.nextClass.when} • {batch.nextClass.time}
              </p>
              {!isLive && countdown && (
                <p className="mt-0.5 text-[10px] font-bold text-[#6D5BD0]">
                  in {countdown}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-2.5 py-2 backdrop-blur">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-emerald-600" />
                <p className="text-[11px] font-bold text-emerald-700">Completed</p>
              </div>
            </div>
          )}
        </div>

        {/* ACTION */}
        <div className="w-full lg:w-auto lg:shrink-0">
          <button
            onClick={() => onOpen(batch)}
            className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#5B48BE] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-violet-300/40 transition hover:shadow-lg hover:shadow-violet-300/60 sm:text-sm lg:w-auto"
          >
            {batch.status === 'completed' ? (
              <>
                <PlayCircle size={13} /> Rewatch
              </>
            ) : batch.status === 'upcoming' ? (
              <>
                <BookOpen size={13} /> Preview
              </>
            ) : (
              <>
                <Video size={13} /> Enter
              </>
            )}
            <ChevronRight
              size={13}
              className="transition-transform group-hover/btn:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */
export default function MyBatches() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('progress');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return studentBatches
      .filter((b) => {
        const matchSearch =
          !q ||
          [b.title, b.code, b.faculty, b.room, b.schedule]
            .join(' ')
            .toLowerCase()
            .includes(q);
        const matchStatus = status === 'all' || b.status === status;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (sort === 'progress') return b.progress - a.progress;
        if (sort === 'name') return a.title.localeCompare(b.title);
        if (sort === 'recent') return b.id - a.id;
        return 0;
      });
  }, [search, status, sort]);

  const statusTabs = [
    { k: 'all', l: 'All', count: studentBatches.length },
    { k: 'active', l: 'Active', count: studentBatches.filter((b) => b.status === 'active').length },
    { k: 'completed', l: 'Completed', count: studentBatches.filter((b) => b.status === 'completed').length },
    { k: 'upcoming', l: 'Upcoming', count: studentBatches.filter((b) => b.status === 'upcoming').length },
  ];

  return (
    <>
      <BatchStyles />

      <div className="relative space-y-4">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#a58bfa]/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-gradient-to-tr from-[#7dd3fc]/25 to-transparent blur-3xl" />

        {/* PAGE HEADING */}
        <div className="relative">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">My Batches</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            View your enrolled batches, schedules and progress.
          </p>
        </div>

        {/* SINGLE GLASS CARD */}
        <div
          className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/60 shadow-[0_20px_60px_-25px_rgba(109,91,208,0.45)] backdrop-blur-sm"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-[#a58bfa]/40 to-transparent blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-gradient-to-tr from-[#7dd3fc]/40 to-transparent blur-3xl" />
          </div>
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.03]" />

          {/* HEADER */}
          <div className="relative flex items-center justify-between gap-3 border-b border-white/50 px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C6ADD] to-[#5B48BE] text-white shadow-md shadow-violet-300/50 ring-1 ring-white/70">
                <GraduationCap size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 sm:text-base">
                  Enrolled Batches
                </h2>
                <p className="text-[10px] text-gray-500 sm:text-xs">
                  {studentBatches.length} total batches
                </p>
              </div>
            </div>
            <span
              key={filtered.length}
              className="shrink-0 rounded-full border border-violet-200/70 bg-violet-100/80 px-2.5 py-1 text-[10px] font-bold text-violet-700 backdrop-blur sm:text-xs"
            >
              {filtered.length} shown
            </span>
          </div>

          {/* TOOLBAR */}
          <div className="relative border-b border-white/50 px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 backdrop-blur transition focus-within:border-[#8D7AE8] focus-within:ring-2 focus-within:ring-violet-200/50">
                <Search size={15} className="shrink-0 text-[#8D7AE8]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by batch, faculty, room..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => setSearch('')}
                      aria-label="Clear search"
                      className="rounded-full p-0.5 text-gray-400 transition hover:bg-white hover:text-gray-700"
                    >
                      <X size={13} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 backdrop-blur sm:w-44">
                <TrendingUp size={14} className="shrink-0 text-[#8D7AE8]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-gray-700 outline-none sm:text-sm"
                >
                  <option value="progress">By progress</option>
                  <option value="recent">Most recent</option>
                  <option value="name">A → Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* STATUS TABS */}
          <div className="relative border-b border-white/50 px-4 py-2.5 sm:px-5">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
              {statusTabs.map((t) => {
                const isActive = status === t.k;
                return (
                  <button
                    key={t.k}
                    onClick={() => setStatus(t.k)}
                    className={`relative shrink-0 overflow-hidden rounded-md px-3 py-1.5 text-[11px] font-semibold transition sm:text-xs ${
                      isActive
                        ? 'text-white shadow-sm shadow-violet-300/40'
                        : 'bg-white/50 text-gray-600 backdrop-blur hover:bg-white/80'
                    }`}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-md bg-gradient-to-r from-[#7C6ADD] to-[#5B48BE]"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      {t.l}
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] ${
                          isActive ? 'bg-white/20' : 'bg-white text-gray-500'
                        }`}
                      >
                        {t.count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ROWS */}
          {filtered.length > 0 ? (
            <div className="relative divide-y divide-white/40">
              {filtered.map((batch, i) => (
                <BatchRow
                  key={batch.id}
                  batch={batch}
                  index={i}
                  onOpen={setSelected}
                />
              ))}
            </div>
          ) : (
            <div className="relative px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/70 bg-white/70 text-[#8D7AE8] backdrop-blur">
                <Search size={20} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-700">No batches found</h3>
              <p className="mt-1 text-xs text-gray-500">
                Try a different search or status filter.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7C6ADD] to-[#5B48BE] px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-300/40 transition hover:shadow-lg"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* FOOTER */}
          <div className="relative flex items-center justify-between border-t border-white/50 bg-white/40 px-4 py-2.5 text-[11px] text-gray-500 backdrop-blur sm:px-5">
            <span>
              Showing <strong className="text-gray-700">{filtered.length}</strong> of{' '}
              {studentBatches.length} batches
            </span>
            <span className="hidden sm:inline">
              {studentBatches.filter((b) => b.status === 'active').length} active
            </span>
          </div>
        </div>

        {/* MODAL — user-triggered, safe */}
        <AnimatePresence>
          {selected && (
            <BatchDetailModal
              key={selected.id}
              batch={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}