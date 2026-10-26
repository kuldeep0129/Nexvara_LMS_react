import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, User, Mail, GraduationCap, Briefcase, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../../hook/useAuth'; 
import ToastNotification from '../../ui/ToastNotification'; 

export default function Profile({ role = 'student' }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const extractedId = user?.userId || user?.id || user?.data?.userId;
  const userId = (typeof extractedId === 'string' || typeof extractedId === 'number') ? String(extractedId) : '';

  const { isLoading, error, success, profileData, updateProfile } = useProfile(role, userId);
  
  // Password change ke liye auth hook
  const { isLoading: isAuthLoading, error: authError, success: authSuccess, changePassword, clearMessages } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); 
  
  const [formData, setFormData] = useState({
    profileImage: null, gender: '', dateOfBirth: '', qualification: '',
    collegeName: '', address: '', passingYear: '', experienceYear: '', bio: '', specialization: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Profile Update Messages
  useEffect(() => { if (success) showToast('success', 'Profile Updated!', success); }, [success]);
  useEffect(() => { if (error) showToast('error', 'Update Failed', error); }, [error]);

  // Password Change Messages
  useEffect(() => { 
    if (authSuccess) {
      showToast('success', 'Password Changed!', authSuccess); 
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  }, [authSuccess]);
  
  useEffect(() => { if (authError) showToast('error', 'Failed', authError); }, [authError]);

  useEffect(() => {
    if (profileData) {
      let genderStr = '';
      if (profileData.gender === 'Male') genderStr = '0';
      else if (profileData.gender === 'Female') genderStr = '1';
      else if (profileData.gender === 'Other') genderStr = '2';

      setFormData({
        profileImage: null, gender: genderStr,
        dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
        qualification: profileData.qualification || '', collegeName: profileData.collegeName || '',
        address: profileData.address || '', passingYear: profileData.passingYear || '',
        experienceYear: profileData.experienceYears || '', bio: profileData.bio || '',
        specialization: profileData.specialization || ''
      });
      if (profileData.profileImageUrl) setPreviewImage(profileData.profileImageUrl);
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files[0]) {
      setFormData(prev => ({ ...prev, profileImage: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
    const errors = {};
    // Admin ke liye koi validation nahi
    if (role === 'admin') return true;

    if (!formData.qualification.trim()) errors.qualification = 'Qualification is required';
    if (role !== 'admin' && !formData.passingYear) errors.passingYear = 'Passing year is required';
    
    if (role === 'student') {
      if (!formData.collegeName.trim()) errors.collegeName = 'College name is required';
      if (!formData.address.trim()) errors.address = 'Address is required';
    }
    if (role === 'teacher') {
      if (!formData.specialization.trim()) errors.specialization = 'Specialization is required';
      if (!formData.experienceYear) errors.experienceYear = 'Experience is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    await updateProfile({ ...formData });
  };

  // Password Change Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showToast('error', 'Mismatch', 'New passwords do not match.');
    }
    if (passwordData.newPassword.length < 6) {
      return showToast('error', 'Weak Password', 'Password must be at least 6 characters.');
    }
    
    const payload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    };
    
    await changePassword(payload);
  };

  if (!userId && !isLoading) return <div className="text-center mt-20 text-red-500">User session not found.</div>;
  if (isLoading && !profileData) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#7c3aed]" size={40} /></div>;

  return (
    <>
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">{role} Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your personal information and security.</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => { setActiveTab('profile'); clearMessages(); }} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-white text-[#7c3aed] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <User size={16} /> Profile Info
            </button>
            <button onClick={() => { setActiveTab('security'); clearMessages(); }} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'security' ? 'bg-white text-[#7c3aed] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <ShieldCheck size={16} /> Security
            </button>
          </div>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] relative">
              <div className="absolute -bottom-12 left-8">
                <div className="relative w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg group">
                  {previewImage ? <img src={previewImage} alt="Profile" className="w-full h-full object-cover" onError={() => setPreviewImage(null)} /> : <User size={40} className="text-gray-400" />}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="text-white" size={24} />
                    <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="pt-16 p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-500"><User size={18} /> {profileData?.userName || 'User'}</div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-500"><Mail size={18} /> {profileData?.email || 'Email'}</div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* QUALIFICATION & PASSING YEAR: Sirf Student/Teacher ke liye */}
                {role !== 'admin' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Qualification *</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.qualification ? 'border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="e.g. B.Tech" />
                      </div>
                      {validationErrors.qualification && <p className="text-red-500 text-xs mt-1">{validationErrors.qualification}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Passing Year *</label>
                      <input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.passingYear ? 'border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="e.g. 2023" />
                      {validationErrors.passingYear && <p className="text-red-500 text-xs mt-1">{validationErrors.passingYear}</p>}
                    </div>
                  </>
                )}

                {role === 'student' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">College Name *</label>
                      <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.collegeName ? 'border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} />
                      {validationErrors.collegeName && <p className="text-red-500 text-xs mt-1">{validationErrors.collegeName}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#7c3aed]">
                        <option value="">Select Gender</option><option value="0">Male</option><option value="1">Female</option><option value="2">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#7c3aed]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Address *</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.address ? 'border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`}></textarea>
                      {validationErrors.address && <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>}
                    </div>
                  </>
                )}

                {role === 'teacher' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Specialization *</label>
                      <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.specialization ? 'border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} />
                      {validationErrors.specialization && <p className="text-red-500 text-xs mt-1">{validationErrors.specialization}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Experience (Years) *</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="number" name="experienceYear" value={formData.experienceYear} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.experienceYear ? 'border-red-500' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} />
                      </div>
                      {validationErrors.experienceYear && <p className="text-red-500 text-xs mt-1">{validationErrors.experienceYear}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Bio</label>
                      <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#7c3aed]"></textarea>
                    </div>
                  </>
                )}

                {/* ADMIN Ke liye message */}
                {role === 'admin' && (
                   <div className="md:col-span-2 text-center py-4 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                     <p>Admin accounts use system defaults. No academic details required.</p>
                   </div>
                )}
              </div>

              {/* SAVE BUTTON: Admin ko chhod kar sabke liye */}
              {role !== 'admin' && (
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isLoading} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        )}

        {/* SECURITY (PASSWORD) TAB */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6 max-w-2xl">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <div className="w-12 h-12 bg-purple-50 text-[#7c3aed] rounded-xl flex items-center justify-center">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
                <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Password</label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed]" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">New Password</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed]" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Re-enter new password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed]" required />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isAuthLoading} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70">
                  {isAuthLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />} Update Password
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </motion.div>
    </>
  );
}