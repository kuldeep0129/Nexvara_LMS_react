import React, { useMemo, useState } from "react";
import {
  Search,
  Users,
  CalendarDays,
  Clock3,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  CircleAlert,
  Video,
  MoreVertical,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  ExternalLink,
  ClipboardList,
} from "lucide-react";

import BlobButton from "../../../../ui/BlobButton.jsx";
import { useTeacherUpcomingBatches } from "../../../hooks/teacher/useTeacherUpcomingBatches.js";

const COLORS = {
  blue: { icon: "bg-blue-50 text-blue-600", progress: "bg-blue-500" },
  purple: { icon: "bg-purple-50 text-purple-600", progress: "bg-purple-500" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", progress: "bg-emerald-500" },
  amber: { icon: "bg-amber-50 text-amber-600", progress: "bg-amber-500" },
};

const getStartingDays = (startIn) => {
  if (!startIn || startIn === "Not Scheduled") return null;
  if (startIn === "Today") return 0;
  const days = Number.parseInt(startIn, 10);
  return Number.isNaN(days) ? null : days;
};

export default function TeacherUpcomingBatches() {
  const {
    batches,
    isLoading,
    error,
    pageNumber,
    totalPages,
    totalCount,
    setPageNumber,
    refetch,
  } = useTeacherUpcomingBatches(10);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Course dropdown options
  const courses = useMemo(() => {
    const uniqueCourses = [
      ...new Set(
        batches
          .map((batch) => batch.course)
          .filter((course) => course && course !== "N/A")
      ),
    ];
    return ["All", ...uniqueCourses];
  }, [batches]);

  // Search and course filtering (current API page only)
  const filteredBatches = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return batches.filter((batch) => {
      const matchesSearch =
        !searchText ||
        batch.name?.toLowerCase().includes(searchText) ||
        batch.course?.toLowerCase().includes(searchText) ||
        batch.code?.toLowerCase().includes(searchText);
      const matchesCourse =
        courseFilter === "All" || batch.course === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [batches, search, courseFilter]);

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <span>Teacher Dashboard</span>
              <span>/</span>
              <span className="text-slate-700">Upcoming Batches</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Upcoming Batches
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Prepare your upcoming batches, review schedules, students
              and course content before the batch starts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
              <CalendarDays size={17} />
              {totalCount} Upcoming
            </span>

            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              title="Refresh batches"
            >
              <RefreshCw size={17} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <CircleAlert size={18} />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="text-sm font-semibold text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* SEARCH AND FILTER */}
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">My Upcoming Batches</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Search and manage your assigned batches.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search batch, course or code..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white sm:w-72"
                />
              </div>

              <div className="relative">
                <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white sm:w-56"
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              Showing {filteredBatches.length} of {batches.length} batches on this page
            </span>

            {(search || courseFilter !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-6 h-20 rounded-xl bg-slate-100" />
                <div className="mt-5 h-3 rounded bg-slate-100" />
                <div className="mt-5 h-10 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* BATCH CARDS */}
        {!isLoading && !error && (
          <>
            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              {filteredBatches.map((batch) => {
                const color = COLORS[batch.color] || COLORS.blue;

                return (
                  <div key={batch.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    {/* CARD HEADER */}
                    <div className="border-b border-slate-100 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.icon}`}>
                            <GraduationCap size={21} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-bold text-slate-900">
                                {batch.name}
                              </h3>
                              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                                UPCOMING
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              {batch.course || "Course not available"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {batch.code || "No batch code"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                          onClick={() => setSelectedBatch(batch)}
                          title="View batch details"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>

                      {/* DATES */}
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <DateBox label="Start Date" value={batch.startDate} icon={<CalendarDays size={16} />} />
                        <DateBox label="End Date" value={batch.endDate} icon={<CalendarDays size={16} />} />
                      </div>

                      {/* PREPARATION */}
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">Preparation Readiness</span>
                          <span className="text-xs font-bold text-slate-700">
                            {typeof batch.preparation === "number" ? `${batch.preparation}%` : "Not checked"}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${color.progress}`}
                            style={{
                              width: `${typeof batch.preparation === "number" ? Math.min(100, Math.max(0, batch.preparation)) : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* CARD DETAILS */}
                    <div className="p-4 sm:p-5">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <MiniStat icon={<Users size={15} />} label="Students" value={`${batch.students ?? 0}/${batch.maxStudents ?? "—"}`} />
                        <MiniStat icon={<Clock3 size={15} />} label="Starts In" value={batch.startIn || "N/A"} />
                        <MiniStat icon={<CalendarDays size={15} />} label="Next Class" value={batch.nextClass || "Not scheduled"} />
                        <MiniStat icon={<Video size={15} />} label="Mode" value={batch.classType || "N/A"} />
                      </div>

                      {/* NEXT CLASS */}
                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-white p-2 text-blue-600">
                            <Clock3 size={17} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] text-slate-400">Next Class Time</p>
                            <p className="text-sm font-semibold text-slate-800">{batch.nextClassTime || "Not scheduled"}</p>
                            {batch.moduleName && <p className="mt-0.5 text-xs text-slate-500">{batch.moduleName}</p>}
                          </div>
                        </div>
                      </div>

                      {/* PREPARATION CHECKLIST */}
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold text-slate-500">Preparation Checklist</p>
                        <div className="flex flex-wrap gap-2">
                          <ChecklistItem label="Content" done={batch.contentReady} />
                          <ChecklistItem label="Schedule" done={batch.scheduleReady} />
                          <ChecklistItem label="Students" done={batch.studentsReady} />
                          <ChecklistItem label="Assessment" done={batch.assessmentReady} />
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <BlobButton
                          variant="primary"
                          className="flex-1 justify-center"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          Prepare Batch <ArrowRight size={16} />
                        </BlobButton>
                        <button
                          type="button"
                          onClick={() => setSelectedBatch(batch)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <BookOpen size={16} /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* EMPTY STATE */}
            {filteredBatches.length === 0 && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <CalendarDays size={23} />
                </div>
                <h3 className="mt-4 font-bold text-slate-800">No upcoming batches found</h3>
                <p className="mt-1 text-sm text-slate-500">Try changing your search or course filter.</p>
                {(search || courseFilter !== "All") && (
                  <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-blue-600">
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page {pageNumber} of {totalPages}
                  <span className="ml-2 text-slate-400">({totalCount} total batches)</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pageNumber <= 1 || isLoading}
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    type="button"
                    disabled={pageNumber >= totalPages || isLoading}
                    onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* DETAILS MODAL */}
        {selectedBatch && (
          <UpcomingBatchModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------
   SUMMARY CARD (Iska use ab nahi ho raha but keeping for future)
------------------------------------------------- */
function SummaryCard({ title, value, subtitle, icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">{subtitle}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   DATE BOX
------------------------------------------------- */
function DateBox({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value || "N/A"}</p>
    </div>
  );
}

/* -------------------------------------------------
   MINI STAT
------------------------------------------------- */
function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] sm:text-[11px]">{label}</span>
      </div>
      <p className="mt-2 truncate text-sm font-bold text-slate-800">{value ?? "N/A"}</p>
    </div>
  );
}

/* -------------------------------------------------
   CHECKLIST ITEM
------------------------------------------------- */
function ChecklistItem({ label, done }) {
  const isReady = done === true;
  const isPending = done === false;

  const statusClass = isReady
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : isPending
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-slate-200 bg-slate-50 text-slate-500";

  const statusText = isReady ? "Ready" : isPending ? "Pending" : "Not checked";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium ${statusClass}`}
      title={`${label}: ${statusText}`}
    >
      {isReady ? <CheckCircle2 size={13} /> : <CircleAlert size={13} />}
      <span>{label}</span>
      <span className="opacity-75">· {statusText}</span>
    </div>
  );
}

/* -------------------------------------------------
   UPCOMING BATCH DETAILS MODAL
------------------------------------------------- */
function UpcomingBatchModal({ batch, onClose }) {
  if (!batch) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upcoming-batch-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap size={22} />
            </div>
            <div className="min-w-0">
              <h2 id="upcoming-batch-title" className="truncate text-lg font-bold text-slate-900">
                {batch.name}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {batch.course} · {batch.code}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="space-y-5 p-5">
          {/* OVERVIEW */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <BookOpen size={17} className="text-blue-600" /> Batch Overview
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DetailItem label="Batch Code" value={batch.code} />
              <DetailItem label="Course" value={batch.course} />
              <DetailItem label="Teacher Role" value={batch.teacherRole} />
              <DetailItem label="Start Date" value={batch.startDate} />
              <DetailItem label="End Date" value={batch.endDate} />
              <DetailItem label="Batch Status" value={batch.status} />
            </div>
          </section>

          {/* STUDENTS */}
          <section className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <Users size={17} className="text-blue-600" /> Student Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Enrolled Students" value={batch.students ?? 0} />
              <DetailItem label="Batch Capacity" value={batch.maxStudents ?? "N/A"} />
            </div>
          </section>

          {/* SCHEDULE */}
          <section className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <CalendarDays size={17} className="text-blue-600" /> Next Class
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Date" value={batch.nextClass} />
              <DetailItem label="Time" value={batch.nextClassTime} />
              <DetailItem label="Class Mode" value={batch.classType} />
              <DetailItem label="Module" value={batch.moduleName || "N/A"} />
            </div>
            {batch.meetingLink && (
              <a
                href={batch.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Video size={16} /> Join Meeting <ExternalLink size={14} />
              </a>
            )}
          </section>

          {/* PREPARATION */}
          <section className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <ClipboardList size={17} className="text-blue-600" /> Preparation Status
            </h3>
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-500">Overall Readiness</span>
                <strong className="text-slate-800">
                  {typeof batch.preparation === "number" ? `${batch.preparation}%` : "Not checked"}
                </strong>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${typeof batch.preparation === "number" ? Math.min(100, Math.max(0, batch.preparation)) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <ChecklistItem label="Content" done={batch.contentReady} />
              <ChecklistItem label="Schedule" done={batch.scheduleReady} />
              <ChecklistItem label="Students" done={batch.studentsReady} />
              <ChecklistItem label="Assessment" done={batch.assessmentReady} />
            </div>
          </section>

          {/* PENDING WORK */}
          <section className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-800">Pending Work</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Pending Assignments" value={batch.pendingAssignments ?? 0} />
              <DetailItem label="Pending Assessments" value={batch.pendingAssessments ?? 0} />
            </div>
          </section>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end border-t border-slate-100 bg-slate-50 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   MODAL DETAIL ITEM
------------------------------------------------- */
function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value !== null && value !== undefined && value !== "" ? value : "N/A"}
      </p>
    </div>
  );
}