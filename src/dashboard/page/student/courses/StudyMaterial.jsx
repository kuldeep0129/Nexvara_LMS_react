import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Star,
  Clock3,
  BookOpen,
  ChevronDown,
  FileCheck2,
  ClipboardList,
  Code2,
  GraduationCap,
  FileQuestion,
  X,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Layers3,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

/* =========================================================
   DEMO DATA
========================================================= */

const materials = [
  {
    id: 1,
    title: "ASP.NET Core Web API Complete Notes",
    description:
      "Complete notes covering controllers, services, repositories, middleware and production API architecture.",
    course: "ASP.NET Core Mastery",
    module: "Web API Fundamentals",
    type: "Notes",
    format: "PDF",
    size: "4.8 MB",
    pages: 86,
    uploadedAt: "2 days ago",
    author: "Nexvara Faculty",
    important: true,
    progress: 72,
    isNew: true,
  },
  {
    id: 2,
    title: "Entity Framework Core Cheat Sheet",
    description:
      "Quick reference for DbContext, migrations, relationships, LINQ queries and common EF Core commands.",
    course: "ASP.NET Core Mastery",
    module: "Entity Framework Core",
    type: "Cheat Sheet",
    format: "PDF",
    size: "1.4 MB",
    pages: 18,
    uploadedAt: "3 days ago",
    author: "Nexvara Faculty",
    important: true,
    progress: 100,
    isNew: true,
  },
  {
    id: 3,
    title: "JWT Authentication Assignment",
    description:
      "Practice assignment covering JWT authentication, refresh tokens, authorization and secure API access.",
    course: "ASP.NET Core Mastery",
    module: "Authentication & Security",
    type: "Assignment",
    format: "PDF",
    size: "780 KB",
    pages: 12,
    uploadedAt: "5 days ago",
    author: "Rahul Sharma",
    important: false,
    progress: 25,
    isNew: true,
  },
  {
    id: 4,
    title: "React Hooks & State Management",
    description:
      "Study material covering useState, useEffect, useMemo, useCallback and custom hooks.",
    course: "React Advanced",
    module: "React Hooks",
    type: "Notes",
    format: "PDF",
    size: "3.2 MB",
    pages: 54,
    uploadedAt: "1 week ago",
    author: "Nexvara Faculty",
    important: true,
    progress: 48,
    isNew: false,
  },
  {
    id: 5,
    title: "React Interview Questions",
    description:
      "Frequently asked React interview questions with practical explanations and examples.",
    course: "React Advanced",
    module: "Interview Preparation",
    type: "Interview Prep",
    format: "PDF",
    size: "2.1 MB",
    pages: 42,
    uploadedAt: "1 week ago",
    author: "Nexvara Faculty",
    important: false,
    progress: 10,
    isNew: false,
  },
  {
    id: 6,
    title: "REST API Design Guidelines",
    description:
      "Practical guidelines for designing scalable, secure and maintainable REST APIs.",
    course: "ASP.NET Core Mastery",
    module: "REST API",
    type: "Guide",
    format: "PDF",
    size: "1.9 MB",
    pages: 31,
    uploadedAt: "8 days ago",
    author: "Nexvara Faculty",
    important: false,
    progress: 100,
    isNew: false,
  },
  {
    id: 7,
    title: "B.Tech Computer Science Syllabus",
    description:
      "Reference syllabus covering major B.Tech Computer Science subjects and academic topics.",
    course: "B.Tech Guidance",
    module: "Academic Guidance",
    type: "Syllabus",
    format: "PDF",
    size: "2.7 MB",
    pages: 64,
    uploadedAt: "10 days ago",
    author: "Nexvara Academic Team",
    important: false,
    progress: 0,
    isNew: false,
  },
  {
    id: 8,
    title: "Data Structures Practice Questions",
    description:
      "Practice questions covering arrays, linked lists, stacks, queues, trees and graphs.",
    course: "Interview Preparation",
    module: "Data Structures",
    type: "Question Bank",
    format: "PDF",
    size: "3.6 MB",
    pages: 72,
    uploadedAt: "12 days ago",
    author: "Nexvara Faculty",
    important: true,
    progress: 35,
    isNew: false,
  },
];

