import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../component/layout/Sidebar'; // Path check karein
import { 
  LayoutDashboard, Users, BookOpen, Layers, FileVideo, Video, 
  CheckSquare, CreditCard, Award, HelpCircle, Edit3, MessageSquare, 
  BarChart, Settings, Calendar, UserCheck, Clock,UserPlus 
} from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
  { 
    name: 'Users', icon: <Users size={20} />, 
    children: [
      { name: 'All Users', path: '/admin/users' },
      { name: 'Students', path: '/admin/users/students' },
      { name: 'Teacher Management', path: '/admin/users/teachers' }, // NAYA: Teacher Management
      { name: 'User Details', path: '/admin/users/details' },
    ] 
  },
  { 
    name: 'Courses', icon: <BookOpen size={20} />, 
    children: [
      { name: 'All Courses', path: '/admin/courses' },
      { name: 'Add Course', path: '/admin/courses/add' },
      { name: 'Draft Courses', path: '/admin/courses/draft' },
      { name: 'Published Courses', path: '/admin/courses/published' },
    ] 
  },
  { 
    name: 'Batches', icon: <Layers size={20} />, 
    children: [
      { name: 'All Batches', path: '/admin/batches' },
      { name: 'Add Batch', path: '/admin/batches/add' },
      { name: 'Batch Schedules', path: '/admin/schedules' }, // NAYA: Batch Schedule
       { name: 'Teacher Assign', path: '/admin/teacher-assign' },
      { name: 'Upcoming Batches', path: '/admin/batches/upcoming' },
      { name: 'Active Batches', path: '/admin/batches/active' },
      { name: 'Completed Batches', path: '/admin/batches/completed' },
    ] 
  },
  { 
    name: 'Content', icon: <FileVideo size={20} />, 
    children: [
      { name: 'Course Modules', path: '/admin/content/modules' },
      { name: 'Course Videos', path: '/admin/content/videos' },
      { name: 'Study Materials', path: '/admin/content/materials' },
      { name: 'Course Syllabus', path: '/admin/content/syllabus' },
    ] 
  },
  { 
    name: 'Live Classes', icon: <Video size={20} />, 
    children: [
      { name: 'All Live Classes', path: '/admin/live' },
      { name: 'Upcoming Classes', path: '/admin/live/upcoming' },
      { name: 'Live Now', path: '/admin/live/now' },
      { name: 'Completed Classes', path: '/admin/live/completed' },
    ] 
  },
  { 
    name: 'Assessments', icon: <CheckSquare size={20} />, 
    children: [
      { name: 'All Assessments', path: '/admin/assessments' },
      { name: 'Create Assessment', path: '/admin/assessments/create' },
      { name: 'Questions', path: '/admin/assessments/questions' },
      { name: 'Attempts / Results', path: '/admin/assessments/results' },
    ] 
  },
  { 
    name: 'Payments', icon: <CreditCard size={20} />, 
    children: [
      { name: 'All Payments', path: '/admin/payments' },
      { name: 'Successful', path: '/admin/payments/success' },
      { name: 'Pending', path: '/admin/payments/pending' },
      { name: 'Failed', path: '/admin/payments/failed' },
    ] 
  },
  { name: 'Certificates', path: '/admin/certificates', icon: <Award size={20} /> },
  { name: 'Guidance', path: '/admin/guidance', icon: <HelpCircle size={20} /> },
  { name: 'Blog', path: '/admin/blog', icon: <Edit3 size={20} /> },
  { name: 'Interview Preparation', path: '/admin/interview', icon: <MessageSquare size={20} /> },
  { name: 'Reports', path: '/admin/reports', icon: <BarChart size={20} /> },
  { name: 'Profile', path: '/admin/profile', icon: <Settings size={20} /> }
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
      />
      
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen transition-all duration-300">
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