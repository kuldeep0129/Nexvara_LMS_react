import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, PlusCircle } from 'lucide-react';

export default function AddSyllabusModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    displayOrder: '',
  });

  const [errors, setErrors] = useState({});

  // Modal open hone par reset form
  useEffect(() => {
    if (isOpen) {
      setFormData({ title: '', description: '', displayOrder: '' });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }
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
    
    // Display order field me sirf integer allow karein
    if (name === 'displayOrder' && value !== '' && !/^\d+$/.test(value)) {
      return; 
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Parent component ko data pass karein
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      displayOrder: parseInt(formData.displayOrder, 10),
    });
  };

  // handleClose me sirf onClose call karenge, reset ka kaam useEffect handle kar raha hai
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Agar modal open nahi hai, to render mat karo
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop - No onClick event so it won't close on outside click */}
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
              <h2 className="text-xl font-bold text-gray-800">Add Syllabus Topic</h2>
              <p className="text-sm text-gray-500 mt-1">Create a new topic for this course</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to .NET"
                disabled={isLoading}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-colors disabled:opacity-60 ${
                  errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7c3aed]'
                }`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief overview of what this topic covers..."
                disabled={isLoading}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm resize-none transition-colors disabled:opacity-60 ${
                  errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7c3aed]'
                }`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description}</p>}
            </div>

            {/* Display Order */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Display Order *</label>
              <input
                type="text" // Using text to control input precisely (prevent 'e', '+', '-')
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                placeholder="e.g. 1"
                disabled={isLoading}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-colors disabled:opacity-60 ${
                  errors.displayOrder ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#7c3aed]'
                }`}
              />
              {errors.displayOrder ? (
                <p className="text-xs text-red-500 mt-1.5">{errors.displayOrder}</p>
              ) : (
                <p className="text-[11px] text-gray-400 mt-1.5">Enter a numeric value to sort this topic.</p>
              )}
            </div>

          </form>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
              {isLoading ? 'Adding...' : 'Add Topic'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}