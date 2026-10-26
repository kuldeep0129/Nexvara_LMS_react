
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Clock,
  Video,
  BookOpen,
  ClipboardList,
  Plus,
  X
} from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const initialEvents = [
  {
    id: 1,
    title: 'UX Research',
    type: 'Lecture',
    day: 0,
    start: 9,
    end: 11,
    color: 'blue',
    batch: 'React Batch'
  },
  {
    id: 2,
    title: 'HTML for Designers',
    type: 'Workshop',
    day: 1,
    start: 10,
    end: 12,
    color: 'pink',
    batch: 'Web Development'
  },
  {
    id: 3,
    title: 'Design Patterns',
    type: 'Practical',
    day: 0,
    start: 12,
    end: 14,
    color: 'purple',
    batch: 'React Batch'
  },
  {
    id: 4,
    title: 'Color Psychology',
    type: 'Lecture',
    day: 2,
    start: 12,
    end: 14,
    color: 'blue',
    batch: 'UI/UX Batch'
  },
  {
    id: 5,
    title: 'UX Writing',
    type: 'Practical',
    day: 3,
    start: 13,
    end: 15,
    color: 'purple',
    batch: 'UI/UX Batch'
  },
  {
    id: 6,
    title: '3D Design',
    type: 'Lecture',
    day: 4,
    start: 11,
    end: 13,
    color: 'blue',
    batch: 'Design Batch'
  },
  {
    id: 7,
    title: 'Mobile Design',
    type: 'Workshop',
    day: 5,
    start: 14,
    end: 16,
    color: 'pink',
    batch: 'UI/UX Batch'
  },
  {
    id: 8,
    title: 'HTML for Designers',
    type: 'Lecture',
    day: 2,
    start: 16,
    end: 18,
    color: 'blue',
    batch: 'Web Development'
  }
];

const hours = Array.from({ length: 10 }, (_, i) => i + 9);

const eventColors = {
  blue: 'bg-[#DDF2F8] border-[#C3E7F1] text-[#315F79]',
  purple: 'bg-[#F0E1F8] border-[#E4CCF1] text-[#80528E]',
  pink: 'bg-[#F8E8EE] border-[#F0D4E1] text-[#A05C79]'
};

