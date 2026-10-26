import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Image as ImageIcon, Layout, Settings, UploadCloud, Star, IndianRupee, ShieldCheck } from 'lucide-react';
import { courseService } from '../../../services/courseService';
import ToastNotification from '../../../../ui/ToastNotification';

export default function EditCourseModal({ courseId, onClose, onSuccess }) {
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', summary: '', description: '',
    duration: '', level: 'Beginner', demand: '', star: '5',
    points: '', technologies: '', accessType: '1', price: '0',
    colorCode: '#7c3aed', softColorCode: '#f3f0fa', icon: '',
    sortOrder: 0, isPublished: false, isFeatured: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setIsFetching(false);
        setError("Course ID is missing.");
        return;
      }
      
      setIsFetching(true);
      setError('');
      
      try {
        const res = await courseService.getCourseById(courseId);
        const data = res.data || res;
        
        let accessTypeVal = data.accessType ? String(data.accessType) : (data.price > 0 ? '2' : '1');
        
        setFormData({
          title: data.title || '', slug: data.slug || '', summary: data.summary || '',
          description: data.description || '', duration: data.duration || '', level: data.level || 'Beginner',
          demand: data.demand || '', star: String(data.star || '5'), points: data.points || '',
          technologies: data.technologies || '', accessType: accessTypeVal, price: String(data.price || '0'),
          colorCode: data.colorCode || '#7c3aed', softColorCode: data.softColorCode || '#f3f0fa',
          icon: data.icon || '', sortOrder: data.sortOrder || 0,
          isPublished: data.isPublished || false, isFeatured: data.isFeatured || false
        });
        
        if (data.imageUrl) setImagePreview(data.imageUrl);
      } catch (err) {
        setError(err.message || 'Failed to load course details.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    if (name === 'title' && !isSlugManual) {
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title: value, slug: generatedSlug }));
      return;
    }

    if (name === 'slug') setIsSlugManual(true);
    if (name === 'accessType' && value === '1') {
      setFormData(prev => ({ ...prev, accessType: value, price: '0' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. Form Submit Triggered!"); // DEBUG
    
    setIsSaving(true);
    setError('');

    try {
      const data = new FormData();
      
      // Append saare text fields
      Object.keys(formData).forEach(key => {
        data.append(key, String(formData[key])); 
      });

      // Image append karein (SIRF tab jab File select hui ho)
      if (imageFile instanceof File) {
        console.log("2. New Image attached:", imageFile.name); // DEBUG
        data.append('ImageUrl', imageFile); 
      } else {
        console.log("2. No image selected. Skipping ImageUrl."); // DEBUG
      }

      // Debug: FormData check karein
      console.log("3. Sending FormData to API...");
      for (let pair of data.entries()) {
        console.log(`   ${pair[0]}:`, pair[1]);
      }

      const response = await courseService.updateCourse(courseId, data);
      console.log("4. API Response Received:", response); // DEBUG
      
      showToast('success', 'Success', response.message || 'Course updated successfully!');
      
      setTimeout(() => {
        onSuccess();
        onClose();   
      }, 1500);

    } catch (err) {
      console.error("API Error Caught:", err); // DEBUG
      setError(err.message || 'Failed to update course.');
      showToast('error', 'Update Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <>
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Course</h2>
              <p className="text-sm text-gray-500">Update complete course details and settings.</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="animate-spin text-[#7c3aed] mb-2" size={32} />
                <p className="text-gray-500 text-sm">Fetching course details...</p>
              </div>
            ) : error && !formData.title ? (
               <div className="text-red-500 text-center py-10">{error}</div>
            ) : (
              // noValidate lagaya hai taaki browser ka required validation API call ko block na kare
              <form id="edit-course-form" onSubmit={handleSubmit} noValidate className="space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}

                {/* SECTION 1: Basic Information */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                    <Layout className="text-[#7c3aed]" size={18} />
                    <h3 className="text-md font-bold text-gray-800">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Course Title *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Slug (URL) *</label>
                      <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none bg-gray-50 text-gray-600 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Summary *</label>
                      <input type="text" name="summary" value={formData.summary} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm"></textarea>
                    </div>
                  </div>
                </motion.div>

                {/* SECTION 2: Media & Pricing */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                    <ImageIcon className="text-[#7c3aed]" size={18} />
                    <h3 className="text-md font-bold text-gray-800">Media & Pricing</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex items-center gap-4">
                      <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center shrink-0">
                        {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={24} />}
                        <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <UploadCloud className="text-white mb-1" size={20} />
                          <span className="text-white text-[10px] font-semibold">Change</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Course Thumbnail</p>
                        <p className="text-xs text-gray-500 mb-2">Leave empty to keep existing image.</p>
                        {imagePreview && <button type="button" onClick={removeImage} className="text-xs text-red-500 font-semibold hover:underline">Remove New Image</button>}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Duration</label>
                      <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Level</label>
                      <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Access Type & Price */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 mt-2">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Access Type</label>
                        <div className="flex gap-3">
                          <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer transition-all ${formData.accessType === '1' ? 'border-[#7c3aed] bg-white text-[#7c3aed] font-bold shadow-sm' : 'border-transparent bg-white/50 text-gray-500'}`}>
                            <input type="radio" name="accessType" value="1" checked={formData.accessType === '1'} onChange={handleChange} className="hidden" />
                            <ShieldCheck size={16} /> Free
                          </label>
                          <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer transition-all ${formData.accessType === '2' ? 'border-[#7c3aed] bg-white text-[#7c3aed] font-bold shadow-sm' : 'border-transparent bg-white/50 text-gray-500'}`}>
                            <input type="radio" name="accessType" value="2" checked={formData.accessType === '2'} onChange={handleChange} className="hidden" />
                            <IndianRupee size={16} /> Paid
                          </label>
                        </div>
                      </div>
                      <AnimatePresence>
                        {formData.accessType === '2' && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="relative">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Price (₹) *</label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required={formData.accessType === '2'} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#7c3aed] outline-none bg-white font-semibold text-sm" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Technologies</label>
                      <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" placeholder="React, Node.js" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Key Points</label>
                      <input type="text" name="points" value={formData.points} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" placeholder="Project based, Job ready" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Demand</label>
                      <input type="text" name="demand" value={formData.demand} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Rating</label>
                      <div className="flex items-center gap-1 h-[42px]">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <button key={starValue} type="button" onClick={() => setFormData(prev => ({ ...prev, star: String(starValue) }))} className="p-1 focus:outline-none hover:scale-110 transition-transform">
                            <Star size={20} className={Number(formData.star) >= starValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* SECTION 3: Appearance & Settings */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                    <Settings className="text-[#7c3aed]" size={18} />
                    <h3 className="text-md font-bold text-gray-800">Appearance & Settings</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="colorCode" value={formData.colorCode} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                        <input type="text" value={formData.colorCode} readOnly className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 outline-none text-xs font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Soft Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" name="softColorCode" value={formData.softColorCode} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer border-none p-0" />
                        <input type="text" value={formData.softColorCode} readOnly className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 outline-none text-xs font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Icon Class</label>
                      <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Sort Order</label>
                      <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
                    </div>

                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-6 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${formData.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="hidden" />
                          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Published</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${formData.isFeatured ? 'bg-blue-500' : 'bg-gray-300'}`}>
                          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="hidden" />
                          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Featured</span>
                      </label>
                    </div>
                  </div>
                </motion.div>

              </form>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" form="edit-course-form" disabled={isFetching || isSaving} className="px-8 py-2.5 rounded-xl font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}