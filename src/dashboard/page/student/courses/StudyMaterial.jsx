import { useMemo, useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Clock3,
  BookOpen,
  ChevronDown,
  FileCheck2,
  ClipboardList,
  Code2,
  GraduationCap,
  FileQuestion,
  PlayCircle,
  Layers3,
  Search,
  X,
  Sparkles,
  TrendingUp,
  FolderOpen,
  RefreshCw,
  Zap,
  Inbox,
  SlidersHorizontal
} from "lucide-react";

import { useStudentStudyMaterials } from "../../../hooks/student/useStudentStudyMaterials";

/* =========================================================
   ICON MAP
========================================================= */

function MaterialIcon({ type, size = 20, className = "" }) {
  const props = { size, className };
  switch (type) {
    case "Assignment":
      return <ClipboardList {...props} />;
    case "Interview Prep":
      return <FileQuestion {...props} />;
    case "Syllabus":
      return <GraduationCap {...props} />;
    case "Cheat Sheet":
      return <Code2 {...props} />;
    case "Question Bank":
      return <FileCheck2 {...props} />;
    default:
      return <FileText {...props} />;
  }
}

/* =========================================================
   TYPE STYLE
========================================================= */

function getTypeStyle(type) {
  switch (type) {
    case "Assignment":
      return "bg-blue-50 text-blue-600 ring-blue-100";
    case "Interview Prep":
      return "bg-purple-50 text-purple-600 ring-purple-100";
    case "Syllabus":
      return "bg-amber-50 text-amber-600 ring-amber-100";
    case "Cheat Sheet":
      return "bg-cyan-50 text-cyan-600 ring-cyan-100";
    case "Question Bank":
      return "bg-rose-50 text-rose-600 ring-rose-100";
    case "Guide":
      return "bg-indigo-50 text-indigo-600 ring-indigo-100";
    default:
      return "bg-emerald-50 text-emerald-600 ring-emerald-100";
  }
}

/* =========================================================
   BUTTON
========================================================= */

function Button({
  children,
  icon,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  ...rest
}) {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-emerald-200/60",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    outline:
      "bg-transparent text-emerald-700 border border-emerald-200 hover:bg-emerald-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-5 py-3 text-sm rounded-xl gap-2",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectBox({ value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
   HELPERS
========================================================= */

function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return "Unknown size";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
}

function getFileActions(material) {
  const fileUrl = material.fileUrl;
  const view = () => {
    if (fileUrl) window.open(fileUrl, "_blank", "noopener,noreferrer");
  };
  const download = () => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = material.title || "study-material";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return { view, download, hasFile: !!fileUrl };
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ count, hasActiveFilters, onClear }) {
  return (
    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="relative">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
          <Zap size={10} className="fill-emerald-500 text-emerald-500" />
          Your Library
        </div>

        <h2 className="flex flex-wrap items-baseline gap-x-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          <span>Learning</span>
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Resources
            </span>
            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-70 blur-[1px]" />
          </span>
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {count} available now
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <TrendingUp size={13} className="text-emerald-500" />
            Curated for your progress
          </span>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="group inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 sm:self-auto"
        >
          <X size={12} className="transition-transform group-hover:rotate-90" />
          Reset Filters
        </button>
      )}
    </div>
  );
}

/* =========================================================
   FEATURED MATERIAL
========================================================= */

