import { motion } from 'framer-motion';
import { studentData } from '../../data/studentMockData';

export default function StudentDashboard() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200 } }
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, Student! 👋</h1>
          <p className="text-gray-500 mt-1">Here is your learning progress overview.</p>
        </div>
        <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30">
          Resume Learning
        </button>
      </div>

      {/* 1. Stats Grid (ERD: Enrollments, LiveClasses, Certificates) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentData.stats.map((stat, index) => (
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

      {/* 2. Main Content Area (Courses & Grades) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: My Courses (ERD: Courses, Batches) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
            <button className="text-sm font-semibold text-[#7c3aed] hover:underline">View All</button>
          </div>
          
          <div className="grid gap-4">
            {studentData.courses.map((course) => (
              <div key={course.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {course.title.charAt(0)}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{course.title}</h3>
                      <p className="text-sm text-gray-500">Batch: {course.batch} • Next: {course.nextClass}</p>
                    </div>
                    <span className="text-sm font-bold text-[#7c3aed]">{course.progress}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-[#7c3aed] h-2.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Recent Grades (ERD: AssessmentAttempts) */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Recent Grades</h2>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            {studentData.recentGrades.map((grade) => {
              const percentage = (grade.score / grade.total) * 100;
              const isPassed = percentage >= 40;
              return (
                <div key={grade.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 text-sm">{grade.title}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isPassed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-800">{grade.score}</span>
                    <span className="text-gray-400 text-sm">/ {grade.total}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 ml-2">
                      <div className={`h-1.5 rounded-full ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            
            <button className="w-full py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors mt-2">
              View All Assessments
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}