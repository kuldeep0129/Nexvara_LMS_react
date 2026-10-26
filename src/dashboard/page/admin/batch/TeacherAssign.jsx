import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, UserPlus, Users, Search, X, Loader2, 
  ChevronLeft, ChevronRight, BookOpen, AlertCircle, Sparkles
} from 'lucide-react';
import { useTeacherAssign } from '../../../hooks/useTeacherAssign';
import AssignTeacherModal from './AssignTeacherModal';
import ViewBatchTeachersModal from './ViewBatchTeachersModal'; // NAYA IMPORT

const FILTER_TABS = ['All', 'Active', 'Upcoming', 'Draft', 'Completed'];

export default function TeacherAssign() {
  const { 
    assignments, isLoading, error, 
    pageNumber, totalPages, setPageNumber,
    activeTab, handleTabChange, refetch
  } = useTeacherAssign();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [assignModal, setAssignModal] = useState({ isOpen: false, batchId: null, batchName: '' });
  // NAYA STATE: View All Modal
  const [viewAllModal, setViewAllModal] = useState({ isOpen: false, batchId: null, batchName: '' });

  // Safe Search Filter Logic
  const filteredAssignments = assignments?.filter(item => {
    const query = searchTerm.toLowerCase();
    if (!query) return true;

    const course = (item.courseName || '').toLowerCase();
    const code = (item.batchCode || '').toLowerCase();
    const name = (item.batchName || '').toLowerCase();

    return course.includes(query) || code.includes(query) || name.includes(query);
  }) || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'NA';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'active' || s === '2') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'upcoming' || s === 'upcomming' || s === '3') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s === 'completed' || s === '5') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'draft' || s === '4') return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 250, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 flex items-center gap-2">
              Teacher Assignment <Sparkles className="text-[#7c3aed]" size={24} />
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-xl">
              Manage batch schedules and assign expert teachers to ensure seamless learning.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-[400px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-[#7c3aed] transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by course, batch name, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-[#7c3aed] transition-all duration-300"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchTerm('')} 
                  className="absolute inset-y-0 right-3 flex items-center p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'text-white bg-[#7c3aed] shadow-lg shadow-purple-500/30' 
                  : 'text-gray-500 bg-white border border-gray-200 hover:text-[#7c3aed] hover:bg-purple-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} /> <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-3xl border border-gray-100/50 backdrop-blur-sm">
            <Loader2 className="animate-spin text-[#7c3aed] mb-4" size={48} />
            <p className="text-gray-500 font-medium animate-pulse">Fetching assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No assignments found</h3>
            <p className="text-sm text-gray-500">Try changing the filter or search keyword.</p>
            <button 
              onClick={() => { setSearchTerm(''); handleTabChange('All'); }}
              className="mt-6 px-6 py-2.5 bg-[#7c3aed] text-white rounded-xl font-semibold hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/30"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredAssignments.map((item) => (
                <motion.div 
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)" }}
                  key={item.batchId}
                  className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col relative overflow-hidden group transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />

                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border ${getStatusBadge(item.status)}`}>
                      {item.status || 'NA'}
                    </span>
                    <span className="bg-gray-50 text-gray-600 text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-gray-200">
                      {item.batchCode || 'NA'}
                    </span>
                  </div>

                  <div className="mb-5 relative z-10">
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-1 uppercase flex items-center gap-1">
                      <BookOpen size={12} /> {item.courseName || 'NA'}
                    </p>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-[#7c3aed] transition-colors">
                      {item.batchName || 'NA'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-gray-600 relative z-10">
                    <Calendar size={14} className="text-[#7c3aed]" />
                    <span>{formatDate(item.startDate)}</span>
                    <span className="text-gray-400">to</span>
                    <span>{formatDate(item.endDate)}</span>
                  </div>

                  <div className="mb-5 relative z-10 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                      <Clock size={12} /> Schedule
                    </span>
                    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                      {item.weekOfDay || 'NA'}
                    </span>
                  </div>

                  <div className="mb-6 relative z-10">
                    {item.teacherId ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {item.teacherName?.charAt(0) || 'T'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">Assigned To</p>
                          <p className="text-sm font-semibold text-emerald-800 truncate">{item.teacherName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                          <AlertCircle size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-amber-600 uppercase">Status</p>
                          <p className="text-sm font-semibold text-amber-800">Teacher Not Assigned</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3 relative z-10">
                    <button 
                      onClick={() => setAssignModal({ isOpen: true, batchId: item.batchId, batchName: item.batchName })}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-purple-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                    >
                      <UserPlus size={16} /> Assign
                    </button>
                    <button 
                      onClick={() => setViewAllModal({ isOpen: true, batchId: item.batchId, batchName: item.batchName })} // NAYA CLICK HANDLER
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-all hover:bg-gray-50"
                      title="View All Teachers"
                    >
                      <Users size={16} /> View All
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button 
              onClick={() => setPageNumber(pageNumber - 1)} 
              disabled={pageNumber === 1} 
              className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#7c3aed] disabled:opacity-50 transition-all shadow-sm"
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <div className="px-5 py-2.5 bg-purple-50 text-[#7c3aed] rounded-xl text-sm font-bold border border-purple-100">
              Page {pageNumber} of {totalPages}
            </div>
            <button 
              onClick={() => setPageNumber(pageNumber + 1)} 
              disabled={pageNumber === totalPages} 
              className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#7c3aed] disabled:opacity-50 transition-all shadow-sm"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Modals */}
        <AssignTeacherModal 
          isOpen={assignModal.isOpen}
          batchId={assignModal.batchId}
          batchName={assignModal.batchName}
          onClose={() => setAssignModal({ isOpen: false, batchId: null, batchName: '' })}
          onSuccess={() => refetch()} 
        />

        {/* NAYA MODAL: View All Teachers */}
        <ViewBatchTeachersModal 
          isOpen={viewAllModal.isOpen}
          batchId={viewAllModal.batchId}
          batchName={viewAllModal.batchName}
          onClose={() => setViewAllModal({ isOpen: false, batchId: null, batchName: '' })}
        />

      </div>
    </div>
  );
}