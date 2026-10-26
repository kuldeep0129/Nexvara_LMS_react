import { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Flame,
  Award,
  Target,
  Trophy,
  Zap,
  BookOpen,
  CheckCircle,
  Star,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Users,
  Briefcase,
  PlayCircle,
  Lock,
  Crown,
  Rocket,
  Medal,
  Brain,
  Code,
  Database,
  Cpu,
  Globe,
  Activity,
} from 'lucide-react';

/* =========================================================
   STYLES — stable rendering without mount animations
========================================================= */
const ProgressStyles = () => (
  <style>{`
    .shimmer-title {
      background: linear-gradient(90deg,#5145A0 0%,#7C6ADD 20%,#7dd3fc 45%,#F472B6 65%,#7C6ADD 85%,#5145A0 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .dot-grid {
      background-image: radial-gradient(circle, #6D5BD0 1px, transparent 1px);
      background-size: 22px 22px;
    }
    .no-scrollbar::-webkit-scrollbar { height: 0; width: 0; }
  `}</style>
);

/* =========================================================
   DATA
========================================================= */
const courseProgress = [
  { id: 1, title: 'Advanced Database Systems', code: 'MCA-24-A', progress: 78, totalLessons: 40, completed: 31, color: '#7C6ADD', gradient: 'from-violet-500 to-indigo-500', trend: '+8%', trendUp: true },
  { id: 2, title: 'Data Structures & Algorithms', code: 'MCA-24-A', progress: 62, totalLessons: 36, completed: 22, color: '#3B82F6', gradient: 'from-sky-500 to-blue-500', trend: '+4%', trendUp: true },
  { id: 3, title: 'Operating Systems', code: 'BCA-23-B', progress: 88, totalLessons: 42, completed: 37, color: '#10B981', gradient: 'from-emerald-500 to-teal-500', trend: '+12%', trendUp: true },
  { id: 4, title: 'Web Technologies', code: 'BCA-23-B', progress: 45, totalLessons: 30, completed: 14, color: '#F59E0B', gradient: 'from-amber-500 to-orange-500', trend: '-2%', trendUp: false },
];

const skillMastery = [
  { name: 'Databases', level: 82, color: '#7C6ADD', Icon: Database },
  { name: 'Algorithms', level: 68, color: '#3B82F6', Icon: Code },
  { name: 'System Design', level: 54, color: '#10B981', Icon: Cpu },
  { name: 'Web Dev', level: 71, color: '#F59E0B', Icon: Globe },
  { name: 'Problem Solving', level: 76, color: '#EC4899', Icon: Brain },
];

const weeklyActivity = [
  { day: 'Mon', mins: 45 }, { day: 'Tue', mins: 62 }, { day: 'Wed', mins: 38 },
  { day: 'Thu', mins: 75 }, { day: 'Fri', mins: 55 }, { day: 'Sat', mins: 20 },
  { day: 'Sun', mins: 0 },
];

const trendData = [45, 52, 48, 65, 58, 72, 68, 78, 74, 82, 78, 88];
const WEEK_GOAL = 300;

const achievements = [
  { id: 1, name: 'First Steps', desc: 'First lesson', Icon: Rocket, unlocked: true, color: 'from-emerald-400 to-teal-500', at: 'Sep 2024' },
  { id: 2, name: 'Week Streak', desc: '7-day streak', Icon: Flame, unlocked: true, color: 'from-amber-400 to-orange-500', at: 'Oct 2024' },
  { id: 3, name: 'Perfectionist', desc: '100% attendance', Icon: Star, unlocked: true, color: 'from-blue-400 to-indigo-500', at: 'Nov 2024' },
  { id: 4, name: 'Deep Diver', desc: '50 lessons', Icon: BookOpen, unlocked: true, color: 'from-violet-400 to-purple-500', at: 'Dec 2024' },
  { id: 5, name: 'Master', desc: 'Complete 3 courses', Icon: Crown, unlocked: false, color: 'from-amber-400 to-yellow-500' },
  { id: 6, name: 'Social Learner', desc: 'Join 5 discussions', Icon: Users, unlocked: false, color: 'from-pink-400 to-rose-500' },
  { id: 7, name: 'Early Bird', desc: '10 morning sessions', Icon: Trophy, unlocked: false, color: 'from-cyan-400 to-sky-500' },
  { id: 8, name: 'Top 10%', desc: 'Rank in batch', Icon: Medal, unlocked: false, color: 'from-red-400 to-rose-500' },
];

