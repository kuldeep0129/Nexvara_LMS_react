import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import { courseService } from '../../../services/courseService'; // Path check karein

export default function EditSyllabusModal({ isOpen, syllabusId, courseId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ title: '', description: '', displayOrder: '' });
  const [errors, setErrors] = useState({});
  
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Data when Modal Opens
  useEffect(() => {
    const fetchDetails = async () => {
      if (!isOpen || !syllabusId) return;
      
      setIsFetching(true);
      setErrors({});
      try {
        const res = await courseService.getSyllabusById(syllabusId);
        const data = res.data || res;
        
        setFormData({
          title: data.syllabusTitle || data.title || '',
          description: data.syllabusDescription || data.description || '',
          displayOrder: data.displayOrder?.toString() || '',
        });
      } catch (err) {
        setErrors({ fetch: err.message || 'Failed to load details.' });
      } finally {
        setIsFetching(false);
      }
    };

    fetchDetails();
  }, [isOpen, syllabusId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.displayOrder) {
      newErrors.displayOrder = 'Display order is required.';
    } else if (!/^\d+$/.test(formData.displayOrder)) {
      newErrors.displayOrder = 'Only integer values are allowed.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'displayOrder' && value !== '' && !/^\d+$/.test(value)) return;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      // Exact Payload based on Swagger
      const payload = {
        id: Number(syllabusId),
        courseId: Number(courseId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        displayOrder: parseInt(formData.displayOrder, 10),
      };

      await courseService.updateSyllabus(payload);
      onSuccess(); // Refetch parent data
      onClose();   // Close modal
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Syllabus Topic</h2>
              <p className="text-sm text-gray-500 mt-1">Update topic details</p>
            </div>
            <button onClick={onClose} disabled={isSaving || isFetching} className="p-2 text-gray-400 hover:text-red-600 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 relative">
            
            {/* Loading Overlay */}
            {isFetching && (
              <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#7c3aed]" size={32} />
              </div>
            )}

            {errors.fetch && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{errors.fetch}</div>}

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Title *</label>
              <input
                type="text" name="title" value={formData.title} onChange={handleChange} disabled={isSaving || isFetching}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange} rows={3} disabled={isSaving || isFetching}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm resize-none ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description}</p>}
            </div>

            {/* Display Order */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Display Order *</label>
              <input
                type="text" name="displayOrder" value={formData.displayOrder} onChange={handleChange} disabled={isSaving || isFetching}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm ${errors.displayOrder ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.displayOrder && <p className="text-xs text-red-500 mt-1.5">{errors.displayOrder}</p>}
            </div>

            {errors.submit && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{errors.submit}</div>}
          </form>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving || isFetching} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={isSaving || isFetching} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}