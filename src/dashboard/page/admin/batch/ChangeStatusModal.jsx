import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, RefreshCw, Check } from 'lucide-react';

// Backend Enum Mapping
const STATUS_OPTIONS = [
  { value: 1, label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 2, label: 'Upcoming', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 3, label: 'Active', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 4, label: 'Completed', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 5, label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
];

export default function ChangeStatusModal({ isOpen, batch, onClose, onSubmit, isLoading }) {
  // Default to current status (assuming backend returns number 1,2,3 etc.)
  const [selectedStatus, setSelectedStatus] = useState(batch?.status || 1);

  if (!isOpen || !batch) return null;

  const handleSubmit = () => {
    onSubmit(batch.id, selectedStatus);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 text-[#7c3aed] rounded-xl flex items-center justify-center">
              <RefreshCw size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Change Status</h2>
              <p className="text-sm text-gray-500 truncate max-w-[200px]" title={batch.name}>{batch.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 mb-8">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                selectedStatus === option.value 
                  ? 'border-[#7c3aed] bg-purple-50 shadow-sm' 
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-xs font-bold border ${option.color}`}>
                  {option.label}
                </span>
              </div>
              {selectedStatus === option.value && (
                <div className="w-6 h-6 bg-[#7c3aed] rounded-full flex items-center justify-center text-white">
                  <Check size={14} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading || selectedStatus === batch.status}
            className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            {isLoading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}