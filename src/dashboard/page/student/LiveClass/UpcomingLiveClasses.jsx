
import React, { useMemo } from "react";
import { motion } from "framer-motion";

import {
  Video,
  CalendarDays,
  Clock3,
  BookOpen,
  Search,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CalendarCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  VideoOff,
  Radio,
} from "lucide-react";

import { useUpcomingLiveClasses } from "../../../hooks/student/useUpcomingLiveClasses";

/* =====================================================
   DATE HELPERS
===================================================== */

const getDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = getDate(value);

  if (!date) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  const date = getDate(value);

  if (!date) return "--:--";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getDuration = (start, end) => {
  const startDate = getDate(start);
  const endDate = getDate(end);

  if (!startDate || !endDate) return "Duration unavailable";

  const minutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / 60000
  );

  if (minutes <= 0) return "Duration unavailable";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) {
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours) return `${hours}h`;

  return `${minutes} min`;
};

const getTimeStatus = (value) => {
  const date = getDate(value);

  if (!date) return "Upcoming";

  const diff = date.getTime() - Date.now();

  if (diff <= 0) return "Starting now";

  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `Starts in ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Starts in ${hours}h`;
  }

  const days = Math.floor(hours / 24);

  return `Starts in ${days} days`;
};

/* =====================================================
   PAGE HEADER
===================================================== */

