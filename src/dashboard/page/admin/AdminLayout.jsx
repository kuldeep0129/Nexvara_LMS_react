import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../component/layout/Sidebar';
import { LayoutDashboard, Users, CreditCard, BookOpen, Settings, User } from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
  { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
  { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
  { name: 'Content Manager', path: '/admin/content', icon: <BookOpen size={20} /> },
  { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  { name: 'My Profile', path: '/admin/profile', icon: <User size={20} /> }, // NAYA
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        links={adminLinks} 
        role="Admin" 
        userName="Super Admin" 
      />
      
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-800 text-2xl">
            ☰
          </button>
          <span className="font-bold text-gray-800">Admin Portal</span>
        </header>

        <main className="p-4 md:p-6 lg:p-8 flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}