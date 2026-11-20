import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  Clock,
  Video,
  ChevronRight,
  Loader2,
  AlertCircle,
  GraduationCap,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  PlayCircle,
  CalendarDays
} from "lucide-react";

import { useStudentBatches } from "../../../hooks/student/useStudentBatches";

// Helpers
const getValue = (obj, pascal, camel, fallback = null) => {
  return obj?.[camel] ?? obj?.[pascal] ?? fallback;
};

const formatTime = (value) => {
  if (!value) return "";
  const [hours, minutes] = String(value).split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
};

// Date formatter for Start/End dates
const formatDateStr = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getBatchTime = (batch) => {
  const startTime = getValue(batch, "StartTime", "startTime");
  const endTime = getValue(batch, "EndTime", "endTime");
  if (!startTime || !endTime) return "Not scheduled";
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const getScheduleDays = (batch) => {
  const days = getValue(batch, "ScheduleDays", "scheduleDays", []);
  return Array.isArray(days) && days.length ? days.join(", ") : "Not scheduled";
};

const getTeacherName = (batch) => {
  const teachers = getValue(batch, "TeacherNames", "teacherNames", []);
  return Array.isArray(teachers) && teachers.length ? teachers.join(", ") : "Faculty TBA";
};

const getProgress = (batch) => {
  const value = Number(getValue(batch, "ProgressPercentage", "progressPercentage", 0));
  return Math.min(100, Math.max(0, value));
};

const getStatusTheme = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return {
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        border: "border-blue-100",
        gradient: "from-blue-500 to-indigo-500",
        button: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
        iconBg: "bg-blue-50 text-blue-600",
      };
    case "upcoming":
      return {
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        border: "border-amber-100",
        gradient: "from-amber-500 to-orange-500",
        button: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20",
        iconBg: "bg-amber-50 text-amber-600",
      };
    default: // Active
      return {
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        border: "border-emerald-100",
        gradient: "from-emerald-500 to-teal-500",
        button: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-purple-500/20",
        iconBg: "bg-purple-50 text-[#7c3aed]",
      };
  }
};

export default function StudentBatches() {
    const navigate = useNavigate();   

  const {
    batches,
    summary,
    isLoading,
    error,
    fetchBatches,
    filters,
    updateFilter,
    pagination
  } = useStudentBatches({
    pageNumber: 1,
    pageSize: 50,
    sortBy: "Progress",
  });

   const handleEnterClassroom = (batch, action) => {
    const batchId = getValue(batch, "BatchId", "batchId");
    if (!batchId) return;

    const mode = action === "Rewatch" ? "rewatch" : "enter";
    navigate(`/student/classroom/${batchId}?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Classroom
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Track your progress and join your live sessions.
            </p>
          </div>

          {!isLoading && !error && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl shadow-sm">
              <GraduationCap size={20} className="text-[#7c3aed]" />
              <span className="text-sm font-bold">{summary.totalBatches}</span>
              <span className="text-sm text-slate-500">Enrolled</span>
            </div>
          )}
        </motion.div>

        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl p-2 sm:p-3 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-3 justify-between items-center"
        >
          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by course, batch or code..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] text-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap w-full lg:w-auto gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] appearance-none cursor-pointer transition-all"
              >
                <option value="">All Status</option>
                <option value="Active">Active Classes</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] appearance-none cursor-pointer transition-all"
              >
                <option value="Progress">Sort by Progress</option>
                <option value="Name">Sort by Name</option>
                <option value="Newest">Sort by Newest</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/20 animate-pulse"></div>
              <Loader2 size={40} className="animate-spin text-[#7c3aed] relative z-10" />
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-4 animate-pulse">Loading your classes...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 text-center max-w-lg mx-auto">
            <AlertCircle size={40} className="mx-auto text-red-400" />
            <h3 className="font-bold text-red-800 text-lg mt-4">Oops! Something went wrong</h3>
            <p className="text-sm text-red-600/80 mt-2">{error}</p>
            <button 
              onClick={() => fetchBatches()} 
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/30"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && batches.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-3xl py-24 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap size={40} className="text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-800 text-xl">No classes found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              We couldn't find any enrolled batches. Try adjusting your filters or check back later.
            </p>
          </div>
        )}

        {/* Batch Grid */}
        {!isLoading && !error && batches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {batches.map((batch, i) => {
                const enrollmentId = getValue(batch, "EnrollmentId", "enrollmentId");
                const batchCode = getValue(batch, "BatchCode", "batchCode", "BATCH");
                const batchName = getValue(batch, "CourseName", "courseName") || getValue(batch, "BatchName", "batchName") || "Untitled Batch";
                const startDate = getValue(batch, "StartDate", "startDate");
                const endDate = getValue(batch, "EndDate", "endDate");
                const status = getValue(batch, "Status", "status", "Active");
                const action = getValue(batch, "Action", "action", status === "Completed" ? "Rewatch" : "Enter");
                const progress = getProgress(batch);
                
                const theme = getStatusTheme(status);

                return (
                  <motion.div
                    key={enrollmentId ?? i}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`group relative bg-white rounded-3xl overflow-hidden border ${theme.border} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col`}
                  >
                    {/* Top Gradient Line */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`}></div>

                    <div className="p-6 flex-1 flex flex-col">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${theme.iconBg} flex items-center gap-1.5`}>
                          <BookOpen size={13} />
                          {batchCode}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold border ${theme.badge}`}>
                          {status}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mb-5">
                        <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-[#7c3aed] transition-colors" title={batchName}>
                          {batchName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {getTeacherName(batch).charAt(0)}
                          </span>
                          {getTeacherName(batch)}
                        </p>
                      </div>

                      {/* Schedule & Dates Info */}
                      <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 mb-6 border border-slate-100/50">
                        {/* Start - End Date */}
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm text-[#7c3aed]">
                            <CalendarDays size={15} />
                          </div>
                          <span className="truncate">
                            {formatDateStr(startDate)} <span className="text-slate-400 mx-1">→</span> {formatDateStr(endDate)}
                          </span>
                        </div>
                        
                        {/* Schedule Days */}
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm text-slate-400">
                            <Calendar size={15} />
                          </div>
                          <span className="truncate">{getScheduleDays(batch)}</span>
                        </div>

                        {/* Batch Time */}
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm text-slate-400">
                            <Clock size={15} />
                          </div>
                          <span>{getBatchTime(batch)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-auto mb-6">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Course Progress</span>
                          <span className="text-sm font-extrabold text-slate-800">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
                          />
                        </div>
                      </div>

                      {/* Proper Enter Button */}
                      <button
                        onClick={() => handleEnterClassroom(batch, action)} 
                        className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md group/btn ${theme.button}`}
                      >
                        {action === "Rewatch" ? (
                          <>
                            <Video size={18} className="group-hover/btn:scale-110 transition-transform" /> 
                            Rewatch Course
                          </>
                        ) : (
                          <>
                            <PlayCircle size={18} className="group-hover/btn:scale-110 transition-transform" /> 
                            Enter Classroom
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <span className="text-sm text-slate-500 font-medium">
              Page {pagination.pageNumber} of {pagination.totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}