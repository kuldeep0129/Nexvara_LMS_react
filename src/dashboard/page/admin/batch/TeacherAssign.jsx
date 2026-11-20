
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Clock3,
  UserPlus,
  Users,
  Search,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Sparkles,
  RefreshCw,
  GraduationCap,
  CheckCircle2,
  Layers3,
  UserRound,
  SearchX,
  ArrowUpRight
} from 'lucide-react';

import { useTeacherAssign } from '../../../hooks/useTeacherAssign';
import AssignTeacherModal from './AssignTeacherModal';
import ViewBatchTeachersModal from './ViewBatchTeachersModal';

const FILTER_TABS = [
  'All',
  'Active',
  'Upcoming',
  'Draft',
  'Completed'
];

const STATUS_STYLES = {
  active: {
    label: 'Active',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  upcoming: {
    label: 'Upcoming',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  draft: {
    label: 'Draft',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500'
  },
  completed: {
    label: 'Completed',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500'
  },
  default: {
    label: 'Unknown',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400'
  }
};

const getStatusMeta = (status) => {
  const value = String(status ?? '').toLowerCase();

  if (value === 'active' || value === '2') {
    return STATUS_STYLES.active;
  }

  if (
    value === 'upcoming' ||
    value === 'upcomming' ||
    value === '3'
  ) {
    return STATUS_STYLES.upcoming;
  }

  if (value === 'draft' || value === '4') {
    return STATUS_STYLES.draft;
  }

  if (value === 'completed' || value === '5') {
    return STATUS_STYLES.completed;
  }

  return {
    ...STATUS_STYLES.default,
    label: status || 'Unknown'
  };
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Not specified';

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return 'Not specified';
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 16
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: 0.18
    }
  }
};

// Reusable dashboard statistic card
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg
}) {
  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            {value}
          </h3>

          <p className="text-xs text-slate-400 mt-2">
            {description}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon size={21} className={iconColor} />
        </div>
      </div>
    </div>
  );
}

// Reusable section label
function InfoLabel({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      <Icon size={13} />
      {children}
    </span>
  );
}

