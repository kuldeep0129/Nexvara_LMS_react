import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, CheckCircle, Clock } from 'lucide-react';
import { teacherData } from '../../data/teacherMockData';

export default function TeacherDashboard() {
  const [gradingList, setGradingList] = useState(teacherData.pendingGrading);
  const [activeGradeId, setActiveGradeId] = useState(null);
  const [gradeInput, setGradeInput] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200 } }
  };

  // Grade Submit karne ka function
  const submitGrade = (id) => {
    if (!gradeInput) return;
    // API call yahan aayegi (POST /Assessments/Grade)
    setGradingList(prev => prev.filter(item => item.id !== id));
    setActiveGradeId(null);
    setGradeInput('');
    // Yahan aap toast show kar sakte hain
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Teacher Dashboard 👨‍🏫</h1>
          <p className="text-gray-500 mt-1">Manage your batches, classes, and grading here.</p>
        </div>
        <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2">
          <Video size={18} /> Start Live Class
        </button>
      </div>

      {/* 1. Stats Grid (ERD: Batches, BatchStudents, Assessments) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherData.stats.map((stat, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Upcoming Live Classes (ERD: LiveClasses) */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Live Classes</h2>
            <button className="text-sm font-semibold text-[#7c3aed] hover:underline">View Schedule</button>
          </div>
          
          <div className="space-y-4">
            {teacherData.upcomingClasses.map((cls) => (
              <div key={cls.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{cls.topic}</h3>
                  <p className="text-sm text-gray-500">Batch: {cls.batch} • {cls.platform}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Clock size={14} /> {cls.time}
                  </span>
                  <button className="bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-xl transition-colors">
                    <Video size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. Pending Grading (ERD: AssessmentAttempts) - Trending Grading UI */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Pending Grading</h2>
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">
              {gradingList.length} Pending
            </span>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <AnimatePresence>
              {gradingList.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <CheckCircle className="text-green-500 w-12 h-12 mb-3" />
                  <p>All caught up! No pending gradings.</p>
                </motion.div>
              ) : (
                gradingList.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <div className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.studentName}</h4>
                        <p className="text-sm text-gray-500">{item.assessment} • {item.submittedAt}</p>
                      </div>
                      
                      {activeGradeId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            placeholder={`/ ${item.maxMarks}`}
                            value={gradeInput}
                            onChange={(e) => setGradeInput(e.target.value)}
                            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]"
                          />
                          <button 
                            onClick={() => submitGrade(item.id)}
                            className="bg-[#7c3aed] text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#6d28d9]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setActiveGradeId(item.id)}
                          className="bg-purple-50 text-[#7c3aed] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors"
                        >
                          Grade Now
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}