import { motion } from 'framer-motion';
import { X, User, Mail, Phone, BookOpen, MapPin, Calendar } from 'lucide-react';

export default function ViewStudentModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="h-24 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors"><X size={18} /></button>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
             <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                {student.profileImageUrl ? <img src={student.profileImageUrl} className="w-full h-full object-cover" /> : <User size={30} className="text-gray-400" />}
             </div>
          </div>
        </div>

        <div className="pt-14 p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">{student.userName}</h2>
          <p className="text-sm text-gray-500 mb-6">{student.email}</p>

          <div className="space-y-4 text-left border-t border-gray-100 pt-6">
             <div className="flex items-center gap-3 text-sm"><Phone className="text-gray-400" size={16}/> <span className="text-gray-700">{student.mobileNumber || 'N/A'}</span></div>
             <div className="flex items-center gap-3 text-sm"><BookOpen className="text-gray-400" size={16}/> <span className="text-gray-700">{student.qualification || 'N/A'} ({student.collegeName || 'N/A'})</span></div>
             <div className="flex items-center gap-3 text-sm"><Calendar className="text-gray-400" size={16}/> <span className="text-gray-700">Passed out: {student.passingYear || 'N/A'}</span></div>
             <div className="flex items-start gap-3 text-sm"><MapPin className="text-gray-400 mt-0.5" size={16}/> <span className="text-gray-700">{student.address || 'N/A'}</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}