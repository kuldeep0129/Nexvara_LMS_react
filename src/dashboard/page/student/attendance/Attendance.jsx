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
} from "lucide-react";

/* =========================================================
   DEMO DATA
========================================================= */

const attendanceRecords = [
  {
    id: 1,
    date: "26 Oct 2026",
    day: "Monday",
    course: "ASP.NET Core Mastery",
    module: "Web API Fundamentals",
    classType: "Live Class",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 2,
    date: "24 Oct 2026",
    day: "Saturday",
    course: "React Advanced",
    module: "React Hooks",
    classType: "Live Class",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 3,
    date: "23 Oct 2026",
    day: "Friday",
    course: "ASP.NET Core Mastery",
    module: "Entity Framework Core",
    classType: "Live Class",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Late",
    duration: "1h 30m",
  },
  {
    id: 4,
    date: "22 Oct 2026",
    day: "Thursday",
    course: "Interview Preparation",
    module: "Data Structures",
    classType: "Live Class",
    startTime: "04:00 PM",
    endTime: "05:30 PM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 5,
    date: "21 Oct 2026",
    day: "Wednesday",
    course: "ASP.NET Core Mastery",
    module: "Authentication & Security",
    classType: "Live Class",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Absent",
    duration: "1h 30m",
  },
  {
    id: 6,
    date: "20 Oct 2026",
    day: "Tuesday",
    course: "React Advanced",
    module: "State Management",
    classType: "Live Class",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 7,
    date: "19 Oct 2026",
    day: "Monday",
    course: "ASP.NET Core Mastery",
    module: "Dependency Injection",
    classType: "Live Class",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 8,
    date: "17 Oct 2026",
    day: "Saturday",
    course: "React Advanced",
    module: "Component Architecture",
    classType: "Live Class",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    status: "Leave",
    duration: "1h 30m",
  },
  {
    id: 9,
    date: "16 Oct 2026",
    day: "Friday",
    course: "Interview Preparation",
    module: "Arrays & Strings",
    classType: "Live Class",
    startTime: "04:00 PM",
    endTime: "05:30 PM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 10,
    date: "15 Oct 2026",
    day: "Thursday",
    course: "ASP.NET Core Mastery",
    module: "REST API",
    classType: "Live Class",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 11,
    date: "14 Oct 2026",
    day: "Wednesday",
    course: "React Advanced",
    module: "Props & State",
    classType: "Live Class",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    status: "Late",
    duration: "1h 30m",
  },
  {
    id: 12,
    date: "13 Oct 2026",
    day: "Tuesday",
    course: "Interview Preparation",
    module: "Linked Lists",
    classType: "Live Class",
    startTime: "04:00 PM",
    endTime: "05:30 PM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 13,
    date: "12 Oct 2026",
    day: "Monday",
    course: "ASP.NET Core Mastery",
    module: "Middleware",
    classType: "Live Class",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Present",
    duration: "1h 30m",
  },
  {
    id: 14,
    date: "10 Oct 2026",
    day: "Saturday",
    course: "React Advanced",
    module: "Context API",
    classType: "Live Class",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    status: "Present",
    duration: "1h 30m",
  },
];

/* =========================================================
   COURSE DATA
========================================================= */

