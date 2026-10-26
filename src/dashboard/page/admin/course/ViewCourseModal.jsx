import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, BookOpen, Clock, BarChart, Star, CheckCircle2, XCircle } from 'lucide-react';
import { courseService } from '../../../services/courseService';

export default function ViewCourseModal({ courseId, onClose }) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await courseService.getCourseById(courseId);
        setCourse(res.data || res);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Course Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-[#7c3aed]" size={32} /></div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : course && (
            <div className="space-y-6">
              {/* Header Image & Title */}
              <div className="flex gap-6 items-start">
                <div className="w-32 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                  {course.imageUrl ? <img src={course.imageUrl} className="w-full h-full object-cover" /> : <BookOpen className="m-auto mt-6 text-gray-300" size={32} />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
                  <p className="text-sm text-gray-500 font-mono mt-1">/{course.slug}</p>
                  <div className="flex gap-2 mt-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${course.isPublished ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {course.isFeatured && <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700">Featured</span>}
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Grid Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl"><span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Clock size={14}/> Duration</span> <p className="font-semibold text-gray-800">{course.duration || 'N/A'}</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><BarChart size={14}/> Level</span> <p className="font-semibold text-gray-800">{course.level || 'N/A'}</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Star size={14}/> Rating</span> <p className="font-semibold text-gray-800">{course.star} / 5</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><span className="text-xs text-gray-500">Demand</span> <p className="font-semibold text-gray-800">{course.demand || 'N/A'}</p></div>
              </div>

              {/* Description & Points */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Summary</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">{course.summary}</p>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Key Points</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {(course.points || '').split(',').map((p, i) => p.trim() && <li key={i}>{p.trim()}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {(course.technologies || '').split(',').map((t, i) => t.trim() && <span key={i} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-semibold border border-purple-100">{t.trim()}</span>)}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}