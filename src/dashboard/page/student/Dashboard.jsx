import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Video,
  Award,
  ClipboardList,
  ArrowRight,
  RefreshCw,
  CalendarDays,
  GraduationCap,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Play,
  AlertCircle,
} from "lucide-react";

import { useStudentDashboard } from "../../hooks/student/useStudentDashboard";

// =====================================================
// Helpers
// =====================================================

const getStats = (stats) => [
  {
    label: "Enrolled Courses",
    value: stats.enrolledCourses,
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/25",
    bg: "bg-blue-50",
    text: "text-blue-600",
    trend: "+2 this month",
  },
  {
    label: "Live Classes",
    value: stats.liveClasses,
    icon: Video,
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-violet-500/25",
    bg: "bg-violet-50",
    text: "text-violet-600",
    trend: "Next: Today",
  },
  {
    label: "Certificates",
    value: stats.certificates,
    icon: Award,
    gradient: "from-amber-500 to-yellow-400",
    glow: "shadow-amber-500/25",
    bg: "bg-amber-50",
    text: "text-amber-600",
    trend: "Keep going!",
  },
  {
    label: "Assignments Due",
    value: stats.assignmentsDue,
    icon: ClipboardList,
    gradient: "from-rose-500 to-pink-400",
    glow: "shadow-rose-500/25",
    bg: "bg-rose-50",
    text: "text-rose-600",
    trend: "Action needed",
  },
];

const formatNextClass = (dateValue, timeValue) => {
  if (!dateValue) return "Not scheduled";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const sameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  let dateLabel;
  if (sameDate(date, today)) dateLabel = "Today";
  else if (sameDate(date, tomorrow)) dateLabel = "Tomorrow";
  else
    dateLabel = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  let timeLabel = "";
  if (timeValue) {
    const [h, m] = String(timeValue).split(":");
    const ph = Number(h);
    const pm = Number(m);
    if (
      Number.isInteger(ph) &&
      Number.isInteger(pm) &&
      ph >= 0 && ph <= 23 &&
      pm >= 0 && pm <= 59
    ) {
      const t = new Date();
      t.setHours(ph, pm, 0, 0);
      timeLabel = t.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  return timeLabel ? `${dateLabel}, ${timeLabel}` : dateLabel;
};

// =====================================================
// Circular Progress Component
// =====================================================

const CircularProgress = ({ value, size = 44, stroke = 4 }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
        {Math.round(value)}%
      </span>
    </div>
  );
};

// =====================================================
// Shimmer Skeleton
// =====================================================

const Shimmer = ({ className }) => (
  <div
    className={`relative overflow-hidden bg-gray-100 rounded-2xl ${className}`}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
    />
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <Shimmer className="h-24 w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <Shimmer key={i} className="h-32" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <Shimmer key={i} className="h-32" />
        ))}
      </div>
      <Shimmer className="h-[420px]" />
    </div>
  </div>
);

// =====================================================
// Main Dashboard
// =====================================================

