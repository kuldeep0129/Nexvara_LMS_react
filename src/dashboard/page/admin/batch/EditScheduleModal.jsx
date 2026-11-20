import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Clock, Calendar, Video, Link as LinkIcon, Save } from 'lucide-react';
import { batchScheduleService } from '../../../services/batchScheduleService'; // Path check kar lein

// C# DayOfWeek Enum mapping (0 = Sunday, 1 = Monday, etc.)
const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

// C# ScheduleClassType Enum mapping
const CLASS_TYPES = [
  { value: '1', label: 'Online Class' },
  { value: '2', label: 'Offline Class' },
  { value: '3', label: 'Recorded' },
];

// PROPS UPDATED: schedule prop hata kar scheduleId aur batchId add kiya
export default function EditScheduleModal({ isOpen, scheduleId, batchId, batchName, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    dayOfWeek: '1',
    startTime: '',
    endTime: '',
    classType: '1',
    meetingLink: '',
  });

  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  // Helper: Convert TimeSpan "18:00:00" to input time "18:00"
  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); 
  };

  // Fetch fresh data from API when modal opens
  useEffect(() => {
    const fetchScheduleDetails = async () => {
      // Check if scheduleId is valid
      if (!isOpen || !scheduleId) return;

      setIsFetching(true);
      setError('');
      
      try {
        const response = await batchScheduleService.getScheduleById(scheduleId);
        
        // API Response structure: { data: { ... }, success: true }
        const data = response.data || response;
        
        if (!data) throw new Error('No data received');

        // Map day of week
        let dayValue = '1';
        if (typeof data.dayOfWeek === 'number') {
          dayValue = String(data.dayOfWeek);
        } else if (typeof data.dayOfWeek === 'string') {
           dayValue = DAYS_OF_WEEK.find(d => d.label.toLowerCase() === data.dayOfWeek.toLowerCase())?.value || '1';
        }

        // Map classType
        let classTypeValue = '1';
        if (typeof data.classType === 'number') {
          classTypeValue = String(data.classType);
        } else if (typeof data.classType === 'string') {
          const t = data.classType.toLowerCase();
          if (t === 'online' || t === 'live') classTypeValue = '1';
          else if (t === 'offline') classTypeValue = '2';
          else if (t === 'recorded') classTypeValue = '3';
        }

        setFormData({
          dayOfWeek: dayValue,
          startTime: formatTimeForInput(data.startTime),
          endTime: formatTimeForInput(data.endTime),
          classType: classTypeValue,
          meetingLink: data.meetingLink || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load schedule details.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchScheduleDetails();
  }, [isOpen, scheduleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.startTime || !formData.endTime) {
      return setError('Start and End time are required.');
    }

    const formatTimeSpan = (timeStr) => {
      if (!timeStr) return "00:00:00";
      return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    };

    const payload = {
      dayOfWeek: Number(formData.dayOfWeek),
      startTime: formatTimeSpan(formData.startTime),
      endTime: formatTimeSpan(formData.endTime),
      classType: Number(formData.classType),
      meetingLink: formData.meetingLink || null,
    };

    // Pass data up to the parent component using batchId and scheduleId props
    onSubmit(batchId, scheduleId, payload);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Schedule</h2>
              <p className="text-sm text-gray-500 mt-1">Update class timing and details.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar relative">
            
            {/* Loading Overlay */}
            {isFetching && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-b-3xl">
                <Loader2 className="animate-spin text-[#7c3aed] mb-2" size={32} />
                <p className="text-sm text-gray-500 font-medium">Fetching latest details...</p>
              </div>
            )}

            {/* Day & Class Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <Calendar size={16} className="text-[#7c3aed]" /> Day of Week *
                </label>
                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                  disabled={isFetching}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm bg-white disabled:opacity-60"
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <Video size={16} className="text-[#7c3aed]" /> Class Type *
                </label>
                <select
                  name="classType"
                  value={formData.classType}
                  onChange={handleChange}
                  required
                  disabled={isFetching}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm bg-white disabled:opacity-60"
                >
                  {CLASS_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <Clock size={16} className="text-[#7c3aed]" /> Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  disabled={isFetching}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                  <Clock size={16} className="text-[#7c3aed]" /> End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  disabled={isFetching}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
                <LinkIcon size={16} className="text-[#7c3aed]" /> Meeting Link
              </label>
              <input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                disabled={isFetching}
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm disabled:opacity-60"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
                {error}
              </div>
            )}
            
            {/* Batch Name Display */}
            {batchName && (
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100">
                Editing schedule for <strong>{batchName}</strong>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
              disabled={isLoading || isFetching}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || isFetching}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}