// Assignment Card
function AssignmentCard({
  item,
  onAssign,
  onViewAll
}) {
  const status = getStatusMeta(item.status);
  const isAssigned = Boolean(item.teacherId);

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col"
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

      <div className="p-4 sm:p-5 flex flex-col flex-1">

        {/* Status and batch code */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold ${status.badge}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
            />
            {status.label}
          </span>

          <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-mono truncate max-w-[125px]">
            {item.batchCode || 'NO-CODE'}
          </span>
        </div>

        {/* Course and batch information */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-violet-600 mb-2">
            <BookOpen size={14} />

            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
              {item.courseName || 'Course not specified'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-violet-700 transition-colors break-words">
            {item.batchName || 'Untitled Batch'}
          </h3>
        </div>

        {/* Batch duration */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-0">
            <InfoLabel icon={CalendarDays}>
              Start Date
            </InfoLabel>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
              {formatDate(item.startDate)}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 min-w-0">
            <InfoLabel icon={CalendarDays}>
              End Date
            </InfoLabel>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
              {formatDate(item.endDate)}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-center justify-between gap-3 bg-violet-50/70 border border-violet-100 rounded-xl px-3 py-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Clock3 size={16} className="text-violet-600 shrink-0" />

            <span className="text-xs font-semibold text-slate-600">
              Schedule
            </span>
          </div>

          <span className="text-xs font-bold text-violet-700 bg-white border border-violet-100 rounded-lg px-2.5 py-1.5 text-right">
            {item.weekOfDay || 'Not scheduled'}
          </span>
        </div>

        {/* Teacher information */}
        <div className="mb-5">
          {isAssigned ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold">
                  {item.teacherName?.charAt(0)?.toUpperCase() || 'T'}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Assigned Teacher
                </p>

                <p className="text-sm font-semibold text-emerald-800 truncate mt-0.5">
                  {item.teacherName || 'Teacher assigned'}
                </p>
              </div>

              <CheckCircle2
                size={18}
                className="text-emerald-600 shrink-0"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Assignment Status
                </p>

                <p className="text-sm font-semibold text-amber-800 mt-0.5">
                  Teacher Not Assigned
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAssign(item)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            <UserPlus size={16} />
            Assign Teacher
          </button>

          <button
            type="button"
            onClick={() => onViewAll(item)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-violet-200 active:scale-[0.98] text-slate-700 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-slate-100"
          >
            <Users size={16} />
            View All
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function TeacherAssign() {
  const {
    assignments,
    isLoading,
    error,
    pageNumber,
    totalPages,
    setPageNumber,
    activeTab,
    handleTabChange,
    refetch
  } = useTeacherAssign();

  const [searchTerm, setSearchTerm] = useState('');

  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    batchId: null,
    batchName: ''
  });

  const [viewAllModal, setViewAllModal] = useState({
    isOpen: false,
    batchId: null,
    batchName: ''
  });

  // Search filtering
  const filteredAssignments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return assignments || [];

    return (assignments || []).filter((item) => {
      const course = (item.courseName || '').toLowerCase();
      const code = (item.batchCode || '').toLowerCase();
      const name = (item.batchName || '').toLowerCase();
      const teacher = (item.teacherName || '').toLowerCase();

      return (
        course.includes(query) ||
        code.includes(query) ||
        name.includes(query) ||
        teacher.includes(query)
      );
    });
  }, [assignments, searchTerm]);

  // Current page statistics
  const stats = useMemo(() => {
    const list = assignments || [];

    return {
      total: list.length,
      assigned: list.filter(item => Boolean(item.teacherId)).length,
      unassigned: list.filter(item => !item.teacherId).length,
      upcoming: list.filter(item => {
        const value = String(item.status ?? '').toLowerCase();
        return value === 'upcoming' || value === 'upcomming' || value === '3';
      }).length
    };
  }, [assignments]);

  const openAssignModal = (item) => {
    setAssignModal({
      isOpen: true,
      batchId: item.batchId,
      batchName: item.batchName || ''
    });
  };

  const openViewAllModal = (item) => {
    setViewAllModal({
      isOpen: true,
      batchId: item.batchId,
      batchName: item.batchName || ''
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    handleTabChange('All');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-5 lg:p-7 xl:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-7">

        {/* ================= HEADER ================= */}
        <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200 shrink-0">
              <GraduationCap
                size={27}
                className="text-white"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Teacher Assignment
                </h1>

                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-50 text-violet-700 text-[10px] font-bold border border-violet-100">
                  <Sparkles size={12} />
                  Management
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-1.5 max-w-xl leading-relaxed">
                Manage batch schedules, assign expert teachers and monitor teaching assignments.
              </p>
            </div>
          </div>

          {/* Search and Refresh */}
          <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">

            <div className="relative flex-1 xl:w-[380px]">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batch, course, code or teacher..."
                className="w-full h-12 pl-11 pr-11 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-violet-400 focus:ring-4 focus:ring-violet-100 shadow-sm"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading}
              className="h-12 px-4 flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-violet-700 hover:border-violet-200 hover:bg-violet-50 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={isLoading ? 'animate-spin' : ''}
              />
              <span className="text-sm font-semibold">
                Refresh
              </span>
            </button>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

          <StatCard
            title="Total Batches"
            value={stats.total}
            description="On current page"
            icon={Layers3}
            iconColor="text-violet-600"
            iconBg="bg-violet-50"
          />

          <StatCard
            title="Teachers Assigned"
            value={stats.assigned}
            description="Successfully assigned"
            icon={CheckCircle2}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />

          <StatCard
            title="Pending Assignment"
            value={stats.unassigned}
            description="Awaiting teacher"
            icon={UserRound}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />

          <StatCard
            title="Upcoming Batches"
            value={stats.upcoming}
            description="Scheduled batches"
            icon={CalendarDays}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />

        </section>

        {/* ================= FILTERS ================= */}
        <section className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Batch Assignments
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Filter batches by their current status.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {filteredAssignments.length} results on this page
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-hide">

            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`
                    shrink-0 px-4 sm:px-5 py-2.5 rounded-xl
                    text-xs sm:text-sm font-semibold
                    border transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-violet-100
                    ${
                      isActive
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-100'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200'
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}

          </div>
        </section>

        {/* ================= ERROR ================= */}
        {error && (
          <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-bold">
                  Unable to load assignments
                </p>

                <p className="text-xs mt-1 text-red-600">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-14">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                <Loader2
                  size={28}
                  className="text-violet-600 animate-spin"
                />
              </div>

              <h3 className="text-base font-bold text-slate-800">
                Loading assignments
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Please wait while we fetch your batch data...
              </p>
            </div>
          </div>

        ) : filteredAssignments.length === 0 ? (

          /* ================= EMPTY STATE ================= */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-16 text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-5">
              <SearchX
                size={32}
                className="text-slate-400"
              />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              No assignments found
            </h3>

            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
              We couldn't find any batches matching your search or selected filter.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-violet-100"
            >
              <RefreshCw size={15} />
              Clear Filters
            </button>
          </motion.div>

        ) : (

          /* ================= ASSIGNMENT CARDS ================= */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">

              {filteredAssignments.map((item, index) => (
                <AssignmentCard
                  key={item.batchId ?? index}
                  item={item}
                  onAssign={openAssignModal}
                  onViewAll={openViewAllModal}
                />
              ))}

            </AnimatePresence>
          </motion.div>
        )}

        {/* ================= PAGINATION ================= */}
        {!isLoading && totalPages > 1 && (

          <section className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs sm:text-sm text-slate-500">
              Page <span className="font-bold text-slate-800">{pageNumber}</span>
              {' '}of{' '}
              <span className="font-bold text-slate-800">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <div className="hidden sm:flex items-center justify-center min-w-11 h-10 px-3 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-sm font-bold">
                {pageNumber}
              </div>

              <button
                type="button"
                onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                disabled={pageNumber >= totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight size={17} />
              </button>

            </div>
          </section>
        )}

        {/* ================= MODALS ================= */}

        <AssignTeacherModal
          isOpen={assignModal.isOpen}
          batchId={assignModal.batchId}
          batchName={assignModal.batchName}
          onClose={() =>
            setAssignModal({
              isOpen: false,
              batchId: null,
              batchName: ''
            })
          }
          onSuccess={() => refetch()}
        />

        <ViewBatchTeachersModal
          isOpen={viewAllModal.isOpen}
          batchId={viewAllModal.batchId}
          batchName={viewAllModal.batchName}
          onClose={() =>
            setViewAllModal({
              isOpen: false,
              batchId: null,
              batchName: ''
            })
          }
        />

      </div>
    </div>
  );
}
