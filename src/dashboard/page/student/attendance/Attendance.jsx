import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarCheck2,
  BookOpen,
  TrendingUp,
  AlertCircle,
  UserCheck,
  X,
  Download,
  Target,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";
import {
  formatDuration,
  normalizeAttendanceStatus,
  useStudentAttendance,
} from "../../../hooks/student/useStudentAttendance";

const STATUS_OPTIONS = ["All Status", "Present", "Absent", "Late", "Leave", "Unmarked"];

const formatDate = (value, options = { day: "2-digit", month: "short", year: "numeric" }) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

const formatTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getDay = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(date);
};

function BlobButton({ children, icon, variant = "primary", className = "", onClick, disabled }) {
  const variants = {
    primary: "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300",
    secondary: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300",
    blue: "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      <span className="pointer-events-none absolute -right-5 -top-5 h-10 w-10 rounded-full bg-white/70 blur-md transition-all duration-300 group-hover:scale-150" />
      <span className="relative z-10 flex items-center gap-2">{icon}{children}</span>
    </button>
  );
}

function SelectBox({ value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = normalizeAttendanceStatus(status);
  const config = {
    Present: { icon: <CheckCircle2 size={13} />, className: "border-emerald-100 bg-emerald-50 text-emerald-700" },
    Absent: { icon: <XCircle size={13} />, className: "border-rose-100 bg-rose-50 text-rose-700" },
    Late: { icon: <Clock3 size={13} />, className: "border-amber-100 bg-amber-50 text-amber-700" },
    Leave: { icon: <CalendarCheck2 size={13} />, className: "border-blue-100 bg-blue-50 text-blue-700" },
    Unmarked: { icon: <AlertCircle size={13} />, className: "border-slate-200 bg-slate-50 text-slate-600" },
  };
  const item = config[normalized] || config.Unmarked;

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${item.className}`}>
      {item.icon}{normalized.toUpperCase()}
    </span>
  );
}

function StatCard({ icon, label, value, helper, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-0.5 text-xl font-black text-slate-900">{value}</p>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">{helper}</p>
        </div>
      </div>
    </div>
  );
}

function BatchAttendanceCard({ item }) {
  const percentageColor = item.percentage == null
    ? "text-slate-500"
    : item.percentage >= 90 ? "text-emerald-600" : item.percentage >= 75 ? "text-amber-600" : "text-rose-600";
  const progressColor = item.percentage == null
    ? "bg-slate-300"
    : item.percentage >= 90 ? "bg-emerald-400" : item.percentage >= 75 ? "bg-amber-400" : "bg-rose-400";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><BookOpen size={18} /></div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">{item.course}</h3>
            <p className="mt-1 text-xs text-slate-400">{item.total} records on this page</p>
          </div>
        </div>
        <span className={`shrink-0 text-lg font-black ${percentageColor}`}>{item.percentage == null ? "—" : `${item.percentage.toFixed(1)}%`}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${item.percentage ?? 0}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5 text-[10px]">
        {[
          ["Present", item.present, "bg-emerald-50", "text-emerald-700"],
          ["Absent", item.absent, "bg-rose-50", "text-rose-700"],
          ["Late", item.late, "bg-amber-50", "text-amber-700"],
          ["Leave", item.leave, "bg-blue-50", "text-blue-700"],
          ["Unmarked", item.unmarked, "bg-slate-50", "text-slate-700"],
        ].map(([label, value, bg, color]) => (
          <div key={label} className={`rounded-lg p-2 ${bg}`}>
            <p className={color}>{label}</p><p className={`mt-0.5 font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>;
}

function AttendanceCalendar({ records }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const monthDate = useMemo(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [monthOffset]);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const statusByDay = useMemo(() => {
    const map = new Map();
    records.forEach((record) => {
      if (!record.joinedAt) return;
      const date = new Date(record.joinedAt);
      if (date.getFullYear() !== year || date.getMonth() !== month) return;
      const day = date.getDate();
      const status = normalizeAttendanceStatus(record.status);
      const current = map.get(day);
      if (!current || status === "Present" || status === "Late") map.set(day, status);
    });
    return map;
  }, [records, year, month]);

  const dayStyle = (status) => ({
    Present: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Absent: "bg-rose-50 text-rose-700 border-rose-100",
    Late: "bg-amber-50 text-amber-700 border-amber-100",
    Leave: "bg-blue-50 text-blue-700 border-blue-100",
    Unmarked: "bg-slate-50 text-slate-500 border-slate-100",
  }[status] || "bg-white text-slate-400 border-slate-100");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div><h2 className="text-base font-bold text-slate-900">Attendance Calendar</h2><p className="mt-1 text-xs text-slate-400">{new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(monthDate)}</p></div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Previous month" onClick={() => setMonthOffset((v) => v - 1)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"><ChevronLeft size={16} /></button>
          <button type="button" aria-label="Next month" onClick={() => setMonthOffset((v) => v + 1)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <div key={`${day}-${index}`} className="pb-1 text-center text-[10px] font-bold text-slate-400">{day}</div>)}
        {Array.from({ length: firstWeekday }, (_, index) => <div key={`blank-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const status = statusByDay.get(day);
          return <div key={day} title={status || "No attendance record"} className={`flex aspect-square items-center justify-center rounded-lg border text-[10px] font-bold sm:rounded-xl sm:text-xs ${dayStyle(status)}`}>{day}</div>;
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
        <Legend color="bg-emerald-400" label="Present" /><Legend color="bg-rose-400" label="Absent" /><Legend color="bg-amber-400" label="Late" /><Legend color="bg-blue-400" label="Leave" /><Legend color="bg-slate-300" label="Unmarked" />
      </div>
      <p className="mt-3 text-[10px] text-slate-400">Calendar is based on the attendance records loaded from the current API page.</p>
    </section>
  );
}

function AttendanceRow({ record }) {
  const status = normalizeAttendanceStatus(record.status);
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3 md:w-44">
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50">
            <span className="text-[9px] font-bold uppercase text-slate-400">{record.joinedAt ? formatDate(record.joinedAt, { month: "short" }) : "—"}</span>
            <span className="text-lg font-black leading-none text-slate-800">{record.joinedAt ? formatDate(record.joinedAt, { day: "2-digit" }) : "—"}</span>
          </div>
          <div className="md:hidden"><p className="text-xs font-bold text-slate-700">{getDay(record.joinedAt)}</p><p className="mt-1 text-[10px] text-slate-400">{formatTime(record.joinedAt)}</p></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:block">
            <div><h3 className="truncate text-sm font-bold text-slate-900">{record.liveClassTitle || "Live Class"}</h3><p className="mt-1 truncate text-xs text-slate-400">{record.batchName} • {record.moduleName}</p></div>
            <div className="sm:hidden"><StatusBadge status={status} /></div>
          </div>
        </div>
        <div className="hidden min-w-[190px] md:block">
          <div className="flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} className="text-slate-400" />{getDay(record.joinedAt)} · {formatDate(record.joinedAt)}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14} className="text-slate-400" />{formatTime(record.joinedAt)} – {formatTime(record.leftAt)}</div>
        </div>
        <div className="hidden min-w-[100px] lg:block"><p className="text-[10px] text-slate-400">Duration</p><p className="mt-1 text-xs font-semibold text-slate-600">{formatDuration(record.durationInSeconds)}</p></div>
        <div className="hidden sm:block"><StatusBadge status={status} /></div>
      </div>
    </div>
  );
}

function LoadingState() {
  return <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center"><LoaderCircle className="mx-auto animate-spin text-emerald-600" size={30} /><p className="mt-4 text-sm font-semibold text-slate-700">Loading your attendance...</p><p className="mt-1 text-xs text-slate-400">Fetching records from your student account.</p></div>;
}

function ErrorState({ message, onRetry }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center"><AlertCircle className="mx-auto text-rose-500" size={28} /><h3 className="mt-3 text-base font-bold text-slate-900">Unable to load attendance</h3><p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{message}</p><BlobButton className="mt-5" variant="secondary" icon={<RefreshCw size={15} />} onClick={onRetry}>Try again</BlobButton></div>;
}

function EmptyState({ hasFilters, onClear }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><CalendarDays size={26} /></div><h3 className="mt-4 text-base font-bold text-slate-900">{hasFilters ? "No matching attendance records" : "No attendance records yet"}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{hasFilters ? "Try changing your search, batch or attendance status filter." : "Your class attendance will appear here after attendance records are created by the institute."}</p>{hasFilters && <div className="mt-5 flex justify-center"><BlobButton variant="secondary" onClick={onClear}>Clear Filters</BlobButton></div>}</div>;
}

export default function StudentAttendance() {
  const {
    records,
    pageNumber,
    totalCount,
    totalPages,
    loading,
    error,
    stats,
    batchAttendance,
    changePage,
    refresh,
  } = useStudentAttendance(100);

  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [status, setStatus] = useState("All Status");

  const batches = useMemo(() => [
    "All Batches",
    ...Array.from(new Set(records.map((record) => record.batchName).filter(Boolean))).sort(),
  ], [records]);

  const filteredRecords = useMemo(() => records.filter((item) => {
    const searchText = [item.liveClassTitle, item.batchName, item.moduleName, item.joinedAt, item.status]
      .filter(Boolean).join(" ").toLowerCase();
    const matchesSearch = !search || searchText.includes(search.toLowerCase());
    const matchesBatch = batch === "All Batches" || item.batchName === batch;
    const matchesStatus = status === "All Status" || normalizeAttendanceStatus(item.status) === status;
    return matchesSearch && matchesBatch && matchesStatus;
  }), [records, search, batch, status]);

  const recentRecords = useMemo(() => [...records]
    .sort((a, b) => new Date(b.joinedAt || 0) - new Date(a.joinedAt || 0))
    .slice(0, 5), [records]);

  const clearFilters = () => {
    setSearch("");
    setBatch("All Batches");
    setStatus("All Status");
  };

  const hasFilters = Boolean(search) || batch !== "All Batches" || status !== "All Status";

  const downloadCsv = () => {
    const headers = ["Live Class", "Batch", "Module", "Joined At", "Left At", "Duration (Seconds)", "Status"];
    const rows = filteredRecords.map((record) => [
      record.liveClassTitle,
      record.batchName,
      record.moduleName,
      record.joinedAt,
      record.leftAt || "",
      record.durationInSeconds,
      normalizeAttendanceStatus(record.status),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `my-attendance-page-${pageNumber}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const percentageText = stats.percentage == null ? "—" : `${stats.percentage.toFixed(1)}%`;
  const pageStart = totalCount === 0 ? 0 : (pageNumber - 1) * 100 + 1;
  const pageEnd = Math.min(pageNumber * 100, totalCount);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><span>Student Dashboard</span><span>/</span><span className="text-slate-600">Attendance</span></div>
              <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">My Attendance</h1><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">LIVE DATA</span></div>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">Monitor your live-class attendance records, participation duration and attendance history.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3"><p className="text-[11px] font-medium text-emerald-600">Recorded Attendance Rate</p><p className="mt-0.5 text-2xl font-black text-emerald-700">{percentageText}</p><p className="text-[9px] text-emerald-600">Based on marked records on this page</p></div>
              <BlobButton variant="secondary" icon={<Download size={16} />} onClick={downloadCsv} disabled={!filteredRecords.length}><span className="hidden sm:inline">Export CSV</span><span className="sm:hidden">CSV</span></BlobButton>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error ? <ErrorState message={error} onRetry={refresh} /> : loading ? <LoadingState /> : <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <StatCard icon={<CalendarDays size={19} />} label="Records Loaded" value={stats.loaded} helper="On current API page" iconClass="bg-blue-50 text-blue-600" />
            <StatCard icon={<CheckCircle2 size={19} />} label="Present" value={stats.present} helper="Marked present" iconClass="bg-emerald-50 text-emerald-600" />
            <StatCard icon={<XCircle size={19} />} label="Absent" value={stats.absent} helper="Marked absent" iconClass="bg-rose-50 text-rose-600" />
            <StatCard icon={<Clock3 size={19} />} label="Late" value={stats.late} helper="Marked late" iconClass="bg-amber-50 text-amber-600" />
            <StatCard icon={<AlertCircle size={19} />} label="Unmarked" value={stats.unmarked} helper="Status not supplied by API" iconClass="bg-slate-100 text-slate-600" />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><UserCheck size={18} /></div><span className="text-xs font-bold uppercase tracking-wide text-emerald-600">Attendance Overview</span></div><h2 className="mt-3 text-xl font-bold text-slate-900">{stats.percentage == null ? "Attendance status is not available yet" : stats.percentage >= 75 ? "Your recorded attendance is on track" : "Your recorded attendance needs attention"}</h2><p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">This percentage uses only records with a Present, Late, Absent or Leave status. It is not a full course eligibility percentage unless the API returns every conducted class and its final status.</p></div>
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[8px] border-emerald-50 bg-white"><div className="text-center"><p className="text-xl font-black text-emerald-600">{percentageText}</p><p className="text-[8px] font-medium text-slate-400">Recorded</p></div></div>
              </div>
              <div className="mt-7"><div className="flex items-center justify-between text-xs"><span className="font-medium text-slate-500">Marked attendance records</span><span className="font-bold text-emerald-600">{stats.marked} / {stats.loaded}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${stats.loaded ? (stats.marked / stats.loaded) * 100 : 0}%` }} /></div><div className="mt-2 flex justify-between text-[10px]"><span className="text-slate-400">Unmarked: {stats.unmarked}</span><span className="font-semibold text-slate-500">{stats.loaded} records on this page</span></div></div>
              <div className="mt-6 grid grid-cols-3 gap-3"><div className="rounded-xl bg-emerald-50 p-3"><p className="text-[10px] text-emerald-600">Present</p><p className="mt-1 text-lg font-black text-emerald-700">{stats.present}</p></div><div className="rounded-xl bg-rose-50 p-3"><p className="text-[10px] text-rose-600">Absent</p><p className="mt-1 text-lg font-black text-rose-700">{stats.absent}</p></div><div className="rounded-xl bg-amber-50 p-3"><p className="text-[10px] text-amber-600">Late</p><p className="mt-1 text-lg font-black text-amber-700">{stats.late}</p></div></div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-5 shadow-sm sm:p-6"><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/70 blur-3xl" /><div className="relative"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"><Target size={21} /></div><h2 className="mt-4 text-lg font-bold text-slate-900">Attendance Information</h2><p className="mt-2 text-sm leading-6 text-slate-500">Your attendance is fetched securely using your login token. The student identifier is not sent from the browser.</p><div className="mt-5 flex items-center justify-between rounded-xl border border-blue-100 bg-white p-3"><div><p className="text-[10px] text-slate-400">Total records</p><p className="mt-1 text-lg font-black text-slate-800">{totalCount}</p></div><div className="h-8 w-px bg-slate-100" /><div><p className="text-[10px] text-slate-400">Current page</p><p className="mt-1 text-lg font-black text-slate-800">{pageNumber} / {totalPages}</p></div></div><div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-700"><TrendingUp size={15} />Live data from your student account</div></div></div>
          </section>

          <section><div className="mb-4"><h2 className="text-lg font-bold text-slate-900">Batch-wise Attendance</h2><p className="mt-1 text-sm text-slate-500">Grouped from the attendance records returned on the current API page.</p></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{batchAttendance.length ? batchAttendance.map((item) => <BatchAttendanceCard key={item.id} item={item} />) : <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">No batch summary available.</div>}</div></section>

          <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]"><AttendanceCalendar records={records} /><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-base font-bold text-slate-900">Recent Attendance</h2><p className="mt-1 text-xs text-slate-400">Latest records from the current API page</p></div><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><UserCheck size={17} /></div></div><div className="mt-5 space-y-2">{recentRecords.length ? recentRecords.map((record) => <div key={record.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500"><CalendarDays size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-700">{record.liveClassTitle}</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{formatDate(record.joinedAt)} · {formatTime(record.joinedAt)}</p></div><StatusBadge status={record.status} /></div>) : <p className="py-8 text-center text-sm text-slate-400">No recent records.</p>}</div></div></section>
        </>}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative min-w-0 flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search live class, batch, module..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div><div className="grid grid-cols-2 gap-2 lg:w-[450px]"><SelectBox value={batch} onChange={setBatch} options={batches} /><SelectBox value={status} onChange={setStatus} options={STATUS_OPTIONS} /></div></div></section>

        <section><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><Filter size={17} className="text-emerald-600" /><h2 className="text-lg font-bold text-slate-900">Attendance History</h2></div><p className="mt-1 text-sm text-slate-500">{filteredRecords.length} visible · {totalCount} total records</p></div><div className="flex flex-wrap gap-2">{hasFilters && <button type="button" onClick={clearFilters} className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"><X size={14} />Clear Filters</button>}<BlobButton variant="secondary" icon={<RefreshCw size={14} />} onClick={refresh} disabled={loading}>Refresh</BlobButton></div></div>
          <div className="mt-4 space-y-3">{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={refresh} /> : filteredRecords.length ? filteredRecords.map((record) => <AttendanceRow key={record.id} record={record} />) : <EmptyState hasFilters={hasFilters} onClear={clearFilters} />}</div>
          {!loading && !error && totalCount > 0 && <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-400">Showing <span className="font-semibold text-slate-600">{pageStart}</span> – <span className="font-semibold text-slate-600">{pageEnd}</span> of <span className="font-semibold text-slate-600">{totalCount}</span></p><div className="flex items-center gap-1"><button type="button" disabled={pageNumber <= 1} onClick={() => changePage(pageNumber - 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).slice(Math.max(0, pageNumber - 3), Math.min(totalPages, pageNumber + 2)).map((page) => <button key={page} type="button" onClick={() => changePage(page)} className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${pageNumber === page ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "text-slate-500 hover:bg-slate-50"}`}>{page}</button>)}<button type="button" disabled={pageNumber >= totalPages} onClick={() => changePage(pageNumber + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={16} /></button></div></div>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><AlertCircle size={18} /></div><div><h3 className="text-sm font-bold text-slate-900">Attendance Information</h3><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">Only attendance records stored by the institute can be displayed here. If a class is missing or its status is unmarked, contact your instructor or institute administrator. Absent and leave totals require the backend to return those statuses for scheduled classes.</p></div></div></div></section>
      </main>
    </div>
  );
}
