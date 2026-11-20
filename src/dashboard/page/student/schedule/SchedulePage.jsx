import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  CalendarDays,
  Clock,
  Video,
  BookOpen,
  ChevronRight,
  RefreshCw,
  X,
  CalendarCheck,
  AlertCircle,
  CalendarClock,
} from "lucide-react";

import { useStudentSchedule } from "../../../hooks/student/useStudentSchedule";

// Safe local date parsing (avoids UTC date shifting).
const parseDate = (value) => {
  if (!value) return null;

  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const formatDate = (value, options = {}) => {
  const date = parseDate(value);

  if (!date) return "Date unavailable";

  return date.toLocaleDateString("en-IN", options);
};

// Supports TimeSpan format: 10:00:00
const formatTime = (value) => {
  if (!value) return "--:--";

  const [hours, minutes] = String(value).split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getSessionDateTime = (session) => {
  const date = parseDate(session.date ?? session.Date);
  const time = session.time ?? session.Time ?? "00:00:00";

  if (!date) return null;

  const [hours = 0, minutes = 0, seconds = 0] =
    String(time).split(":").map(Number);

  date.setHours(hours, minutes, seconds, 0);

  return date;
};

const colors = [
  {
    card: "bg-[#DDF2F8] border-[#C3E7F1]",
    text: "text-[#315F79]",
    icon: "bg-[#DDF2F8] text-[#477B93]",
  },
  {
    card: "bg-[#F0E1F8] border-[#E4CCF1]",
    text: "text-[#80528E]",
    icon: "bg-[#F0E1F8] text-[#9463A6]",
  },
  {
    card: "bg-[#F8E8EE] border-[#F0D4E1]",
    text: "text-[#A05C79]",
    icon: "bg-[#F8E8EE] text-[#B36E89]",
  },
];

export default function SchedulePage() {
  const {
    sessions,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    refresh,
  } = useStudentSchedule();

  const [selectedSession, setSelectedSession] = useState(null);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const first = getSessionDateTime(a);
      const second = getSessionDateTime(b);

      return (first?.getTime() ?? 0) - (second?.getTime() ?? 0);
    });
  }, [sessions]);

  const upcomingSessions = useMemo(() => {
    const now = new Date();

    return sortedSessions
      .filter((session) => {
        const date = getSessionDateTime(session);
        return date && date >= now;
      })
      .slice(0, 4);
  }, [sortedSessions]);

  const getSessionColor = (index) => colors[index % colors.length];

  return (
    <div className="min-h-screen bg-[#F0EDFF] p-3 sm:p-5 lg:p-7">

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-white shadow-[0_15px_55px_rgba(91,70,160,0.08)]"
      >

        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[#F2F0F8] px-5 py-5 sm:px-7 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#352D77]">
              My Schedule
            </h1>

            <p className="mt-1 text-sm text-[#9692AB]">
              Stay on track with your learning and upcoming classes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* Date Filter */}
            <div className="relative flex items-center gap-2 rounded-xl border border-[#F0EDF8] bg-[#FAF9FD] px-3 py-2.5">
              <CalendarDays size={17} className="text-[#8A78DE]" />

              <input
                type="date"
                value={selectedDate}
                max="9999-12-31"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[#49416D] outline-none"
              />
            </div>

            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#6D5BD0] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-[#5947BC] disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

          </div>
        </header>

        {/* Main */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]">

          {/* Left Content */}
          <section className="min-w-0 p-4 sm:p-6">

            {/* Selected Date */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A5A0B7]">
                  Selected date
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#49416D]">
                  {formatDate(selectedDate, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#F7F5FC] px-4 py-2.5">
                <CalendarCheck size={17} className="text-[#8A78DE]" />

                <span className="text-sm font-semibold text-[#6D5BD0]">
                  {sortedSessions.length} Sessions
                </span>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-2xl bg-[#F7F5FC]"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                <AlertCircle className="mx-auto text-red-500" size={28} />

                <p className="mt-3 text-sm font-semibold text-red-700">
                  Unable to load schedule
                </p>

                <p className="mt-1 text-xs text-red-500">
                  {error}
                </p>

                <button
                  onClick={refresh}
                  className="mt-4 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Sessions List */}
            {!loading && !error && (
              <div>

                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#50476E]">
                    All Scheduled Classes
                  </h2>

                  <span className="text-xs text-[#A09BB4]">
                    Sorted by date & time
                  </span>
                </div>

                <div className="space-y-3">

                  <AnimatePresence mode="popLayout">

                    {sortedSessions.map((session, index) => {
                      const color = getSessionColor(index);

                      const id = session.id ?? session.Id;
                      const batchName =
                        session.batchName ?? session.BatchName ?? "Batch";

                      const moduleName =
                        session.moduleName ?? session.ModuleName ?? "Class";

                      const date = session.date ?? session.Date;
                      const time = session.time ?? session.Time;

                      return (
                        <motion.button
                          key={id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ delay: Math.min(index * 0.025, 0.2) }}
                          onClick={() => setSelectedSession(session)}
                          className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:gap-4 ${color.card}`}
                        >

                          {/* Date */}
                          <div className="flex w-[66px] shrink-0 flex-col items-center justify-center rounded-xl bg-white/75 p-2">

                            <span className="text-[10px] font-semibold uppercase text-[#8E88A8]">
                              {formatDate(date, { month: "short" })}
                            </span>

                            <span className="text-2xl font-bold text-[#49416D]">
                              {formatDate(date, { day: "numeric" })}
                            </span>

                            <span className="text-[9px] text-[#A5A0B7]">
                              {formatDate(date, { weekday: "short" })}
                            </span>

                          </div>

                          {/* Session Information */}
                          <div className="min-w-0 flex-1">

                            <h3 className={`truncate text-sm font-bold sm:text-base ${color.text}`}>
                              {moduleName}
                            </h3>

                            <p className="mt-1 truncate text-xs text-[#79738F]">
                              {batchName}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#89839F]">

                              <span className="flex items-center gap-1">
                                <Clock size={13} />
                                {formatTime(time)}
                              </span>

                              <span className="flex items-center gap-1">
                                <BookOpen size={13} />
                                Learning Session
                              </span>

                            </div>
                          </div>

                          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70 sm:flex">
                            <Video size={18} className={color.text} />
                          </div>

                          <ChevronRight
                            size={18}
                            className="shrink-0 text-[#A5A0B7]"
                          />

                        </motion.button>
                      );
                    })}

                  </AnimatePresence>

                </div>

                {/* Empty State */}
                {sortedSessions.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#DDD7F1] py-16 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F0FC]">
                      <CalendarDays size={25} className="text-[#A18EDC]" />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-[#77718F]">
                      No classes scheduled
                    </h3>

                    <p className="mt-2 text-xs text-[#A7A1B8]">
                      There are no sessions available from this date.
                    </p>

                    <button
                      onClick={() => setSelectedDate(
                        new Date().toISOString().slice(0, 10)
                      )}
                      className="mt-5 rounded-xl bg-[#6D5BD0] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#5947BC]"
                    >
                      Go to Today
                    </button>

                  </div>
                )}

              </div>
            )}

          </section>

          {/* Right Panel */}
          <aside className="border-t border-[#F1EDF8] bg-[#FCFBFE] p-5 xl:border-l xl:border-t-0">

            {/* Selected Date Card */}
            <div className="rounded-2xl border border-[#F0EDF7] bg-white p-4">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEE9FC]">
                  <CalendarDays size={18} className="text-[#7863C9]" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#50476E]">
                    Schedule Overview
                  </h2>

                  <p className="text-[10px] text-[#A09BB4]">
                    Your learning calendar
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#F7F5FC] p-4">
                <p className="text-xs text-[#9993AE]">
                  Selected From
                </p>

                <p className="mt-1 text-sm font-bold text-[#6D5BD0]">
                  {formatDate(selectedDate, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p className="mt-2 text-[10px] text-[#A09BB4]">
                  Showing all enrolled batch sessions from this date.
                </p>
              </div>

            </div>

            {/* Upcoming Sessions */}
            <div className="mt-6">

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#50476E]">
                  Upcoming Sessions
                </h2>

                <span className="rounded-full bg-[#EEE9FC] px-2.5 py-1 text-[10px] font-bold text-[#7863C9]">
                  {upcomingSessions.length}
                </span>
              </div>

              <div className="space-y-3">

                {!loading && upcomingSessions.map((session, index) => {
                  const date = session.date ?? session.Date;
                  const time = session.time ?? session.Time;

                  return (
                    <motion.button
                      key={session.id ?? session.Id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      onClick={() => setSelectedSession(session)}
                      className="flex w-full items-center gap-3 rounded-xl border border-[#F0EDF7] bg-white p-3 text-left transition hover:border-[#DCD3F5] hover:shadow-sm"
                    >

                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[#EEE9FC]">
                        <span className="text-[9px] font-semibold text-[#8A78DE]">
                          {formatDate(date, { month: "short" })}
                        </span>

                        <span className="text-sm font-bold text-[#6D5BD0]">
                          {formatDate(date, { day: "numeric" })}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[#575071]">
                          {session.moduleName ?? session.ModuleName ?? "Class"}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-[#A19BB3]">
                          {session.batchName ?? session.BatchName ?? "Batch"}
                        </p>

                        <p className="mt-1 text-[10px] text-[#8B80C8]">
                          {formatTime(time)}
                        </p>
                      </div>

                      <ChevronRight size={14} className="text-[#B3ADC4]" />

                    </motion.button>
                  );
                })}

                {!loading && upcomingSessions.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#DDD7F1] p-6 text-center">
                    <CalendarClock size={22} className="mx-auto text-[#B1A7D7]" />

                    <p className="mt-2 text-xs font-semibold text-[#77718F]">
                      No upcoming sessions
                    </p>
                  </div>
                )}

              </div>
            </div>

          </aside>
        </div>
      </motion.div>

      {/* Session Detail Modal */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241C45]/40 p-4 backdrop-blur-sm"
            onClick={() => setSelectedSession(null)}
          >

            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >

              <div className="flex items-start justify-between">

                <div>
                  <span className="rounded-full bg-[#EEE9FC] px-3 py-1 text-[10px] font-bold text-[#7863C9]">
                    Learning Session
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-[#40376A]">
                    {selectedSession.moduleName ??
                      selectedSession.ModuleName ??
                      "Class"}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedSession(null)}
                  className="rounded-xl bg-[#F6F4FA] p-2 text-[#88819F] hover:bg-[#EEEAF7]"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="mt-6 space-y-4 text-sm text-[#79738F]">

                <div className="flex items-center gap-3">
                  <CalendarDays size={17} className="text-[#8A78DE]" />

                  {formatDate(
                    selectedSession.date ?? selectedSession.Date,
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={17} className="text-[#8A78DE]" />

                  {formatTime(
                    selectedSession.time ?? selectedSession.Time
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen size={17} className="text-[#8A78DE]" />

                  {selectedSession.batchName ??
                    selectedSession.BatchName ??
                    "Batch"}
                </div>

              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="mt-7 w-full rounded-xl bg-[#6D5BD0] py-3 text-sm font-bold text-white transition hover:bg-[#5947BC]"
              >
                Close
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}