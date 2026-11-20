import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, Users, BarChart, Star, PlayCircle, 
  Edit, Plus, MoreVertical, Trash2, Eye, LayoutDashboard, List, 
  FolderOpen, Video, FileText, Settings, TrendingUp, CheckCircle2, 
  ChevronRight, UploadCloud, Link as LinkIcon, Calendar, Loader2, BookOpen
} from 'lucide-react';

// Hook Import
import { useCourseCurriculum } from '../../../hooks/useCourseCurriculum';
import AddSyllabusModal from './AddSyllabusModal'; 
import EditSyllabusModal from './EditSyllabusModal'; 

// ==========================================
// STATIC DATA (Modules Tab)
// ==========================================
const DEMO_MODULES = [
  {
    id: 1,
    title: 'Module 1: C# Basics',
    description: 'Learn the core concepts of C# programming.',
    videos: 3, materials: 2, resources: 1,
    lessons: [
      { id: 101, title: 'C# Introduction', duration: '12:45', status: 'Published' },
      { id: 102, title: 'Variables and Data Types', duration: '18:30', status: 'Published' },
      { id: 103, title: 'Control Flow', duration: '16:20', status: 'Published' },
    ]
  },
  { id: 2, title: 'Module 2: ASP.NET Core', videos: 0, materials: 0, resources: 0, lessons: [] },
];

