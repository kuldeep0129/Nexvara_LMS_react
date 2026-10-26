import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Loader2, Calendar, Clock, Video, Users, CheckCircle2, Link as LinkIcon 
} from 'lucide-react';
import { batchScheduleService } from '../../../services/batchScheduleService';
import { batchService } from '../../../services/batchService';
import ToastNotification from '../../../../ui/ToastNotification';

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

// Assuming standard Enum values for ClassType (Check backend to confirm exact numbers)
const CLASS_TYPES = [
  { value: '1', label: 'Online Class' },
  { value: '2', label: 'Offline Class' },
  { value: '3', label: 'Recorded' },
];

export default function CreateSchedule() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    batchId: '',
    dayOfWeek: '1', // Monday
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    classType: '1', // Online
    meetingLink: '',
  });

  const [batches, setBatches] = useState([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Fetch batches for the dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await batchService.getBatchesList(1, 100);
        setBatches(res.data?.items || []);
      } catch (err) {
        setError('Failed to load batches dropdown.');
      } finally {
        setIsLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.batchId) {
      return showToast('error', 'Validation Error', 'Please select a batch.');
    }

    setIsSaving(true);
    setError('');

    try {
      // 1. Format Time to TimeSpan format ("HH:mm:00")
      const formatTime = (timeStr) => {
        if (!timeStr) return "00:00:00";
        return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
      };

      // 2. Prepare payload according to DTO
      const payload = {
        dayOfWeek: Number(formData.dayOfWeek),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        startTime: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime),
        classType: Number(formData.classType),
        meetingLink: formData.meetingLink || null,
      };

      await batchScheduleService.createSchedule(formData.batchId, payload);
      
      showToast('success', 'Schedule Created!', 'The class schedule has been successfully created.');
      
      setTimeout(() => {
        navigate('/admin/schedules');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to create schedule.');
      showToast('error', 'Creation Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/schedules')} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Schedule</h1>
            <p className="text-gray-500 text-sm mt-1">Add a new class schedule for a specific batch.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: Batch Selection */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <Users className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Select Batch</h2>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Target Batch *</label>
              <select 
                name="batchId" 
                value={formData.batchId} 
                onChange={handleChange} 
                required 
                disabled={isLoadingBatches}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none bg-white text-sm"
              >
                <option value="">{isLoadingBatches ? "Loading batches..." : "Choose a Batch"}</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* SECTION 2: Schedule Details */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <Calendar className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Schedule Details</h2>
            </div>
            
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
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">End Time *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm text-gray-700" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* SECTION 3: Meeting Link */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <Video className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Virtual Classroom</h2>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Meeting Link (Zoom/Google Meet)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" placeholder="https://meet.google.com/..." />
              </div>
              <p className="text-xs text-gray-500 mt-1">Required only if the class is Online.</p>
            </div>
          </motion.div>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}

          {/* Submit */}
          <motion.div variants={fadeInUp} className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving || isLoadingBatches} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isSaving ? 'Creating Schedule...' : 'Create Schedule'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </>
  );
}