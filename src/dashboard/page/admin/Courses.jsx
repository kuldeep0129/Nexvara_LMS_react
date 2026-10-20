import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, UserPlus } from 'lucide-react';
import StatusBadge from '../../component/ui/StatusBadge';

const mockBatches = [
  { id: 1, name: 'FS-2024-A (Full Stack)', course: 'Web Development', teacher: 'Prof. Verma', students: 45, status: 'Active', startDate: '01 Jan 2024' },
  { id: 2, name: 'RN-2024-B (React Native)', course: 'Mobile Apps', teacher: 'Not Assigned', students: 30, status: 'Upcoming', startDate: '15 Feb 2024' },
  { id: 3, name: 'UI-2024-C (UI/UX)', course: 'Design', teacher: 'Prof. Gupta', students: 52, status: 'Active', startDate: '10 Dec 2023' },
];

export default function AdminCourses() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Batches & Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Assign teachers and manage batch schedules.</p>
        </div>
        <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all">
          <Plus size={18} /> Create New Batch
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search batches..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] transition-all" />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          <Filter size={18} /> Filter by Status
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-semibold">Batch Name</th>
                <th className="p-4 font-semibold">Assigned Teacher</th>
                <th className="p-4 font-semibold">Students</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Start Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockBatches.map((batch, i) => (
                <motion.tr 
                  key={batch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{batch.name}</p>
                    <p className="text-xs text-gray-500">{batch.course}</p>
                  </td>
                  <td className="p-4">
                    {batch.teacher === 'Not Assigned' ? (
                      <button className="text-[#7c3aed] text-sm font-semibold flex items-center gap-1 hover:underline">
                        <UserPlus size={14} /> Assign Now
                      </button>
                    ) : (
                      <span className="text-sm text-gray-700 font-medium">{batch.teacher}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{batch.students} Enrolled</td>
                  <td className="p-4"><StatusBadge status={batch.status} /></td>
                  <td className="p-4 text-sm text-gray-500">{batch.startDate}</td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#7c3aed] rounded-lg hover:bg-purple-50 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}