import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Search, Users, CalendarDays, Video, BookOpen, ClipboardCheck, FileText,
  ArrowRight, CheckCircle2, TrendingUp, GraduationCap, X, UserCheck,
  PlayCircle, Filter, Loader2, Settings, Clock3, UploadCloud, Download,
  ExternalLink, RefreshCw, AlertCircle, File, FileImage, FileVideo,
  FileSpreadsheet, Eye, Link2, Layers, Trash2, Pencil, Plus
} from "lucide-react";

import { useTeacherActiveBatches } from "../../../hooks/teacher/useTeacherActiveBatches.js";
import { batchService } from "../../../services/teacher/batchService";

const COLOR_MAP = {
  blue: { icon: "bg-blue-50 text-blue-600", progress: "bg-blue-500" },
  purple: { icon: "bg-purple-50 text-purple-600", progress: "bg-purple-500" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", progress: "bg-emerald-500" },
};

const TABS = [
  { name: "Overview", icon: BookOpen },
  { name: "Students", icon: Users },
  { name: "Attendance", icon: UserCheck },
  { name: "Materials", icon: FileText },
  { name: "Modules", icon: Layers },
  { name: "Schedule", icon: CalendarDays },
  { name: "Classes", icon: Video },
];

const getValue = (obj, camel, pascal, fallback = null) =>
  obj?.[camel] ?? obj?.[pascal] ?? fallback;

const getPayload = (response) => response?.data ?? response?.Data ?? response;

const formatDate = (value) => {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (value) => {
  if (!value) return "N/A";
  if (typeof value === "string" && /^\d{1,2}:\d{2}/.test(value)) {
    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function TeacherActiveBatches() {
  const { batches, isLoading, error, refetch } = useTeacherActiveBatches();

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);

  const courses = useMemo(() => ["All", ...new Set(batches.map((batch) => batch.course))], [batches]);

  const filteredBatches = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return batches.filter((batch) => {
      const matchesSearch =
        batch.name.toLowerCase().includes(keyword) ||
        batch.course.toLowerCase().includes(keyword) ||
        batch.code.toLowerCase().includes(keyword);
      const matchesCourse = courseFilter === "All" || batch.course === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [batches, search, courseFilter]);

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <span>Teacher Dashboard</span>
              <span>/</span>
              <span className="font-medium text-slate-700">Active Batches</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Active Batches</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Manage your assigned batches, students, attendance and learning materials.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isLoading ? "Loading..." : `${batches.length} Active Batches`}
            </span>
            <button onClick={refetch} disabled={isLoading} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50" title="Refresh batches">
              <RefreshCw size={17} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">My Active Batches</h2>
              <p className="mt-0.5 text-xs text-slate-500">Select a batch to manage its activities.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batch..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white sm:w-64" />
              </div>
              <div className="relative">
                <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white sm:w-56">
                  {courses.map((course) => <option key={course} value={course}>{course}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="mb-4 animate-spin text-blue-600" size={38} />
            <p className="text-sm font-medium text-slate-500">Fetching your batches...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto mb-2 text-red-500" size={28} />
            <p className="font-semibold text-red-700">{error}</p>
            <button onClick={refetch} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Try Again</button>
          </div>
        )}

        {/* Batch cards */}
        {!isLoading && !error && (
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {filteredBatches.map((batch) => {
              const colors = COLOR_MAP[batch.color] || COLOR_MAP.blue;
              return (
                <div key={batch.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="border-b border-slate-100 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
                          <GraduationCap size={21} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-bold text-slate-900">{batch.name}</h3>
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{String(batch.status).toUpperCase()}</span>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{batch.course}</p>
                          <p className="mt-1 text-xs text-slate-400">Batch Code: {batch.code}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Course Progress</span>
                        <span className="text-xs font-bold text-slate-700">{batch.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${colors.progress}`} style={{ width: `${Math.min(Math.max(batch.progress, 0), 100)}%` }} />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <MiniStat icon={<Users size={15} />} label="Students" value={`${batch.students}/${batch.maxStudents}`} />
                      <MiniStat icon={<TrendingUp size={15} />} label="Attendance" value={`${batch.attendance}%`} />
                      <MiniStat icon={<CalendarDays size={15} />} label="Start Date" value={formatDate(batch.startDate)} />
                    </div>
                  </div>

                  <div className="bg-slate-50/70 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                          <Video size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400">Batch Duration</p>
                          <p className="mt-1 text-sm font-bold text-slate-800">{formatDate(batch.startDate)} - {formatDate(batch.endDate)}</p>
                        </div>
                      </div>
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
                        <PlayCircle size={14} /> Active Batch
                      </span>
                    </div>

                    <button onClick={() => setSelectedBatch(batch)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99]">
                      <Settings size={17} /> Manage Batch <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !error && filteredBatches.length === 0 && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <BookOpen className="mx-auto text-slate-300" size={30} />
            <h3 className="mt-4 font-bold text-slate-800">No active batches found</h3>
            <p className="mt-1 text-sm text-slate-500">Try changing your search or course filter.</p>
          </div>
        )}

        {/* Management Modal */}
        {selectedBatch && (
          <BatchManagementModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
        )}
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon} <span className="text-[11px]">{label}</span>
      </div>
      <p className="mt-1 truncate text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function BatchManagementModal({ batch, onClose }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await batchService.getBatchOverview(batch.id);
      const payload = getPayload(response);
      const result = payload?.data ?? payload?.Data ?? payload;
      setOverview(result);
    } catch (err) {
      console.error("Batch overview error:", err);
      setError(err.message || "Unable to load batch overview.");
    } finally {
      setIsLoading(false);
    }
  }, [batch.id]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const summary = getValue(overview, "summary", "Summary", {});
  const basic = getValue(overview, "basicInformation", "BasicInformation", {});
  const nextClass = getValue(overview, "nextLiveClass", "NextLiveClass", null);
  const attendance = getValue(overview, "attendance", "Attendance", []);
  const materials = getValue(overview, "materials", "Materials", []);
  const syllabusInformation = getValue(overview, "syllabusInformation", "SyllabusInformation", []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[92vh]">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">{batch.name}</h2>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{String(batch.status).toUpperCase()}</span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">{batch.course} · {batch.code}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button onClick={fetchOverview} disabled={isLoading} title="Refresh overview" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 disabled:opacity-50">
              <RefreshCw size={17} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border-b border-slate-100">
          <div className="flex min-w-max px-2 sm:px-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.name;
              return (
                <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${active ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                  <Icon size={15} /> {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          {isLoading && (
            <div className="flex min-h-[350px] flex-col items-center justify-center">
              <Loader2 className="mb-3 animate-spin text-blue-600" size={35} />
              <p className="text-sm font-medium text-slate-500">Loading batch details...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <AlertCircle size={35} className="text-red-500" />
              <h3 className="mt-3 font-bold text-slate-800">Unable to load batch details</h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
              <button onClick={fetchOverview} className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Retry</button>
            </div>
          )}

          {!isLoading && !error && overview && (
            <>
              {activeTab === "Overview" && <OverviewTab summary={summary} basic={basic} nextClass={nextClass} attendance={attendance} materials={materials} onChangeTab={setActiveTab} />}
              {activeTab === "Students" && <StudentsTab attendance={attendance} />}
              {activeTab === "Attendance" && <AttendanceTab batchId={batch.id} />}
              {activeTab === "Materials" && <MaterialsTab batchId={batch.id} courseId={getValue(basic, "courseId", "CourseId") || batch.courseId} materials={materials} onUploaded={fetchOverview} />}
              {activeTab === "Modules" && <ModulesTab syllabus={syllabusInformation} />}
              {activeTab === "Schedule" && <ScheduleTab nextClass={nextClass} />}
              {activeTab === "Classes" && (
                <ClassesTab
                  batchId={batch.id}
                  courseId={getValue(basic, "courseId", "CourseId") || batch.courseId}
                  syllabus={syllabusInformation}
                  nextClass={nextClass}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ATTENDANCE TAB (WITH MARK ATTENDANCE MODAL)
// ============================================================

function AttendanceTab({ batchId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showMarkModal, setShowMarkModal] = useState(false);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await batchService.getBatchAttendanceSummary(batchId);
      const payload = res?.data ?? res?.Data ?? res;
      setData(payload);
    } catch (err) {
      console.error("Attendance summary error:", err);
      setError(err.message || "Unable to load attendance data.");
    } finally {
      setIsLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const students = useMemo(() => {
    const list = data?.particularAttendnace ?? data?.ParticularAttendnace ?? [];
    return list;
  }, [data]);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return students.filter((s) => {
      const name = String(s.studentName ?? s.StudentName ?? "").toLowerCase();
      const id = String(s.studentId ?? s.StudentId ?? "").toLowerCase();
      const matchesSearch = !keyword || name.includes(keyword) || id.includes(keyword);

      const pct = Number(s.averageAttendance ?? s.AverageAttendance ?? 0);
      let matchesFilter = true;
      if (filter === "Good") matchesFilter = pct >= 75;
      if (filter === "Low") matchesFilter = pct > 0 && pct < 75;
      if (filter === "Zero") matchesFilter = pct === 0;

      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center">
        <Loader2 className="mb-3 animate-spin text-blue-600" size={32} />
        <p className="text-sm font-medium text-slate-500">Loading attendance summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle size={32} className="text-red-500" />
        <h3 className="mt-3 font-bold text-slate-800">Unable to load attendance</h3>
        <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
        <button onClick={fetchSummary} className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          Retry
        </button>
      </div>
    );
  }

  const totalStudent = data?.totalStudent ?? data?.TotalStudent ?? 0;
  const batchAvg = Number(data?.batchAverageAttendance ?? data?.BatchAverageAttendance ?? 0);
  const presentToday = data?.presentToday ?? data?.PresentToday ?? 0;
  const absentToday = data?.absentToday ?? data?.AbsentToday ?? 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Attendance Overview</h3>
          <p className="mt-1 text-xs text-slate-500">
            Batch-level attendance summary and per-student breakdown.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMarkModal(true)}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <ClipboardCheck size={14} /> Mark Attendance
          </button>
          <button onClick={fetchSummary} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatBox label="Total Students" value={totalStudent} icon={<Users size={18} />} tone="blue" />
        <StatBox label="Batch Average" value={`${batchAvg.toFixed(1)}%`} icon={<TrendingUp size={18} />} tone="emerald" />
        <StatBox label="Present Today" value={presentToday} icon={<UserCheck size={18} />} tone="green" />
        <StatBox label="Absent Today" value={absentToday} icon={<X size={18} />} tone="red" />
      </div>

      {/* Batch average bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Batch Attendance Rate</span>
          <span className="font-bold text-slate-800">{batchAvg.toFixed(1)}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
            style={{ width: `${Math.min(Math.max(batchAvg, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {["All", "Good", "Low", "Zero"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f === "All" ? "All Students" : f === "Good" ? "Good (≥75%)" : f === "Low" ? "Low (<75%)" : "Zero"}
            </button>
          ))}
        </div>
      </div>

      {/* Student list */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={<UserCheck size={25} />}
          title="No students found"
          description="Try changing your search or filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((s) => {
            const studentId = s.studentId ?? s.StudentId ?? "";
            const name = s.studentName ?? s.StudentName ?? "Student";
            const image = s.studnetProfileImage ?? s.StudentProfileImage ?? s.studnetProfileImage;
            const present = s.present ?? s.Present ?? 0;
            const absent = s.absent ?? s.Absent ?? 0;
            const pct = Number(s.averageAttendance ?? s.AverageAttendance ?? 0);

            return (
              <StudentAttendanceRow
                key={studentId}
                batchId={batchId}
                studentId={studentId}
                name={name}
                image={image}
                present={present}
                absent={absent}
                pct={pct}
              />
            );
          })}
        </div>
      )}

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <MarkAttendanceModal
          batchId={batchId}
          students={students}
          onClose={() => setShowMarkModal(false)}
          onSaved={() => {
            setShowMarkModal(false);
            fetchSummary();
          }}
        />
      )}
    </div>
  );
}

function StatBox({ label, value, icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <div className={`rounded-lg p-2 ${tones[tone]}`}>{icon}</div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// ============================================================
// MARK ATTENDANCE MODAL (BULK)
// ============================================================

function MarkAttendanceModal({ batchId, students, onClose, onSaved }) {
  const [sessions, setSessions] = useState([]);
  const [isFetchingSessions, setIsFetchingSessions] = useState(true);
  const [sessionsError, setSessionsError] = useState("");
  const [selectedSessionIds, setSelectedSessionIds] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [studentStatus, setStudentStatus] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsFetchingSessions(true);
      setSessionsError("");
      try {
        const res = await batchService.getTeacherBatchClassSessions(batchId, 1, 100);
        const payload = res?.data ?? res?.Data ?? res;
        const items = payload?.items ?? payload?.Items ?? (Array.isArray(payload) ? payload : []);
        if (mounted) setSessions(Array.isArray(items) ? items : []);
      } catch (err) {
        if (mounted) setSessionsError(err.message || "Failed to load sessions.");
      } finally {
        if (mounted) setIsFetchingSessions(false);
      }
    })();
    return () => { mounted = false; };
  }, [batchId]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return students;
    return students.filter((s) => {
      const name = String(s.studentName ?? s.StudentName ?? "").toLowerCase();
      const id = String(s.studentId ?? s.StudentId ?? "").toLowerCase();
      return name.includes(keyword) || id.includes(keyword);
    });
  }, [students, search]);

  const toggleSession = (id) => {
    setSelectedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleStudent = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setStudentStatus((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: { status: "Present", remarks: "" } };
    });
  };

  const selectAllStudents = () => {
    const ids = filteredStudents.map((s) => s.studentId ?? s.StudentId);
    setSelectedStudentIds(ids);
    const next = { ...studentStatus };
    ids.forEach((id) => {
      if (!next[id]) next[id] = { status: "Present", remarks: "" };
    });
    setStudentStatus(next);
  };

  const clearAllStudents = () => {
    setSelectedStudentIds([]);
  };

  const updateStudentStatus = (studentId, status) => {
    setStudentStatus((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), status },
    }));
  };

  const updateStudentRemarks = (studentId, remarks) => {
    setStudentStatus((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || { status: "Present" }), remarks },
    }));
  };

  const totalRecords = selectedSessionIds.length * selectedStudentIds.length;
  const canSave = selectedSessionIds.length > 0 && selectedStudentIds.length > 0 && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setSaveError("");
    try {
      const records = [];
      selectedSessionIds.forEach((sessionId) => {
        selectedStudentIds.forEach((studentId) => {
          const entry = studentStatus[studentId] || { status: "Present", remarks: "" };
          records.push({
            studentId,
            batchClassSessionId: sessionId,
            status: entry.status,
            remarks: entry.remarks?.trim() || null,
          });
        });
      });
      await batchService.createStudentAttendance({ attendanceRecords: records });
      onSaved();
    } catch (err) {
      setSaveError(err.message || "Failed to save attendance.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-4 sm:p-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Mark Attendance</h3>
            <p className="mt-1 text-xs text-slate-500">
              Select sessions and students. Default status is Present.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* STEP 1: SESSIONS */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                1. Sessions {selectedSessionIds.length > 0 && `(${selectedSessionIds.length} selected)`}
              </p>
              {sessions.length > 0 && (
                <button
                  onClick={() =>
                    setSelectedSessionIds(
                      selectedSessionIds.length === sessions.length
                        ? []
                        : sessions.map((s) => s.batchClassSessionId ?? s.BatchClassSessionId)
                    )
                  }
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  {selectedSessionIds.length === sessions.length ? "Clear all" : "Select all"}
                </button>
              )}
            </div>

            {isFetchingSessions && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={15} className="animate-spin" /> Loading sessions...
              </div>
            )}
            {sessionsError && <p className="text-xs font-medium text-red-600">{sessionsError}</p>}
            {!isFetchingSessions && !sessionsError && sessions.length === 0 && (
              <p className="text-xs text-slate-400">No sessions available.</p>
            )}

            {sessions.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {sessions.map((s) => {
                  const id = s.batchClassSessionId ?? s.BatchClassSessionId;
                  const selected = selectedSessionIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleSession(id)}
                      className={`flex items-start justify-between gap-2 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-200"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatDate(s.sessionDate ?? s.SessionDate)}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formatTime(s.startTime ?? s.StartTime)} – {formatTime(s.endTime ?? s.EndTime)}
                        </p>
                      </div>
                      <div className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded border ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"}`}>
                        {selected && <CheckCircle2 size={11} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* STEP 2: STUDENTS */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                2. Students {selectedStudentIds.length > 0 && `(${selectedStudentIds.length} selected)`}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={selectAllStudents} className="text-[11px] font-semibold text-blue-600 hover:underline">
                  Select all
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={clearAllStudents} className="text-[11px] font-semibold text-slate-500 hover:underline">
                  Clear
                </button>
              </div>
            </div>

            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-blue-400"
              />
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-xs text-slate-400">No students found.</p>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map((s) => {
                  const id = s.studentId ?? s.StudentId;
                  const name = s.studentName ?? s.StudentName ?? "Student";
                  const image = s.studnetProfileImage ?? s.StudentProfileImage;
                  const selected = selectedStudentIds.includes(id);
                  const entry = studentStatus[id] || { status: "Present", remarks: "" };

                  return (
                    <div
                      key={id}
                      className={`rounded-xl border p-3 transition ${
                        selected ? "border-blue-300 bg-blue-50/50" : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStudent(id)}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"}`}
                        >
                          {selected && <CheckCircle2 size={13} />}
                        </button>
                        {image ? (
                          <img src={image} alt={name} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-600">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <p className="flex-1 truncate text-sm font-semibold text-slate-800">{name}</p>

                        {selected && (
                          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateStudentStatus(id, "Present")}
                              className={`px-2.5 py-1 text-[11px] font-semibold ${
                                entry.status === "Present"
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white text-slate-600 hover:bg-emerald-50"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStudentStatus(id, "Absent")}
                              className={`px-2.5 py-1 text-[11px] font-semibold border-l border-slate-200 ${
                                entry.status === "Absent"
                                  ? "bg-red-600 text-white"
                                  : "bg-white text-slate-600 hover:bg-red-50"
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        )}
                      </div>

                      {selected && (
                        <div className="mt-2 pl-8">
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) => updateStudentRemarks(id, e.target.value)}
                            placeholder="Remarks (optional)"
                            maxLength={200}
                            className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-blue-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {saveError && (
            <p className="flex items-center gap-2 text-xs font-medium text-red-600">
              <AlertCircle size={14} /> {saveError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              {selectedSessionIds.length} session(s) × {selectedStudentIds.length} student(s) ={" "}
              <span className="font-bold text-slate-800">{totalRecords} record(s)</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle2 size={15} /> Save Attendance</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STUDENT ROW + SESSION EDITOR
// ============================================================

function StudentAttendanceRow({ batchId, studentId, name, image, present, absent, pct }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [savingSessionId, setSavingSessionId] = useState(null);
  const [rowSuccess, setRowSuccess] = useState("");

  const fetchDetail = useCallback(async () => {
    if (detail) return;
    setIsFetching(true);
    setDetailError("");
    try {
      const res = await batchService.getParticularStudentAttendanceSummary(batchId, studentId);
      const payload = res?.data ?? res?.Data ?? res;
      setDetail(payload);
    } catch (err) {
      setDetailError(err.message || "Failed to load student attendance.");
    } finally {
      setIsFetching(false);
    }
  }, [batchId, studentId, detail]);

  const handleToggle = () => {
    setExpanded((v) => !v);
    if (!expanded) fetchDetail();
  };

  const handleSaveAttendance = async (session, status, remarks) => {
    setSavingSessionId(session.sessionId);
    setDetailError("");
    setRowSuccess("");
    try {
      await batchService.createStudentAttendance({
        attendanceRecords: [
          {
            studentId,
            batchClassSessionId: session.sessionId,
            status,
            remarks: remarks || null,
          },
        ],
      });
      setDetail((prev) => {
        if (!prev?.summary) return prev;
        return {
          ...prev,
          summary: prev.summary.map((s) =>
            s.sessionId === session.sessionId
              ? { ...s, status, remarks: remarks || null, markedAt: new Date().toISOString(), attendanceId: s.attendanceId || 1 }
              : s
          ),
        };
      });
      setRowSuccess(`Attendance saved for ${formatDate(session.sessionDate)}`);
    } catch (err) {
      setDetailError(err.message || "Failed to save attendance.");
    } finally {
      setSavingSessionId(null);
    }
  };

  const barColor =
    pct >= 75 ? "bg-emerald-500" :
    pct >= 40 ? "bg-amber-500" :
    pct > 0 ? "bg-red-500" : "bg-slate-300";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={handleToggle}
        className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/70"
      >
        <div className="flex items-center gap-3">
          {image ? (
            <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-slate-800">{name}</p>
            <p className="text-[11px] text-slate-400">
              Present <span className="text-emerald-600 font-semibold">{present}</span> · Absent{" "}
              <span className="text-red-500 font-semibold">{absent}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-40">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }} />
            </div>
          </div>
          <span className="w-14 text-right text-sm font-bold text-slate-800">{pct.toFixed(1)}%</span>
          <span className={`text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Session History</p>
            {rowSuccess && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 size={13} /> {rowSuccess}
              </span>
            )}
          </div>

          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={15} className="animate-spin" /> Loading sessions...
            </div>
          )}
          {detailError && <p className="text-xs font-medium text-red-600">{detailError}</p>}

          {detail && (
            <>
              <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="rounded-md bg-white px-2 py-1 text-slate-600 border border-slate-200">
                  Total: {detail.totalClasses}
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 border border-emerald-200">
                  Present: {detail.present}
                </span>
                <span className="rounded-md bg-red-50 px-2 py-1 text-red-700 border border-red-200">
                  Absent: {detail.absent}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600 border border-slate-200">
                  Not Marked: {detail.notMarked}
                </span>
              </div>

              {detail.summary?.length ? (
                <div className="space-y-2">
                  {detail.summary.map((session) => (
                    <SessionAttendanceEditor
                      key={session.sessionId}
                      session={session}
                      isSaving={savingSessionId === session.sessionId}
                      onSave={(status, remarks) => handleSaveAttendance(session, status, remarks)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No session history available.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SessionAttendanceEditor({ session, isSaving, onSave }) {
  const [status, setStatus] = useState(session.status || "Not Marked");
  const [remarks, setRemarks] = useState(session.remarks || "");

  useEffect(() => {
    setStatus(session.status || "Not Marked");
    setRemarks(session.remarks || "");
  }, [session.sessionId, session.status, session.remarks]);

  const isNotMarked = status === "Not Marked";

  const statusBadgeClass =
    status === "Present"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Absent"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {formatDate(session.sessionDate)}
          </p>
          <p className="text-xs text-slate-400">
            {formatTime(session.startTime)} – {formatTime(session.endTime)}
          </p>
        </div>
        <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusBadgeClass}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setStatus("Present")}
            className={`px-3 py-1.5 text-xs font-semibold transition ${
              status === "Present"
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 hover:bg-emerald-50"
            } disabled:opacity-50`}
          >
            Present
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setStatus("Absent")}
            className={`px-3 py-1.5 text-xs font-semibold transition border-l border-slate-200 ${
              status === "Absent"
                ? "bg-red-600 text-white"
                : "bg-white text-slate-600 hover:bg-red-50"
            } disabled:opacity-50`}
          >
            Absent
          </button>
        </div>

        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks (optional)"
          maxLength={200}
          disabled={isSaving}
          className="h-9 w-full flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-400 focus:bg-white disabled:opacity-50"
        />

        <button
          type="button"
          disabled={isSaving || isNotMarked}
          onClick={() => onSave(status, remarks.trim())}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <><Loader2 size={13} className="animate-spin" /> Saving...</>
          ) : (
            <><CheckCircle2 size={13} /> Save</>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// OTHER TABS
// ============================================================

function OverviewTab({ summary, basic, nextClass, attendance, materials, onChangeTab }) {
  const totalStudents = getValue(summary, "totalStudents", "TotalStudents", 0);
  const attendancePercentage = getValue(summary, "attendancePercentage", "AttendancePercentage", 0);
  const courseProgress = getValue(summary, "courseProgress", "CourseProgress", 0);
  const nextClassDate = getValue(summary, "nextClassDate", "NextClassDate", null);

  const batchName = getValue(basic, "batchName", "BatchName", "N/A");
  const batchCode = getValue(basic, "batchCode", "BatchCode", "N/A");
  const courseName = getValue(basic, "courseName", "CourseName", "N/A");
  const startDate = getValue(basic, "startDate", "StartDate", null);
  const endDate = getValue(basic, "endDate", "EndDate", null);
  const capacity = getValue(basic, "capacity", "Capacity", 0);
  const batchStatus = getValue(basic, "batchStatus", "BatchStatus", "N/A");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OverviewMetric label="Total Students" value={totalStudents} icon={<Users size={18} />} color="blue" />
        <OverviewMetric label="Attendance" value={`${Number(attendancePercentage || 0).toFixed(1)}%`} icon={<UserCheck size={18} />} color="emerald" />
        <OverviewMetric label="Course Progress" value={`${Number(courseProgress || 0).toFixed(1)}%`} icon={<TrendingUp size={18} />} color="purple" />
        <OverviewMetric label="Next Class" value={formatDate(nextClassDate)} icon={<CalendarDays size={18} />} color="amber" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Batch Information</h3>
              <p className="mt-1 text-xs text-slate-500">Basic details of your assigned batch</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <GraduationCap size={19} />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <InfoRow label="Batch Name" value={batchName} />
            <InfoRow label="Batch Code" value={batchCode} />
            <InfoRow label="Course" value={courseName} />
            <InfoRow label="Start Date" value={formatDate(startDate)} />
            <InfoRow label="End Date" value={formatDate(endDate)} />
            <InfoRow label="Capacity" value={capacity} />
            <InfoRow label="Status" value={batchStatus} />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-wide text-blue-600">NEXT LIVE CLASS</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                {nextClass ? getValue(nextClass, "topic", "Topic", "Upcoming Class") : "No upcoming class"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {getValue(nextClass, "moduleName", "ModuleName", "No module assigned")}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
              <Video size={20} />
            </div>
          </div>

          {nextClass ? (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{formatDate(getValue(nextClass, "sessionDate", "SessionDate"))}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {formatTime(getValue(nextClass, "startTime", "StartTime"))} - {formatTime(getValue(nextClass, "endTime", "EndTime"))}
                  </p>
                </div>
              </div>
              {getValue(nextClass, "meetingLink", "MeetingLink") && (
                <a href={getValue(nextClass, "meetingLink", "MeetingLink")} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                  <Video size={17} /> Open Meeting Link <ExternalLink size={15} />
                </a>
              )}
            </>
          ) : (
            <p className="mt-5 rounded-xl bg-white p-4 text-sm text-slate-500">There is no upcoming live class available for this batch.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">Quick Management</h3>
            <p className="mt-1 text-xs text-slate-500">Access your batch activities</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction icon={<Users size={19} />} title="Students" count={attendance.length} onClick={() => onChangeTab("Students")} />
          <QuickAction icon={<UserCheck size={19} />} title="Attendance" count={attendance.length} onClick={() => onChangeTab("Attendance")} />
          <QuickAction icon={<FileText size={19} />} title="Materials" count={materials.length} onClick={() => onChangeTab("Materials")} />
          <QuickAction icon={<CalendarDays size={19} />} title="Schedule" count={nextClass ? 1 : 0} onClick={() => onChangeTab("Schedule")} />
        </div>
      </div>
    </div>
  );
}

function OverviewMetric({ label, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <div className={`rounded-lg p-2 ${colorMap[color]}`}>{icon}</div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className="mt-3 break-words text-lg font-bold text-slate-900 sm:text-xl">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="break-all text-right text-sm font-semibold text-slate-700">{value ?? "N/A"}</span>
    </div>
  );
}

function QuickAction({ icon, title, count, onClick }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50">
      <div className="flex items-center justify-between gap-2">
        <span className="text-blue-600">{icon}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{count}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
    </button>
  );
}

function ModulesTab({ syllabus }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return syllabus || [];
    return (syllabus || []).filter((item) => {
      const title = getValue(item, "syllabusTitle", "SyllabusTitle", getValue(item, "title", "Title", ""));
      const desc = getValue(item, "syllabusDescription", "SyllabusDescription", getValue(item, "description", "Description", ""));
      return String(title).toLowerCase().includes(keyword) || String(desc).toLowerCase().includes(keyword);
    });
  }, [syllabus, search]);

  if (!syllabus || syllabus.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={25} />}
        title="No modules added"
        description="Course modules and syllabus will appear here once configured."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Course Modules & Syllabus</h3>
          <p className="mt-1 text-xs text-slate-500">
            {syllabus.length} module{syllabus.length > 1 ? "s" : ""} covered in this batch
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search module..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-400 sm:w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Layers size={25} />}
          title="No matching modules"
          description="Try a different search keyword."
        />
      ) : (
        <div className="relative space-y-3 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filtered.map((item, index) => {
            const id = getValue(item, "id", "Id", index);
            const title = getValue(item, "syllabusTitle", "SyllabusTitle", getValue(item, "title", "Title", "Untitled Module"));
            const description = getValue(item, "syllabusDescription", "SyllabusDescription", getValue(item, "description", "Description"));
            const displayOrder = getValue(item, "displayOrder", "DisplayOrder", index + 1);
            const totalTopics = getValue(item, "totalTopics", "TotalTopics", null);
            const duration = getValue(item, "duration", "Duration", null);

            return (
              <div key={id} className="relative">
                <span className="absolute -left-6 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 border-orange-200 bg-orange-50 text-[10px] font-bold text-orange-600">
                  {displayOrder}
                </span>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <PlayCircle size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
                        {totalTopics != null && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {totalTopics} topics
                          </span>
                        )}
                        {duration && (
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                            {duration}
                          </span>
                        )}
                      </div>
                      {description && (
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StudentsTab({ attendance }) {
  const [search, setSearch] = useState("");

  const students = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return attendance.filter((student) => {
      const name = getValue(student, "studentName", "StudentName", "");
      const id = getValue(student, "studentId", "StudentId", "");
      return name.toLowerCase().includes(keyword) || id.toLowerCase().includes(keyword);
    });
  }, [attendance, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Batch Students</h3>
          <p className="mt-1 text-xs text-slate-500">Students enrolled in this batch</p>
        </div>
        <span className="w-fit rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">{attendance.length} Students</span>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student by name or ID..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-400" />
      </div>
      {students.length === 0 ? (
        <EmptyState icon={<Users size={25} />} title="No students found" description="No student records match your search." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 sm:grid">
            <span>Student</span>
            <span>Classes</span>
            <span>Attendance</span>
            <span>Present / Absent</span>
          </div>
          <div className="divide-y divide-slate-100">
            {students.map((student) => {
              const id = getValue(student, "studentId", "StudentId", "");
              const name = getValue(student, "studentName", "StudentName", "Student");
              const image = getValue(student, "profileImageUrl", "ProfileImageUrl");
              const total = getValue(student, "totalClasses", "TotalClasses", 0);
              const present = getValue(student, "present", "Present", 0);
              const absent = getValue(student, "absent", "Absent", 0);
              const percentage = getValue(student, "attendancePercentage", "AttendancePercentage", 0);
              return (
                <div key={id} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] sm:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    {image ? (
                      <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">{name.charAt(0).toUpperCase()}</div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{name}</p>
                      <p className="truncate text-xs text-slate-400">{id}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm sm:block">
                    <span className="text-xs text-slate-400 sm:hidden">Total classes</span>
                    <span className="font-semibold text-slate-700">{total}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:block">
                    <span className="text-xs text-slate-400 sm:hidden">Attendance</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{Number(percentage).toFixed(1)}%</p>
                      <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs sm:block">
                    <span className="text-slate-400 sm:hidden">Present / Absent</span>
                    <span className="font-semibold text-slate-700">
                      <span className="text-emerald-600">{present}</span> / <span className="text-red-500">{absent}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AttendanceBadge({ status }) {
  const normalized = String(status).toLowerCase();
  const classes =
    normalized === "present" ? "bg-emerald-50 text-emerald-700" :
    normalized === "late" ? "bg-amber-50 text-amber-700" :
    normalized === "absent" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600";
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${classes}`}>{status}</span>;
}

function MaterialsTab({ batchId, materials, onUploaded, courseId }) {
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [file, setFile] = useState(null);
  const [modules, setModules] = useState([]);
  const [isFetchingModules, setIsFetchingModules] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editModuleId, setEditModuleId] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [isFetchingEdit, setIsFetchingEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    if ((showUpload || editingMaterial) && modules.length === 0 && courseId) {
      const fetchModules = async () => {
        setIsFetchingModules(true);
        try {
          const res = await batchService.getCourseModules(1, 100, courseId);
          const payload = getPayload(res);
          const items = payload?.items ?? payload?.Items ?? payload?.data ?? [];
          setModules(items);
        } catch (err) {
          console.error("Failed to load modules", err);
        } finally {
          setIsFetchingModules(false);
        }
      };
      fetchModules();
    }
  }, [showUpload, editingMaterial, modules.length, courseId]);

  const handleUpload = async (event) => {
    event.preventDefault();
    setError(""); setSuccess("");
    if (!title.trim()) { setError("Please enter material title."); return; }
    if (!file) { setError("Please select a file to upload."); return; }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("CourseId", parseInt(courseId, 10) || 0);
      formData.append("BatchId", parseInt(batchId, 10) || 0);
      formData.append("ModuleId", moduleId ? parseInt(moduleId, 10) : 0);
      formData.append("Title", title.trim());
      formData.append("FileUrl", file);

      await batchService.createCourseMaterial(formData);

      setTitle(""); setModuleId(""); setFile(null); setShowUpload(false);
      setSuccess("Material added successfully.");
      await onUploaded();
    } catch (err) {
      setError(err.message || "Material creation failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setTogglingId(id);
      await batchService.updateCourseMaterialStatus(id);
      setSuccess("Material status updated successfully.");
      await onUploaded();
    } catch (err) {
      setError(err.message || "Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleEditClick = async (material) => {
    setEditingMaterial(material);
    setIsFetchingEdit(true);
    setError("");
    setEditFile(null);
    try {
      const res = await batchService.getCourseMaterialById(material.id);
      const data = getPayload(res);
      setEditTitle(data.name || data.title || "");
      setEditModuleId(data.moduleId || "");
    } catch (err) {
      setError(err.message || "Failed to fetch material details.");
    } finally {
      setIsFetchingEdit(false);
    }
  };

  const handleUpdateMaterial = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setIsUpdating(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("Id", parseInt(editingMaterial.id, 10));
      formData.append("CourseId", parseInt(courseId, 10) || 0);
      formData.append("BatchId", parseInt(batchId, 10) || 0);
      formData.append("Title", editTitle.trim());
      if (editModuleId) formData.append("ModuleId", parseInt(editModuleId, 10));
      if (editFile) formData.append("FileUrl", editFile);

      await batchService.updateCourseMaterial(formData);
      setEditingMaterial(null);
      setSuccess("Material updated successfully.");
      await onUploaded();
    } catch (err) {
      setError(err.message || "Failed to update material.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Learning Materials</h3>
          <p className="mt-1 text-xs text-slate-500">Add and manage study material for this batch.</p>
        </div>
        <button onClick={() => { setError(""); setSuccess(""); setShowUpload(!showUpload); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          {showUpload ? <X size={16} /> : <UploadCloud size={16} />} {showUpload ? "Cancel" : "Add Material"}
        </button>
      </div>

      {success && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 size={17} /> {success}</div>}
      {error && !showUpload && !editingMaterial && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} /> {error}</div>}

      {showUpload && (
        <form onSubmit={handleUpload} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:p-5">
          <div className="mb-4">
            <h4 className="font-bold text-slate-900">Upload New Material</h4>
            <p className="mt-1 text-xs text-slate-500">Provide details and attach the file.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Material Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. ASP.NET Core Notes" maxLength={150} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Select Module</label>
              <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} disabled={isFetchingModules} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50">
                <option value="">{isFetchingModules ? "Loading modules..." : "-- Optional --"}</option>
                {modules.map((mod) => <option key={mod.id || mod.Id} value={mod.id || mod.Id}>{mod.title || mod.Title}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Attach File *</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-200 border border-slate-200 rounded-xl bg-white" />
              {file && <p className="mt-1 text-[11px] text-emerald-600">Selected: {file.name}</p>}
            </div>
          </div>
          {error && <p className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600"><AlertCircle size={15} /> {error}</p>}
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowUpload(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={uploading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><UploadCloud size={16} /> Save Material</>}
            </button>
          </div>
        </form>
      )}

      {materials.length === 0 ? (
        <EmptyState icon={<FileText size={25} />} title="No materials added" description="Add notes, PDFs and other learning resources for your students." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {materials.map((material) => {
            const id = getValue(material, "id", "Id");
            const name = getValue(material, "name", "Name", "Untitled Material");
            const moduleName = getValue(material, "moduleName", "ModuleName");
            const fileType = getValue(material, "fileType", "FileType", "File");
            const materialUrl = getValue(material, "fileUrl", "FileUrl", "");
            const fileSize = getValue(material, "fileSize", "FileSize", 0);
            const isActive = material.isActive === true;
            const isToggling = togglingId === id;
            const isImage = String(fileType).toLowerCase().includes("image") || String(materialUrl).toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/);
            const isPdfOrDoc = String(fileType).toLowerCase().includes("pdf") || String(materialUrl).toLowerCase().match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/);

            return (
              <div key={id} className={`group relative flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md ${isToggling ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MaterialIcon fileType={fileType} />
                </div>
                <div className="min-w-0 flex-1 pr-24">
                  <p className="truncate text-sm font-bold text-slate-800">{name}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{moduleName || fileType} {fileSize > 0 ? `· ${formatFileSize(fileSize)}` : ""}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-100">
                  {materialUrl && (
                    isImage ? (
                      <a href={materialUrl} target="_blank" rel="noreferrer" title="View Image" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></a>
                    ) : isPdfOrDoc ? (
                      <a href={materialUrl} download target="_blank" rel="noreferrer" title="Download File" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Download size={16} /></a>
                    ) : (
                      <a href={materialUrl} target="_blank" rel="noreferrer" title="Open File" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ExternalLink size={16} /></a>
                    )
                  )}
                  <button onClick={() => handleEditClick(material)} title="Edit" className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Settings size={16} /></button>
                  <button onClick={() => handleToggleStatus(id)} disabled={isToggling} title={isActive ? "Deactivate" : "Activate"} className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ml-1 ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-1'}`} />
                    {isToggling && <Loader2 size={10} className="absolute inset-0 m-auto text-white animate-spin" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingMaterial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleUpdateMaterial} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl relative">
            {isFetchingEdit && (
              <div className="absolute inset-0 z-10 bg-white/80 rounded-2xl flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
                <p className="text-xs text-slate-500 font-medium">Fetching details...</p>
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-900">Edit Material</h3>
            <p className="mt-1 text-xs text-slate-500">Update title, module or upload a new file.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Title *</label>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 focus:bg-white" placeholder="Material Title" required />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Module</label>
                <select value={editModuleId} onChange={(e) => setEditModuleId(e.target.value)} disabled={isFetchingModules} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 focus:bg-white disabled:opacity-50">
                  <option value="">{isFetchingModules ? "Loading..." : "-- Optional --"}</option>
                  {modules.map((mod) => <option key={mod.id || mod.Id} value={mod.id || mod.Id}>{mod.title || mod.Title}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Update File (Optional)</label>
                <input type="file" onChange={(e) => setEditFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-xl bg-slate-50" />
                <p className="mt-1 text-[10px] text-slate-400">Leave blank to keep the existing file.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingMaterial(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50" disabled={isUpdating || isFetchingEdit}>Cancel</button>
              <button type="submit" disabled={isUpdating || isFetchingEdit} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function MaterialIcon({ fileType }) {
  const type = String(fileType).toLowerCase();
  if (type.includes("image")) return <FileImage size={20} />;
  if (type.includes("video")) return <FileVideo size={20} />;
  if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet size={20} />;
  return <File size={20} />;
}

function ScheduleTab({ nextClass }) {
  if (!nextClass) {
    return <EmptyState icon={<CalendarDays size={25} />} title="No upcoming schedule" description="There is no next live class available in the overview response." />;
  }
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-slate-900">Upcoming Schedule</h3>
        <p className="mt-1 text-xs text-slate-500">Next scheduled class for this batch</p>
      </div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm"><CalendarDays size={22} /></div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Next Class</p>
            <h4 className="mt-1 text-lg font-bold text-slate-900">{getValue(nextClass, "topic", "Topic", "Scheduled Class")}</h4>
            <p className="mt-1 text-sm text-slate-500">{getValue(nextClass, "moduleName", "ModuleName", "Module not assigned")}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoCard icon={<CalendarDays size={17} />} label="Date" value={formatDate(getValue(nextClass, "sessionDate", "SessionDate"))} />
          <InfoCard icon={<Clock3 size={17} />} label="Time" value={`${formatTime(getValue(nextClass, "startTime", "StartTime"))} - ${formatTime(getValue(nextClass, "endTime", "EndTime"))}`} />
          <InfoCard icon={<Video size={17} />} label="Class Type" value={getValue(nextClass, "classType", "ClassType", "N/A")} />
          <InfoCard icon={<BookOpen size={17} />} label="Module" value={getValue(nextClass, "moduleName", "ModuleName", "N/A")} />
        </div>
        {getValue(nextClass, "meetingLink", "MeetingLink") && (
          <a href={getValue(nextClass, "meetingLink", "MeetingLink")} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Link2 size={16} /> Open Meeting
          </a>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white bg-white p-3">
      <div className="flex items-center gap-2 text-slate-400">{icon} <span className="text-xs">{label}</span></div>
      <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function ClassesTab({ batchId, courseId, syllabus, nextClass }) {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await batchService.getBatchClasses(batchId);
      const dataContainer = res?.data ?? res?.Data ?? res;
      const items = dataContainer?.items ?? dataContainer?.Items ?? (Array.isArray(dataContainer) ? dataContainer : []);
      setClasses(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Fetch classes error:", err);
      setError(err.message || "Unable to load classes.");
    } finally {
      setIsLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setError("");
      await batchService.updateCourseVideoStatus(id);
      setSuccess("Class deleted successfully.");
      setConfirmDelete(null);
      await fetchClasses();
    } catch (err) {
      setError(err.message || "Failed to delete class.");
    } finally {
      setDeletingId(null);
    }
  };

  const publishedCount = classes.filter((c) => c.isPublished === true || c.IsPublished === true).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Class Management</h3>
          <p className="mt-1 text-xs text-slate-500">
            Recorded video classes for this batch — create, edit, publish or remove.
          </p>
        </div>
        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setShowCreate(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={16} /> Add Class
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 size={17} /> {success}
        </div>
      )}
      {error && !showCreate && !editingClass && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={17} /> {error}
        </div>
      )}

      {nextClass && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm">
                <CalendarDays size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">Next Live Class</p>
                <p className="mt-0.5 text-sm font-bold text-slate-800">{getValue(nextClass, "topic", "Topic", "Upcoming Class")}</p>
                <p className="text-xs text-slate-500">
                  {formatDate(getValue(nextClass, "sessionDate", "SessionDate"))} · {formatTime(getValue(nextClass, "startTime", "StartTime"))}
                </p>
              </div>
            </div>
            {getValue(nextClass, "meetingLink", "MeetingLink") && (
              <a href={getValue(nextClass, "meetingLink", "MeetingLink")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                <Link2 size={14} /> Join
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] text-slate-400">Total Classes</p>
          <p className="mt-1 text-lg font-bold text-slate-800">{classes.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
          <p className="text-[11px] text-emerald-600">Published</p>
          <p className="mt-1 text-lg font-bold text-emerald-700">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] text-slate-400">Drafts</p>
          <p className="mt-1 text-lg font-bold text-slate-800">{classes.length - publishedCount}</p>
        </div>
      </div>

      {(showCreate || editingClass) && (
        <ClassFormModal
          batchId={batchId}
          courseId={courseId}
          syllabus={syllabus}
          editingClass={editingClass}
          onClose={() => {
            setShowCreate(false);
            setEditingClass(null);
          }}
          onSaved={async () => {
            const wasEdit = Boolean(editingClass);
            setShowCreate(false);
            setEditingClass(null);
            setSuccess(wasEdit ? "Class updated." : "Class created.");
            await fetchClasses();
          }}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Delete Class?</h3>
                <p className="mt-0.5 text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} disabled={Boolean(deletingId)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={Boolean(deletingId)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {deletingId ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex min-h-[200px] flex-col items-center justify-center">
          <Loader2 className="mb-2 animate-spin text-blue-600" size={28} />
          <p className="text-sm text-slate-500">Loading classes...</p>
        </div>
      )}

      {!isLoading && classes.length === 0 && (
        <EmptyState
          icon={<Video size={25} />}
          title="No recorded classes yet"
          description="Add your first class video using the Add Class button above."
        />
      )}

      {!isLoading && classes.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {classes.map((item) => {
            const id = getValue(item, "id", "Id");
            const title = getValue(item, "title", "Title", "Untitled Class");
            const description = getValue(item, "description", "Description");
            const moduleId = getValue(item, "moduleId", "ModuleId");
            const moduleName = getValue(item, "moduleName", "ModuleName");
            const videoUrl = getValue(item, "videoUrl", "VideoUrl");
            const videoProvider = getValue(item, "videoProvider", "VideoProvider", "");
            const videoId = getValue(item, "videoId", "VideoId");
            const durationInSeconds = getValue(item, "durationInSeconds", "DurationInSeconds", 0);
            const displayOrder = getValue(item, "displayOrder", "DisplayOrder", 0);
            const isPublished = item.isPublished === true || item.IsPublished === true;
            const isDeleting = deletingId === id;

            const module = (syllabus || []).find(
              (m) => String(getValue(m, "id", "Id")) === String(moduleId)
            );
            const moduleLabel =
              moduleName ||
              getValue(module, "syllabusTitle", "SyllabusTitle", getValue(module, "title", "Title")) ||
              "Unassigned module";

            let watchLink = videoUrl;
            if (!watchLink && videoProvider === "YouTube" && videoId) {
              watchLink = `https://www.youtube.com/watch?v=${videoId}`;
            }

            const duration = formatDuration(durationInSeconds);

            return (
              <div key={id} className={`group relative rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md ${isDeleting ? "pointer-events-none opacity-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <PlayCircle size={20} />
                    {displayOrder > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-blue-700 ring-1 ring-blue-200">{displayOrder}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pr-16">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="truncate text-sm font-bold text-slate-800">{title}</h4>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      <Layers size={11} className="mr-1 inline" /> {moduleLabel}
                    </p>
                    {description && <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">{description}</p>}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                  {watchLink ? (
                    <a href={watchLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                      <PlayCircle size={13} /> Watch
                      {duration && <span className="ml-1 text-[9px] text-slate-400">({duration})</span>}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
                      <Video size={13} /> No video
                    </span>
                  )}
                  <button onClick={() => setEditingClass(item)} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => setConfirmDelete(id)} disabled={isDeleting} className="ml-auto inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50">
                    {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClassFormModal({ batchId, courseId, syllabus, editingClass, onClose, onSaved }) {
  const isEdit = Boolean(editingClass);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    setTitle(getValue(editingClass, "title", "Title", ""));
    setDescription(getValue(editingClass, "description", "Description", "") || "");
    setModuleId(getValue(editingClass, "moduleId", "ModuleId", "") || "");
    setDisplayOrder(getValue(editingClass, "displayOrder", "DisplayOrder", 0) || 0);
    setIsPublished(editingClass.isPublished === true || editingClass.IsPublished === true);

    const provider = getValue(editingClass, "videoProvider", "VideoProvider", "");
    const videoId = getValue(editingClass, "videoId", "VideoId");
    const existingUrl = getValue(editingClass, "videoUrl", "VideoUrl");

    if (provider === "YouTube" && videoId) {
      setYoutubeUrl(`https://www.youtube.com/watch?v=${videoId}`);
    } else if (existingUrl) {
      setYoutubeUrl(existingUrl);
    }
  }, [isEdit, editingClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!isEdit && !videoFile && !youtubeUrl.trim()) {
      setError("Provide a video file or a YouTube URL.");
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      if (isEdit) fd.append("Id", parseInt(editingClass.id, 10));
      fd.append("CourseId", parseInt(courseId, 10) || 0);
      fd.append("BatchId", parseInt(batchId, 10) || 0);
      if (moduleId) fd.append("ModuleId", parseInt(moduleId, 10));
      fd.append("Title", title.trim());
      if (description.trim()) fd.append("Description", description.trim());
      if (videoFile) fd.append("VideoUrl", videoFile);
      if (youtubeUrl.trim()) fd.append("VideoYoutubeUrl", youtubeUrl.trim());
      fd.append("DisplayOrder", parseInt(displayOrder, 10) || 0);
      fd.append("IsPublished", isPublished ? "true" : "false");

      if (isEdit) {
        await batchService.updateCourseVideo(fd);
      } else {
        await batchService.createCourseVideo(fd);
      }

      await onSaved();
    } catch (err) {
      setError(err.message || "Failed to save class.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-4">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{isEdit ? "Edit Class" : "Add New Class"}</h3>
            <p className="mt-1 text-xs text-slate-500">Upload a video file or paste a YouTube link.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Intro to React Hooks"
              maxLength={150}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description about the class..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Module</label>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
            >
              <option value="">-- Optional --</option>
              {(syllabus || []).map((m) => (
                <option key={getValue(m, "id", "Id")} value={getValue(m, "id", "Id")}>
                  {getValue(m, "syllabusTitle", "SyllabusTitle", getValue(m, "title", "Title", "Module"))}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Display Order</label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Status</label>
              <button
                type="button"
                onClick={() => setIsPublished((v) => !v)}
                className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-xs font-bold transition ${
                  isPublished ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {isPublished ? <CheckCircle2 size={14} /> : <X size={14} />}
                {isPublished ? "Published" : "Draft"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-blue-600">Video Source</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Upload Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-lg border border-slate-200 bg-white text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
                />
                {videoFile && <p className="mt-1 text-[11px] text-emerald-600">Selected: {videoFile.name}</p>}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">YouTube URL</label>
                <input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 text-xs font-medium text-red-600">
              <AlertCircle size={14} /> {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {isSaving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <>{isEdit ? "Save Changes" : "Create Class"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">{icon}</div>
      <h3 className="mt-4 font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}