/* =========================================================
   FILTER DATA
========================================================= */

const materialTypes = [
  "All Materials",
  "Notes",
  "Assignment",
  "Cheat Sheet",
  "Interview Prep",
  "Guide",
  "Syllabus",
  "Question Bank",
];

const courses = [
  "All Courses",
  "ASP.NET Core Mastery",
  "React Advanced",
  "B.Tech Guidance",
  "Interview Preparation",
];

/* =========================================================
   ICON
========================================================= */

function MaterialIcon({ type, size = 20 }) {
  if (type === "Assignment") {
    return <ClipboardList size={size} />;
  }

  if (type === "Interview Prep") {
    return <FileQuestion size={size} />;
  }

  if (type === "Syllabus") {
    return <GraduationCap size={size} />;
  }

  if (type === "Cheat Sheet") {
    return <Code2 size={size} />;
  }

  if (type === "Question Bank") {
    return <FileCheck2 size={size} />;
  }

  return <FileText size={size} />;
}

/* =========================================================
   TYPE STYLE
========================================================= */

function getTypeStyle(type) {
  switch (type) {
    case "Assignment":
      return "bg-blue-50 text-blue-600";

    case "Interview Prep":
      return "bg-purple-50 text-purple-600";

    case "Syllabus":
      return "bg-amber-50 text-amber-600";

    case "Cheat Sheet":
      return "bg-cyan-50 text-cyan-600";

    case "Question Bank":
      return "bg-rose-50 text-rose-600";

    case "Guide":
      return "bg-indigo-50 text-indigo-600";

    default:
      return "bg-emerald-50 text-emerald-600";
  }
}

/* =========================================================
   LIGHT BLOB BUTTON
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

    soft:
      "border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100",

    amber:
      "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",

    danger:
      "border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${variants[variant]} ${className}`}
    >
      <span className="pointer-events-none absolute -right-5 -top-5 h-10 w-10 rounded-full bg-white/60 blur-md transition-all duration-300 group-hover:scale-150" />

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
   FEATURED MATERIAL
========================================================= */

