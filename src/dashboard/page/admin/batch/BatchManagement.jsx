import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Search, X, ChevronLeft, ChevronRight, MoreVertical, 
  Plus, Eye, Edit, RefreshCw, UploadCloud, Archive, Users, UserCheck, Calendar, AlertTriangle
} from 'lucide-react';
import { useBatches } from '../../../hooks/useBatches';
import ToastNotification from '../../../../ui/ToastNotification';
import ChangeStatusModal from './ChangeStatusModal'; // NAYA IMPORT

export default function BatchManagement() {
  const { 
    batches, isLoading, error, pageNumber, totalPages, totalCount, setPageNumber,
    handleDeleteBatch, actionLoadingId, handleTogglePublish, handleUpdateStatus
  } = useBatches();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [filters, setFilters] = useState({ course: 'All', status: 'All', published: 'All', active: 'All' });
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, batchId: null, batchName: '' });
  const [statusModal, setStatusModal] = useState({ isOpen: false, batch: null }); // NAYA STATE

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBatches = batches.filter((batch) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      (batch.name || '').toLowerCase().includes(query) ||
      (batch.code || '').toLowerCase().includes(query) ||
      (batch.courseName || '').toLowerCase().includes(query);

    const matchesCourse = filters.course === 'All' || batch.courseName === filters.course;
    
    // Status filter ko number aur string dono ke liye handle karein
    const statusStr = String(batch.status).toLowerCase();
    const matchesStatus = filters.status === 'All' || statusStr === filters.status.toLowerCase();

    const matchesPublished = filters.published === 'All' || String(batch.isPublished) === filters.published;
    const matchesActive = filters.active === 'All' || String(batch.isActive) === filters.active;

    return matchesSearch && matchesCourse && matchesStatus && matchesPublished && matchesActive;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'active' || s === '3') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'upcoming' || s === '2') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'completed' || s === '4') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (s === 'cancelled' || s === '5') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200'; // Draft
  };

  const openDeleteModal = (batch) => {
    setActiveDropdown(null); 
    setDeleteModal({ isOpen: true, batchId: batch.id, batchName: batch.name });
  };

  const openStatusModal = (batch) => {
    setActiveDropdown(null);
    setStatusModal({ isOpen: true, batch });
  };

  const confirmDelete = async () => {
    const result = await handleDeleteBatch(deleteModal.batchId);
    if (result.success) {
      showToast('success', 'Batch Archived', `"${deleteModal.batchName}" has been archived successfully.`);
      setDeleteModal({ isOpen: false, batchId: null, batchName: '' });
    } else {
      showToast('error', 'Action Failed', result.error);
    }
  };

  const confirmStatusChange = async (id, newStatus) => {
    const result = await handleUpdateStatus(id, newStatus);
    if (result.success) {
      showToast('success', 'Status Updated', `Batch status changed successfully.`);
      setStatusModal({ isOpen: false, batch: null });
    } else {
      showToast('error', 'Action Failed', result.error);
    }
  };

  const handlePublishToggle = async (batch) => {
    setActiveDropdown(null);
    const result = await handleTogglePublish(batch.id, batch.isPublished);
    if (result.success) {
      const actionText = batch.isPublished ? 'unpublished' : 'published';
      showToast('success', 'Status Updated', `Batch "${batch.name}" has been ${actionText} successfully.`);
    } else {
      showToast('error', 'Action Failed', result.error);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Batch Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all course batches, schedules, and status.</p>
        </div>
        <button onClick={() => navigate('/admin/batches/add')} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all whitespace-nowrap">
          <Plus size={18} /> Add Batch
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 justify-between">
        <div className="relative w-full xl:w-96 flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input type="text" placeholder="Search batch name, code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm" />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={16} /></button>}
        </div>

        <div className="flex flex-wrap gap-3">
          <select name="course" value={filters.course} onChange={handleFilterChange} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed]">
            <option value="All">All Courses</option>
            {[...new Set(batches.map(b => b.courseName))].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed]">
            <option value="All">All Status</option>
            <option value="1">Draft</option>
            <option value="2">Upcoming</option>
            <option value="3">Active</option>
            <option value="4">Completed</option>
            <option value="5">Cancelled</option>
          </select>
          <select name="published" value={filters.published} onChange={handleFilterChange} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed]">
            <option value="All">Published: All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
          <select name="active" value={filters.active} onChange={handleFilterChange} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#7c3aed]">
            <option value="All">Active: All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Batch Details</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Timeline</th>
                <th className="p-4 font-semibold text-center">People</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="p-10 text-center"><Loader2 className="animate-spin text-[#7c3aed] mx-auto" size={32} /></td></tr>
              ) : filteredBatches.length === 0 ? (
                <tr><td colSpan="6" className="p-16 text-center text-gray-500">No batches found.</td></tr>
              ) : (
                filteredBatches.map((batch) => (
                  <motion.tr key={batch.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`border-b border-gray-50 hover:bg-gray-50/50 ${actionLoadingId === batch.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <td className="p-4">
                      <p className="font-bold text-gray-800 text-base">{batch.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{batch.code}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">{batch.courseName || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Calendar size={12}/> Start: {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> End: {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="flex items-center gap-1 text-sm font-bold text-gray-700"><Users size={14} className="text-blue-500"/> {batch.totalStudents || 0}</span>
                          <span className="text-[10px] text-gray-400 uppercase">Students</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="flex items-center gap-1 text-sm font-bold text-gray-700"><UserCheck size={14} className="text-green-500"/> {batch.totalTeachers || 0}</span>
                          <span className="text-[10px] text-gray-400 uppercase">Teachers</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Capacity: {batch.capacity}</p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadge(batch.status)}`}>
                          {batch.status || 'Draft'}
                        </span>
                        <div className="flex gap-1 mt-1">
                          {batch.isPublished && <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 rounded">PUBLISHED</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right relative">
                      <button onClick={() => setActiveDropdown(activeDropdown === batch.id ? null : batch.id)} className="p-2 text-gray-400 hover:text-[#7c3aed] hover:bg-purple-50 rounded-lg transition-colors">
                        {actionLoadingId === batch.id ? <Loader2 size={20} className="animate-spin text-[#7c3aed]" /> : <MoreVertical size={20} />}
                      </button>

                      <AnimatePresence>
                        {activeDropdown === batch.id && (
                          <motion.div ref={dropdownRef} initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                            <button onClick={() => navigate(`/admin/batches/${batch.id}`)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                              <Eye size={16} className="text-blue-500" /> View Details
                            </button>
                            <button onClick={() => navigate(`/admin/batches/edit/${batch.id}`)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit size={16} className="text-[#7c3aed]" /> Edit Batch
                            </button>
                            
                            {/* CHANGED: Open Status Modal */}
                            <button onClick={() => openStatusModal(batch)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                              <RefreshCw size={16} className="text-orange-500" /> Change Status
                            </button>
                            
                            <button onClick={() => handlePublishToggle(batch)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                              <UploadCloud size={16} className={batch.isPublished ? 'text-orange-500' : 'text-green-500'} /> 
                              {batch.isPublished ? 'Unpublish Batch' : 'Publish Batch'}
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button onClick={() => openDeleteModal(batch)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                              <Archive size={16} /> Archive Batch
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalCount > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-2xl">
            <p className="text-sm text-gray-500">Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> batches</p>
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

      {/* DELETE/ARCHIVE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, batchId: null, batchName: '' })} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-red-600" size={32} /></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Archive Batch?</h2>
              <p className="text-gray-500 mb-6 text-sm">Are you sure you want to archive <span className="font-semibold text-gray-800">"{deleteModal.batchName}"</span>?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal({ isOpen: false, batchId: null, batchName: '' })} className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button onClick={confirmDelete} disabled={actionLoadingId === deleteModal.batchId} className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2">
                  {actionLoadingId === deleteModal.batchId ? <Loader2 size={18} className="animate-spin" /> : <Archive size={18} />} Yes, Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE STATUS MODAL */}
      <AnimatePresence>
        {statusModal.isOpen && (
          <ChangeStatusModal 
            isOpen={statusModal.isOpen}
            batch={statusModal.batch}
            isLoading={actionLoadingId === statusModal.batch?.id}
            onClose={() => setStatusModal({ isOpen: false, batch: null })}
            onSubmit={confirmStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}