import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, Check, UserPlus } from 'lucide-react';
import { teacherAssignService } from '../../../services/teacherAssignService';
import ToastNotification from '../../../../ui/ToastNotification';

export default function AssignTeacherModal({ isOpen, batchId, batchName, onClose, onSuccess }) {
  const [teachers, setTeachers] = useState([]);
  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isPrimary, setIsPrimary] = useState(false);
  
  const dropdownRef = useRef(null);
  
  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Fetch teachers when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchTeachers = async () => {
      setIsFetchingTeachers(true);
      try {
        const data = await teacherAssignService.getAllTeachers();
        setTeachers(data);
      } catch (err) {
        showToast('error', 'Fetch Failed', 'Failed to load teachers list.');
      } finally {
        setIsFetchingTeachers(false);
      }
    };
    fetchTeachers();
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter teachers based on search (Handling both id and name)
  const filteredTeachers = teachers.filter(t => 
    (t.name || t.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.id || t.Id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedTeacher) {
      return showToast('error', 'Validation Error', 'Please select a teacher first.');
    }

    setIsSaving(true);
    try {
      const payload = {
        teacherId: selectedTeacher.id || selectedTeacher.Id, // DTO ke hisaab se
        isPrimary: isPrimary
      };
      
      await teacherAssignService.assignTeacherToBatch(batchId, payload);
      
      showToast('success', 'Success', 'Teacher assigned successfully!');
      setTimeout(() => {
        onSuccess(); // Refresh list
        onClose();   // Close modal
      }, 1500);
      
    } catch (err) {
      showToast('error', 'Assignment Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-visible flex flex-col"
        >
          <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Assign Teacher</h2>
              <p className="text-sm text-gray-500 truncate max-w-[250px]" title={batchName}>To: {batchName}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            
            {/* Searchable Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Select Teacher *</label>
              
              <div 
                onClick={() => setIsDropdownOpen(true)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-purple-500/20 transition-all"
              >
                {selectedTeacher ? (
                  <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-[#7c3aed] flex items-center justify-center text-xs font-bold shrink-0">
                      {(selectedTeacher.name || selectedTeacher.Name || 'T').charAt(0)}
                    </div>
                    {selectedTeacher.name || selectedTeacher.Name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">Search and select teacher...</span>
                )}
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col"
                  >
                    <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                      <div className="relative flex items-center">
                        <Search className="absolute left-3 text-gray-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search by name or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                      {isFetchingTeachers ? (
                        <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin text-[#7c3aed]" size={16} /> Loading teachers...
                        </div>
                      ) : filteredTeachers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">No teachers found</div>
                      ) : (
                        filteredTeachers.map((t) => {
                          // DTO Mapping
                          const tId = t.id || t.Id;
                          const tName = t.name || t.Name;
                          const isSelected = selectedTeacher?.id === tId || selectedTeacher?.Id === tId;
                          
                          return (
                            <div 
                              key={tId}
                              onClick={() => {
                                setSelectedTeacher(t);
                                setIsDropdownOpen(false);
                                setSearchTerm('');
                              }}
                              className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${isSelected ? 'bg-purple-50 text-[#7c3aed]' : 'hover:bg-gray-50'}`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-[#7c3aed] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                  {tName?.charAt(0) || 'T'}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{tName}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">ID: {tId}</p>
                                </div>
                              </div>
                              {isSelected && <Check size={16} className="text-[#7c3aed]" />}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary Checkbox */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#7c3aed] rounded border-gray-300 focus:ring-[#7c3aed] cursor-pointer"
              />
              <div>
                <label htmlFor="isPrimary" className="text-sm font-bold text-gray-800 cursor-pointer">Make Primary Teacher</label>
                <p className="text-xs text-gray-500 mt-0.5">Primary teacher will be the main point of contact for this batch.</p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving || !selectedTeacher}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {isSaving ? 'Assigning...' : 'Assign Teacher'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}