import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Loader2, ArrowLeft, BookOpen, Calendar, Users, Settings, CheckCircle2 } from 'lucide-react';
import { batchService } from '../../../services/batchService';
import { courseService } from '../../../services/courseService';
import ToastNotification from '../../../../ui/ToastNotification';

export default function EditBatch() {
  const { id } = useParams(); // URL se ID nikal rahe hain
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    code: '',
    description: '',
    startDate: '',
    endDate: '',
    capacity: 30,
    isPublished: false,
  });

  const [courses, setCourses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  // 1. Fetch Courses for Dropdown & Fetch Batch Data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch courses
        const coursesRes = await courseService.getCoursesList(1, 100);
        setCourses(coursesRes.data?.items || []);
        setIsLoadingCourses(false);

        // Fetch batch details
        const batchRes = await batchService.getBatchById(id);
        const batchData = batchRes.data || batchRes;
        
        // Format dates to YYYY-MM-DD for HTML date input
        const formatForInput = (dateStr) => {
          if (!dateStr) return '';
          return new Date(dateStr).toISOString().split('T')[0];
        };

        setFormData({
          courseId: batchData.courseId || '',
          name: batchData.name || '',
          code: batchData.code || '',
          description: batchData.description || '',
          startDate: formatForInput(batchData.startDate),
          endDate: formatForInput(batchData.endDate),
          capacity: batchData.capacity || 0,
          isPublished: batchData.isPublished || false,
        });

      } catch (err) {
        showToast('error', 'Load Failed', err.message);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Payload as per Swagger schema
      const payload = {
        id: Number(id), // Required in body
        courseId: Number(formData.courseId),
        name: formData.name,
        code: formData.code,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        capacity: Number(formData.capacity),
        isPublished: formData.isPublished,
      };

      const response = await batchService.updateBatch(id, payload);
      
      showToast('success', 'Batch Updated!', response.message || 'Batch updated successfully.');
      
      setTimeout(() => {
        navigate(`/admin/batches/${id}`); // Redirect back to details page
      }, 1500);

    } catch (err) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (isFetching) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#7c3aed]" size={40} />
      </div>
    );
  }

  return (
    <>
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Batch</h1>
            <p className="text-gray-500 text-sm mt-1">Update batch details and settings.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: Basic Information */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <BookOpen className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Batch Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Select Course *</label>
                <select 
                  name="courseId" 
                  value={formData.courseId} 
                  onChange={handleChange} 
                  required 
                  disabled={isLoadingCourses}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none bg-white text-sm"
                >
                  <option value="">{isLoadingCourses ? "Loading courses..." : "Choose a Course"}</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Batch Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Batch Code *</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm"></textarea>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: Schedule & Capacity */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <Calendar className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Schedule & Capacity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Start Date *</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-gray-700 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">End Date *</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-gray-700 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Max Capacity *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#7c3aed] outline-none text-sm" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* SECTION 3: Settings */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
              <Settings className="text-[#7c3aed]" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Settings</h2>
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${formData.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="hidden" />
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Publish Batch (Visible to students)</span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fadeInUp} className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isSaving ? 'Updating Batch...' : 'Update Batch'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </>
  );
}