import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save, User, Mail, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function Profile({ role = 'student' }) {
  // ==========================================
  // 1. ID Extraction
  // ==========================================
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  const extractedId = user?.userId || user?.id || user?.data?.userId;
  const userId = (typeof extractedId === 'string' || typeof extractedId === 'number') 
    ? String(extractedId) 
    : '';

  const { isLoading, error, success, profileData, updateProfile } = useProfile(role, userId);

  // ==========================================
  // 2. Form State
  // ==========================================
  const [formData, setFormData] = useState({
    profileImage: null,
    gender: '',
    dateOfBirth: '',
    qualification: '',
    collegeName: '',
    address: '',
    passingYear: '',
    experienceYear: '',
    bio: '',
    specialization: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // ==========================================
  // 3. Populate Data (GENDER FIX YAHAN HAI)
  // ==========================================
  useEffect(() => {
    if (profileData) {
      // API se "Male" aata hai, usko select box ke "0" mein convert karo
      let genderStr = '';
      if (profileData.gender === 'Male') genderStr = '0';
      else if (profileData.gender === 'Female') genderStr = '1';
      else if (profileData.gender === 'Other') genderStr = '2';
      else if (profileData.gender !== undefined && profileData.gender !== null) {
        genderStr = String(profileData.gender); 
      }

      setFormData({
        profileImage: null,
        gender: genderStr, 
        dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
        qualification: profileData.qualification || '',
        collegeName: profileData.collegeName || '',
        address: profileData.address || '',
        passingYear: profileData.passingYear || '',
        experienceYear: profileData.experienceYears || '',
        bio: profileData.bio || '',
        specialization: profileData.specialization || ''
      });
      
      if (profileData.profileImageUrl) setPreviewImage(profileData.profileImageUrl);
    }
  }, [profileData]);

  // ==========================================
  // 4. Handlers
  // ==========================================
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

  const validate = () => {
    const errors = {};
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await updateProfile({ ...formData });
  };

  // ==========================================
  // 5. Loading & Error States
  // ==========================================
  if (!userId && !isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-red-500 font-semibold flex-col gap-2">
        <p>User session not found.</p>
        <button onClick={() => window.location.href = '/'} className="text-[#7c3aed] underline">Go to Login</button>
      </div>
    );
  }

  if (isLoading && !profileData) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
      </div>
    );
  }

  // ==========================================
  // 6. Render UI
  // ==========================================
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 capitalize">{role} Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and settings.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover & Avatar */}
        <div className="h-32 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg group">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={() => setPreviewImage(null)} // Fallback
                />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="text-white" size={24} />
                <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pt-16 p-8 space-y-8">
          {/* Read Only Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                <User size={18} /> {profileData?.userName || user?.fullName || 'User'}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                <Mail size={18} /> {profileData?.email || user?.email || 'Email'}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Dynamic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Qualification *</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.qualification ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="e.g. B.Tech" />
              </div>
              {validationErrors.qualification && <p className="text-red-500 text-xs mt-1">{validationErrors.qualification}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Passing Year *</label>
              <input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.passingYear ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="e.g. 2023" />
              {validationErrors.passingYear && <p className="text-red-500 text-xs mt-1">{validationErrors.passingYear}</p>}
            </div>

            {role === 'student' && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">College Name *</label>
                  <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.collegeName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="Enter your college name" />
                  {validationErrors.collegeName && <p className="text-red-500 text-xs mt-1">{validationErrors.collegeName}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed]"
                  >
                    <option value="">Select Gender</option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                    <option value="2">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="Enter your full address"></textarea>
                  {validationErrors.address && <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>}
                </div>
              </>
            )}

            {role === 'teacher' && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Specialization *</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.specialization ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="e.g. React, Node.js" />
                  {validationErrors.specialization && <p className="text-red-500 text-xs mt-1">{validationErrors.specialization}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Experience (Years) *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="number" name="experienceYear" value={formData.experienceYear} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${validationErrors.experienceYear ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-500/20 focus:border-[#7c3aed]'}`} placeholder="e.g. 5" />
                  </div>
                  {validationErrors.experienceYear && <p className="text-red-500 text-xs mt-1">{validationErrors.experienceYear}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed]" placeholder="Tell us about yourself..."></textarea>
                </div>
              </>
            )}
          </div>

          <AnimatePresence>
            {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-lg">{error}</motion.p>}
            {success && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-green-600 text-sm font-semibold bg-green-50 p-3 rounded-lg">{success}</motion.p>}
          </AnimatePresence>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}