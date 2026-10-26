
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from '../../component/layout/Sidebar';

import {
  LayoutDashboard,
  Layers,
  Users,
  Video,
  CheckSquare,
  FileVideo,
  Award,
  User,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';

// Teacher Navigation
const teacherLinks = [
  {
    name: 'Dashboard',
    path: '/teacher',
    icon: <LayoutDashboard size={20} />
  },

  {
    name: 'Schedule',
    path: '/teacher/schedule',
    icon: <CalendarDays size={20} />
  },

  {
    name: 'My Batches',
    icon: <Layers size={20} />,
    children: [
      {
        name: 'Active Batches',
        path: '/teacher/batches/active'
      },
      {
        name: 'Upcoming Batches',
        path: '/teacher/batches/upcoming'
      },
      {
        name: 'Completed Batches',
        path: '/teacher/batches/completed'
      }
    ]
  },

  {
    name: 'My Students',
    path: '/teacher/students',
    icon: <Users size={20} />
  },

  {
    name: 'Live Classes',
    icon: <Video size={20} />,
    children: [
      {
        name: 'Upcoming',
        path: '/teacher/live/upcoming'
      },
      {
        name: 'Live',
        path: '/teacher/live/now'
      },
      {
        name: 'Completed',
        path: '/teacher/live/completed'
      }
    ]
  },

  {
    name: 'Attendance',
    path: '/teacher/attendance',
    icon: <CheckSquare size={20} />
  },

  {
    name: 'Assessments',
    icon: <FileVideo size={20} />,
    children: [
      {
        name: 'My Assessments',
        path: '/teacher/assessments'
      },
      {
        name: 'Create Assessment',
        path: '/teacher/assessments/create'
      },
      {
        name: 'Questions',
        path: '/teacher/assessments/questions'
      },
      {
        name: 'Results',
        path: '/teacher/assessments/results'
      }
    ]
  },

  {
    name: 'Course Content',
    path: '/teacher/content',
    icon: <FileVideo size={20} />
  },

  {
    name: 'Certificates',
    path: '/teacher/certificates',
    icon: <Award size={20} />
  },

  {
    name: 'My Profile',
    path: '/teacher/profile',
    icon: <User size={20} />
  }
];

export default function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  // Open / close sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Current page
  const currentPage = teacherLinks.find(link => {
    if (link.path === location.pathname) {
      return true;
    }

    if (link.children) {
      return link.children.some(
        child => child.path === location.pathname
      );
    }

    return false;
  });

  const pageTitle = currentPage?.name || 'Teacher Portal';

  return (
    <div className="min-h-screen bg-[#F0EDFF]">

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-[#241C45]/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        links={teacherLinks}
        role="Teacher"
      />

      {/* Main Content */}
      <div className="flex min-h-screen flex-col lg:ml-[260px]">

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EAE5F7] bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">

          <div className="flex items-center gap-3">

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6D5BD0] transition hover:bg-[#E7E0FC]"
              aria-label="Open sidebar"
            >
              {isSidebarOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </motion.button>

            <div>
              <h1 className="text-sm font-bold text-[#40376A]">
                Nexvara LMS
              </h1>

              <p className="text-[11px] text-[#9690AA]">
                Teacher Portal
              </p>
            </div>

          </div>

          {/* Current Page */}
          <div className="max-w-[45%] truncate rounded-xl bg-[#F3F0FC] px-3 py-2 text-xs font-semibold text-[#6D5BD0]">
            {pageTitle}
          </div>

        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7">

          <AnimatePresence mode="wait">

            <motion.div
              key={location.pathname}
              initial={{
                opacity: 0,
                y: 12
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -8
              }}
              transition={{
                duration: 0.25,
                ease: 'easeOut'
              }}
              className="min-h-full"
            >

              <Outlet />

            </motion.div>

          </AnimatePresence>

        </main>

      </div>

    </div>
  );
}
