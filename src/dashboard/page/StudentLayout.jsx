
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from '../../dashboard/component/layout/Sidebar';

import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Video,
  FileText,
  CheckSquare,
  Award,
  CreditCard,
  User,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';

// Student navigation
const studentLinks = [
  {
    name: 'Dashboard',
    path: '/student',
    icon: <LayoutDashboard size={20} />
  },

  {
    name: 'Schedule',
    path: '/student/schedule',
    icon: <CalendarDays size={20} />
  },

  {
    name: 'My Learning',
    icon: <BookOpen size={20} />,
    children: [
      
      {
        name: 'My Batches',
        path: '/student/batches'
      },
      {
        name: 'Continue Learning',
        path: '/student/continue'
      },
      {
        name: 'Progress',
        path: '/student/progress'
      }
    ]
  },

  {
    name: 'Explore Courses',
    path: '/student/explore',
    icon: <Layers size={20} />
  },

  {
    name: 'Live Classes',
    icon: <Video size={20} />,
    children: [
      {
        name: 'Upcoming',
        path: '/student/live/upcoming'
      },
      {
        name: 'Completed',
        path: '/student/live/completed'
      }
    ]
  },

  {
    name: 'Study Material',
    path: '/student/materials',
    icon: <FileText size={20} />
  },

  {
    name: 'Assessments',
    icon: <CheckSquare size={20} />,
    children: [
      {
        name: 'Upcoming',
        path: '/student/assessments/upcoming'
      },
      {
        name: 'Available',
        path: '/student/assessments/available'
      },
      {
        name: 'Results',
        path: '/student/assessments/results'
      }
    ]
  },

  {
    name: 'Attendance',
    path: '/student/attendance',
    icon: <CheckSquare size={20} />
  },

  {
    name: 'Certificates',
    path: '/student/certificates',
    icon: <Award size={20} />
  },

  {
    name: 'Payments',
    path: '/student/payments',
    icon: <CreditCard size={20} />
  },

  {
    name: 'My Profile',
    path: '/student/profile',
    icon: <User size={20} />
  }
];

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Current page title
  const currentPage = studentLinks.find(link => {
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

  const pageTitle = currentPage?.name || 'Student Portal';

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
        links={studentLinks}
        role="Student"
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
                Student Portal
              </p>
            </div>

          </div>

          {/* Current page */}
          <div className="max-w-[45%] truncate rounded-xl bg-[#F3F0FC] px-3 py-2 text-xs font-semibold text-[#6D5BD0]">
            {pageTitle}
          </div>

        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7">

       <AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
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
