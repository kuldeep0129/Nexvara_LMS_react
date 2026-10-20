import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Video } from 'lucide-react';
import StatusBadge from '../../component/ui/StatusBadge';

const teacherBatches = [
  { id: 1, name: 'FS-2024-A (Full Stack)', students: 45, nextClass: 'Today, 4:00 PM', status: 'Active' },
  { id: 2, name: 'FS-2024-B (Full Stack)', students: 38, nextClass: 'Tomorrow, 10:00 AM', status: 'Active' },
];

export default function TeacherBatches() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Batches</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your students and live sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teacherBatches.map((batch, i) => (
          <motion.div 
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{batch.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Users size={16} /> {batch.students} Students</span>
                  <span className="flex items-center gap-1"><BookOpen size={16} /> Full Stack</span>
                </div>
              </div>
              <StatusBadge status={batch.status} />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Next Live Class</p>
                <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {batch.nextClass}
                </p>
              </div>
              <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white p-2.5 rounded-lg shadow-md transition-colors">
                <Video size={20} />
              </button>
            </div>

            <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-[#7c3aed] transition-colors">
              View Student List
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}