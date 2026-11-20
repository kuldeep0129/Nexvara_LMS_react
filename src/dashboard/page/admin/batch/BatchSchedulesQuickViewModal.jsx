import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Clock, Video, Users, CheckCircle2, XCircle,
  BookOpen, ListChecks
} from 'lucide-react';
import { formatTime, formatDisplayDate } from '../../../data/dateHelpers';

const getClassTypeLabel = (type) => {
  if (typeof type === 'string') {
    const t = type.toLowerCase().trim();
    if (t === 'live' || t === 'online' || t === 'online class' || t === '1') return 'Online Class';
    if (t === 'offline' || t === 'offline class' || t === '2') return 'Offline Class';
    if (t === 'recorded' || t === '3') return 'Recorded';
  }
  const map = { 1: 'Online Class', 2: 'Offline Class', 3: 'Recorded' };
  return map[type] || type || 'N/A';
};

export default function BatchSchedulesQuickViewModal({ isOpen, schedules = [], batchName, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#7c3aed] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ListChecks size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">All Schedules</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <BookOpen size={14} className="text-[#7c3aed]" />
                  <span className="font-semibold text-[#7c3aed]">{batchName || 'Batch'}</span>
                  <span className="text-gray-400">•</span>
                  <span>{schedules.length} schedule{schedules.length !== 1 ? 's' : ''}</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
            {schedules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Calendar size={40} className="mb-2 text-gray-300" />
                <p className="font-semibold">No schedules found for this batch</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((s, idx) => {
                  const typeLabel = getClassTypeLabel(s.classType);
                  const isOnline = typeLabel === 'Online Class';
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                          {isOnline ? <Video size={18} /> : <Users size={18} />}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                              {s.dayOfWeek || 'N/A'}
                            </span>
                            <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                              <Clock size={14} className="text-gray-400" />
                              {formatTime(s.startTime)} - {formatTime(s.endTime)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> From {formatDisplayDate(s.startDate)}
                            </span>
                            <span>To {s.endDate ? formatDisplayDate(s.endDate) : 'N/A'}</span>
                            <span className="text-gray-400">•</span>
                            <span>{typeLabel}</span>
                          </div>
                          {s.meetingLink && (
                            <a
                              href={s.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-500 hover:underline mt-1 block truncate max-w-[260px]"
                            >
                              {s.meetingLink}
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        {s.isActive ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}