import { motion } from "framer-motion";
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
  ArrowUpDown
} from "lucide-react";

import { useStudentBatches } from "../../hooks/student/useStudentBatches"; // Path check karein

// Helper for PascalCase and camelCase
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

const getBatchTime = (batch) => {
  const startTime = getValue(batch, "StartTime", "startTime");
  const endTime = getValue(batch, "EndTime", "endTime");
  if (!startTime || !endTime) return "Schedule not available";
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const getScheduleDays = (batch) => {
  const days = getValue(batch, "ScheduleDays", "scheduleDays", []);
  return Array.isArray(days) && days.length ? days.join(", ") : "Schedule not available";
};

const getTeacherName = (batch) => {
  const teachers = getValue(batch, "TeacherNames", "teacherNames", []);
  return Array.isArray(teachers) && teachers.length ? teachers.join(", ") : "Faculty not assigned";
};

const getProgress = (batch) => {
  const value = Number(getValue(batch, "ProgressPercentage", "progressPercentage", 0));
  return Math.min(100, Math.max(0, value));
};

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "completed": return "bg-blue-50 text-blue-700";
    case "upcoming": return "bg-amber-50 text-amber-700";
    default: return "bg-green-50 text-green-700";
  }
};

export default function StudentBatches() {
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

    // 👇 open a new page
    navigate(`/student/classroom/${batchId}?mode=${mode}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto p-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <p className="text-gray-500 text-sm mt-1">Access your enrolled batches and schedules.</p>
        </div>

        {!isLoading && !error && (
          <div className="flex items-center gap-2 bg-purple-50 text-[#7c3aed] px-4 py-2 rounded-xl">
            <GraduationCap size={18} />
            <span className="text-sm font-semibold">{summary.totalBatches} Enrolled Batches</span>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search batch, code or course..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#7c3aed] text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed] appearance-none"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed] appearance-none"
            >
              <option value="Progress">Sort by Progress</option>
              <option value="Name">Sort by Name</option>
              <option value="Newest">Sort by Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={35} className="animate-spin text-purple-600" />
          <p className="text-sm text-gray-500 mt-3">Loading enrolled batches...</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <AlertCircle size={32} className="mx-auto text-red-500" />
          <h3 className="font-semibold text-red-700 mt-3">Unable to load batches</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button onClick={() => fetchBatches()} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && batches.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">
          <GraduationCap size={42} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-800 mt-4">No Enrolled Batches</h3>
          <p className="text-sm text-gray-500 mt-1">Your enrolled batches will appear here.</p>
        </div>
      )}

      {/* Batch Cards */}
      {!isLoading && !error && batches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {batches.map((batch, i) => {
            const enrollmentId = getValue(batch, "EnrollmentId", "enrollmentId");
            const batchId = getValue(batch, "BatchId", "batchId");
            const batchCode = getValue(batch, "BatchCode", "batchCode", "BATCH");
            
            const batchName =
              getValue(batch, "CourseName", "courseName") ||
              getValue(batch, "BatchName", "batchName") ||
              "Untitled Batch";

            const status = getValue(batch, "Status", "status", "Active");
            const action = getValue(batch, "Action", "action", status === "Completed" ? "Rewatch" : "Enter");
            const progress = getProgress(batch);

            return (
              <motion.div
                key={enrollmentId ?? batchId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-[#7c3aed] bg-purple-50 px-2.5 py-1 rounded-md mb-2 inline-block">
                        {batchCode}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800">{batchName}</h3>
                      <p className="text-sm text-gray-500 mt-1">Instructor: {getTeacherName(batch)}</p>
                      <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(status)}`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="space-y-3 mb-6 mt-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar size={18} className="text-gray-400" />
                      <span>{getScheduleDays(batch)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock size={18} className="text-gray-400" />
                      <span>{getBatchTime(batch)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                      <span>Course Progress</span>
                      <span className="text-[#7c3aed]">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button
                     onClick={() => handleEnterClassroom(batch, action)}
                  className="w-full py-3 bg-[#7c3aed] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#6d28d9] transition-colors group"
                >
                  {action === "Rewatch" ? (
                    <>
                      <Video size={18} /> Rewatch
                    </>
                  ) : (
                    <>
                      Enter Classroom
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Info */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <div className="text-center text-sm text-gray-500 mt-6">
          Showing page {pagination.pageNumber} of {pagination.totalPages}
        </div>
      )}
    </motion.div>
  );
}