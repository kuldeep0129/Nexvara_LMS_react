import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, X, ChevronLeft, ChevronRight, BookOpen, Clock, BarChart, Star, CheckCircle2, XCircle } from 'lucide-react';
import { useDraftCourses } from '../../../hooks/useDraftCourses';

export default function DraftCourses() {
  const { 
    courses, isLoading, error, pageNumber, totalPages, totalCount, setPageNumber 
  } = useDraftCourses();

  const [searchTerm, setSearchTerm] = useState('');

  // Search Filter (Client-side)
  const filteredCourses = courses.filter((course) => {
    const query = searchTerm.toLowerCase();
    return (
      (course.title || '').toLowerCase().includes(query) ||
      (course.slug || '').toLowerCase().includes(query) ||
      (course.level || '').toLowerCase().includes(query) ||
      (course.technologies || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Draft Courses</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage unpublished draft courses.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search drafts by title, slug, tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] text-sm"
          />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"><X size={16} /></button>}
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Course Info</th>
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold">Technologies</th>
                <th className="p-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="p-10 text-center"><Loader2 className="animate-spin text-[#7c3aed] mx-auto" size={32} /></td></tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center text-gray-500 flex flex-col items-center">
                    <BookOpen size={48} className="text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-700">No draft courses found</p>
                    <p className="text-sm">Try adjusting your search or create a new course.</p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                    
                    {/* Course Info (Image + Title + Slug) */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          {course.imageUrl ? (
                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen size={20}/></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-base">{course.title}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">/{course.slug}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]" title={course.summary}>{course.summary}</p>
                        </div>
                      </div>
                    </td>

                    {/* Details (Duration, Level, Rating) */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400"/> {course.duration || 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><BarChart size={14} className="text-gray-400"/> {course.level || 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400 fill-yellow-400"/> {course.star || '0'} / 5</span>
                      </div>
                    </td>

                    {/* Technologies */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {(course.technologies || '').split(',').slice(0, 3).map((tech, i) => (
                          tech.trim() && (
                            <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">
                              {tech.trim()}
                            </span>
                          )
                        ))}
                        {(course.technologies || '').split(',').length > 3 && (
                          <span className="text-xs text-gray-400 font-medium px-1">+more</span>
                        )}
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          course.isPublished 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {course.isPublished ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {course.isFeatured && (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
                             Featured
                           </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!isLoading && totalCount > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-2xl">
            <p className="text-sm text-gray-500">Showing <span className="font-semibold">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(pageNumber * 10, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> drafts</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"><ChevronLeft size={18} /></button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPageNumber(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${pageNumber === i + 1 ? 'bg-[#7c3aed] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages} className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}