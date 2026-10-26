import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Calendar, Clock, Video, Users, AlertCircle } from 'lucide-react';
import { batchScheduleService } from '../../../services/batchScheduleService';

export default function BatchScheduleListModal({ isOpen, batchId, batchName, onClose }) {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !batchId) return;

    const fetchSchedules = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await batchScheduleService.getSchedulesByBatchId(batchId);
        const data = res.data || res;
        const items = Array.isArray(data) ? data : (data.items || []);
        setSchedules(items);
      } catch (err) {
        setError(err.message || 'Failed to load batch schedules.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [isOpen, batchId]);

  if (!isOpen) return null;

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${minute} ${ampm}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Batch Schedules</h2>
              <p className="text-sm text-gray-500">All class schedules for <span className="font-semibold text-[#7c3aed]">{batchName || `Batch ID: ${batchId}`}</span></p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="animate-spin text-[#7c3aed] mb-4" size={40} />
                <p className="text-gray-500 text-sm font-medium">Fetching schedules...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle size={40} className="mb-2" />
                <p className="font-semibold">{error}</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <Calendar size={40} className="mb-2 text-gray-300" />
                <p className="font-semibold text-lg">No schedules found</p>
                <p className="text-sm">This batch doesn't have any schedules yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                      <th className="p-4 font-semibold">Day</th>
                      <th className="p-4 font-semibold">Time</th>
                      <th className="p-4 font-semibold">Duration</th>
                      <th className="p-4 font-semibold">Type</th>
                      <th className="p-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4">
                          <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                            {schedule.dayOfWeek || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-700 flex items-center gap-1.5 mt-2">
                          <Clock size={14} className="text-gray-400"/> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 text-xs text-gray-600">
                            <span>From: {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : 'N/A'}</span>
                            <span>To: {schedule.endDate ? new Date(schedule.endDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            {schedule.classType === 'Online' || schedule.classType === '1' ? <Video size={14} className="text-blue-500"/> : <Users size={14} className="text-orange-500"/>}
                            {schedule.classType || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${schedule.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {schedule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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