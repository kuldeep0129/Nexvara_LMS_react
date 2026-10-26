import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, User } from 'lucide-react';
import { studentService } from '../../services/studentService';
import ToastNotification from '../../../ui/ToastNotification';

export default function EditStudentModal({ userId, onClose, onSuccess }) {
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    userName: '', email: '', mobileNumber: '',
    profileImage: null, gender: '', dateOfBirth: '', qualification: '',
    collegeName: '', address: '', passingYear: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!userId) {
        setError("Student ID is missing from the selected row.");
        setIsFetching(false);
        return;
      }

      console.log("Fetching data for userId:", userId); // Debugging

      setIsFetching(true);
      setError('');
      
      try {
        const response = await studentService.getStudentById(userId);
        const data = response.data || response;
        
        let genderStr = '';
        if (data.gender === 'Male') genderStr = '0';
        else if (data.gender === 'Female') genderStr = '1';
        else if (data.gender === 'Other') genderStr = '2';

        setFormData({
          userName: data.userName || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          profileImage: null,
          gender: genderStr,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          qualification: data.qualification || '',
          collegeName: data.collegeName || '',
          address: data.address || '',
          passingYear: data.passingYear || ''
        });
        
        if (data.profileImageUrl) setPreviewImage(data.profileImageUrl);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError(err.message || 'Failed to fetch student details.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchStudentData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files[0]) {
      setFormData(prev => ({ ...prev, profileImage: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await studentService.updateStudent(userId, formData);
      showToast('success', 'Success', response.message || 'Student profile updated successfully!');
      setTimeout(() => {
        onSuccess(); 
        onClose();   
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update student.');
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

        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Student Profile</h2>
              <p className="text-sm text-gray-500">Update complete student details</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="animate-spin text-[#7c3aed] mb-2" size={32} />
                <p className="text-gray-500 text-sm">Fetching details...</p>
              </div>
            ) : error && !formData.userName ? (
               <div className="flex flex-col items-center justify-center h-48 text-red-500 text-center px-4">
                 <p className="font-semibold mb-2">Failed to load profile</p>
                 <p className="text-sm">{error}</p>
               </div>
            ) : (
              <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 break-words">{error}</div>}
                
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-4 border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden relative group">
                    {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <User size={30} className="text-gray-300" />}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <span className="text-white text-xs font-semibold">Change</span>
                      <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="hidden" />
                    </label>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-800">Profile Picture</p>
                    <p className="text-xs">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
                    <input type="text" name="userName" value={formData.userName} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
                    <input type="email" name="email" value={formData.email} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mobile Number</label>
                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none">
                      <option value="">Select</option>
                 <option value="0">Male</option>
<option value="1">Female</option>
<option value="2">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Qualification</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Passing Year</label>
                    <input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">College Name</label>
                    <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none"></textarea>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" form="edit-form" disabled={isFetching || isSaving || (error && !formData.userName)} className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] flex items-center gap-2 shadow-lg disabled:opacity-70">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}