import { LayoutDashboard, BookOpen, Video, Award, User } from 'lucide-react'; // User icon import karein
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../component/layout/Sidebar.jsx';
// Icons ke sath links define karein

const studentLinks = [
  { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
  { name: 'My Batches', path: '/student/courses', icon: <BookOpen size={20} /> },
  { name: 'Live Classes', path: '/student/live', icon: <Video size={20} /> },
  { name: 'Certificates', path: '/student/certificates', icon: <Award size={20} /> },
  { name: 'My Profile', path: '/student/profile', icon: <User size={20} /> }, // NAYA
];

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        links={studentLinks} 
        role="Student" 
        userName="Rahul Sharma" // Dynamic user name yahan aayega
      />
      
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-800 text-2xl">
            ☰
          </button>
          <span className="font-bold text-gray-800">Student Portal</span>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}