export default function StudentDashboard() {
  const navigate = useNavigate();
  const {
    studentName,
    stats,
    courses,
    recentGrades,
    isLoading,
    error,
    refreshDashboard,
  } = useStudentDashboard();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 220, damping: 22 },
    },
  };

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl border border-red-100 rounded-3xl p-10 text-center max-w-md w-full shadow-xl shadow-red-500/5"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-400 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-500/30">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Unable to Load Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">{error}</p>
          <button
            onClick={refreshDashboard}
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 active:scale-[0.98]"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const dashboardStats = getStats(stats);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-7 pb-8"
    >
      {/* =====================================================
          HERO HEADER
      ===================================================== */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4f46e5] p-6 md:p-8 shadow-xl shadow-purple-500/20"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/3 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90 text-xs font-medium mb-3 border border-white/20">
              <Sparkles size={13} className="text-yellow-300" />
              {greeting}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, {studentName} 👋
            </h1>
            <p className="text-purple-100/90 mt-1.5 text-sm md:text-base">
              Here's your learning progress overview.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/continue")}
            disabled={courses.length === 0}
            className="group inline-flex items-center gap-2 bg-white text-[#6d28d9] hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-black/10 active:scale-[0.97]"
          >
            <Play size={16} className="fill-current" />
            Resume Learning
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </motion.div>

      {/* =====================================================
          STATS GRID
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group relative bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100/80 transition-all duration-300 overflow-hidden"
            >
              {/* Corner gradient */}
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`}
              />

              <div className="relative flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} text-white flex items-center justify-center shadow-lg ${stat.glow}`}
                >
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <span
                  className={`text-[10px] font-semibold ${stat.text} ${stat.bg} px-2 py-1 rounded-full`}
                >
                  {stat.trend}
                </span>
              </div>

              <p className="text-xs font-medium text-gray-500 mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold text-gray-800 tracking-tight">
                {stat.value}
              </h3>
            </motion.div>
          );
        })}
      </div>

      {/* =====================================================
          COURSES + GRADES
      ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- COURSES ---------- */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#7c3aed]" />
                My Courses
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Continue where you left off
              </p>
            </div>
            <button
              onClick={() => navigate("/student/batches")}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
            >
              View All
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="space-y-4">
            {courses.length > 0 ? (
              courses.map((course, idx) => (
                <motion.div
                  key={`${course.batchId}-${course.courseId}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ scale: 1.005 }}
                  className="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden"
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7c3aed] to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#7c3aed] to-blue-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                      {course.courseImage ? (
                        <img
                          src={course.courseImage}
                          alt={course.courseName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        course.courseName.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-800 text-base break-words leading-tight">
                            {course.courseName}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Batch: {course.batchName}
                            {course.batchCode && (
                              <span className="ml-1 text-gray-400">
                                ({course.batchCode})
                              </span>
                            )}
                          </p>
                        </div>
                        <CircularProgress value={course.progress} />
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + idx * 0.1 }}
                          className="bg-gradient-to-r from-[#7c3aed] to-blue-500 h-2 rounded-full"
                        />
                      </div>

                      {/* Next class */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays size={13} className="text-gray-400" />
                          <span>Next:</span>
                          <span className="font-semibold text-gray-700">
                            {formatNextClass(
                              course.nextClassDate,
                              course.nextClassTime
                            )}
                          </span>
                        </div>
                        <button
                          onClick={() => navigate("/student/continue")}
                          className="text-xs font-semibold text-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1"
                        >
                          Continue <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="relative overflow-hidden bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-60" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 text-[#7c3aed] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <GraduationCap size={30} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    No Enrolled Courses
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                    You haven't enrolled in any courses yet. Explore our catalog
                    to kickstart your learning journey.
                  </p>
                  <button
                    onClick={() => navigate("/student/explore")}
                    className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98]"
                  >
                    Explore Courses <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ---------- GRADES ---------- */}
        <motion.div variants={itemVariants} className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              Recent Grades
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Your latest assessment results
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
            {recentGrades.length > 0 ? (
              recentGrades.map((grade, idx) => {
                const percentage =
                  grade.total > 0
                    ? Math.min(
                        100,
                        Math.max(
                          0,
                          grade.percentage ||
                            (grade.score / grade.total) * 100
                        )
                      )
                    : 0;
                const isPassed = grade.isPassed;

                return (
                  <motion.div
                    key={grade.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="space-y-2.5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                        {grade.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 ${
                          isPassed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isPassed ? "PASSED" : "FAILED"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-800">
                        {grade.score}
                      </span>
                      <span className="text-gray-400 text-xs">
                        / {grade.total}
                      </span>
                      <span className="ml-auto text-xs font-semibold text-gray-500">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                        className={`h-1.5 rounded-full ${
                          isPassed
                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                            : "bg-gradient-to-r from-red-500 to-rose-400"
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ClipboardList size={24} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  No Recent Grades
                </h3>
                <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                  Your assessment results will appear here once you complete an
                  assessment.
                </p>
              </div>
            )}

            <button
              onClick={() => navigate("/student/assessments/results")}
              className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-[#7c3aed] rounded-xl transition-all flex items-center justify-center gap-1.5 group"
            >
              View All Assessments
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}