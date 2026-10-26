import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save, Link as LinkIcon } from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

const CLASS_TYPES = [
  { value: '1', label: 'Online Class' },
  { value: '2', label: 'Offline Class' },
  { value: '3', label: 'Recorded' },
];

export default function EditScheduleModal({ isOpen, schedule, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    dayOfWeek: '1',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '10:00',
    classType: '1',
    meetingLink: '',
  });

  // Populate form data when modal opens
  useEffect(() => {
    if (isOpen && schedule) {
      // 1. Map Day of Week safely
      let dayStr = '1'; // Default Monday
      if (typeof schedule.dayOfWeek === 'number') {
        dayStr = String(schedule.dayOfWeek);
      } else if (typeof schedule.dayOfWeek === 'string') {
        const found = DAYS_OF_WEEK.find(d => d.label.toLowerCase() === schedule.dayOfWeek.toLowerCase());
        if (found) dayStr = found.value;
      }

      // 2. Map Class Type safely (String or Number to Enum 1, 2, 3)
      let classTypeStr = '1'; // Default Online
      if (typeof schedule.classType === 'number') {
        classTypeStr = String(schedule.classType);
      } else if (typeof schedule.classType === 'string') {
        const ct = schedule.classType.toLowerCase().trim();
        if (ct === 'online' || ct === 'online class' || ct === '1') classTypeStr = '1';
        else if (ct === 'offline' || ct === 'offline class' || ct === '2') classTypeStr = '2';
        else if (ct === 'recorded' || ct === '3') classTypeStr = '3';
      }

      // 3. Format Dates safely
      const formatForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
          return new Date(dateStr).toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      // 4. Format Time safely (HH:mm)
      const formatTimeForInput = (timeStr) => {
        if (!timeStr) return '09:00';
        return timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr;
      };

      setFormData({
        dayOfWeek: dayStr,
        startDate: formatForInput(schedule.startDate),
        endDate: formatForInput(schedule.endDate),
        startTime: formatTimeForInput(schedule.startTime),
        endTime: formatTimeForInput(schedule.endTime),
        classType: classTypeStr,
        meetingLink: schedule.meetingLink || '',
      });
    }
  }, [isOpen, schedule]);

  if (!isOpen || !schedule) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format for Backend DTO
    const formatTime = (timeStr) => {
      if (!timeStr) return "00:00:00";
      return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    };

    // Ensure we send valid numbers, never NaN
    const payload = {
      dayOfWeek: Number(formData.dayOfWeek) || 1,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
      classType: Number(formData.classType) || 1, // If NaN, fallback to 1
      meetingLink: formData.meetingLink || null,
    };

    onSubmit(schedule.batchId, schedule.id, payload);
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
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Schedule</h2>
              <p className="text-sm text-gray-500">Update class schedule for {schedule.batchName}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <form id="edit-schedule-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Day of Week *</label>
                  <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm bg-white">
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Class Type *</label>
                  <select name="classType" value={formData.classType} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm bg-white">
                    {CLASS_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Start Date *</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">End Date (Optional)</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Start Time *</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">End Time *</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Meeting Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" placeholder="https://meet.google.com/..." />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
            <button 
              type="submit" 
              form="edit-schedule-form" 
              disabled={isLoading} 
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] flex items-center gap-2 shadow-lg disabled:opacity-70 transition-all"
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