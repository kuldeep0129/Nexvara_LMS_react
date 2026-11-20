import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  CalendarDays,
  Clock3,
  FileQuestion,
  Award,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowUpRight,
  Eye,
  TrendingUp,
  Target,
  BarChart3,
  Trophy,
  X,
  BookOpen,
} from "lucide-react";

/* =========================================================
   DEMO DATA
========================================================= */

const assessmentResults = [
  {
    id: 1,
    title: "ASP.NET Core Web API Assessment",
    course: "ASP.NET Core Mastery",
    module: "Web API Fundamentals",
    type: "Quiz",
    date: "28 Oct 2026",
    completedAt: "28 Oct 2026, 10:42 AM",
    duration: 45,
    timeTaken: 38,
    questions: 30,
    attempted: 29,
    correct: 24,
    wrong: 5,
    skipped: 1,
    totalMarks: 50,
    obtainedMarks: 42,
    percentage: 84,
    passingMarks: 20,
    status: "Passed",
    grade: "A",
    attempts: 1,
    maxAttempts: 1,
  },
  {
    id: 2,
    title: "Entity Framework Core Evaluation",
    course: "ASP.NET Core Mastery",
    module: "Entity Framework Core",
    type: "Assessment",
    date: "25 Oct 2026",
    completedAt: "25 Oct 2026, 03:05 PM",
    duration: 60,
    timeTaken: 52,
    questions: 40,
    attempted: 38,
    correct: 31,
    wrong: 7,
    skipped: 2,
    totalMarks: 60,
    obtainedMarks: 48,
    percentage: 80,
    passingMarks: 24,
    status: "Passed",
    grade: "A",
    attempts: 1,
    maxAttempts: 2,
  },
  {
    id: 3,
    title: "React Hooks & State Management Quiz",
    course: "React Advanced",
    module: "React Hooks",
    type: "Quiz",
    date: "22 Oct 2026",
    completedAt: "22 Oct 2026, 12:02 PM",
    duration: 30,
    timeTaken: 29,
    questions: 25,
    attempted: 23,
    correct: 17,
    wrong: 6,
    skipped: 2,
    totalMarks: 40,
    obtainedMarks: 27,
    percentage: 67.5,
    passingMarks: 16,
    status: "Passed",
    grade: "B+",
    attempts: 1,
    maxAttempts: 1,
  },
  {
    id: 4,
    title: "JWT Authentication & Security Test",
    course: "ASP.NET Core Mastery",
    module: "Authentication & Security",
    type: "Test",
    date: "18 Oct 2026",
    completedAt: "18 Oct 2026, 03:49 PM",
    duration: 45,
    timeTaken: 45,
    questions: 35,
    attempted: 32,
    correct: 15,
    wrong: 17,
    skipped: 3,
    totalMarks: 50,
    obtainedMarks: 18,
    percentage: 36,
    passingMarks: 20,
    status: "Failed",
    grade: "C",
    attempts: 2,
    maxAttempts: 2,
  },
  {
    id: 5,
    title: "Data Structures Practice Assessment",
    course: "Interview Preparation",
    module: "Data Structures",
    type: "Assessment",
    date: "15 Oct 2026",
    completedAt: "15 Oct 2026, 11:38 AM",
    duration: 75,
    timeTaken: 63,
    questions: 50,
    attempted: 47,
    correct: 39,
    wrong: 8,
    skipped: 3,
    totalMarks: 100,
    obtainedMarks: 78,
    percentage: 78,
    passingMarks: 40,
    status: "Passed",
    grade: "B+",
    attempts: 1,
    maxAttempts: 2,
  },
  {
    id: 6,
    title: "Full Stack Development Mock Test",
    course: "Full Stack Development",
    module: "Final Evaluation",
    type: "Mock Test",
    date: "10 Oct 2026",
    completedAt: "10 Oct 2026, 02:27 PM",
    duration: 90,
    timeTaken: 84,
    questions: 60,
    attempted: 57,
    correct: 48,
    wrong: 9,
    skipped: 3,
    totalMarks: 100,
    obtainedMarks: 86,
    percentage: 86,
    passingMarks: 40,
    status: "Passed",
    grade: "A",
    attempts: 1,
    maxAttempts: 1,
  },
];

/* =========================================================
   FILTER DATA
========================================================= */

const courses = [
  "All Courses",
  "ASP.NET Core Mastery",
  "React Advanced",
  "Interview Preparation",
  "Full Stack Development",
];

const resultStatuses = [
  "All Results",
  "Passed",
  "Failed",
];

/* =========================================================
   BLOB BUTTON
========================================================= */