const milestones = [
  { id: 1, title: 'Mid-term Assessment', course: 'Advanced Database Systems', due: 'In 3 days', status: 'upcoming', weight: 30 },
  { id: 2, title: 'DSA Project Submission', course: 'Data Structures & Algorithms', due: 'In 5 days', status: 'upcoming', weight: 25 },
  { id: 3, title: 'OS Unit Test', course: 'Operating Systems', due: 'In 8 days', status: 'upcoming', weight: 20 },
  { id: 4, title: 'Web Tech Lab Exam', course: 'Web Technologies', due: 'Completed', status: 'done', weight: 15 },
];

const recentActivity = [
  { id: 1, action: 'Completed lesson', detail: '3NF & BCNF Deep Dive', course: 'Advanced Database Systems', time: '2h ago', Icon: CheckCircle, tone: 'text-emerald-600 bg-emerald-50' },
  { id: 2, action: 'Earned badge', detail: 'Deep Diver — 50 lessons', course: 'Achievement unlocked', time: '5h ago', Icon: Award, tone: 'text-amber-600 bg-amber-50' },
  { id: 3, action: 'Scored 92%', detail: 'DSA Quiz — Graphs', course: 'Data Structures & Algorithms', time: 'Yesterday', Icon: Star, tone: 'text-violet-600 bg-violet-50' },
  { id: 4, action: 'Joined session', detail: 'Deadlock Detection', course: 'Operating Systems', time: '2d ago', Icon: PlayCircle, tone: 'text-blue-600 bg-blue-50' },
];

const RANGES = [
  { k: 'week', l: 'This Week' },
  { k: 'month', l: 'This Month' },
  { k: 'all', l: 'All Time' },
];

/* =========================================================
   PROGRESS RING
========================================================= */
function ProgressRing({ value, color = '#7C6ADD', size = 100, stroke = 8, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.65)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none"
          strokeDasharray={c} strokeDashoffset={offset}
         
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black text-gray-800">{value}%</span>
        {label && <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>}
      </div>
    </div>
  );
}

