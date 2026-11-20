import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Search, X, ChevronLeft, ChevronRight, MoreVertical, 
  Edit, Eye, BookOpen, Clock, BarChart, Plus, Settings, Star, 
  Flame, CheckCircle2
} from 'lucide-react';
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

  // Manage button handles navigation to the detailed page
  const handleManage = (courseId) => {
    // Yahan apna detailed route dalna, jaise: /admin/courses/manage/1
    navigate(`/admin/courses/manage/${courseId}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#f8fafc] min-h-screen">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your platform's courses and content.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="absolute left-4 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm" 
            />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={16} /></button>}
          </div>
          <button 
            onClick={() => navigate('/admin/courses/add')} 
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all whitespace-nowrap"
          >
            <Plus size={18} /> Add Course
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}

      {/* Card Grid Section */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-[#7c3aed]" size={36} />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-500">
            No courses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              
              // Dynamic Colors from API
              const mainColor = course.colorCode || '#7c3aed';
              const softColor = course.softColorCode || '#f3f0fa';
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col relative group overflow-hidden"
                >
                  {/* Featured Ribbon */}
                  {course.isFeatured && (
                    <div 
                      className="absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm"
                      style={{ backgroundColor: mainColor }}
                    >
                      Featured
                    </div>
                  )}

                  {/* Card Header with Image / Icon */}
                  <div className="p-5 pb-0 flex gap-4">
                    <div 
                      className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border"
                      style={{ backgroundColor: softColor, borderColor: `${mainColor}30` }}
                    >
                      {course.imageUrl ? (
                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <i className={`${course.icon || 'devicon-code-plain'} text-4xl`} style={{ color: mainColor }}></i>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900 truncate pr-6" title={course.title}>
                          {course.title}
                        </h3>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)} 
                          className="text-gray-400 hover:text-gray-700 p-1 -mt-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">/{course.slug}</p>
                      
                      {/* Meta tags (Level & Duration) */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <BarChart size={12} /> {course.level || 'All Levels'}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock size={12} /> {course.duration ? `${course.duration} weeks` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

          {/* Body / Summary */}
<div className="p-5 flex-1 flex flex-col">
  <p className="text-sm text-gray-600 line-clamp-2 mt-2 flex-1">
    {course.summary || 'Explore this comprehensive course to master the skills.'}
  </p>

  {/* Stats Row (Demand, Rating, Price, Status) */}
  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
    <div className="flex items-center gap-3">
      {/* Demand */}
      {course.demand && (
        <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
          <Flame size={12} /> {course.demand}
        </div>
      )}
      {/* Rating */}
      <div className="flex items-center gap-1 text-xs font-bold text-yellow-600">
        <Star size={13} className="fill-yellow-500 text-yellow-500" />
        {course.star || '4.0'}
      </div>
      {/* Price */}
      <div className="flex items-center gap-1 text-xs font-bold">
        {course.courseType?.toLowerCase() === 'free' ? (
          <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">Free</span>
        ) : (
          <span className="text-[#7c3aed] bg-purple-50 px-2 py-1 rounded-md">
            ₹{course.price ?? 'N/A'}
          </span>
        )}
      </div>
    </div>

    {/* Status Toggle */}
    <div className="flex items-center gap-1.5">
      <button 
        onClick={() => handleToggle(course.id)}
        disabled={togglingId === course.id}
        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${course.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${course.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
        {togglingId === course.id && <Loader2 className="absolute inset-0 m-auto text-white animate-spin" size={10} />}
      </button>
      <span className={`text-[10px] font-bold uppercase ${course.isActive ? 'text-green-600' : 'text-gray-500'}`}>
        {course.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  </div>
</div>

                  {/* Footer Actions */}
                  <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center gap-2">
                    <button 
                      onClick={() => handleAction('view', course)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-[#7c3aed] text-[#7c3aed] rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors"
                    >
                      <Eye size={16} /> View
                    </button>
                    
                    {/* Manage Button -> Image Page */}
                    <button 
                      onClick={() => handleManage(course.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#7c3aed] text-white rounded-xl font-bold text-sm hover:bg-[#6d28d9] transition-colors shadow-md shadow-purple-500/20"
                    >
                      <Settings size={16} /> Manage
                    </button>
                  </div>

                  {/* Dropdown for Edit */}
                  <AnimatePresence>
                    {activeDropdown === course.id && (
                      <motion.div 
                        ref={dropdownRef} 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                        className="absolute top-12 right-5 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden"
                      >
                        <button onClick={() => handleAction('edit', course)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit size={16} className="text-[#7c3aed]" /> Edit Details
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!isLoading && totalCount > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> courses
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setPageNumber(i + 1)} 
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${pageNumber === i + 1 ? 'bg-[#7c3aed] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

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