import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, ArrowLeft, Image as ImageIcon, Layout, Settings, CheckCircle2, Star, UploadCloud, X, IndianRupee, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../../services/courseService';
import ToastNotification from '../../../../ui/ToastNotification';

export default function AddCourse() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    points: '',
    technologies: '',
    description: '',
    duration: '',
    demand: '',
    star: '5',
    level: 'Beginner',
    isPublished: false,
    sortOrder: 0,
    isFeatured: false,
    icon: '',
    colorCode: '#7c3aed',
    softColorCode: '#f3f0fa',
    accessType: '1', // 1 = Free, 2 = Paid
    price: '0',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });

  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let finalValue = type === 'checkbox' ? checked : value;

    if (name === 'title' && !isSlugManual) {
      finalValue = value;
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
    console.log("1. File Selected:", file); 
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
    
    console.log("2. Form Submit Triggered!"); 
    
    setIsSaving(true);

    try {
      const data = new FormData();
      
      // Append text/boolean fields
      Object.keys(formData).forEach(key => {
        data.append(key, String(formData[key])); 
      });

      // Append Image File with key 'ImageUrl' as required by Backend
      if (imageFile) {
        console.log("3. Image attached to FormData as 'ImageUrl':", imageFile.name);
        data.append('ImageUrl', imageFile); 
      } else {
        console.log("3. No image file selected.");
      }

      // DEBUG: Print all FormData keys
      console.log("4. Final FormData Keys:");
      for (let [key, value] of data.entries()) {
        console.log(`   ${key}:`, value);
      }

      console.log("5. Sending Request to API...");
      const response = await courseService.createCourse(data);
      console.log("6. API Response Received:", response);

      showToast('success', 'Course Created!', response.message || 'The course has been successfully created.');
      
      setTimeout(() => {
        navigate('/admin/courses'); 
      }, 2000);

    } catch (err) {
      console.error("API Error Caught:", err);
      showToast('error', 'Creation Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="p-6 max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
              <p className="text-gray-500 text-sm mt-1">Add a new course to the platform.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          
          {/* SECTION 1: Basic Information */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <Layout className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Course Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="e.g. Full Stack Web Development" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Slug (URL) *</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none bg-gray-50 text-gray-600" placeholder="full-stack-web-development" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Summary *</label>
                <input type="text" name="summary" value={formData.summary} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="Short summary of the course..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="Detailed description of the course..."></textarea>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: Course Details & Pricing */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <ImageIcon className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Details, Media & Pricing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Course Thumbnail (Image)</label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative cursor-pointer group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud className="mx-auto text-gray-400 group-hover:text-[#7c3aed] mb-2 transition-colors" size={32} />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                ) : (
                  <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="e.g. 6 Months" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Level</label>
                <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-purple-50 rounded-xl border border-purple-100 mt-2">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Course Access Type *</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.accessType === '1' ? 'border-[#7c3aed] bg-white text-[#7c3aed] font-bold shadow-sm' : 'border-transparent bg-white/50 text-gray-500'}`}>
                      <input type="radio" name="accessType" value="1" checked={formData.accessType === '1'} onChange={handleChange} className="hidden" />
                      <ShieldCheck size={18} /> Free
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.accessType === '2' ? 'border-[#7c3aed] bg-white text-[#7c3aed] font-bold shadow-sm' : 'border-transparent bg-white/50 text-gray-500'}`}>
                      <input type="radio" name="accessType" value="2" checked={formData.accessType === '2'} onChange={handleChange} className="hidden" />
                      <IndianRupee size={18} /> Paid
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {formData.accessType === '2' && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative">
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Course Price (₹) *</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required={formData.accessType === '2'} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none bg-white font-semibold" placeholder="e.g. 4999" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Technologies (Comma separated)</label>
                <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="React, Node.js, MongoDB" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Key Points (Comma separated)</label>
                <input type="text" name="points" value={formData.points} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="Project based, Job ready" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Demand</label>
                <input type="text" name="demand" value={formData.demand} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="e.g. High" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Course Rating</label>
                <div className="flex items-center gap-1 h-[42px]">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button key={starValue} type="button" onClick={() => setFormData(prev => ({ ...prev, star: String(starValue) }))} className="p-1 focus:outline-none hover:scale-110 transition-transform">
                      <Star size={24} className={Number(formData.star) >= starValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500 font-medium">({formData.star} / 5)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SECTION 3: Appearance & Settings */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <Settings className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Appearance & Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" name="colorCode" value={formData.colorCode} onChange={handleChange} className="w-12 h-12 rounded cursor-pointer border-none p-0" />
                  <input type="text" value={formData.colorCode} readOnly className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Soft Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" name="softColorCode" value={formData.softColorCode} onChange={handleChange} className="w-12 h-12 rounded cursor-pointer border-none p-0" />
                  <input type="text" value={formData.softColorCode} readOnly className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Icon Name/Class</label>
                <input type="text" name="icon" value={formData.icon} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" placeholder="e.g. FaCode" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Sort Order</label>
                <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none" />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-6 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${formData.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="hidden" />
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Publish Immediately</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${formData.isFeatured ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="hidden" />
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Mark as Featured</span>
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isSaving ? 'Creating Course...' : 'Create Course'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </>
  );
}