function FeaturedMaterial({ material }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm sm:p-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
              <MaterialIcon type={material.type} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Recommended for you
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                {material.course}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-emerald-600 shadow-sm ring-1 ring-emerald-100">
            FEATURED
          </span>
        </div>

        <h2 className="mt-5 max-w-2xl text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {material.title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {material.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Layers3 size={14} />
            {material.module}
          </span>

          <span className="flex items-center gap-1.5">
            <FileText size={14} />
            {material.pages} pages
          </span>

          <span>{material.size}</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <BlobButton
            variant="primary"
            icon={<PlayCircle size={17} />}
          >
            Continue Reading
          </BlobButton>

          <BlobButton
            variant="secondary"
            icon={<Download size={16} />}
          >
            Download
          </BlobButton>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MATERIAL CARD
========================================================= */

function MaterialCard({ material }) {
  const typeStyle = getTypeStyle(material.type);

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 sm:p-5">
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${typeStyle}`}
        >
          <MaterialIcon type={material.type} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Top */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  {material.title}
                </h3>

                {material.isNew && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    NEW
                  </span>
                )}

                {material.important && (
                  <Star
                    size={14}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                )}
              </div>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
                {material.description}
              </p>
            </div>

            <button
              type="button"
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:flex"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400 sm:text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <BookOpen size={13} />
              {material.course}
            </span>

            <span className="flex items-center gap-1.5">
              <Layers3 size={13} />
              {material.module}
            </span>

            <span>{material.format}</span>

            <span>{material.size}</span>

            <span>{material.pages} pages</span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={13} />
              {material.uploadedAt}
            </span>
          </div>

          {/* Progress */}
          {material.progress > 0 && (
            <div className="mt-4 max-w-md">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  {material.progress === 100
                    ? "Completed"
                    : "Reading progress"}
                </span>

                <span
                  className={`text-[11px] font-bold ${
                    material.progress === 100
                      ? "text-emerald-600"
                      : "text-slate-600"
                  }`}
                >
                  {material.progress}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    material.progress === 100
                      ? "bg-emerald-500"
                      : "bg-emerald-400"
                  }`}
                  style={{
                    width: `${material.progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Bottom */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <BlobButton
              variant="primary"
              className="rounded-xl px-3 py-2 text-xs"
              icon={<Eye size={14} />}
            >
              {material.progress > 0 &&
              material.progress < 100
                ? "Continue"
                : "View"}
            </BlobButton>

            <BlobButton
              variant="secondary"
              className="rounded-xl px-3 py-2 text-xs"
              icon={<Download size={14} />}
            >
              Download
            </BlobButton>

            <button
              type="button"
              className="ml-auto hidden items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 md:flex"
            >
              Details
              <ArrowUpRight size={13} />
            </button>
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
        <FileText size={28} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No materials found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        We couldn't find any study material matching your
        current filters. Try another course, material type or
        search term.
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

export default function StudyMaterial() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [type, setType] = useState("All Materials");
  const [importantOnly, setImportantOnly] =
    useState(false);
  const [activeTab, setActiveTab] = useState("All");

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const searchText =
        `${item.title} ${item.description} ${item.course} ${item.module}`.toLowerCase();

      const matchesSearch =
        !search ||
        searchText.includes(search.toLowerCase());

      const matchesCourse =
        course === "All Courses" ||
        item.course === course;

      const matchesType =
        type === "All Materials" ||
        item.type === type;

      const matchesImportant =
        !importantOnly || item.important;

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Recent" && item.isNew) ||
        (activeTab === "Important" && item.important) ||
        (activeTab === "Completed" &&
          item.progress === 100);

      return (
        matchesSearch &&
        matchesCourse &&
        matchesType &&
        matchesImportant &&
        matchesTab
      );
    });
  }, [
    search,
    course,
    type,
    importantOnly,
    activeTab,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const recentMaterials = materials.filter(
    (item) => item.isNew
  );

  const importantMaterials = materials.filter(
    (item) => item.important
  );

  const completedMaterials = materials.filter(
    (item) => item.progress === 100
  );

  const featuredMaterial =
    materials.find(
      (item) =>
        item.important &&
        item.progress > 0 &&
        item.progress < 100
    ) || materials[0];

  const averageProgress = Math.round(
    materials.reduce(
      (sum, item) => sum + item.progress,
      0
    ) / materials.length
  );

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setCourse("All Courses");
    setType("All Materials");
    setImportantOnly(false);
    setActiveTab("All");
  };

  const hasFilters =
    search ||
    course !== "All Courses" ||
    type !== "All Materials" ||
    importantOnly ||
    activeTab !== "All";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Student Dashboard</span>
                <span>/</span>
                <span className="text-slate-600">
                  Learning Resources
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Study Material
                </h1>

                <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 sm:inline-flex">
                  LEARNING HUB
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Everything you need for your courses — notes,
                assignments, interview preparation and academic
                resources.
              </p>
            </div>

            {/* Progress */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-medium text-slate-400">
                Overall Progress
              </p>

              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${averageProgress}%`,
                    }}
                  />
                </div>

                <span className="text-sm font-bold text-slate-800">
                  {averageProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileText size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Total Resources
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {materials.length}
                </p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Courses
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  4
                </p>
              </div>
            </div>
          </div>

          {/* Important */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Bookmark size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Saved / Important
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {importantMaterials.length}
                </p>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Completed
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {completedMaterials.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FEATURED
        ================================================= */}

        {!hasFilters && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                size={17}
                className="text-emerald-600"
              />

              <h2 className="text-base font-bold text-slate-900">
                Continue Learning
              </h2>
            </div>

            <FeaturedMaterial
              material={featuredMaterial}
            />
          </section>
        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Filter
                  size={16}
                  className="text-slate-500"
                />

                <h3 className="text-sm font-bold text-slate-900">
                  Browse Materials
                </h3>
              </div>

              <div className="mt-4 space-y-1">
                {materialTypes.map((item) => {
                  const active = type === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item}</span>

                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="my-5 border-t border-slate-100" />

              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Filters
              </p>

              <div className="mt-2 space-y-1">
                {/* Recent */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      activeTab === "Recent"
                        ? "All"
                        : "Recent"
                    )
                  }
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                    activeTab === "Recent"
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Clock3 size={15} />
                  Recently Added
                </button>

                {/* Important */}
                <button
                  type="button"
                  onClick={() =>
                    setImportantOnly(
                      (value) => !value
                    )
                  }
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                    importantOnly
                      ? "bg-amber-50 font-semibold text-amber-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Star
                    size={15}
                    fill={
                      importantOnly
                        ? "currentColor"
                        : "none"
                    }
                  />
                  Important
                </button>

                {/* Completed */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      activeTab === "Completed"
                        ? "All"
                        : "Completed"
                    )
                  }
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                    activeTab === "Completed"
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CheckCircle2 size={15} />
                  Completed
                </button>
              </div>
            </div>
          </aside>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <div className="min-w-0 space-y-5">
            {/* Search + Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
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
                    placeholder="Search notes, assignments, interview prep..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {/* Course */}
                  <SelectBox
                    value={course}
                    onChange={setCourse}
                    options={courses}
                    className="min-w-0 sm:w-52"
                  />

                  {/* Type Mobile */}
                  <div className="lg:hidden">
                    <SelectBox
                      value={type}
                      onChange={setType}
                      options={materialTypes}
                      className="w-full"
                    />
                  </div>

                  {/* Important */}
                  <button
                    type="button"
                    onClick={() =>
                      setImportantOnly(
                        (value) => !value
                      )
                    }
                    className={`h-11 rounded-xl border px-3 text-sm font-semibold transition ${
                      importantOnly
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Star
                        size={15}
                        fill={
                          importantOnly
                            ? "currentColor"
                            : "none"
                        }
                      />
                      Important
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Result Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Learning Resources
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredMaterials.length} resource
                  {filteredMaterials.length !== 1
                    ? "s"
                    : ""}{" "}
                  available
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

            {/* Mobile Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {[
                ["All", "All"],
                ["Recent", "Recent"],
                ["Important", "Important"],
                ["Completed", "Completed"],
              ].map(([label, value]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeTab === value
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Materials */}
            {filteredMaterials.length > 0 ? (
              <div className="space-y-3">
                {filteredMaterials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                clearFilters={clearFilters}
              />
            )}
          </div>
        </section>

        {/* =================================================
            RECENTLY ADDED
        ================================================= */}

        {!hasFilters &&
          recentMaterials.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={17}
                      className="text-blue-600"
                    />

                    <h2 className="text-lg font-bold text-slate-900">
                      Recently Added
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    New learning resources added by your
                    instructors.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("Recent")
                  }
                  className="hidden rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:block"
                >
                  View all
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {recentMaterials
                  .slice(0, 3)
                  .map((material) => (
                    <div
                      key={material.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${getTypeStyle(
                            material.type
                          )}`}
                        >
                          <MaterialIcon
                            type={material.type}
                            size={18}
                          />
                        </div>

                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                          NEW
                        </span>
                      </div>

                      <h3 className="mt-4 line-clamp-2 text-sm font-bold text-slate-900">
                        {material.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {material.course}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {material.uploadedAt}
                        </span>

                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Open
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

        {/* =================================================
            FOOTER INFO
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BookOpen size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Make the most of your study material
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Read the material before your live class,
                  complete the related assignments and revisit
                  important resources during revision.
                </p>
              </div>
            </div>

            <BlobButton
              variant="secondary"
              icon={<GraduationCap size={15} />}
            >
              Learning Guide
            </BlobButton>
          </div>
        </div>
      </main>
    </div>
  );
}