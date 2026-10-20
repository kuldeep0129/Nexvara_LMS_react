import { LayoutDashboard, Users, Video, FileText, User } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../component/layout/Sidebar';
const teacherLinks = [
  { name: 'Dashboard', path: '/teacher', icon: <LayoutDashboard size={20} /> },
  { name: 'My Batches', path: '/teacher/batches', icon: <Users size={20} /> },
  { name: 'Live Classes', path: '/teacher/live', icon: <Video size={20} /> },
  { name: 'Assessments', path: '/teacher/assessments', icon: <FileText size={20} /> },
  { name: 'My Profile', path: '/teacher/profile', icon: <User size={20} /> }, // NAYA
];

export default function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        links={teacherLinks} 
        role="Teacher" 
        userName="Prof. Verma" // Teacher ka naam
      />
      
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-800 text-2xl">
            ☰
          </button>
          <span className="font-bold text-gray-800">Teacher Portal</span>
        </header>

        <main className="p-4 md:p-6 lg:p-8 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}