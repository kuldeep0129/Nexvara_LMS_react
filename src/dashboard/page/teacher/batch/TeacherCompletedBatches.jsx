import React, { useMemo, useState } from "react";
import {
  Search, Users, CalendarDays, Clock3, BookOpen, GraduationCap, 
  CheckCircle2, CircleAlert, Video, MoreVertical, ArrowRight, 
  Filter, ChevronLeft, ChevronRight, RefreshCw, X, ExternalLink, 
  ClipboardList, Download, Award, CheckSquare
} from "lucide-react";

import BlobButton from "../../../../ui/BlobButton.jsx";
import { useTeacherCompletedBatches } from "../../../hooks/teacher/useTeacherCompleteBatch.js";

const COLORS = {
  slate: { icon: "bg-slate-100 text-slate-600", progress: "bg-slate-500" },
  indigo: { icon: "bg-indigo-50 text-indigo-600", progress: "bg-indigo-500" },
  teal: { icon: "bg-teal-50 text-teal-600", progress: "bg-teal-500" },
};

export default function TeacherCompletedBatches() {
  const {
    batches, isLoading, error, pageNumber, totalPages, totalCount, setPageNumber, refetch,
  } = useTeacherCompletedBatches(10);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Course dropdown options
  const courses = useMemo(() => {
    const uniqueCourses = [
      ...new Set(batches.map((batch) => batch.course).filter((course) => course && course !== "N/A")),
    ];
    return ["All", ...uniqueCourses];
  }, [batches]);

  // Filter Logic
  const filteredBatches = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return batches.filter((batch) => {
      const matchesSearch =
        !searchText ||
        batch.name?.toLowerCase().includes(searchText) ||
        batch.course?.toLowerCase().includes(searchText) ||
        batch.code?.toLowerCase().includes(searchText);
      const matchesCourse = courseFilter === "All" || batch.course === courseFilter;
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
              <span className="text-slate-700">Completed Batches</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Completed Batches
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Review your completed batches, student results, and download final reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              <CheckSquare size={17} />
              {totalCount} Completed
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
              <CircleAlert size={18} /> <span>{error}</span>
            </div>
            <button type="button" onClick={refetch} disabled={isLoading} className="text-sm font-semibold text-red-700 underline">
              Try Again
            </button>
          </div>
        )}

        {/* SEARCH AND FILTER */}
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">My Completed Batches</h2>
              <p className="mt-0.5 text-xs text-slate-500">Search and review your past batches.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search batch, course or code..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-400 focus:bg-white sm:w-72"
                />
              </div>

              <div className="relative">
                <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:bg-white sm:w-56"
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400">
            <span>Showing {filteredBatches.length} of {batches.length} batches on this page</span>
            {(search || courseFilter !== "All") && (
              <button type="button" onClick={clearFilters} className="shrink-0 font-semibold text-emerald-600 hover:text-emerald-700">
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
                const color = COLORS[batch.color] || COLORS.slate;

                return (
                  <div key={batch.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    {/* CARD HEADER */}
                    <div className="border-b border-slate-100 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.icon}`}>
                            <Award size={21} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-bold text-slate-900">
                                {batch.name}
                              </h3>
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 uppercase">
                                Completed
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{batch.course || "Course not available"}</p>
                            <p className="mt-1 text-xs text-slate-400">{batch.code || "No batch code"}</p>
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

                      {/* PROGRESS (Completed means 100%) */}
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500"/> Course Completed</span>
                          <span className="text-xs font-bold text-slate-700">100%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-emerald-500 w-full" />
                        </div>
                      </div>
                    </div>

                    {/* CARD DETAILS */}
                    <div className="p-4 sm:p-5">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <MiniStat icon={<Users size={15} />} label="Total Students" value={batch.students ?? 0} />
                        <MiniStat icon={<TrendingUpIcon />} label="Avg. Attendance" value={`${batch.attendance || 0}%`} />
                        <MiniStat icon={<Clock3 size={15} />} label="Completed On" value={batch.endDate} />
                        <MiniStat icon={<Video size={15} />} label="Mode" value={batch.classType || "N/A"} />
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setSelectedBatch(batch)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
                        >
                          <ClipboardList size={16} /> View Summary
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Download size={16} /> Report
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
                  <Award size={23} />
                </div>
                <h3 className="mt-4 font-bold text-slate-800">No completed batches found</h3>
                <p className="mt-1 text-sm text-slate-500">Try changing your search or course filter.</p>
                {(search || courseFilter !== "All") && (
                  <button type="button" onClick={clearFilters} className="mt-4 text-sm font-semibold text-emerald-600">
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
          <CompletedBatchModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
        )}
      </div>
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
        {icon} <span className="text-[10px] sm:text-[11px]">{label}</span>
      </div>
      <p className="mt-2 truncate text-sm font-bold text-slate-800">{value ?? "N/A"}</p>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}

function DateBox({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon} <span className="text-[11px]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value || "N/A"}</p>
    </div>
  );
}

/* -------------------------------------------------
   COMPLETED BATCH MODAL
------------------------------------------------- */
function CompletedBatchModal({ batch, onClose }) {
  if (!batch) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Award size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">{batch.name}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{batch.course} · {batch.code}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="space-y-5 p-5">
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <BookOpen size={17} className="text-slate-600" /> Batch Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DetailItem label="Batch Code" value={batch.code} />
              <DetailItem label="Course" value={batch.course} />
              <DetailItem label="Batch Status" value={batch.status} />
              <DetailItem label="Start Date" value={batch.startDate} />
              <DetailItem label="End Date" value={batch.endDate} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <Users size={17} className="text-slate-600" /> Student Results
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Total Enrolled" value={batch.students ?? 0} />
              <DetailItem label="Avg. Attendance" value={`${batch.attendance || 0}%`} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-800">Pending Work</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Unresolved Assignments" value={batch.pendingAssignments ?? 0} />
              <DetailItem label="Unresolved Assessments" value={batch.pendingAssessments ?? 0} />
            </div>
          </section>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end border-t border-slate-100 bg-slate-50 p-4 gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Close
          </button>
          <button type="button" className="rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2">
            <Download size={16} /> Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   DETAIL ITEM
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