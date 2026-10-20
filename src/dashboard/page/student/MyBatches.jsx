import { motion } from 'framer-motion';
import { Calendar, Clock, Video, ChevronRight } from 'lucide-react';

const studentBatches = [
  { id: 1, name: 'FS-2024-A (Full Stack)', teacher: 'Prof. Verma', progress: 65, schedule: 'Mon, Wed, Fri', time: '4:00 PM - 5:30 PM' },
  { id: 2, name: 'RN-2024-B (React Native)', teacher: 'Prof. Gupta', progress: 30, schedule: 'Tue, Thu', time: '10:00 AM - 11:30 AM' },
];

export default function StudentBatches() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
        <p className="text-gray-500 text-sm mt-1">Access your enrolled batches and schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentBatches.map((batch, i) => (
          <motion.div 
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-[#7c3aed] bg-purple-50 px-2.5 py-1 rounded-md mb-2 inline-block">
                  {batch.name.split(' ')[0]}
                </span>
                <h3 className="text-lg font-bold text-gray-800">{batch.name.split('(')[1].replace(')', '')}</h3>
                <p className="text-sm text-gray-500 mt-1">Instructor: {batch.teacher}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar size={18} className="text-gray-400" />
                <span>{batch.schedule}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock size={18} className="text-gray-400" />
                <span>{batch.time}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                <span>Course Progress</span>
                <span className="text-[#7c3aed]">{batch.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${batch.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] h-2 rounded-full"
                />
              </div>
            </div>

            <button className="w-full py-3 bg-[#7c3aed] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#6d28d9] transition-colors group">
              Enter Classroom 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}