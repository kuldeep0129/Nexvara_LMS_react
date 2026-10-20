import { motion } from 'framer-motion';

export default function GradeCard({ title, score, total, status }) {
  const percentage = (score / total) * 100;
  const isPassed = percentage >= 40;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-gray-900">{score}</span>
        <span className="text-gray-500 mb-1">/ {total}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-2 rounded-full ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </div>
    </motion.div>
  );
}