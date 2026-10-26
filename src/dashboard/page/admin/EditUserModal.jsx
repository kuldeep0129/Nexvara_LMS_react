import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, User } from 'lucide-react';
import { userService } from '../../services/userService';
import ToastNotification from '../../../ui/ToastNotification';

export default function EditUserModal({ userId, onClose, onSuccess }) {
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    userName: '', email: '', mobileNumber: '', role: ''
  });

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return setIsFetching(false);
      setIsFetching(true);
      try {
        const response = await userService.getUserById(userId);
        const data = response.data || response;
        setFormData({
          userName: data.userName || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          role: data.roles?.[0] || data.role || 'Student'
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch user details.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const response = await userService.updateUser(userId, formData);
      showToast('success', 'Success', response.message || 'User updated successfully!');
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update user.');
      showToast('error', 'Update Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit User Details</h2>
              <p className="text-sm text-gray-500">Update basic user information</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="animate-spin text-[#7c3aed] mb-2" size={32} />
                <p className="text-gray-500 text-sm">Fetching details...</p>
              </div>
            ) : (
              <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}
                
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mobile Number</label>
                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Role (Read Only)</label>
                    <input type="text" value={formData.role} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed" />
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" form="edit-user-form" disabled={isFetching || isSaving} className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] flex items-center gap-2 shadow-lg disabled:opacity-70">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}