export default function SchedulePage({ role = 'student' }) {
  const [events] = useState(initialEvents);
  const [selectedDay, setSelectedDay] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('week');

  const isTeacher = role.toLowerCase() === 'teacher';

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.batch.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  const upcomingEvents = [...filteredEvents]
    .sort((a, b) => a.day - b.day || a.start - b.start)
    .slice(0, 4);

  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

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
              Schedule
            </h1>
            <p className="mt-1 text-sm text-[#9692AB]">
              {isTeacher
                ? 'Manage your classes and teaching schedule'
                : 'Stay on track with your learning'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A0B8]"
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search classes..."
                className="w-full rounded-xl border border-[#F0EDF8] bg-[#FAF9FD] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#8A78DE] sm:w-48"
              />
            </div>

            {isTeacher && (
              <button
                className="flex items-center gap-2 rounded-xl bg-[#6D5BD0] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-[#5947BC] active:scale-95"
                onClick={() => alert('Connect your Create Class modal')}
              >
                <Plus size={16} />
                <span>Schedule Class</span>
              </button>
            )}

            <div className="flex items-center gap-2 rounded-xl bg-[#F7F5FC] p-1">
              <button
                onClick={() => setView('week')}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  view === 'week'
                    ? 'bg-white text-[#6D5BD0] shadow-sm'
                    : 'text-[#9993AE]'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  view === 'day'
                    ? 'bg-white text-[#6D5BD0] shadow-sm'
                    : 'text-[#9993AE]'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_270px]">
          <section className="min-w-0 p-4 sm:p-6">
            {/* Date navigation */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setSelectedDay(prev => (prev + 6) % 7)
                  }
                  className="rounded-lg p-2 text-[#807A9A] transition hover:bg-[#F3F0FC]"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm font-bold text-[#49416D]">
                  January 2023
                </span>

                <button
                  onClick={() =>
                    setSelectedDay(prev => (prev + 1) % 7)
                  }
                  className="rounded-lg p-2 text-[#807A9A] transition hover:bg-[#F3F0FC]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <span className="text-xs text-[#A09BB4]">
                Weekly timetable
              </span>
            </div>

            {/* Mobile day selector */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
              {days.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={`min-w-[62px] rounded-xl px-3 py-2 text-center transition ${
                    selectedDay === index
                      ? 'bg-[#6D5BD0] text-white shadow-lg shadow-purple-200'
                      : 'bg-[#F7F5FC] text-[#89839F]'
                  }`}
                >
                  <span className="block text-[10px]">{day}</span>
                  <span className="mt-1 block text-sm font-bold">
                    {7 + index}
                  </span>
                </button>
              ))}
            </div>

            {/* Desktop weekly grid */}
            <div className="hidden overflow-x-auto lg:block">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[55px_repeat(7,minmax(0,1fr))]">
                  <div />

                  {days.map((day, index) => (
                    <div
                      key={day}
                      className="mb-3 border-l border-[#F4F1FA] px-2 text-center"
                    >
                      <span className="block text-[10px] font-semibold text-[#A5A0B7]">
                        {String(7 + index).padStart(2, '0')} {day}
                      </span>
                      <span
                        className={`mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                          selectedDay === index
                            ? 'bg-[#6D5BD0] text-white'
                            : 'text-[#8E88A8]'
                        }`}
                      >
                        {7 + index}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative grid grid-cols-[55px_repeat(7,minmax(0,1fr))]">
                  {/* Time column */}
                  <div>
                    {hours.map(hour => (
                      <div
                        key={hour}
                        className="h-[76px] border-t border-[#F3F0F8] pt-2 text-[10px] text-[#A5A0B7]"
                      >
                        {hour > 12 ? hour - 12 : hour}
                        {hour >= 12 ? ' pm' : ' am'}
                      </div>
                    ))}
                  </div>

                  {/* Calendar columns */}
                  {days.map((day, dayIndex) => (
                    <div
                      key={day}
                      className="relative border-l border-[#F3F0F8]"
                    >
                      {hours.map(hour => (
                        <div
                          key={hour}
                          className="h-[76px] border-t border-[#F3F0F8]"
                        />
                      ))}

                      {filteredEvents
                        .filter(event => event.day === dayIndex)
                        .map(event => (
                          <motion.button
                            key={event.id}
                            whileHover={{
                              scale: 1.03,
                              y: -2,
                              boxShadow: '0 8px 20px rgba(109,91,208,0.12)'
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedEvent(event)}
                            style={{
                              top: `${(event.start - 9) * 76}px`,
                              height: `${(event.end - event.start) * 76 - 4}px`
                            }}
                            className={`absolute left-1 right-1 overflow-hidden rounded-lg border p-2 text-left ${eventColors[event.color]}`}
                          >
                            <span className="block text-[10px] font-bold leading-4">
                              {event.title}
                            </span>
                            <span className="mt-1 block text-[9px] opacity-80">
                              {event.type}
                            </span>
                            <span className="mt-2 block text-[9px] opacity-75">
                              {event.start > 12
                                ? event.start - 12
                                : event.start}
                              {' pm'}
                            </span>
                          </motion.button>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile / Tablet agenda */}
            <div className="space-y-3 lg:hidden">
              <AnimatePresence mode="popLayout">
                {filteredEvents
                  .filter(event => event.day === selectedDay)
                  .map(event => (
                    <motion.button
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedEvent(event)}
                      className={`flex w-full gap-3 rounded-2xl border p-4 text-left ${eventColors[event.color]}`}
                    >
                      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white/70 p-2">
                        <Clock size={15} />
                        <span className="mt-1 text-xs font-bold">
                          {event.start > 12
                            ? event.start - 12
                            : event.start}
                          {event.start >= 12 ? ' PM' : ' AM'}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold">{event.title}</h3>
                        <p className="mt-1 text-xs opacity-80">
                          {event.type} · {event.batch}
                        </p>
                        <p className="mt-2 text-[10px] opacity-70">
                          {event.end - event.start} hour session
                        </p>
                      </div>

                      <ChevronRight size={17} />
                    </motion.button>
                  ))}
              </AnimatePresence>

              {filteredEvents.filter(e => e.day === selectedDay).length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#DDD7F1] py-12 text-center">
                  <CalendarDays className="mx-auto text-[#B1A7D7]" />
                  <p className="mt-3 text-sm font-semibold text-[#77718F]">
                    No classes scheduled
                  </p>
                  <p className="mt-1 text-xs text-[#A7A1B8]">
                    Your schedule is free for this day.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right panel */}
          <aside className="border-t border-[#F1EDF8] bg-[#FCFBFE] p-5 xl:border-l xl:border-t-0">
            {/* Mini calendar */}
            <div className="rounded-2xl border border-[#F0EDF7] bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#50476E]">
                  January 2023
                </h2>
                <div className="flex gap-1">
                  <button className="rounded-md p-1 text-[#9993AE] hover:bg-[#F6F3FC]">
                    <ChevronLeft size={15} />
                  </button>
                  <button className="rounded-md p-1 text-[#9993AE] hover:bg-[#F6F3FC]">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <span
                    key={`${day}-${i}`}
                    className="text-[9px] font-semibold text-[#AAA4BC]"
                  >
                    {day}
                  </span>
                ))}

                {monthDays.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay((day - 1) % 7)}
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[10px] transition ${
                      day === 7
                        ? 'bg-[#6D5BD0] font-bold text-white'
                        : 'text-[#77718F] hover:bg-[#F0EDFA]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#50476E]">
                  Upcoming events
                </h2>
                <span className="rounded-full bg-[#EEE9FC] px-2 py-1 text-[10px] font-bold text-[#7863C9]">
                  {upcomingEvents.length}
                </span>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ x: 3 }}
                    onClick={() => setSelectedEvent(event)}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#F0EDF7] bg-white p-3 text-left transition hover:border-[#DCD3F5] hover:shadow-sm"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        event.color === 'blue'
                          ? 'bg-[#DDF2F8] text-[#477B93]'
                          : event.color === 'pink'
                          ? 'bg-[#F8E8EE] text-[#B36E89]'
                          : 'bg-[#F0E1F8] text-[#9463A6]'
                      }`}
                    >
                      {event.type === 'Lecture' ? (
                        <Video size={18} />
                      ) : event.type === 'Workshop' ? (
                        <BookOpen size={18} />
                      ) : (
                        <ClipboardList size={18} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#575071]">
                        {event.title}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-[#A19BB3]">
                        {event.batch}
                      </p>
                      <p className="mt-1 text-[10px] text-[#8B80C8]">
                        {days[event.day]} · {event.start}:00
                      </p>
                    </div>

                    <ChevronRight size={14} className="text-[#B3ADC4]" />
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </motion.div>

      {/* Event detail modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241C45]/40 p-4 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-[#EEE9FC] px-3 py-1 text-[10px] font-bold text-[#7863C9]">
                    {selectedEvent.type}
                  </span>
                  <h2 className="mt-4 text-xl font-bold text-[#40376A]">
                    {selectedEvent.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-xl bg-[#F6F4FA] p-2 text-[#88819F] hover:bg-[#EEEAF7]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm text-[#79738F]">
                <p>
                  <CalendarDays className="mr-2 inline" size={16} />
                  {days[selectedEvent.day]}
                </p>
                <p>
                  <Clock className="mr-2 inline" size={16} />
                  {selectedEvent.start}:00 – {selectedEvent.end}:00
                </p>
                <p>
                  <BookOpen className="mr-2 inline" size={16} />
                  {selectedEvent.batch}
                </p>
              </div>

              {isTeacher && (
                <button
                  onClick={() => alert('Connect your class management API')}
                  className="mt-6 w-full rounded-xl bg-[#6D5BD0] py-3 text-sm font-bold text-white transition hover:bg-[#5947BC]"
                >
                  Manage Class
                </button>
              )}

              {!isTeacher && (
                <button
                  onClick={() => alert('Connect your class join API')}
                  className="mt-6 w-full rounded-xl bg-[#6D5BD0] py-3 text-sm font-bold text-white transition hover:bg-[#5947BC]"
                >
                  View Class
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