function BlobButton({
  children,
  icon,
  variant = "primary",
  className = "",
  onClick,
}) {
  const variants = {
    primary:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300",

    secondary:
      "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300",

    blue:
      "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300",

    amber:
      "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${variants[variant]} ${className}`}
    >
      <span className="pointer-events-none absolute -right-5 -top-5 h-10 w-10 rounded-full bg-white/70 blur-md transition-all duration-300 group-hover:scale-150" />

      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectBox({
  value,
  onChange,
  options,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   RESULT STATUS
========================================================= */

function StatusBadge({ status }) {
  if (status === "Passed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
        <CheckCircle2 size={12} />
        PASSED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
      <XCircle size={12} />
      FAILED
    </span>
  );
}

/* =========================================================
   RESULT CARD
========================================================= */

function ResultCard({ result, onView }) {
  const accuracy =
    result.attempted > 0
      ? Math.round((result.correct / result.attempted) * 100)
      : 0;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Left */}
        <div className="flex min-w-0 flex-1 gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              result.status === "Passed"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {result.status === "Passed" ? (
              <Trophy size={21} />
            ) : (
              <Target size={21} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {result.title}
              </h3>

              <StatusBadge status={result.status} />
            </div>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {result.course} • {result.module}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays size={14} className="text-slate-400" />
                {result.date}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock3 size={14} className="text-slate-400" />
                {result.timeTaken} / {result.duration} min
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <FileQuestion size={14} className="text-slate-400" />
                {result.questions} Questions
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Award size={14} className="text-slate-400" />
                {result.obtainedMarks} / {result.totalMarks}
              </div>
            </div>

            {/* Question Stats */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 size={12} />
                {result.correct} Correct
              </span>

              <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
                <XCircle size={12} />
                {result.wrong} Wrong
              </span>

              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                <MinusCircle size={12} />
                {result.skipped} Skipped
              </span>

              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                {accuracy}% Accuracy
              </span>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-5 border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="min-w-[85px] text-center">
            <p className="text-[11px] font-medium text-slate-400">
              Score
            </p>

            <p
              className={`mt-0.5 text-2xl font-black ${
                result.status === "Passed"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {result.percentage}%
            </p>

            <p className="text-[11px] font-semibold text-slate-400">
              Grade {result.grade}
            </p>
          </div>

          <div className="h-12 w-px bg-slate-100" />

          <div className="flex flex-wrap gap-2">
            <BlobButton
              variant="secondary"
              className="rounded-xl px-3 py-2 text-xs"
              icon={<Eye size={14} />}
              onClick={() => onView(result)}
            >
              View Result
            </BlobButton>

            <BlobButton
              variant="primary"
              className="rounded-xl px-3 py-2 text-xs"
              icon={<ArrowUpRight size={14} />}
              onClick={() => onView(result)}
            >
              Review
            </BlobButton>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   RESULT DETAIL MODAL
========================================================= */

function ResultDetailModal({ result, onClose }) {
  if (!result) return null;

  const accuracy =
    result.attempted > 0
      ? Math.round((result.correct / result.attempted) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-5 sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Assessment Result
              </h2>

              <StatusBadge status={result.status} />
            </div>

            <p className="mt-1 text-xs text-slate-400">
              {result.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Score Hero */}
          <section
            className={`rounded-3xl border p-6 ${
              result.status === "Passed"
                ? "border-emerald-100 bg-emerald-50/60"
                : "border-rose-100 bg-rose-50/60"
            }`}
          >
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Final Score
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className={`text-5xl font-black ${
                      result.status === "Passed"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {result.obtainedMarks}
                  </span>

                  <span className="text-lg font-semibold text-slate-400">
                    / {result.totalMarks}
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {result.percentage}% • Grade {result.grade}
                </p>
              </div>

              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-sm ring-8 ring-white/60">
                <p className="text-3xl font-black text-slate-900">
                  {result.percentage}%
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Score
                </p>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] text-slate-400">
                Correct
              </p>

              <p className="mt-1 text-xl font-bold text-emerald-600">
                {result.correct}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] text-slate-400">
                Wrong
              </p>

              <p className="mt-1 text-xl font-bold text-rose-600">
                {result.wrong}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] text-slate-400">
                Skipped
              </p>

              <p className="mt-1 text-xl font-bold text-slate-600">
                {result.skipped}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] text-slate-400">
                Accuracy
              </p>

              <p className="mt-1 text-xl font-bold text-blue-600">
                {accuracy}%
              </p>
            </div>
          </section>

          {/* Progress */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Question Performance
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {result.attempted} of {result.questions} questions attempted
                </p>
              </div>

              <BarChart3
                size={19}
                className="text-blue-500"
              />
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{
                  width: `${
                    (result.correct / result.questions) *
                    100
                  }%`,
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Correct {result.correct}
              </span>

              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Wrong {result.wrong}
              </span>

              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Skipped {result.skipped}
              </span>
            </div>
          </section>

          {/* Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Assessment Details
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">
                  Course
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {result.course}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">
                  Module
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {result.module}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">
                  Completed At
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {result.completedAt}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">
                  Time Taken
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {result.timeTaken} / {result.duration} minutes
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">
                  Passing Marks
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {result.passingMarks}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">
                  Attempt
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {result.attempts} / {result.maxAttempts}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 p-4 sm:flex-row sm:justify-end">
          <BlobButton
            variant="secondary"
            onClick={onClose}
          >
            Close
          </BlobButton>

          <BlobButton
            variant="primary"
            icon={<BookOpen size={15} />}
          >
            Review Answers
          </BlobButton>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ clearFilters }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Award size={28} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No results found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        No assessment results match your current search or filters.
      </p>

      <div className="mt-5 flex justify-center">
        <BlobButton
          variant="secondary"
          onClick={clearFilters}
        >
          Clear Filters
        </BlobButton>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AssessmentResults() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [status, setStatus] = useState("All Results");

  const [selectedResult, setSelectedResult] =
    useState(null);

  const filteredResults = useMemo(() => {
    return assessmentResults.filter((item) => {
      const searchText =
        `${item.title} ${item.course} ${item.module}`.toLowerCase();

      const matchesSearch =
        !search ||
        searchText.includes(search.toLowerCase());

      const matchesCourse =
        course === "All Courses" ||
        item.course === course;

      const matchesStatus =
        status === "All Results" ||
        item.status === status;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesStatus
      );
    });
  }, [search, course, status]);

  const totalAssessments =
    assessmentResults.length;

  const passedCount = assessmentResults.filter(
    (item) => item.status === "Passed"
  ).length;

  const failedCount = assessmentResults.filter(
    (item) => item.status === "Failed"
  ).length;

  const averageScore =
    assessmentResults.reduce(
      (sum, item) => sum + item.percentage,
      0
    ) / assessmentResults.length;

  const bestScore = Math.max(
    ...assessmentResults.map(
      (item) => item.percentage
    )
  );

  const clearFilters = () => {
    setSearch("");
    setCourse("All Courses");
    setStatus("All Results");
  };

  const hasFilters =
    search ||
    course !== "All Courses" ||
    status !== "All Results";

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Student Dashboard</span>
                <span>/</span>
                <span>Assessment</span>
                <span>/</span>
                <span className="text-slate-600">
                  Results & History
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Assessment Results
                </h1>

                <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 sm:inline-flex">
                  PERFORMANCE
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Review your assessment performance, scores, accuracy and
                previous attempts.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3">
              <p className="text-[11px] font-medium text-blue-600">
                Average Score
              </p>

              <p className="mt-0.5 text-xl font-bold text-blue-700">
                {averageScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ===================================================
            STATS
        =================================================== */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BarChart3 size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Total Attempts
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {totalAssessments}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Passed
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {passedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <XCircle size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Failed
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {failedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Trophy size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Best Score
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {bestScore}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            PERFORMANCE BANNER
        =================================================== */}

        {!hasFilters && (
          <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm sm:p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                  <TrendingUp size={22} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                    Your Performance
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    You're averaging {averageScore.toFixed(1)}% across your
                    assessments
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Keep reviewing your incorrect answers and focus on the
                    topics where your accuracy is lower.
                  </p>
                </div>
              </div>

              <BlobButton
                variant="blue"
                icon={<BookOpen size={16} />}
              >
                Study Material
              </BlobButton>
            </div>
          </section>
        )}

        {/* ===================================================
            FILTERS
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search assessment, course or module..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SelectBox
                value={course}
                onChange={setCourse}
                options={courses}
                className="sm:w-56"
              />

              <SelectBox
                value={status}
                onChange={setStatus}
                options={resultStatuses}
                className="sm:w-40"
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            RESULT LIST HEADER
        =================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Filter
                size={17}
                className="text-emerald-600"
              />

              <h2 className="text-lg font-bold text-slate-900">
                Assessment History
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {filteredResults.length} result
              {filteredResults.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        {/* ===================================================
            RESULTS
        =================================================== */}

        {filteredResults.length > 0 ? (
          <section className="space-y-3">
            {filteredResults.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onView={setSelectedResult}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            clearFilters={clearFilters}
          />
        )}

        {/* ===================================================
            FOOTER
        =================================================== */}

        {!hasFilters && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Target size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Improve your next assessment
                  </h3>

                  <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                    Review wrong answers, revisit the related study material
                    and practice weak topics before your next attempt.
                  </p>
                </div>
              </div>

              <BlobButton
                variant="secondary"
                icon={<BookOpen size={15} />}
              >
                Review Topics
              </BlobButton>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          RESULT DETAIL MODAL
      ===================================================== */}

      <ResultDetailModal
        result={selectedResult}
        onClose={() =>
          setSelectedResult(null)
        }
      />
    </div>
  );
}