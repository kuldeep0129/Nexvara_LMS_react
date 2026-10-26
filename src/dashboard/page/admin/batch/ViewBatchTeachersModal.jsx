import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Users, ShieldCheck, Calendar, Mail, AlertCircle } from 'lucide-react';
import { teacherAssignService } from '../../../services/teacherAssignService';
import ToastNotification from '../../../../ui/ToastNotification';

export default function ViewBatchTeachersModal({ isOpen, batchId, batchName, onClose }) {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // NAYA: Toggle Loading State
  const [updatingId, setUpdatingId] = useState(null);

  // Toast State
  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Fetch initial data
  useEffect(() => {
    if (!isOpen || !batchId) return;

    const fetchTeachers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await teacherAssignService.getBatchTeachers(batchId);
        setTeachers(data);
      } catch (err) {
        setError(err.message || 'Failed to load teachers.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [isOpen, batchId]);

  if (!isOpen) return null;

  // NAYA: Toggle Handler
  const handleToggleStatus = async (teacherId) => {
    setUpdatingId(teacherId);
    try {
      await teacherAssignService.updateTeacherStatus(batchId, teacherId);
      
      // Update local state to reflect the change instantly without refetching
      setTeachers(prev => prev.map(t => 
        t.teacherId === teacherId ? { ...t, isActive: !t.isActive } : t
      ));
      
      showToast('success', 'Status Updated', 'Teacher status changed successfully.');
    } catch (err) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 text-[#7c3aed] rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Assigned Teachers</h2>
                <p className="text-sm text-gray-500 truncate max-w-[300px]">Batch: {batchName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="animate-spin text-[#7c3aed] mb-4" size={40} />
                <p className="text-gray-500 font-medium">Fetching teachers list...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle size={40} className="mb-2" />
                <p className="font-semibold">{error}</p>
              </div>
            ) : teachers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Users size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700">No Teachers Assigned</h3>
                <p className="text-sm mt-1">This batch doesn't have any teachers assigned yet.</p>
              </div>
            ) : (
              <motion.div 
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-4"
              >
                {teachers.map((teacher) => (
                  <motion.div 
                    key={teacher.id}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${updatingId === teacher.teacherId ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'}`}
                  >
                    {/* Left side: Avatar & Details */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 text-[#7c3aed] flex items-center justify-center text-lg font-bold border-2 border-white shadow-sm overflow-hidden shrink-0 relative">
                        <span className="absolute">{teacher.teacherName?.charAt(0)?.toUpperCase() || 'T'}</span>
                        
                        {teacher.profileImageUrl && (
                          <img 
                            src={teacher.profileImageUrl.includes('http') ? teacher.profileImageUrl : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/${teacher.profileImageUrl}`} 
                            alt={teacher.teacherName}
                            className="w-full h-full object-cover relative z-10"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800 text-base">{teacher.teacherName}</p>
                          {teacher.isPrimary && (
                            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                              <ShieldCheck size={12} /> PRIMARY
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail size={14} /> {teacher.teacherEmail}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Status Toggle & Date */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                      
                      <div className="flex flex-col items-end">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> Assigned: {formatDate(teacher.assignedAt)}
                        </p>
                      </div>

                      {/* NAYA: TOGGLE SWITCH */}
                      <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                        <span className={`text-xs font-bold uppercase ${teacher.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {teacher.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(teacher.teacherId)}
                          disabled={updatingId === teacher.teacherId}
                          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${teacher.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${teacher.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                          {updatingId === teacher.teacherId && <Loader2 className="absolute inset-0 m-auto text-white animate-spin" size={12} />}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </motion.div>
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