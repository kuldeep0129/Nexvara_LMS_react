import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Phone, Search, X, ChevronLeft, ChevronRight, MoreVertical, Edit } from 'lucide-react';
import { useStudents } from '../../hooks/useStudents';
import EditStudentModal from './EditStudentModal';

export default function StudentsList() {
  const { 
    students, isLoading, error, pageNumber, totalPages, totalCount, 
    setPageNumber, toggleStatus, togglingId, fetchStudents 
  } = useStudents();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Modal States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalType, setModalType] = useState(null); 
  
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

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.toLowerCase();
    return (
      (student.userName || '').toLowerCase().includes(query) ||
      (student.email || '').toLowerCase().includes(query) ||
      (student.mobileNumber || '').includes(query)
    );
  });

  const handleAction = (type, student) => {
    setActiveDropdown(null);
    setSelectedStudent(student);
    setModalType(type);
    console.log("Selected Student for Edit:", student); // Debugging
  };

  const handleToggle = async (userId) => {
    const res = await toggleStatus(userId);
    if (!res.success) alert(res.error); 
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Students</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered students.</p>
        </div>
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm"
          />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={16} /></button>}
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Qualification</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="animate-spin text-[#7c3aed] mx-auto" size={32} /></td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                    
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0 overflow-hidden">
                        {student.profileImageUrl ? <img src={student.profileImageUrl} className="w-full h-full object-cover" /> : student.userName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{student.userName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {student.email}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-700 flex items-center gap-1"><Phone size={14}/> {student.mobileNumber || 'N/A'}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-800">{student.qualification || 'N/A'}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{student.collegeName || 'N/A'}</p>
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleToggle(student.userId)}
                        disabled={togglingId === student.userId}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${student.isActive === 'True' ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${student.isActive === 'True' ? 'translate-x-6' : 'translate-x-1'}`} />
                        {togglingId === student.userId && <Loader2 className="absolute inset-0 m-auto text-white animate-spin" size={12} />}
                      </button>
                      <p className="text-[10px] font-bold mt-1 text-gray-500 uppercase">{student.isActive === 'True' ? 'Active' : 'Inactive'}</p>
                    </td>

                    <td className="p-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                        className="p-2 text-gray-400 hover:text-[#7c3aed] hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === student.id && (
                          <motion.div 
                            ref={dropdownRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-8 top-12 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden"
                          >
                            <button onClick={() => handleAction('edit', student)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit size={16} className="text-[#7c3aed]" /> Edit Profile
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
            <p className="text-sm text-gray-500">Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span></p>
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
        {modalType === 'edit' && selectedStudent && (
          <EditStudentModal 
            userId={selectedStudent.userId} // <--- Yahan Direct userId pass ho raha hai
            onClose={() => setModalType(null)} 
            onSuccess={() => { fetchStudents(pageNumber); setModalType(null); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}