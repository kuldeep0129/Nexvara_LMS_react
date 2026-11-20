import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import ViewScheduleModal from './ViewScheduleModal';
import EditScheduleModal from './EditScheduleModal';
import BatchScheduleListModal from './BatchScheduleListModal';
import BatchSchedulesQuickViewModal from './BatchSchedulesQuickViewModal';
import {
  Loader2, Search, X, ChevronLeft, ChevronRight,
  Calendar, Users, Video, Plus, Eye, ArrowLeft,
  Settings, MonitorPlay, Briefcase, ChevronDown
} from 'lucide-react';
import { useBatchSchedules } from '../../../hooks/useBatchSchedules';
import ToastNotification from '../../../../ui/ToastNotification';
import { formatTime, formatDisplayDate } from '../../../data/dateHelpers';

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
  // Manage button se open hone wala modal (Single Schedule Edit)
  const [editModal, setEditModal] = useState({ isOpen: false, scheduleId: null, batchId: null, batchName: '' });
  
  const [listModal, setListModal] = useState({ isOpen: false, batchId: null, batchName: '' });
  const [quickView, setQuickView] = useState({ isOpen: false, schedules: [], batchName: '' });

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
      setEditModal({ isOpen: false, scheduleId: null, batchId: null, batchName: '' });
    } else {
      showToast('error', 'Update Failed', res.error);
    }
  };

  // Helper to get nested schedules
  const getBatchSchedules = (schedule) => {
    if (Array.isArray(schedule.schedules) && schedule.schedules.length > 0) {
      return schedule.schedules;
    }
    return [schedule];
  };

  // Handle Manage Button Click
  const handleManageClick = (batch) => {
    const batchSchedules = getBatchSchedules(batch);
    // Kyunki "Manage" edit karne ke liye hai, hum pehli schedule pick kar rahe hain
    const firstSchedule = batchSchedules[0];
    
    if (!firstSchedule) {
      return showToast('error', 'Error', 'No schedule found for this batch.');
    }

    setEditModal({
      isOpen: true,
      scheduleId: firstSchedule.id,
      batchId: batch.batchId || firstSchedule.batchId,
      batchName: batch.batchName || firstSchedule.batchName,
    });
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (!batchId) return true;
    const matchSearch = !filters.search || schedule.batchName?.toLowerCase().includes(filters.search.toLowerCase());
    const matchDay = !filters.dayOfWeek || schedule.dayOfWeek === filters.dayOfWeek;
    const matchStatus = filters.isActive === '' || String(schedule.isActive) === filters.isActive;
    return matchSearch && matchDay && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#f8fafc] min-h-screen">
      
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          {batchId && (
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
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
          <input 
            type="text" 
            placeholder="Search batch or course..." 
            value={filters.search} 
            onChange={(e) => updateFilter('search', e.target.value)} 
            className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm" 
          />
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

      {/* Card Grid Section */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-[#7c3aed]" size={36} />
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-500">
            No schedules found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredSchedules.map((batch, idx) => {
              const batchSchedules = getBatchSchedules(batch);
              const first = batchSchedules[0] || {};
              
              // Data mapping based on your API response
              const courseImage = first.imageUrl || 'https://via.placeholder.com/150?text=No+Image';
              const startDate = formatDisplayDate(first.startDate);
              const endDate = formatDisplayDate(first.endDate);
              const isActive = first.isActive ?? false;
              const enrolled = first.enrolledStudent ?? 0;
              const total = first.totalStuentSheet ?? 30;
              const teachers = first.teacherName ? [first.teacherName] : []; 
              const isOnline = String(first.classType).toLowerCase() === 'online' || String(first.classType).toLowerCase() === 'live';

              return (
                <motion.div
                  key={batch.batchId || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl border border-blue-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden flex flex-col relative"
                >
                  {/* Top Section */}
                  <div className="p-5 flex gap-5">
                    {/* Image Box */}
                    <div className="relative shrink-0 w-[130px] h-[130px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1f36] to-[#2d3756] shadow-sm flex items-center justify-center">
                      <span className="absolute top-0 left-0 bg-[#8b5cf6] text-white text-[10px] font-bold px-2.5 py-1 rounded-br-xl z-10 flex items-center gap-1">
                         ★ Featured
                      </span>
                      <img 
                        src={courseImage} 
                        alt={batch.batchName} 
                        className="w-full h-full object-cover opacity-90"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=.NET' }}
                      />
                    </div>

                    {/* Info Box */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-900 truncate pr-2" title={batch.batchName}>
                            {batch.batchName}
                          </h3>
                          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                            <span className="font-bold tracking-widest text-lg leading-none">...</span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {batch.courseName || first.courseName || 'Full Stack Development Program'}
                        </p>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <Calendar size={16} className="text-[#7c3aed]" />
                          <span>{startDate} <span className="text-gray-400 mx-1">→</span> {endDate}</span>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Divider */}
                  <div className="w-full h-px bg-gray-100"></div>

                  {/* Stats Row */}
                  <div className="px-6 py-4 flex items-center justify-between">
                    {/* Students Stat */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900 leading-none">
                          {enrolled} <span className="text-gray-400 font-medium text-sm">/ {total}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Students</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-10 bg-gray-100 mx-2"></div>

                    {/* Teachers Stat */}
                    <div className="flex items-center gap-3 flex-1 justify-center">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <MonitorPlay size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900 leading-none">
                          {teachers.length || 1}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Teachers</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-10 bg-gray-100 mx-2"></div>

                    {/* Batch Type Stat */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900 leading-none">
                          {first.classType || 'Live'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Batch Type</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-6 pb-4">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min((enrolled / total) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer Area */}
                  <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between mt-auto">
                    {/* Avatars (Mockup for showing enrolled students) */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((_, i) => (
                          <img 
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-200"
                            src={`https://i.pravatar.cc/100?img=${i + 10}`}
                            alt="student"
                          />
                        ))}
                        {enrolled > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                            +{enrolled - 3}
                          </div>
                        )}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-semibold text-gray-700">{enrolled} Students</p>
                        <p className="text-[10px] text-gray-500">Enrolled</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setQuickView({ isOpen: true, schedules: batchSchedules, batchName: batch.batchName })}
                        className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#7c3aed] text-[#7c3aed] rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors"
                      >
                        <Eye size={16} /> View Batch
                      </button>
                      
                      {/* MANAGE BUTTON: Ab yeh popup open karega aur API call hogi */}
                      <button 
                        onClick={() => handleManageClick(batch)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl font-bold text-sm hover:bg-[#6d28d9] transition-colors shadow-md shadow-purple-500/20"
                      >
                        <Settings size={16} /> Manage <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!batchId && !isLoading && totalCount > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of{' '}
            <span className="font-semibold">{totalCount}</span> batches
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPageNumber(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                    pageNumber === i + 1
                      ? 'bg-[#7c3aed] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber === totalPages}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewScheduleModal
        isOpen={viewModal.isOpen}
        scheduleId={viewModal.scheduleId}
        onClose={() => setViewModal({ isOpen: false, scheduleId: null })}
      />

      {/* Yahan Humne Pass Kiya Schedule ID jo Modal ke andar API call karega */}
      <EditScheduleModal
        isOpen={editModal.isOpen}
        scheduleId={editModal.scheduleId}
        batchId={editModal.batchId}
        batchName={editModal.batchName}
        isLoading={togglingId === editModal.scheduleId}
        onClose={() => setEditModal({ isOpen: false, scheduleId: null, batchId: null, batchName: '' })}
        onSubmit={onEditSubmit}
      />

      <BatchScheduleListModal
        isOpen={listModal.isOpen}
        batchId={listModal.batchId}
        batchName={listModal.batchName}
        onClose={() => setListModal({ isOpen: false, batchId: null, batchName: '' })}
      />

      <BatchSchedulesQuickViewModal
        isOpen={quickView.isOpen}
        schedules={quickView.schedules}
        batchName={quickView.batchName}
        onClose={() => setQuickView({ isOpen: false, schedules: [], batchName: '' })}
      />
    </div>
  );
}