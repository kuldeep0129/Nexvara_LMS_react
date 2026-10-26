import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, X, ChevronLeft, ChevronRight, MoreVertical, Edit, Eye, BookOpen, Clock, BarChart, Plus } from 'lucide-react';
import { useCourses } from '../../../hooks/useCourses';
import { useNavigate } from 'react-router-dom';
import ViewCourseModal from './ViewCourseModal';
import EditCourseModal from './EditCourseModal';

export default function AllCourses() {
  const { 
    courses, isLoading, error, pageNumber, totalPages, totalCount, 
    setPageNumber, fetchCourses, toggleStatus, togglingId 
  } = useCourses();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Modal States
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' | 'edit'
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCourses = courses.filter((course) => {
    const query = searchTerm.toLowerCase();
    return (
      (course.title || '').toLowerCase().includes(query) ||
      (course.slug || '').toLowerCase().includes(query)
    );
  });

  const handleAction = (type, course) => {
    setActiveDropdown(null);
    setSelectedCourse(course);
    setModalType(type);
  };

  const handleToggle = async (id) => {
    const res = await toggleStatus(id);
    if (!res.success) alert(res.error); 
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your platform's courses and content.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="absolute left-4 text-gray-400" size={18} />
            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm" />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={16} /></button>}
          </div>
          <button onClick={() => navigate('/admin/courses/add')} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all whitespace-nowrap">
            <Plus size={18} /> Add Course
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Course Details</th>
                <th className="p-4 font-semibold">Meta Info</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="p-10 text-center"><Loader2 className="animate-spin text-[#7c3aed] mx-auto" size={32} /></td></tr>
              ) : filteredCourses.length === 0 ? (
                <tr><td colSpan="4" className="p-16 text-center text-gray-500">No courses found.</td></tr>
              ) : (
                filteredCourses.map((course) => (
                  <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                    
                    {/* Course Details */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          {course.imageUrl ? <img src={course.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen size={20}/></div>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-base">{course.title}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">/{course.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Meta Info */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400"/> {course.duration || 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><BarChart size={14} className="text-gray-400"/> {course.level || 'N/A'}</span>
                      </div>
                    </td>

                    {/* STATUS TOGGLE */}
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleToggle(course.id)}
                        disabled={togglingId === course.id}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${course.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${course.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        {togglingId === course.id && <Loader2 className="absolute inset-0 m-auto text-white animate-spin" size={12} />}
                      </button>
                      <p className="text-[10px] font-bold mt-1 text-gray-500 uppercase">{course.isActive ? 'Active' : 'Inactive'}</p>
                    </td>

                    {/* Actions Dropdown */}
                    <td className="p-4 text-right relative">
                      <button onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)} className="p-2 text-gray-400 hover:text-[#7c3aed] hover:bg-purple-50 rounded-lg transition-colors">
                        <MoreVertical size={20} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === course.id && (
                          <motion.div ref={dropdownRef} initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-8 top-12 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
                            <button onClick={() => handleAction('view', course)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                              <Eye size={16} className="text-blue-500" /> View Details
                            </button>
                            <button onClick={() => handleAction('edit', course)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit size={16} className="text-[#7c3aed]" /> Edit Course
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

        {/* PAGINATION */}
        {!isLoading && totalCount > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-2xl">
            <p className="text-sm text-gray-500">Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> courses</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronLeft size={18} /></button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPageNumber(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-semibold ${pageNumber === i + 1 ? 'bg-[#7c3aed] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {modalType === 'view' && selectedCourse && (
          <ViewCourseModal courseId={selectedCourse.id} onClose={() => setModalType(null)} />
        )}
        {modalType === 'edit' && selectedCourse && (
          <EditCourseModal courseId={selectedCourse.id} onClose={() => setModalType(null)} onSuccess={() => fetchCourses(pageNumber)} />
        )}
      </AnimatePresence>
    </div>
  );
}