function FeaturedMaterial({ material }) {
  if (!material) return null;
  const type = material.fileType || material.type;
  const { view, download, hasFile } = getFileActions(material);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
              <MaterialIcon type={type} size={22} />
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                <Sparkles size={12} />
                Recommended for you
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {material.courseName || material.course || "Course"}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-emerald-600 shadow-sm ring-1 ring-emerald-100">
            ⭐ FEATURED
          </span>
        </div>

        <h2 className="mt-5 max-w-2xl text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
          {material.title}
        </h2>

        {material.description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {material.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          {material.moduleName && (
            <span className="flex items-center gap-1.5">
              <Layers3 size={14} className="text-emerald-500" />
              {material.moduleName}
            </span>
          )}
          {material.pages && (
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-emerald-500" />
              {material.pages} pages
            </span>
          )}
          {material.fileSize && (
            <span className="flex items-center gap-1.5">
              <FolderOpen size={14} className="text-emerald-500" />
              {formatFileSize(material.fileSize)}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={<PlayCircle size={17} />}
            onClick={view}
            disabled={!hasFile}
          >
            Continue Reading
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<Download size={16} />}
            onClick={download}
            disabled={!hasFile}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MATERIAL CARD
========================================================= */

function MaterialCard({ material }) {
  const typeStyle = getTypeStyle(material.fileType);
  const { view, download, hasFile } = getFileActions(material);

  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg sm:p-5">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${typeStyle}`}
        >
          <MaterialIcon type={material.fileType} size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {material.title}
            </h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-100">
              PUBLISHED
            </span>
          </div>
          {material.fileType && (
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {material.fileType}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        {material.courseName && (
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} className="text-slate-400" />
            {material.courseName}
          </span>
        )}
        {material.moduleName && (
          <span className="flex items-center gap-1.5">
            <Layers3 size={13} className="text-slate-400" />
            {material.moduleName}
          </span>
        )}
        {material.batchName && (
          <span className="flex items-center gap-1.5">
            <GraduationCap size={13} className="text-slate-400" />
            {material.batchName}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <FolderOpen size={13} className="text-slate-400" />
          {formatFileSize(material.fileSize)}
        </span>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <Button
          variant="primary"
          size="sm"
          icon={<Eye size={14} />}
          onClick={view}
          disabled={!hasFile}
        >
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<Download size={14} />}
          onClick={download}
          disabled={!hasFile}
        >
          Download
        </Button>
      </div>
    </article>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex gap-3">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 h-3 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-7 w-16 rounded-lg bg-slate-200" />
        <div className="h-7 w-20 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

/* =========================================================
   PROFESSIONAL EMPTY STATE (CIRCLE ME JO UI HAI)
========================================================= */

function EmptyState({ clearFilters, onRefresh, isFilterActive }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-20 shadow-sm">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Premium Icon Box */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-50 shadow-sm ring-1 ring-slate-100">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-100/50 to-transparent opacity-50" />
          <Inbox size={40} className="text-slate-400" strokeWidth={1.5} />
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
            <Search size={14} className="text-slate-400" />
          </div>
        </div>

        {/* Typography */}
        <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          No materials found
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          {isFilterActive 
            ? "We couldn't find any study material matching your current filters. Try adjusting your search or resetting the filters."
            : "Your library is currently empty. Please check back later or refresh to load your study materials."}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row w-full sm:w-auto">
          {isFilterActive && (
            <Button
              variant="primary"
              size="md"
              icon={<SlidersHorizontal size={16} />}
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              Clear All Filters
            </Button>
          )}
          <Button
            variant={isFilterActive ? "secondary" : "primary"}
            size="md"
            icon={<RefreshCw size={16} />}
            onClick={onRefresh}
            className="w-full sm:w-auto"
          >
            Refresh Library
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, icon, accent = "emerald" }) {
  const accents = {
    emerald: "from-emerald-500/10 to-emerald-500/0 text-emerald-600",
    blue: "from-blue-500/10 to-blue-500/0 text-blue-600",
    purple: "from-purple-500/10 to-purple-500/0 text-purple-600",
    amber: "from-amber-500/10 to-amber-500/0 text-amber-600",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md sm:p-5">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100 ${accents[accent]}`}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 ${accents[
            accent
          ].split(" ").pop()}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function StudyMaterial() {
  const {
    materials = [],
    total = 0,
    isLoading,
    error,
    fetchStudyMaterials,
  } = useStudentStudyMaterials();

  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [type, setType] = useState("All Materials");

  const courseOptions = useMemo(
    () => [
      "All Courses",
      ...new Set(materials.map((item) => item.courseName).filter(Boolean)),
    ],
    [materials]
  );

  const materialTypeOptions = useMemo(
    () => [
      "All Materials",
      ...new Set(materials.map((item) => item.fileType).filter(Boolean)),
    ],
    [materials]
  );

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const searchText = [
        item.title,
        item.courseName,
        item.batchName,
        item.moduleName,
        item.fileType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchText.includes(search.toLowerCase());
      const matchesCourse =
        course === "All Courses" || item.courseName === course;
      const matchesType =
        type === "All Materials" || item.fileType === type;

      return matchesSearch && matchesCourse && matchesType;
    });
  }, [materials, search, course, type]);

  const clearFilters = () => {
    setSearch("");
    setCourse("All Courses");
    setType("All Materials");
  };

  const uniqueCourses = useMemo(
    () => new Set(materials.map((item) => item.courseId).filter(Boolean)).size,
    [materials]
  );
  const uniqueBatches = useMemo(
    () => new Set(materials.map((item) => item.batchId).filter(Boolean)).size,
    [materials]
  );
  const uniqueModules = useMemo(
    () => new Set(materials.map((item) => item.moduleId).filter(Boolean)).size,
    [materials]
  );

  const featuredMaterial = filteredMaterials[0];
  const listMaterials = filteredMaterials.slice(1);
  const hasActiveFilters =
    search || course !== "All Courses" || type !== "All Materials";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ============ HERO HEADER ============ */}
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-100">
                <Sparkles size={11} />
                Learning Hub
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Study Material
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Access your published course notes, assignments and learning
                resources — all in one place.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                icon={
                  <RefreshCw
                    size={15}
                    className={isLoading ? "animate-spin" : ""}
                  />
                }
                onClick={fetchStudyMaterials}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <StatCard
              title="Resources"
              value={total}
              icon={<FileText size={18} />}
              accent="emerald"
            />
            <StatCard
              title="Courses"
              value={uniqueCourses}
              icon={<BookOpen size={18} />}
              accent="blue"
            />
            <StatCard
              title="Batches"
              value={uniqueBatches}
              icon={<GraduationCap size={18} />}
              accent="purple"
            />
            <StatCard
              title="Modules"
              value={uniqueModules}
              icon={<Layers3 size={18} />}
              accent="amber"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ============ FILTERS ============ */}
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search materials, courses, modules..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <SelectBox
                value={course}
                onChange={setCourse}
                options={courseOptions}
                className="sm:w-52"
              />
              <SelectBox
                value={type}
                onChange={setType}
                options={materialTypeOptions}
                className="sm:w-44"
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="md"
                  icon={<X size={14} />}
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* ============ RESULT HEADING ============ */}
        <SectionHeading
          count={filteredMaterials.length}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />

        {/* ============ LOADING ============ */}
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ============ ERROR ============ */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
            <p className="text-sm font-medium text-rose-600">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={fetchStudyMaterials}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ============ CONTENT ============ */}
        {!isLoading && !error && (
          <>
            {featuredMaterial && (
              <FeaturedMaterial material={featuredMaterial} />
            )}

            {listMaterials.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {listMaterials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            ) : (
              !featuredMaterial && (
                <EmptyState 
                  clearFilters={clearFilters} 
                  onRefresh={fetchStudyMaterials}
                  isFilterActive={!!hasActiveFilters}
                />
              )
            )}
          </>
        )}
      </main>
    </div>
  );
}