/* =========================================================
   KPI CARD
========================================================= */
function KpiCard({ Icon, value, label, trend, trendUp, tone, delay = 0 }) {
  return (
    <div
      className="group relative overflow-hidden rounded-[18px] border border-white/60 bg-white/60 p-3.5 shadow-[0_12px_36px_-18px_rgba(109,91,208,0.35)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-4"
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${tone.bg} opacity-40 blur-xl`} />
      <div className="relative flex items-start justify-between gap-2">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone.grad} text-white shadow-md`}>
          <Icon size={16} />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${
            trendUp
              ? 'border-emerald-200/80 bg-emerald-50/80 text-emerald-700'
              : 'border-rose-200/80 bg-rose-50/80 text-rose-700'
          }`}>
            {trendUp ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
            {trend}
          </span>
        )}
      </div>
      <div className="relative mt-2.5">
        <p className="text-xl font-black leading-none text-gray-800 sm:text-2xl">{value}</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY BAR CHART
========================================================= */
function ActivityChart() {
  const max = Math.max(...weeklyActivity.map(d => d.mins), 1);
  const total = weeklyActivity.reduce((s, d) => s + d.mins, 0);
  const goalPct = Math.min(100, Math.round((total / WEEK_GOAL) * 100));

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_45px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-violet-200/40 to-transparent blur-xl" />

      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Weekly Activity</p>
          <p className="mt-1 text-sm font-black text-gray-800">
            {total} <span className="text-xs font-semibold text-gray-500">/ {WEEK_GOAL} min</span>
          </p>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
          goalPct >= 80 ? 'border-emerald-200/80 bg-emerald-50/80 text-emerald-700'
                        : goalPct >= 50 ? 'border-amber-200/80 bg-amber-50/80 text-amber-700'
                        : 'border-rose-200/80 bg-rose-50/80 text-rose-700'
        }`}>
          {goalPct}% goal
        </span>
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-1.5 sm:gap-2" style={{ height: 90 }}>
        {weeklyActivity.map((d, i) => {
          const h = Math.max(6, (d.mins / max) * 78);
          const isActive = d.mins > 0;
          const isToday = i === 4;
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-1.5" style={{ height: '100%' }}>
              <div
                className={` w-full rounded-md ${
                  isToday
                    ? 'bg-gradient-to-t from-[#5B48BE] to-[#a58bfa] ring-2 ring-violet-300/50'
                    : isActive
                    ? 'bg-gradient-to-t from-[#7C6ADD] to-[#a58bfa]'
                    : 'bg-white/60 ring-1 ring-white/70'
                }`}
                style={{ height: h }}
                title={`${d.mins} min`}
              />
              <span className={`text-[9px] font-bold ${isToday ? 'text-[#6D5BD0]' : 'text-gray-400'}`}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   TREND LINE CHART
========================================================= */
function TrendChart() {
  const w = 300, h = 80, pad = 6;
  const max = Math.max(...trendData);
  const min = Math.min(...trendData);
  const step = (w - pad * 2) / (trendData.length - 1);

  const pts = trendData.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return [x, y];
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = `${path} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
  const totalLen = 600;

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_45px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:p-5">
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gradient-to-tr from-cyan-200/40 to-transparent blur-xl" />

      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Performance Trend</p>
          <p className="mt-1 text-sm font-black text-gray-800">
            Last 12 weeks
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          <TrendingUp size={9} /> +18%
        </span>
      </div>

      <div className="relative mt-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7C6ADD" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7C6ADD" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#trendFill)" />
          <path
            d={path}
            stroke="#7C6ADD" strokeWidth="2" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={totalLen} strokeDashoffset={0}
           
          />
          {pts.map(([x, y], i) => (
            <circle
              key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4 : 2.5}
              fill={i === pts.length - 1 ? '#5B48BE' : '#7C6ADD'}
              stroke="white" strokeWidth="1.5"
             
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* =========================================================
   COURSE PROGRESS CARD
========================================================= */
function CourseProgressCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_45px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:p-5">
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-200/30 to-transparent blur-xl" />

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C6ADD] to-[#5B48BE] text-white shadow-sm">
            <BookOpen size={14} />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Course Progress</h3>
        </div>
        <button className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6D5BD0] hover:text-[#5B48BE]">
          View all <ChevronRight size={11} />
        </button>
      </div>

      <div className="relative mt-4 space-y-3.5">
        {courseProgress.map((c, i) => (
          <div key={c.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 ring-1 ring-white/70">
                    {c.code}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    c.trendUp
                      ? 'bg-emerald-50/80 text-emerald-700'
                      : 'bg-rose-50/80 text-rose-700'
                  }`}>
                    {c.trendUp ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
                    {c.trend}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs font-bold text-gray-800">{c.title}</p>
                <p className="text-[10px] text-gray-500">{c.completed}/{c.totalLessons} lessons</p>
              </div>
              <span className="text-sm font-black" style={{ color: c.color }}>
                {c.progress}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-white/60">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${c.progress}%`,
                  background: `linear-gradient(90deg, ${c.color}, ${c.color}cc)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SKILL MASTERY
========================================================= */
function SkillCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_45px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:p-5">
      <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-pink-200/30 to-transparent blur-xl" />

      <div className="relative flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-sm">
          <Brain size={14} />
        </div>
        <h3 className="text-sm font-bold text-gray-800">Skill Mastery</h3>
      </div>

      <div className="relative mt-4 space-y-3">
        {skillMastery.map((s, i) => (
          <div key={s.name}>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
              <span className="inline-flex items-center gap-1.5 text-gray-700">
                <s.Icon size={11} style={{ color: s.color }} />
                {s.name}
              </span>
              <span style={{ color: s.color }}>{s.level}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-white/60">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${s.level}%`,
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ACHIEVEMENTS
========================================================= */
function AchievementsCard() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_45px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-amber-200/40 to-transparent blur-xl" />

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-white shadow-sm">
            <Award size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Achievements</h3>
            <p className="text-[10px] text-gray-500">{unlockedCount}/{achievements.length} unlocked</p>
          </div>
        </div>
      </div>

      <div className="relative mt-3 grid grid-cols-4 gap-2">
        {achievements.map((a, i) => (
          <div
            key={a.id}
            className={` relative flex flex-col items-center gap-1 rounded-xl border p-2 transition ${
              a.unlocked
                ? 'border-white/70 bg-white/70 hover:-translate-y-0.5 hover:shadow-md'
                : 'border-white/50 bg-white/30 opacity-60'
            }`}
            title={a.desc}
          >
            <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${a.color} text-white shadow-sm`}>
              {a.unlocked ? <a.Icon size={13} /> : <Lock size={12} />}
            </div>
            <p className="line-clamp-1 w-full text-center text-[9px] font-bold text-gray-700">
              {a.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MILESTONES TIMELINE
========================================================= */
function MilestonesCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_45px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:p-5">
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] text-white shadow-sm">
            <Target size={14} />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Upcoming Milestones</h3>
        </div>
      </div>

      <div className="relative mt-4 space-y-3">
        {milestones.map((m, i) => {
          const isDone = m.status === 'done';
          return (
            <div key={m.id} className="relative flex gap-3">
              <div className="relative flex flex-col items-center">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-white ${
                  isDone
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                    : 'bg-gradient-to-br from-[#7C6ADD] to-[#5B48BE] text-white'
                }`}>
                  {isDone ? <CheckCircle size={13} /> : <Calendar size={12} />}
                </div>
                {i < milestones.length - 1 && (
                  <div className="mt-1 w-0.5 flex-1 bg-gradient-to-b from-violet-200 to-transparent" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold ${isDone ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {m.title}
                    </p>
                    <p className="truncate text-[10px] text-gray-500">{m.course}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    isDone
                      ? 'bg-emerald-50/80 text-emerald-700'
                      : 'bg-amber-50/80 text-amber-700'
                  }`}>
                    {m.due}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className="font-semibold">Weight: {m.weight}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   RECENT ACTIVITY
========================================================= */
function ActivityFeed() {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-[0_15px_45px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:p-5">
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C6ADD] to-[#5B48BE] text-white shadow-sm">
            <Activity size={14} />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Recent Activity</h3>
        </div>
        <button className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6D5BD0] hover:text-[#5B48BE]">
          View all <ChevronRight size={11} />
        </button>
      </div>

      <div className="relative mt-3 divide-y divide-white/40">
        {recentActivity.map((a, i) => (
          <div key={a.id} className="flex items-start gap-2.5 py-2.5">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${a.tone}`}>
              <a.Icon size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-800">
                {a.action}
              </p>
              <p className="truncate text-[10px] text-gray-500">
                {a.detail} · {a.course}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold text-gray-400">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */
export default function ProgressPage() {
  const [range, setRange] = useState('week');

  // Values change with range to make tabs meaningful
  const viewStats = useMemo(() => {
    if (range === 'week')  return { overall: 74, hours: 28, rank: 8,  streak: 12, completed: 24, trendOverall: '+6%',  trendUp: true };
    if (range === 'month') return { overall: 68, hours: 112, rank: 6, streak: 12, completed: 82, trendOverall: '+15%', trendUp: true };
    return { overall: 62, hours: 384, rank: 5, streak: 12, completed: 248, trendOverall: '+32%', trendUp: true };
  }, [range]);

  return (
    <>
      <ProgressStyles />

      <div className="relative space-y-4">
        {/* Page aurora */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#a58bfa]/30 to-transparent blur-xl" />
        <div className="pointer-events-none absolute -left-20 top-40 h-64 w-64 rounded-full bg-gradient-to-tr from-[#7dd3fc]/25 to-transparent blur-xl" />

        {/* =====================
            HERO HEADING
        ===================== */}
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#6D5BD0] backdrop-blur">
              <Sparkles size={10} />
              PROGRESS & ANALYTICS
            </span>
            <h1 className="mt-2 text-xl font-black tracking-tight text-gray-800 sm:text-2xl lg:text-3xl">
              <span className="shimmer-title">Your</span>{' '}
              <span className="bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#7dd3fc] bg-clip-text text-transparent">
                Progress.
              </span>
            </h1>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Track growth, celebrate wins, and level up every day.
            </p>
          </div>

          {/* Range tabs */}
          <div className="inline-flex rounded-lg border border-white/70 bg-white/60 p-0.5 backdrop-blur">
            {RANGES.map((r) => {
              const active = range === r.k;
              return (
                <button
                  key={r.k}
                  onClick={() => setRange(r.k)}
                  className={`relative shrink-0 overflow-hidden rounded-md px-3 py-1.5 text-[11px] font-bold transition sm:text-xs ${
                    active ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {active && (
                    <span
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-[#7C6ADD] to-[#5B48BE] shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{r.l}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================
            OVERALL PROGRESS HERO
        ===================== */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/60 shadow-[0_20px_60px_-25px_rgba(109,91,208,0.45)] backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#a58bfa]/45 to-transparent blur-xl" />
            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gradient-to-tr from-[#7dd3fc]/40 to-transparent blur-xl" />
          </div>
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.03]" />

          <div className="relative grid gap-5 p-5 sm:p-6 lg:grid-cols-[auto_1fr] lg:items-center">
            {/* Big ring */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <ProgressRing value={viewStats.overall} color="#7C6ADD" size={140} stroke={10} label="Overall" />
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md ring-2 ring-white">
                  <Flame size={14} />
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-[#6D5BD0]" />
                <h2 className="text-sm font-bold text-gray-800 sm:text-base">
                  Great momentum, keep going!
                </h2>
              </div>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                You're ahead of 68% of students in your batch. You've completed{' '}
                <strong className="text-gray-700">{viewStats.completed} lessons</strong> in this{' '}
                {range === 'week' ? 'week' : range === 'month' ? 'month' : 'program'}.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <KpiCard Icon={Clock} value={`${viewStats.hours}h`} label="Hours" trend="+4h" trendUp tone={{ grad: 'from-[#7C6ADD] to-[#5B48BE]', bg: 'from-violet-200 to-purple-200' }} delay={120} />
                <KpiCard Icon={Flame} value={`${viewStats.streak}d`} label="Streak" trend="+2d" trendUp tone={{ grad: 'from-[#F59E0B] to-[#FBBF24]', bg: 'from-amber-200 to-orange-200' }} delay={160} />
                <KpiCard Icon={Trophy} value={`#${viewStats.rank}`} label="Rank" trend="+2" trendUp tone={{ grad: 'from-[#3B82F6] to-[#06B6D4]', bg: 'from-sky-200 to-cyan-200' }} delay={200} />
                <KpiCard Icon={CheckCircle} value={viewStats.completed} label="Lessons" trend="+12" trendUp tone={{ grad: 'from-[#10B981] to-[#14B8A6]', bg: 'from-emerald-200 to-teal-200' }} delay={240} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================
            CHARTS ROW
        ===================== */}
        <div className="grid gap-3 md:grid-cols-2">
          <ActivityChart />
          <TrendChart />
        </div>

        {/* =====================
            COURSES + SKILLS
        ===================== */}
        <div className="grid gap-3 lg:grid-cols-2">
          <CourseProgressCard />
          <SkillCard />
        </div>

        {/* =====================
            ACHIEVEMENTS + MILESTONES + ACTIVITY
        ===================== */}
        <div className="grid gap-3 lg:grid-cols-3">
          <AchievementsCard />
          <MilestonesCard />
          <ActivityFeed />
        </div>

        {/* =====================
            DOWNLOAD / CTA
        ===================== */}
        <div className="relative overflow-hidden rounded-[20px] border border-white/60 bg-gradient-to-r from-violet-100/70 via-white/60 to-cyan-100/70 px-5 py-5 shadow-[0_15px_40px_-20px_rgba(109,91,208,0.4)] backdrop-blur-sm sm:px-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-violet-200/40 blur-xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-cyan-200/40 blur-xl" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-[.16em] text-[#6D5BD0]">
                EXPORT YOUR PROGRESS
              </span>
              <h2 className="mt-1 text-base font-black text-gray-800 sm:text-lg">
                Share your growth with mentors or future employers.
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Get a detailed PDF report of all your courses, skills, and achievements.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#7C6ADD] via-[#6D5BD0] to-[#5B48BE] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-300/50 sm:self-center"
            >
              <Download size={14} />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}