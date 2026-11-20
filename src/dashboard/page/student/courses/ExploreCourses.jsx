import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  X,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Users,
  SlidersHorizontal,
  ChevronDown,
  Laptop,
  RotateCcw,
  Loader2,
  Check,
  Zap,
  CalendarDays,
} from "lucide-react";
import { useExploreCourses } from "../../../hooks/useExploreCourses";
import EnrollmentModal from "../../student/courses/EnrollmentModal";

const money = (value) => {
  const num = Number(value);
  return num === 0 ? "Free" : `₹${num.toLocaleString("en-IN")}`;
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block min-w-0 text-xs font-extrabold tracking-wide text-slate-600">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ExploreCourses() {
  const {
    courses,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    pageNumber,
    setPageNumber,
    totalPages,
    totalCount,
    refresh,
  } = useExploreCourses(6);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // 🔁 Backend ab source-of-truth hai — success ke baad list refresh karo
  const handleSuccess = () => {
    refresh();
  };

  const closeModal = useCallback(() => setSelected(null), []);

  const activeFilterCount = [
    filters.priceType !== "",
    filters.enrollmentStatus !== "",
    filters.level !== "",
    filters.mode !== "",
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] text-slate-900">
      {/* ============ HERO SECTION ============ */}
      <section className="relative isolate overflow-hidden bg-white pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/60 via-white to-white" />
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-bold tracking-[.16em] text-violet-600 shadow-sm">
              <Sparkles size={14} className="text-violet-500" /> YOUR NEXT SKILL
              STARTS HERE
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Explore Courses. <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Unlock Your Potential.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Learn from industry experts, practice with real projects, and
              build skills that move your career forward.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-5">
              {[
                ["6+", "Learning Tracks"],
                ["Project", "Based Learning"],
                ["Flexible", "Learning Modes"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <strong className="block text-lg font-black text-slate-900 sm:text-2xl">
                    {value}
                  </strong>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-500 sm:text-xs">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto flex min-h-56 w-full max-w-md items-center justify-center sm:min-h-72"
            initial={{ opacity: 0, scale: 0.85, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute h-52 w-52 rounded-full border border-violet-100 bg-gradient-to-br from-violet-50 to-cyan-50 shadow-[0_0_80px_rgba(139,92,246,.15)] sm:h-64 sm:w-64" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white bg-white text-violet-600 shadow-xl shadow-violet-200/50 sm:h-40 sm:w-40">
              <GraduationCap size={66} />
            </div>

            <motion.div
              className="absolute left-0 top-6 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-lg backdrop-blur-md"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star size={15} className="text-amber-500" fill="currentColor" />{" "}
              Mentor-led learning
            </motion.div>
            <motion.div
              className="absolute bottom-5 right-0 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-lg backdrop-blur-md"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            >
              <CheckCircle size={15} className="text-emerald-500" /> Build real
              projects
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ COURSE CATALOG ============ */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[.18em] text-violet-600">
              <Zap size={14} fill="currentColor" /> COURSE CATALOG
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Find your learning path
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
              Choose a batch that fits your goals and start building.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <BookOpen size={20} />
            </div>
            <div>
              <strong className="block text-xl font-black leading-none text-slate-900">
                {totalCount}
              </strong>
              <span className="text-xs font-semibold text-slate-500">
                batches available
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH / FILTER / SORT */}
        <div className="mt-8 flex flex-col gap-3 lg:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
            <Search size={20} className="shrink-0 text-slate-400" />
            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search batches, skills, technologies..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => updateFilter("search", "")}
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 outline-none focus:outline-none"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold shadow-sm transition hover:border-violet-300 hover:bg-violet-50 outline-none focus:outline-none"
          >
            <SlidersHorizontal size={18} className="text-violet-600" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                filtersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm shadow-sm">
            <span className="whitespace-nowrap font-medium text-slate-500">
              Sort by:
            </span>
            <select
              value={filters.sortBy}
              onChange={(event) => updateFilter("sortBy", event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-bold text-slate-800 outline-none focus:outline-none focus:ring-0 cursor-pointer appearance-none"
            >
              <option value="Popular">Most popular</option>
              <option value="Newest">Newest</option>
              <option value="PriceLowToHigh">Price: low to high</option>
              <option value="PriceHighToLow">Price: high to low</option>
            </select>
          </label>
        </div>

        {/* FILTER PANEL */}
        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              key="filter-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold tracking-wide text-slate-600">
                      COURSE FEE
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:max-w-md">
                    {[
                      { label: "All", value: "" },
                      { label: "Free", value: "Free" },
                      { label: "Paid", value: "Paid" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.label}
                        onClick={() => updateFilter("priceType", item.value)}
                        className={`rounded-xl px-3 py-3 text-sm font-bold transition outline-none focus:outline-none ${
                          filters.priceType === item.value
                            ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300 hover:bg-violet-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FilterSelect
                    label="ENROLLMENT STATUS"
                    value={filters.enrollmentStatus}
                    onChange={(val) => updateFilter("enrollmentStatus", val)}
                    options={[
                      { label: "All Batches", value: "" },
                      { label: "Enrolled", value: "Enrolled" },
                      { label: "Not Enrolled", value: "NotEnrolled" },
                    ]}
                  />
                  <FilterSelect
                    label="LEVEL"
                    value={filters.level}
                    onChange={(val) => updateFilter("level", val)}
                    options={[
                      { label: "All levels", value: "" },
                      { label: "Beginner", value: "Beginner" },
                      { label: "Intermediate", value: "Intermediate" },
                      { label: "Advanced", value: "Advanced" },
                    ]}
                  />
                  <FilterSelect
                    label="LEARNING MODE"
                    value={filters.mode}
                    onChange={(val) => updateFilter("mode", val)}
                    options={[
                      { label: "All modes", value: "" },
                      { label: "Online", value: "Online" },
                      { label: "Offline", value: "Offline" },
                      { label: "Hybrid", value: "Hybrid" },
                    ]}
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 outline-none focus:outline-none"
                  >
                    <RotateCcw size={14} /> Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING */}
        {isLoading && (
          <div className="mt-32 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-violet-600" size={48} />
            <p className="mt-4 text-sm font-bold text-slate-500">
              Fetching best batches for you...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!isLoading && error && (
          <div className="mt-12 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
            <p className="text-sm font-bold text-rose-600">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700 outline-none focus:outline-none"
            >
              Try Again
            </button>
          </div>
        )}

        {/* CARDS */}
        {!isLoading && !error && courses.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const batchId = course.batchId ?? course.BatchId;
              const courseId = course.courseId ?? course.CourseId;
              const batchName =
                course.batchName ?? course.BatchName ?? "Untitled batch";
              const courseName =
                course.courseName ?? course.CourseName ?? "Course";
              const price = Number(course.price ?? course.Price ?? 0);
              const isFree =
                course.isFree ?? course.IsFree ?? price === 0;
              const availableSeats = Number(
                course.availableSeats ?? course.AvailableSeats ?? 0
              );
              const startDate = course.startDate ?? course.StartDate;
              const thumbnailUrl = course.thumbnailUrl ?? course.ThumbnailUrl;
              const description = course.description ?? course.Description ?? "";
              const mode = course.mode ?? course.Mode ?? "Online";
              const rating = course.rating ?? course.Rating;
              const duration = course.duration ?? course.Duration ?? "Flexible";
              const level = course.level ?? course.Level ?? "All levels";
              const courseTags = course.courseTags ?? course.CourseTags ?? "";

              // ✅ Backend ab `isEnrolled` bhej raha hai — yahi source of truth hai
              const isEnrolled =
                course.isEnrolled ?? course.IsEnrolled ?? false;

              const low = availableSeats <= 5;
              const formattedStartDate = formatDate(startDate);

              const tags = courseTags
                ? String(courseTags)
                    .replace(/'/g, "")
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                : [];

              return (
                <motion.article
                  key={batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index, 6) * 0.05,
                  }}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50"
                >
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={batchName}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-400">
                        <BookOpen size={48} />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-md">
                        {courseName}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-black tracking-wider shadow-sm backdrop-blur-md ${
                          isFree
                            ? "bg-emerald-500 text-white"
                            : "bg-violet-600 text-white"
                        }`}
                      >
                        {isFree ? "FREE" : "PAID"}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                            <BookOpen size={14} />
                          </div>
                          <span className="text-xs font-semibold">{mode}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">
                          <Star
                            size={12}
                            fill="currentColor"
                            className="text-amber-400"
                          />
                          <span className="text-xs font-bold text-white">
                            {rating || "New"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-violet-600">
                      {batchName}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                      {description}
                    </p>

                    {formattedStartDate && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-violet-700 bg-violet-50 w-fit px-3 py-1.5 rounded-lg border border-violet-100">
                        <CalendarDays size={14} />
                        Starts on {formattedStartDate}
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                        {tags.length > 3 && (
                          <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-400">
                            +{tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-y-3 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Clock size={15} className="text-violet-500" />{" "}
                        {duration}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <GraduationCap size={15} className="text-violet-500" />{" "}
                        {level}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 font-bold ${
                          low ? "text-rose-500" : "text-emerald-600"
                        }`}
                      >
                        <Users size={15} /> {availableSeats} seats left
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Laptop size={15} className="text-violet-500" /> {mode}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-5">
                      <div>
                        <strong className="text-2xl font-black text-slate-900">
                          {money(price)}
                        </strong>
                        {price > 0 && (
                          <small className="mt-0.5 block text-[10px] font-bold text-slate-400">
                            one-time fee
                          </small>
                        )}
                      </div>

                      {/* ✅ Enrolled (sweet green pill) OR Enroll Now */}
                      {isEnrolled ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-sm font-black text-emerald-700 shadow-sm cursor-default select-none">
                          <Check size={16} strokeWidth={3} />
                          Enrolled
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setSelected({
                              ...course,
                              batchId,
                              courseId,
                              batchName,
                              price,
                              isFree,
                              startDate,
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-md shadow-violet-200 transition-all outline-none focus:outline-none hover:bg-violet-700 hover:shadow-lg"
                        >
                          Enroll Now
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !error && courses.length === 0 && (
          <div className="mt-12 rounded-[2rem] border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-white to-cyan-50 px-5 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-violet-500 shadow-sm">
              <Search size={36} />
            </div>
            <h3 className="mt-6 text-2xl font-black text-slate-900">
              No batches found
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-violet-700 outline-none focus:outline-none"
            >
              <RotateCcw size={16} /> Clear all filters
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber === 1}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 outline-none focus:outline-none"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-slate-600">
              Page {pageNumber}{" "}
              <span className="mx-1 text-slate-400">of</span> {totalPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
              disabled={pageNumber === totalPages}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 outline-none focus:outline-none"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="relative mx-4 mb-12 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-12 shadow-xl sm:mx-6 sm:px-12 lg:mx-auto lg:max-w-7xl">
        <div className="pointer-events-none absolute -right-20 -top-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-black tracking-[.2em] text-violet-200">
              START YOUR JOURNEY
            </span>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Your future starts with one batch.
            </h2>
            <p className="mt-3 text-sm font-medium text-violet-100">
              Explore a skill, practice it, and build something amazing.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-6 py-3.5 font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50 sm:self-center outline-none focus:outline-none"
          >
            Browse Batches <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <EnrollmentModal
            key={selected.batchId}
            course={selected}
            onClose={closeModal}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </main>
  );
}