function PageHeader({ totalClasses, onRefresh, loading }) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#F0EDF8] px-5 py-6 sm:px-7 md:flex-row md:items-center md:justify-between">

      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6D5BD0]">
            <Video size={19} />
          </span>

          <span className="text-xs font-bold uppercase tracking-wider text-[#8C80C8]">
            Student Learning
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#352D77] sm:text-3xl">
          Upcoming Live Classes
        </h1>

        <p className="mt-2 text-sm text-[#9692AB]">
          Never miss a live learning session. Stay prepared and join on time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">

        <div className="flex items-center gap-2 rounded-xl border border-[#EEEAF8] bg-[#FAF9FD] px-4 py-3">
          <CalendarCheck size={17} className="text-[#8A78DE]" />

          <span className="text-sm font-semibold text-[#51478A]">
            {totalClasses} Classes
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-[#6D5BD0] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-[#5947BC] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

      </div>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({ icon: Icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-[#EEEAF8] bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6D5BD0]">
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-[#40376A]">
        {value}
      </p>

      <h3 className="mt-1 text-sm font-semibold text-[#625A83]">
        {title}
      </h3>

      <p className="mt-1 text-xs text-[#A09BB4]">
        {description}
      </p>

    </div>
  );
}

/* =====================================================
   LIVE CLASS CARD
===================================================== */

function LiveClassCard({ item, index }) {
  const validMeetingUrl = (() => {
    try {
      const url = new URL(item.meetingUrl);

      return ["https:", "http:"].includes(url.protocol)
        ? url.href
        : null;
    } catch {
      return null;
    }
  })();

  const startDate = getDate(item.scheduledStartAt);
  const isStarting = startDate && startDate.getTime() <= Date.now();

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      className="group overflow-hidden rounded-2xl border border-[#EDE9F7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/70"
    >

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:p-6">

        {/* Date */}
        <div className="flex h-[90px] w-[90px] shrink-0 flex-col items-center justify-center rounded-2xl border border-[#E6DFFF] bg-[#F5F2FF]">

          <span className="text-xs font-bold uppercase text-[#8A78DE]">
            {startDate
              ? startDate.toLocaleDateString("en-IN", { month: "short" })
              : "DATE"}
          </span>

          <span className="text-3xl font-extrabold text-[#51478A]">
            {startDate ? startDate.getDate() : "--"}
          </span>

          <span className="text-[10px] font-semibold text-[#9A92B9]">
            {startDate
              ? startDate.toLocaleDateString("en-IN", {
                  weekday: "short",
                })
              : "Unavailable"}
          </span>

        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">

          <div className="mb-2 flex flex-wrap items-center gap-2">

            <span className="rounded-lg bg-[#F0EDFF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6D5BD0]">
              {item.batchName}
            </span>

            <span className="rounded-lg bg-[#E9F9F1] px-2.5 py-1 text-[10px] font-bold text-[#19976A]">
              UPCOMING
            </span>

          </div>

          <h3 className="text-lg font-bold text-[#40376A] transition group-hover:text-[#6D5BD0]">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#9692AB]">
              {item.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">

            <div className="flex items-center gap-2 text-xs font-medium text-[#77708F]">
              <Clock3 size={15} className="text-[#8A78DE]" />

              {formatTime(item.scheduledStartAt)}
              {" - "}
              {formatTime(item.scheduledEndAt)}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#77708F]">
              <CalendarDays size={15} className="text-[#8A78DE]" />

              {formatDate(item.scheduledStartAt)}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#77708F]">
              <BookOpen size={15} className="text-[#8A78DE]" />

              {item.moduleName}
            </div>

          </div>

        </div>

        {/* Action */}
        <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-[#F1EEF8] pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">

          <div className="text-right">
            <p className="text-xs font-bold text-[#51478A]">
              {getTimeStatus(item.scheduledStartAt)}
            </p>

            <p className="mt-1 text-[11px] text-[#A09BB4]">
              {getDuration(
                item.scheduledStartAt,
                item.scheduledEndAt
              )}
            </p>
          </div>

          {validMeetingUrl ? (
            <a
              href={validMeetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6D5BD0] px-4 py-3 text-xs font-bold text-white shadow-md shadow-purple-200 transition hover:bg-[#5947BC]"
            >
              <Video size={15} />

              {isStarting ? "Join Class" : "Meeting Link"}

              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-xs font-semibold text-gray-500">
              <VideoOff size={15} />
              Link unavailable
            </span>
          )}

        </div>

      </div>

      <div className="h-1 w-full bg-gradient-to-r from-[#8E7BE8] via-[#C4B5FD] to-[#E9DFFF]" />

    </motion.article>
  );
}

/* =====================================================
   LOADING
===================================================== */

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-44 animate-pulse rounded-2xl border border-[#EEEAF8] bg-[#F8F6FC]"
        />
      ))}
    </div>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({ search }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#DCD5EF] bg-[#FAF9FD] px-5 py-16 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0EDFF] text-[#8A78DE]">
        {search ? <Search size={27} /> : <VideoOff size={27} />}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#40376A]">
        {search
          ? "No matching live classes"
          : "No upcoming live classes"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9692AB]">
        {search
          ? "Try another search keyword to find your live class."
          : "You don't have any scheduled live classes right now. Check again later for new sessions."}
      </p>

    </div>
  );
}

/* =====================================================
   ERROR STATE
===================================================== */

function ErrorState({ error, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">

      <AlertCircle
        size={32}
        className="mx-auto text-red-500"
      />

      <h3 className="mt-3 font-bold text-red-700">
        Unable to load live classes
      </h3>

      <p className="mt-2 text-sm text-red-500">
        {error}
      </p>

      <button
        onClick={onRetry}
        className="mt-5 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
      >
        Try Again
      </button>

    </div>
  );
}

/* =====================================================
   MAIN PAGE
===================================================== */

export default function UpcomingLiveClasses() {

  const {
    classes,
    totalClasses,
    pagination,
    search,
    setSearch,
    isLoading,
    error,
    changePage,
    refresh,
  } = useUpcomingLiveClasses();

  const nextClass = useMemo(() => {
    return [...classes]
      .filter((item) => {
        const date = getDate(item.scheduledStartAt);
        return date && date.getTime() >= Date.now();
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledStartAt) -
          new Date(b.scheduledStartAt)
      )[0] || null;
  }, [classes]);

  return (
    <div className="min-h-screen bg-[#F0EDFF] p-3 sm:p-5 lg:p-7">

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-white shadow-[0_15px_55px_rgba(91,70,160,0.08)]"
      >

        <PageHeader
          totalClasses={totalClasses}
          onRefresh={refresh}
          loading={isLoading}
        />

        <div className="space-y-6 p-5 sm:p-7">

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            <StatCard
              icon={Video}
              title="Upcoming Classes"
              value={totalClasses}
              description="Your scheduled learning sessions"
            />

            <StatCard
              icon={CalendarDays}
              title="Next Live Session"
              value={
                nextClass
                  ? formatDate(nextClass.scheduledStartAt)
                  : "--"
              }
              description={
                nextClass
                  ? nextClass.title
                  : "No next class scheduled"
              }
            />

            <StatCard
              icon={GraduationCap}
              title="Learning Platform"
              value="Nexvara"
              description="Your online classroom"
            />

          </div>

          {/* Next Class Highlight */}
          {nextClass && !isLoading && !error && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5947BC] to-[#8B7AE0] p-5 text-white sm:p-7">

              <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold">
                    <Radio size={14} />
                    YOUR NEXT LIVE CLASS
                  </div>

                  <h2 className="text-xl font-bold sm:text-2xl">
                    {nextClass.title}
                  </h2>

                  <p className="mt-2 text-sm text-white/80">
                    {nextClass.batchName}
                    {" · "}
                    {formatDate(nextClass.scheduledStartAt)}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
                    <Clock3 size={16} />
                    {formatTime(nextClass.scheduledStartAt)}
                  </div>
                </div>

                <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4 sm:min-w-[190px]">
                  <p className="text-xs font-medium text-white/70">
                    Session starts
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {getTimeStatus(nextClass.scheduledStartAt)}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Search & List */}
          <section>

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold text-[#40376A]">
                  All Upcoming Sessions
                </h2>

                <p className="mt-1 text-xs text-[#9692AB]">
                  Browse your scheduled live classes.
                </p>
              </div>

              <div className="relative w-full sm:max-w-[320px]">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A09BB4]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search classes or batches..."
                  className="w-full rounded-xl border border-[#EEEAF8] bg-[#FAF9FD] py-3 pl-10 pr-4 text-sm text-[#51478A] outline-none transition focus:border-[#8A78DE] focus:ring-2 focus:ring-purple-100"
                />

              </div>

            </div>

            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState
                error={error}
                onRetry={refresh}
              />
            ) : classes.length === 0 ? (
              <EmptyState search={search} />
            ) : (
              <div className="space-y-4">

                {classes.map((item, index) => (
                  <LiveClassCard
                    key={item.id}
                    item={item}
                    index={index}
                  />
                ))}

              </div>
            )}

          </section>

          {/* Pagination */}
          {!isLoading && !error && pagination.totalPages > 1 && (

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EDF8] pt-5">

              <p className="text-xs font-medium text-[#9692AB]">
                Page {pagination.pageNumber} of {pagination.totalPages}
              </p>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => changePage(pagination.pageNumber - 1)}
                  disabled={pagination.pageNumber <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEEAF8] text-[#6D5BD0] transition hover:bg-[#F0EDFF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => changePage(pagination.pageNumber + 1)}
                  disabled={pagination.pageNumber >= pagination.totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEEAF8] text-[#6D5BD0] transition hover:bg-[#F0EDFF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>

              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
