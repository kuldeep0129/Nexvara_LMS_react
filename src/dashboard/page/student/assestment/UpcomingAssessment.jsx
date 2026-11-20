import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Clock3,
  CalendarDays,
  BookOpen,
  FileQuestion,
  ClipboardCheck,
  Timer,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Layers3,
  Award,
  X,
  Sparkles,
} from "lucide-react";

/* =========================================================
   DEMO DATA
========================================================= */

const assessments = [
  {
    id: 1,
    title: "ASP.NET Core Web API Assessment",
    description:
      "Test your understanding of controllers, dependency injection, middleware, REST APIs and Web API architecture.",
    course: "ASP.NET Core Mastery",
    module: "Web API Fundamentals",
    type: "Quiz",
    date: "28 Oct 2026",
    time: "10:00 AM",
    duration: 45,
    questions: 30,
    totalMarks: 50,
    passingMarks: 20,
    attempts: 1,
    attemptsUsed: 0,
    status: "Upcoming",
    priority: "High",
    isNew: true,
  },
  {
    id: 2,
    title: "Entity Framework Core Evaluation",
    description:
      "Assessment covering DbContext, migrations, relationships, LINQ queries and database operations.",
    course: "ASP.NET Core Mastery",
    module: "Entity Framework Core",
    type: "Assessment",
    date: "30 Oct 2026",
    time: "02:00 PM",
    duration: 60,
    questions: 40,
    totalMarks: 60,
    passingMarks: 24,
    attempts: 2,
    attemptsUsed: 0,
    status: "Upcoming",
    priority: "Medium",
    isNew: false,
  },
  {
    id: 3,
    title: "React Hooks & State Management Quiz",
    description:
      "Evaluate your knowledge of useState, useEffect, useMemo, useCallback and custom hooks.",
    course: "React Advanced",
    module: "React Hooks",
    type: "Quiz",
    date: "02 Nov 2026",
    time: "11:30 AM",
    duration: 30,
    questions: 25,
    totalMarks: 40,
    passingMarks: 16,
    attempts: 1,
    attemptsUsed: 0,
    status: "Upcoming",
    priority: "Medium",
    isNew: true,
  },
  {
    id: 4,
    title: "JWT Authentication & Security Test",
    description:
      "Test covering JWT tokens, refresh tokens, authorization, claims and secure authentication practices.",
    course: "ASP.NET Core Mastery",
    module: "Authentication & Security",
    type: "Test",
    date: "04 Nov 2026",
    time: "03:00 PM",
    duration: 45,
    questions: 35,
    totalMarks: 50,
    passingMarks: 20,
    attempts: 2,
    attemptsUsed: 0,
    status: "Upcoming",
    priority: "High",
    isNew: false,
  },
  {
    id: 5,
    title: "Data Structures Practice Assessment",
    description:
      "Practice assessment covering arrays, linked lists, stacks, queues, trees and basic graph concepts.",
    course: "Interview Preparation",
    module: "Data Structures",
    type: "Assessment",
    date: "07 Nov 2026",
    time: "10:30 AM",
    duration: 75,
    questions: 50,
    totalMarks: 100,
    passingMarks: 40,
    attempts: 2,
    attemptsUsed: 0,
    status: "Upcoming",
    priority: "Low",
    isNew: false,
  },
  {
    id: 6,
    title: "Full Stack Development Mock Test",
    description:
      "Comprehensive mock test covering React, APIs, databases and full-stack development concepts.",
    course: "Full Stack Development",
    module: "Final Evaluation",
    type: "Mock Test",
    date: "10 Nov 2026",
    time: "01:00 PM",
    duration: 90,
    questions: 60,
    totalMarks: 100,
    passingMarks: 40,
    attempts: 1,
    attemptsUsed: 0,
    status: "Upcoming",
    priority: "High",
    isNew: true,
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

const assessmentTypes = [
  "All Types",
  "Quiz",
  "Assessment",
  "Test",
  "Mock Test",
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
      "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",

    amber:
      "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
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
   SELECT BOX
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
   TYPE STYLE
========================================================= */

function getTypeStyle(type) {
  switch (type) {
    case "Quiz":
      return "bg-blue-50 text-blue-600";

    case "Assessment":
      return "bg-purple-50 text-purple-600";

    case "Test":
      return "bg-amber-50 text-amber-600";

    case "Mock Test":
      return "bg-rose-50 text-rose-600";

    default:
      return "bg-emerald-50 text-emerald-600";
  }
}

/* =========================================================
   PRIORITY STYLE
========================================================= */

function getPriorityStyle(priority) {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-600 border-rose-100";

    case "Medium":
      return "bg-amber-50 text-amber-600 border-amber-100";

    default:
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
  }
}

/* =========================================================
   ASSESSMENT CARD
========================================================= */

function AssessmentCard({ assessment }) {
  const typeStyle = getTypeStyle(assessment.type);
  const priorityStyle = getPriorityStyle(
    assessment.priority
  );

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 sm:p-5">
      {/* =====================================================
          TOP
      ===================================================== */}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${typeStyle}`}
        >
          <ClipboardCheck size={21} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {assessment.title}
                </h3>

                {assessment.isNew && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    NEW
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs font-medium text-slate-400">
                {assessment.course}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${priorityStyle}`}
              >
                {assessment.priority} Priority
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-500">
            {assessment.description}
          </p>

          {/* =================================================
              META
          ================================================= */}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarDays
                size={14}
                className="text-slate-400"
              />
              <span className="font-medium">
                {assessment.date}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock3
                size={14}
                className="text-slate-400"
              />
              {assessment.time}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Timer
                size={14}
                className="text-slate-400"
              />
              {assessment.duration} min
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FileQuestion
                size={14}
                className="text-slate-400"
              />
              {assessment.questions} Questions
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Award
                size={14}
                className="text-slate-400"
              />
              {assessment.totalMarks} Marks
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Layers3
                size={14}
                className="text-slate-400"
              />
              {assessment.module}
            </div>
          </div>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Attempts
              </span>

              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                {assessment.attempts -
                  assessment.attemptsUsed}{" "}
                available
              </span>

              <span className="text-xs text-slate-400">
                •
              </span>

              <span className="text-xs text-slate-400">
                Passing: {assessment.passingMarks} marks
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <BlobButton
                variant="secondary"
                className="rounded-xl px-3 py-2 text-xs"
                icon={<ArrowUpRight size={14} />}
              >
                Details
              </BlobButton>

              <BlobButton
                variant="primary"
                className="rounded-xl px-3.5 py-2 text-xs"
                icon={<PlayCircle size={14} />}
              >
                View Assessment
              </BlobButton>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ clearFilters }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ClipboardCheck size={28} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No upcoming assessments
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        There are no assessments matching your current
        filters. Try changing the course, assessment type or
        search keyword.
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

export default function UpcomingAssessment() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [type, setType] = useState("All Types");
  const [priority, setPriority] = useState("All");

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const searchText =
        `${item.title} ${item.description} ${item.course} ${item.module}`.toLowerCase();

      const matchesSearch =
        !search ||
        searchText.includes(search.toLowerCase());

      const matchesCourse =
        course === "All Courses" ||
        item.course === course;

      const matchesType =
        type === "All Types" ||
        item.type === type;

      const matchesPriority =
        priority === "All" ||
        item.priority === priority;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesType &&
        matchesPriority
      );
    });
  }, [search, course, type, priority]);

  /* =======================================================
     STATS
  ======================================================= */

  const highPriorityCount = assessments.filter(
    (item) => item.priority === "High"
  ).length;

  const totalQuestions = assessments.reduce(
    (sum, item) => sum + item.questions,
    0
  );

  const totalMarks = assessments.reduce(
    (sum, item) => sum + item.totalMarks,
    0
  );

  const clearFilters = () => {
    setSearch("");
    setCourse("All Courses");
    setType("All Types");
    setPriority("All");
  };

  const hasFilters =
    search ||
    course !== "All Courses" ||
    type !== "All Types" ||
    priority !== "All";

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Student Dashboard</span>

                <span>/</span>

                <span>Assessment</span>

                <span>/</span>

                <span className="text-slate-600">
                  Upcoming
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Upcoming Assessments
                </h1>

                <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 sm:inline-flex">
                  ASSESSMENT HUB
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                View your upcoming quizzes, tests and
                assessments, prepare in advance and track your
                evaluation schedule.
              </p>
            </div>

            {/* Header Summary */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-[11px] font-medium text-emerald-600">
                  Upcoming
                </p>

                <p className="mt-0.5 text-xl font-bold text-emerald-700">
                  {assessments.length}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
                <p className="text-[11px] font-medium text-rose-600">
                  High Priority
                </p>

                <p className="mt-0.5 text-xl font-bold text-rose-700">
                  {highPriorityCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Upcoming */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardCheck size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Upcoming
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {assessments.length}
                </p>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileQuestion size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Total Questions
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {totalQuestions}
                </p>
              </div>
            </div>
          </div>

          {/* Marks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Award size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Total Marks
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {totalMarks}
                </p>
              </div>
            </div>
          </div>

          {/* Preparation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Timer size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Preparation
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  Ready
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            UPCOMING HIGHLIGHT
        ================================================= */}

        {!hasFilters && assessments.length > 0 && (
          <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-5 shadow-sm sm:p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                  <Sparkles size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Next Assessment
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    {assessments[0].title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {assessments[0].date}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {assessments[0].time}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Timer size={14} />
                      {assessments[0].duration} minutes
                    </span>
                  </div>
                </div>
              </div>

              <BlobButton
                variant="blue"
                icon={<BookOpen size={16} />}
              >
                Prepare Now
              </BlobButton>
            </div>
          </section>
        )}

        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row">
            {/* Search */}
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
                placeholder="Search assessments, courses, modules..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <SelectBox
                value={course}
                onChange={setCourse}
                options={courses}
                className="sm:w-52"
              />

              <SelectBox
                value={type}
                onChange={setType}
                options={assessmentTypes}
                className="sm:w-40"
              />

              <SelectBox
                value={priority}
                onChange={setPriority}
                options={[
                  "All",
                  "High",
                  "Medium",
                  "Low",
                ]}
                className="sm:w-36"
              />
            </div>
          </div>
        </section>

        {/* =================================================
            RESULT HEADER
        ================================================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Filter
                size={17}
                className="text-emerald-600"
              />

              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Assessments
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {filteredAssessments.length} assessment
              {filteredAssessments.length !== 1
                ? "s"
                : ""}{" "}
              scheduled for you
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

        {/* =================================================
            ASSESSMENT LIST
        ================================================= */}

        {filteredAssessments.length > 0 ? (
          <section className="space-y-3">
            {filteredAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            clearFilters={clearFilters}
          />
        )}

        {/* =================================================
            PREPARATION INFO
        ================================================= */}

        {!hasFilters && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Prepare before your assessment
                  </h3>

                  <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                    Review your study material, attend the
                    related live classes and complete practice
                    questions before attempting an assessment.
                  </p>
                </div>
              </div>

              <BlobButton
                variant="secondary"
                icon={<BookOpen size={15} />}
              >
                Study Material
              </BlobButton>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}