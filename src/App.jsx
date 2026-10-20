import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AppProvider } from './ctx.jsx';
import ScrollManager from './ScrollManager.jsx';
import { GooFilter } from './ui/BlobButton.jsx';

import PublicLayout from './layout/PublicLayout.jsx';
import ProtectedRoute from './dashboard/component/ProtectedRoute.jsx'; // NAYA IMPORT

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import NotFound from './pages/NotFound.jsx';
import EmailVerification from './pages/EmailVerification.jsx';

// ==========================================
// STUDENT IMPORTS
// ==========================================
import StudentLayout from './dashboard/page/StudentLayout.jsx';
import StudentDashboard from './dashboard/page/student/Dashboard.jsx';
import StudentBatches from './dashboard/page/student/MyBatches.jsx';

// ==========================================
// TEACHER IMPORTS
// ==========================================
import TeacherLayout from './dashboard/page/teacher/TeacherLayout.jsx';
import TeacherDashboard from './dashboard/page/teacher/Dashboard.jsx';
import TeacherBatches from './dashboard/page/teacher/MyBatches.jsx';

// ==========================================
// ADMIN IMPORTS
// ==========================================
import AdminLayout from './dashboard/page/admin/AdminLayout.jsx';
import AdminDashboard from './dashboard/page/admin/Dashboard.jsx';
import AdminCourses from './dashboard/page/admin/Courses.jsx';

// ==========================================
// Profile IMPORTS
// ==========================================
import Profile from './dashboard/page/Profile.jsx';

export default function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />

      <ScrollManager />
      <GooFilter />

      <Routes>
        {/* ==========================================
            PUBLIC WEBSITE ROUTES
        ========================================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Unknown public URLs */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Email Verification - Without Public Header/Footer */}
        <Route
          path="/confirm-email"
          element={<EmailVerification />}
        />

        {/* ==========================================
            STUDENT DASHBOARD ROUTES (Protected)
        ========================================== */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<Profile role="student" />} />
            
            {/* My Batches / Courses Page */}
            <Route path="courses" element={<StudentBatches />} />
            <Route path="live" element={<div>Live Classes</div>} />
            <Route path="certificates" element={<div>Certificates</div>} />
          </Route>
        </Route>

        {/* ==========================================
            TEACHER DASHBOARD ROUTES (Protected)
        ========================================== */}
        <Route element={<ProtectedRoute allowedRoles={['Trainer']} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="profile" element={<Profile role="teacher" />} />

            {/* Teacher Batches Page */}
            <Route path="batches" element={<TeacherBatches />} />
            <Route path="live" element={<div>Live Classes</div>} />
            <Route path="assessments" element={<div>Assessments</div>} />
          </Route>
        </Route>

        {/* ==========================================
            ADMIN DASHBOARD ROUTES (Protected)
        ========================================== */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<div>User Management</div>} />
            <Route path="profile" element={<Profile role="admin" />} />
            <Route path="payments" element={<div>Payments</div>} />
            
            {/* Admin Courses & Batches Page */}
            <Route path="content" element={<AdminCourses />} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Route>

      </Routes>
    </AppProvider>
  );
}