const courseAttendance = [
  {
    id: 1,
    course: "ASP.NET Core Mastery",
    total: 18,
    present: 16,
    absent: 1,
    late: 1,
    leave: 0,
    percentage: 88.9,
  },
  {
    id: 2,
    course: "React Advanced",
    total: 14,
    present: 12,
    absent: 0,
    late: 1,
    leave: 1,
    percentage: 92.9,
  },
  {
    id: 3,
    course: "Interview Preparation",
    total: 12,
    present: 11,
    absent: 0,
    late: 1,
    leave: 0,
    percentage: 91.7,
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
];

const statuses = [
  "All Status",
  "Present",
  "Absent",
  "Late",
  "Leave",
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

function SelectBox({ value, onChange, options, className = "" }) {
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
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const config = {
    Present: {
      icon: <CheckCircle2 size={13} />,
      className: "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    Absent: {
      icon: <XCircle size={13} />,
      className: "border-rose-100 bg-rose-50 text-rose-700",
    },
    Late: {
      icon: <Clock3 size={13} />,
      className: "border-amber-100 bg-amber-50 text-amber-700",
    },
    Leave: {
      icon: <CalendarCheck2 size={13} />,
      className: "border-blue-100 bg-blue-50 text-blue-700",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${item.className}`}
    >
      {item.icon}
      {status.toUpperCase()}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon, label, value, helper, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>

          <p className="mt-0.5 text-xl font-black text-slate-900">
            {value}
          </p>

          {helper && (
            <p className="mt-0.5 truncate text-[10px] text-slate-400">
              {helper}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COURSE ATTENDANCE
========================================================= */

function CourseAttendanceCard({ item }) {
  const percentageColor =
    item.percentage >= 90
      ? "text-emerald-600"
      : item.percentage >= 75
      ? "text-amber-600"
      : "text-rose-600";

  const progressColor =
    item.percentage >= 90
      ? "bg-emerald-400"
      : item.percentage >= 75
      ? "bg-amber-400"
      : "bg-rose-400";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {item.course}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {item.total} classes conducted
            </p>
          </div>
        </div>

        <span className={`shrink-0 text-lg font-black ${percentageColor}`}>
          {item.percentage}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${progressColor}`}
          style={{ width: `${item.percentage}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-[10px]">
        <div className="rounded-lg bg-emerald-50 p-2">
          <p className="text-emerald-600">Present</p>
          <p className="mt-0.5 font-bold text-emerald-700">
            {item.present}
          </p>
        </div>

        <div className="rounded-lg bg-rose-50 p-2">
          <p className="text-rose-600">Absent</p>
          <p className="mt-0.5 font-bold text-rose-700">
            {item.absent}
          </p>
        </div>

        <div className="rounded-lg bg-amber-50 p-2">
          <p className="text-amber-600">Late</p>
          <p className="mt-0.5 font-bold text-amber-700">
            {item.late}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-2">
          <p className="text-blue-600">Leave</p>
          <p className="mt-0.5 font-bold text-blue-700">
            {item.leave}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CALENDAR
========================================================= */

function AttendanceCalendar() {
  const days = [
    { day: 1, status: "Present" },
    { day: 2, status: "Present" },
    { day: 3, status: "Present" },
    { day: 4, status: "Absent" },
    { day: 5, status: "Present" },
    { day: 6, status: null },
    { day: 7, status: null },
    { day: 8, status: "Present" },
    { day: 9, status: "Present" },
    { day: 10, status: "Late" },
    { day: 11, status: "Present" },
    { day: 12, status: "Present" },
    { day: 13, status: "Present" },
    { day: 14, status: "Present" },
    { day: 15, status: "Present" },
    { day: 16, status: "Present" },
    { day: 17, status: "Leave" },
    { day: 18, status: "Present" },
    { day: 19, status: "Present" },
    { day: 20, status: "Present" },
    { day: 21, status: "Absent" },
    { day: 22, status: "Present" },
    { day: 23, status: "Late" },
    { day: 24, status: "Present" },
    { day: 25, status: null },
    { day: 26, status: "Present" },
    { day: 27, status: null },
    { day: 28, status: null },
    { day: 29, status: null },
    { day: 30, status: null },
    { day: 31, status: null },
  ];

  const getDayStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "Absent":
        return "bg-rose-50 text-rose-700 border-rose-100";

      case "Late":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Leave":
        return "bg-blue-50 text-blue-700 border-blue-100";

      default:
        return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Attendance Calendar
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            October 2026
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map(
          (day, index) => (
            <div
              key={`${day}-${index}`}
              className="pb-1 text-center text-[10px] font-bold text-slate-400"
            >
              {day}
            </div>
          )
        )}

        {days.map((item) => (
          <div
            key={item.day}
            title={item.status || "No class"}
            className={`flex aspect-square items-center justify-center rounded-lg border text-[10px] font-bold sm:rounded-xl sm:text-xs ${getDayStyle(
              item.status
            )}`}
          >
            {item.day}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
        <Legend color="bg-emerald-400" label="Present" />
        <Legend color="bg-rose-400" label="Absent" />
        <Legend color="bg-amber-400" label="Late" />
        <Legend color="bg-blue-400" label="Leave" />
      </div>
    </section>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

/* =========================================================
   ATTENDANCE ROW
========================================================= */

function AttendanceRow({ record }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* DATE */}
        <div className="flex items-center gap-3 md:w-40">
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50">
            <span className="text-[9px] font-bold uppercase text-slate-400">
              {record.date.split(" ")[1]}
            </span>

            <span className="text-lg font-black leading-none text-slate-800">
              {record.date.split(" ")[0]}
            </span>
          </div>

          <div className="md:hidden">
            <p className="text-xs font-bold text-slate-700">
              {record.day}
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              {record.startTime}
            </p>
          </div>
        </div>

        {/* COURSE */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:block">
            <div>
              <h3 className="truncate text-sm font-bold text-slate-900">
                {record.course}
              </h3>

              <p className="mt-1 truncate text-xs text-slate-400">
                {record.module} • {record.classType}
              </p>
            </div>

            <div className="sm:hidden">
              <StatusBadge status={record.status} />
            </div>
          </div>
        </div>

        {/* DAY / TIME */}
        <div className="hidden min-w-[190px] md:block">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays
              size={14}
              className="text-slate-400"
            />
            {record.day}
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <Clock3
              size={14}
              className="text-slate-400"
            />
            {record.startTime} - {record.endTime}
          </div>
        </div>

        {/* DURATION */}
        <div className="hidden min-w-[100px] lg:block">
          <p className="text-[10px] text-slate-400">
            Duration
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-600">
            {record.duration}
          </p>
        </div>

        {/* STATUS */}
        <div className="hidden sm:block">
          <StatusBadge status={record.status} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function StudentAttendance() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [status, setStatus] = useState("All Status");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalClasses = 44;
  const present = 39;
  const absent = 2;
  const late = 2;
  const leave = 1;

  const attendancePercentage =
    ((present + late) / totalClasses) * 100;

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((item) => {
      const searchText =
        `${item.course} ${item.module} ${item.classType} ${item.date} ${item.day}`.toLowerCase();

      const matchesSearch =
        !search ||
        searchText.includes(search.toLowerCase());

      const matchesCourse =
        course === "All Courses" ||
        item.course === course;

      const matchesStatus =
        status === "All Status" ||
        item.status === status;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesStatus
      );
    });
  }, [search, course, status]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / pageSize)
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* =======================================================
     CLEAR FILTER
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setCourse("All Courses");
    setStatus("All Status");
    setCurrentPage(1);
  };

  const hasFilters =
    search ||
    course !== "All Courses" ||
    status !== "All Status";

  /* =======================================================
     PAGE CHANGE
  ======================================================= */

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Student Dashboard</span>
                <span>/</span>
                <span className="text-slate-600">
                  Attendance
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  My Attendance
                </h1>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                  ATTENDANCE
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor your attendance, course-wise participation
                and complete class attendance history.
              </p>
            </div>

            {/* OVERALL */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3">
                <p className="text-[11px] font-medium text-emerald-600">
                  Overall Attendance
                </p>

                <p className="mt-0.5 text-2xl font-black text-emerald-700">
                  {attendancePercentage.toFixed(1)}%
                </p>
              </div>

              <BlobButton
                variant="secondary"
                icon={<Download size={16} />}
              >
                <span className="hidden sm:inline">
                  Download
                </span>
                <span className="sm:hidden">
                  PDF
                </span>
              </BlobButton>
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

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <StatCard
            icon={<CalendarDays size={19} />}
            label="Total Classes"
            value={totalClasses}
            helper="Classes conducted"
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={<CheckCircle2 size={19} />}
            label="Present"
            value={present}
            helper="Classes attended"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={<XCircle size={19} />}
            label="Absent"
            value={absent}
            helper="Missed classes"
            iconClass="bg-rose-50 text-rose-600"
          />

          <StatCard
            icon={<Clock3 size={19} />}
            label="Late"
            value={late}
            helper="Late attendance"
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            icon={<CalendarCheck2 size={19} />}
            label="Leave"
            value={leave}
            helper="Approved leave"
            iconClass="bg-purple-50 text-purple-600"
          />
        </section>

        {/* ===================================================
            OVERALL + ALERT
        =================================================== */}

        <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {/* OVERALL CARD */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <UserCheck size={18} />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                    Attendance Overview
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  Your attendance is on track
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  You are maintaining a healthy attendance percentage
                  across your enrolled courses.
                </p>
              </div>

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[8px] border-emerald-50 bg-white">
                <div className="text-center">
                  <p className="text-xl font-black text-emerald-600">
                    {attendancePercentage.toFixed(0)}%
                  </p>

                  <p className="text-[8px] font-medium text-slate-400">
                    Attendance
                  </p>
                </div>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="mt-7">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  Attendance Progress
                </span>

                <span className="font-bold text-emerald-600">
                  {attendancePercentage.toFixed(1)}%
                </span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{
                    width: `${attendancePercentage}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px]">
                <span className="text-slate-400">
                  Minimum required: 75%
                </span>

                <span className="font-semibold text-emerald-600">
                  +{(attendancePercentage - 75).toFixed(1)}% above minimum
                </span>
              </div>
            </div>

            {/* MINI STATS */}

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[10px] text-emerald-600">
                  Present
                </p>

                <p className="mt-1 text-lg font-black text-emerald-700">
                  {present}
                </p>
              </div>

              <div className="rounded-xl bg-rose-50 p-3">
                <p className="text-[10px] text-rose-600">
                  Absent
                </p>

                <p className="mt-1 text-lg font-black text-rose-700">
                  {absent}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-[10px] text-amber-600">
                  Late
                </p>

                <p className="mt-1 text-lg font-black text-amber-700">
                  {late}
                </p>
              </div>
            </div>
          </div>

          {/* ALERT */}

          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-5 shadow-sm sm:p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/70 blur-3xl" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                <Target size={21} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Attendance Target
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep attending your upcoming live classes regularly
                to maintain your eligibility and course progress.
              </p>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-100 bg-white p-3">
                <div>
                  <p className="text-[10px] text-slate-400">
                    Required
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-800">
                    75%
                  </p>
                </div>

                <div className="h-8 w-px bg-slate-100" />

                <div>
                  <p className="text-[10px] text-slate-400">
                    Current
                  </p>

                  <p className="mt-1 text-lg font-black text-emerald-600">
                    {attendancePercentage.toFixed(1)}%
                  </p>
                </div>

                <div className="h-8 w-px bg-slate-100" />

                <div>
                  <p className="text-[10px] text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-xs font-bold text-emerald-600">
                    On Track
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-700">
                <TrendingUp size={15} />
                Good attendance performance
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            COURSE WISE
        =================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Course-wise Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View your attendance performance for each enrolled course.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {courseAttendance.map((item) => (
              <CourseAttendanceCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </section>

        {/* ===================================================
            CALENDAR + RECENT
        =================================================== */}

        <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <AttendanceCalendar />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Attendance
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Your latest class attendance
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={17} />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {attendanceRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <CalendarDays size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-700">
                      {record.course}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {record.date} • {record.startTime}
                    </p>
                  </div>

                  <StatusBadge status={record.status} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            FILTER
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search course, module, date..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* FILTERS */}

            <div className="grid grid-cols-2 gap-2 lg:w-[450px]">
              <SelectBox
                value={course}
                onChange={(value) => {
                  setCourse(value);
                  setCurrentPage(1);
                }}
                options={courses}
              />

              <SelectBox
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setCurrentPage(1);
                }}
                options={statuses}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            HISTORY
        =================================================== */}

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Filter
                  size={17}
                  className="text-emerald-600"
                />

                <h2 className="text-lg font-bold text-slate-900">
                  Attendance History
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {filteredRecords.length} record
                {filteredRecords.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>

          {/* RECORDS */}

          <div className="mt-4 space-y-3">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <AttendanceRow
                  key={record.id}
                  record={record}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarDays size={26} />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No attendance records found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Try changing your search, course or attendance
                  status filter.
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
            )}
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {filteredRecords.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                -
                <span className="font-semibold text-slate-600">
                  {" "}
                  {Math.min(
                    currentPage * pageSize,
                    filteredRecords.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {filteredRecords.length}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    changePage(currentPage - 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => changePage(page)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                      currentPage === page
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    changePage(currentPage + 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            POLICY
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <AlertCircle size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Attendance Policy
                </h3>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                  Students should maintain the minimum attendance
                  percentage required by their course or batch. If you
                  believe an attendance record is incorrect, contact
                  your instructor or institute administrator.
                </p>
              </div>
            </div>

            <BlobButton
              variant="secondary"
              icon={<BookOpen size={15} />}
              className="w-full sm:w-auto"
            >
              View Policy
            </BlobButton>
          </div>
        </section>
      </main>
    </div>
  );
}