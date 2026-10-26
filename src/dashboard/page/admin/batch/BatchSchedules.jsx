import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ViewScheduleModal from './ViewScheduleModal'; 
import EditScheduleModal from './EditScheduleModal';
import BatchScheduleListModal from './BatchScheduleListModal'; // NAYA MODAL IMPORT
import { 
  Loader2, Search, X, ChevronLeft, ChevronRight, 
  Calendar, Clock, Users, Video, Plus, Eye, Edit, ArrowLeft, List 
} from 'lucide-react';
import { useBatchSchedules } from '../../../hooks/useBatchSchedules';
import ToastNotification from '../../../../ui/ToastNotification';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BatchSchedules() {
  const { batchId } = useParams(); 
  const navigate = useNavigate();

  const { 
    schedules, isLoading, error, 
    pageNumber, totalPages, totalCount, setPageNumber,
    filters, updateFilter,
    handleToggleStatus, togglingId,
    handleUpdateSchedule,
    refetch 
  } = useBatchSchedules(10, batchId);

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));
  
  const [viewModal, setViewModal] = useState({ isOpen: false, scheduleId: null });
  const [editModal, setEditModal] = useState({ isOpen: false, schedule: null });
  
  // NAYA STATE: List Modal ke liye
  const [listModal, setListModal] = useState({ isOpen: false, batchId: null, batchName: '' });

  const onToggle = async (bId, scheduleId) => {
    const res = await handleToggleStatus(bId, scheduleId);
    if (!res.success) {
      showToast('error', 'Status Update Failed', res.error);
    } else {
      showToast('success', 'Status Updated', 'Schedule status changed successfully.');
    }
  };

  const onEditSubmit = async (bId, scheduleId, payload) => {
    const res = await handleUpdateSchedule(bId, scheduleId, payload);
    if (res.success) {
      showToast('success', 'Schedule Updated', 'Class schedule has been updated successfully.');
      setEditModal({ isOpen: false, schedule: null });
    } else {
      showToast('error', 'Update Failed', res.error);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (!batchId) return true; 
    const matchSearch = !filters.search || schedule.batchName?.toLowerCase().includes(filters.search.toLowerCase());
    const matchDay = !filters.dayOfWeek || schedule.dayOfWeek === filters.dayOfWeek;
    const matchStatus = filters.isActive === '' || String(schedule.isActive) === filters.isActive;
    return matchSearch && matchDay && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          {batchId && (
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {batchId ? (schedules[0]?.batchName || 'Batch') + ' Schedules' : 'All Batch Schedules'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {batchId ? `Manage timetables for this specific batch.` : 'Manage timetables and class schedules across all batches.'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate(batchId ? `/admin/schedules/create?batchId=${batchId}` : '/admin/schedules/create')} 
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all whitespace-nowrap"
        >
          <Plus size={18} /> Add Schedule
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between">
        <div className="relative w-full lg:w-96 flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input type="text" placeholder="Search schedule..." value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm" />
          {filters.search && <button onClick={() => updateFilter('search', '')} className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={16} /></button>}
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={filters.dayOfWeek} onChange={(e) => updateFilter('dayOfWeek', e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed]">
            <option value="">All Days</option>
            {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
          </select>
          <select value={filters.isActive} onChange={(e) => updateFilter('isActive', e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed]">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Batch / Course</th>
                <th className="p-4 font-semibold">Day & Time</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="p-10 text-center"><Loader2 className="animate-spin text-[#7c3aed] mx-auto" size={32} /></td></tr>
              ) : filteredSchedules.length === 0 ? (
                <tr><td colSpan="6" className="p-16 text-center text-gray-500">No schedules found.</td></tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <motion.tr key={schedule.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`border-b border-gray-50 hover:bg-gray-50/50 ${togglingId === schedule.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    
                    <td className="p-4">
                      <p className="font-bold text-gray-800 text-base">{schedule.batchName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{schedule.courseName || ''}</p>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded w-max">{schedule.dayOfWeek || 'N/A'}</span>
                        <span className="text-xs text-gray-600 flex items-center gap-1"><Clock size={12}/> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Calendar size={12}/> From: {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : 'N/A'}</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> To: {schedule.endDate ? new Date(schedule.endDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        {schedule.classType === 'Online' || schedule.classType === '1' ? <Video size={14} className="text-blue-500"/> : <Users size={14} className="text-orange-500"/>}
                        {schedule.classType || 'N/A'}
                      </span>
                      {schedule.meetingLink && (
                        <a href={schedule.meetingLink} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block truncate max-w-[150px]">Join Meeting</a>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <button onClick={() => onToggle(schedule.batchId, schedule.id)} disabled={togglingId === schedule.id} className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${schedule.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${schedule.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        {togglingId === schedule.id && <Loader2 className="absolute inset-0 m-auto text-white animate-spin" size={12} />}
                      </button>
                      <p className="text-[10px] font-bold mt-1 text-gray-500 uppercase">{schedule.isActive ? 'Active' : 'Inactive'}</p>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* NAYA BUTTON: View All Schedules for this Batch */}
                        <button 
                          onClick={() => setListModal({ isOpen: true, batchId: schedule.batchId, batchName: schedule.batchName })} 
                          className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" 
                          title="View All Schedules for this Batch"
                        >
                          <List size={18} />
                        </button>

                        <button onClick={() => setViewModal({ isOpen: true, scheduleId: schedule.id })} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="View Details">
                          <Eye size={18} />
                        </button>
                        
                        <button onClick={() => setEditModal({ isOpen: true, schedule })} className="p-2 text-[#7c3aed] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors" title="Edit Schedule">
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!batchId && !isLoading && totalCount > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-2xl">
            <p className="text-sm text-gray-500">Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> schedules</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"><ChevronLeft size={18} /></button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPageNumber(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-semibold ${pageNumber === i + 1 ? 'bg-[#7c3aed] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewScheduleModal 
        isOpen={viewModal.isOpen}
        scheduleId={viewModal.scheduleId}
        onClose={() => setViewModal({ isOpen: false, scheduleId: null })}
      />

      <EditScheduleModal 
        isOpen={editModal.isOpen}
        schedule={editModal.schedule}
        isLoading={togglingId === editModal.schedule?.id}
        onClose={() => setEditModal({ isOpen: false, schedule: null })}
        onSubmit={onEditSubmit}
      />

      {/* NAYA LIST MODAL */}
      <BatchScheduleListModal 
        isOpen={listModal.isOpen}
        batchId={listModal.batchId}
        batchName={listModal.batchName}
        onClose={() => setListModal({ isOpen: false, batchId: null, batchName: '' })}
      />
    </div>
  );
}