export default function ManageCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeModule, setActiveModule] = useState(1);

  // Modals State
  const [isAddSyllabusOpen, setIsAddSyllabusOpen] = useState(false);
  const [isEditSyllabusOpen, setIsEditSyllabusOpen] = useState(false);
  const [selectedSyllabusId, setSelectedSyllabusId] = useState(null);

  // API Hook Call
  const { 
    courseData, isLoading, error, 
    addSyllabus, isAdding, 
    toggleSyllabusStatus, togglingSyllabusId,
    refetch 
  } = useCourseCurriculum(id);

  const selectedModuleData = DEMO_MODULES.find(m => m.id === activeModule);

  // Tabs (only Overview, Syllabus, Modules)
  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Syllabus', icon: List },
    { name: 'Modules', icon: FolderOpen },
  ];

  // Handle Add Syllabus Submit
  const handleAddSyllabus = async (formData) => {
    const res = await addSyllabus(formData);
    if (res.success) {
      setIsAddSyllabusOpen(false);
    } else {
      alert(res.error); 
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = async (syllabusId) => {
    const res = await toggleSyllabusStatus(syllabusId);
    if (!res.success) {
      alert(res.error);
    }
  };

  // ---------------- LOADING & ERROR STATES ----------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#7c3aed] mb-4" size={48} />
        <p className="text-gray-500 font-semibold animate-pulse">Loading Course Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-md w-full shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 w-full">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ---------------- TAB CONTENT RENDERERS ----------------

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dynamic Description */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm col-span-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Course Description</h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
          {courseData?.courseDescription && courseData.courseDescription !== 'string' 
            ? courseData.courseDescription 
            : courseData?.courseShortDescription || 'No description provided.'}
        </p>
        
        {/* Dynamic Points */}
        {courseData?.coursePoint && (
          <div className="mt-4 pt-6 border-t border-gray-100">
            <h4 className="font-bold text-lg text-gray-800 mb-4">What you'll learn</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courseData.coursePoint.split(',').map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{point.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modern Technologies Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm col-span-full">
        <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-5 bg-[#7c3aed] rounded-full inline-block"></span> Technologies Covered
            </h3>
            <p className="text-xs text-gray-500 mt-1">Tools and frameworks you will master in this course</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {courseData?.technologies ? courseData.technologies.split(',').map((tech, i) => (
            <div 
              key={i} 
              className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#7c3aed] hover:shadow-md transition-all cursor-default"
            >
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                <Settings size={16} />
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-[#7c3aed] transition-colors">
                {tech.replace(/'/g, '').trim()}
              </span>
            </div>
          )) : <p className="text-gray-500 text-sm">Not specified.</p>}
        </div>
      </div>
    </motion.div>
  );

  const renderSyllabus = () => {
    const syllabusList = courseData?.syllabus || [];

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-500 rounded-full inline-block"></span> Course Syllabus
            </h3>
            <p className="text-xs text-gray-500 mt-1">Complete roadmap of this course</p>
          </div>
          
          <button 
            onClick={() => setIsAddSyllabusOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#7c3aed] text-[#7c3aed] rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors"
          >
            <Plus size={14} /> Add Syllabus Topic
          </button>
        </div>
        
        <div className="space-y-3">
          {syllabusList.map((item, index) => (
            <div key={item.syllabusId || index} className={`flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors group ${togglingSyllabusId === item.syllabusId ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {item.displayOrder || index + 1}
                </span>
                <div>
                  <p className="font-bold text-gray-800">{item.syllabusTitle}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.syllabusDescription}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Status Toggle */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleStatus(item.syllabusId)}
                    disabled={togglingSyllabusId === item.syllabusId}
                    className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${item.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
                    {togglingSyllabusId === item.syllabusId && <Loader2 className="absolute inset-0 m-auto text-white animate-spin" size={10} />}
                  </button>
                  <span className={`text-[10px] font-bold uppercase ${item.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setSelectedSyllabusId(item.syllabusId);
                      setIsEditSyllabusOpen(true);
                    }} 
                    className="p-2 text-gray-400 hover:text-[#7c3aed] bg-white rounded-lg shadow-sm"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(item.syllabusId)} 
                    className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-lg shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {syllabusList.length === 0 && (
             <div className="text-center py-8 text-gray-500">No syllabus topics added yet.</div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderModules = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-5 bg-orange-500 rounded-full inline-block"></span> Modules & Content Structure
          </h3>
          <p className="text-xs text-gray-500 mt-1">Manage modules, videos and materials</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        
        {/* LEFT SIDE: Module List */}
        <div className="w-full md:w-1/3 space-y-2">
          {DEMO_MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                activeModule === mod.id 
                  ? 'bg-purple-50 border-purple-200 shadow-sm' 
                  : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${activeModule === mod.id ? 'text-[#7c3aed]' : 'text-gray-800'}`}>
                  {mod.title}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[150px]">
                  {mod.description}
                </span>
              </div>
              {activeModule === mod.id && <ChevronRight size={16} className="text-[#7c3aed] shrink-0" />}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE: Active Module Details */}
        <div className="w-full md:w-2/3 border border-gray-100 rounded-xl p-6 bg-gray-50/30 relative">
          
          {/* Header with Title & Desc */}
          <div className="flex justify-between items-start mb-4 border-b border-gray-200/60 pb-4">
            <div>
              <h4 className="font-bold text-xl text-gray-900">
                {selectedModuleData?.title || 'Module Title'}
              </h4>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {selectedModuleData?.description || 'No description available for this module.'}
              </p>
            </div>
          </div>

          {/* Stats Pills */}
          <div className="flex gap-2 mb-5">
            <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Video size={14} className="text-blue-500"/> Videos ({selectedModuleData?.videos || 0})
            </span>
            <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
              <FileText size={14} className="text-orange-500"/> Materials ({selectedModuleData?.materials || 0})
            </span>
          </div>

          {/* Lessons List */}
          <div className="space-y-2 bg-white rounded-xl border border-gray-100 p-2">
            {selectedModuleData?.lessons?.length > 0 ? selectedModuleData.lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <PlayCircle size={20} className="text-purple-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-gray-500">{lesson.duration}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${lesson.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {lesson.status}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={16}/></button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-sm text-gray-500">
                No lessons added in this module yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );

  // API Data Extraction
  const displayRating = courseData?.rating || '0';
  const isPublished = courseData?.isPublished ?? false;
  const hasImage = courseData?.cousrseImage && courseData.cousrseImage !== 'string';

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-10">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Course Details</h1>
          </div>
          <div className="flex gap-2">
             <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              <Eye size={16} /> View Course
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#7c3aed] text-white rounded-xl font-semibold text-sm hover:bg-[#6d28d9] shadow-md shadow-purple-500/20 transition-colors">
              <Edit size={16} /> Edit Course
            </button>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-lg relative z-10 bg-gray-100 flex items-center justify-center">
             {hasImage ? (
                <img src={courseData.cousrseImage} alt="Course" className="w-full h-full object-cover" />
             ) : (
                <BookOpen size={48} className="text-gray-400" />
             )}
          </div>

          <div className="flex-1 z-10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{courseData?.courseName}</h2>
              
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${isPublished ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                {isPublished ? 'Published' : 'Unpublished'}
              </span>

              <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                {displayRating} <span className="text-gray-400 font-normal">(2.5k reviews)</span>
              </div>
            </div>
            
            <p className="text-gray-500 mb-4 max-w-2xl text-sm">{courseData?.courseShortDescription}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BarChart size={18} /></div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Level</p>
                  <p className="text-sm font-bold text-gray-800">{courseData?.courseLevel || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock size={18} /></div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Duration</p>
                  <p className="text-sm font-bold text-gray-800">{courseData?.courseDuration ? `${courseData.courseDuration} weeks` : 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={18} /></div>
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Students</p>
                  <p className="text-sm font-bold text-gray-800">{courseData?.activeStudent > 0 ? `${courseData.activeStudent}+` : '0'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-[#7c3aed] text-[#7c3aed] bg-purple-50/50 rounded-t-lg' 
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-lg'
                }`}
              >
                <Icon size={16} /> {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && <div key="overview">{renderOverview()}</div>}
          {activeTab === 'Syllabus' && <div key="syllabus">{renderSyllabus()}</div>}
          {activeTab === 'Modules' && <div key="modules">{renderModules()}</div>}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AddSyllabusModal 
        isOpen={isAddSyllabusOpen}
        onClose={() => setIsAddSyllabusOpen(false)}
        onSubmit={handleAddSyllabus}
        isLoading={isAdding}
      />

      <EditSyllabusModal 
        isOpen={isEditSyllabusOpen}
        syllabusId={selectedSyllabusId}
        courseId={id}
        onClose={() => {
          setIsEditSyllabusOpen(false);
          setSelectedSyllabusId(null);
        }}
        onSuccess={() => refetch()} 
      />

    </div>
  );
}