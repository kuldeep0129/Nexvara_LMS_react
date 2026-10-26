import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Loader2, Calendar, Clock, Users, Video, CheckCircle2, XCircle, 
  ExternalLink, BookOpen, AlertCircle 
} from 'lucide-react';
import { batchScheduleService } from '../../../services/batchScheduleService';

export default function ViewScheduleModal({ isOpen, scheduleId, onClose }) {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !scheduleId) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await batchScheduleService.getScheduleById(scheduleId);
        setSchedule(res.data || res);
      } catch (err) {
        setError(err.message || 'Failed to load schedule details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, scheduleId]);

  if (!isOpen) return null;

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${minute} ${ampm}`;
  };

  const getClassTypeName = (type) => {
    // Enum mapping: 1 = Online, 2 = Offline, 3 = Recorded (Adjust based on your backend)
    const types = { 1: 'Online Class', 2: 'Offline Class', 3: 'Recorded' };
    return types[type] || type || 'N/A';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#7c3aed] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Schedule Details</h2>
                <p className="text-sm text-gray-500">View complete class information.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="animate-spin text-[#7c3aed] mb-4" size={40} />
                <p className="text-gray-500 text-sm font-medium">Fetching schedule details...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle size={40} className="mb-2" />
                <p className="font-semibold">{error}</p>
              </div>
            ) : schedule ? (
              <div className="space-y-6">
                
                {/* Top Banner (Batch & Status) */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Batch Name</p>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <BookOpen size={18} className="text-[#7c3aed]" /> 
                      {schedule.batchName || 'N/A'}
                    </h3>
                  </div>
                  <div>
                    {schedule.isActive ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold border border-green-200">
                        <CheckCircle2 size={16} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-bold border border-red-200">
                        <XCircle size={16} /> Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Day */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Day of Week</p>
                    <p className="font-semibold text-gray-800 text-base capitalize">{schedule.dayOfWeek || 'N/A'}</p>
                  </div>

                  {/* Class Type */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Class Type</p>
                    <p className="font-semibold text-gray-800 text-base flex items-center gap-2">
                      {getClassTypeName(schedule.classType) === 'Online Class' ? <Video size={16} className="text-blue-500"/> : <Users size={16} className="text-orange-500"/>}
                      {getClassTypeName(schedule.classType)}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Time Slot</p>
                    <p className="font-semibold text-gray-800 text-base flex items-center gap-2">
                      <Clock size={16} className="text-[#7c3aed]" />
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Duration</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {formatDate(schedule.startDate)} {schedule.endDate ? ` to ${formatDate(schedule.endDate)}` : '(Ongoing)'}
                    </p>
                  </div>

                </div>

                {/* Meeting Link */}
                {schedule.meetingLink && (
                  <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-500 uppercase mb-2">Meeting Link</p>
                    <a 
                      href={schedule.meetingLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#7c3aed] font-semibold hover:underline break-all"
                    >
                      <ExternalLink size={16} /> Join Virtual Classroom
                    </a>
                  </div>
                )}

              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}