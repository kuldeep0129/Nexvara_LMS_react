import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AppProvider } from './ctx.jsx';
import ScrollManager from './ScrollManager.jsx';
import { GooFilter } from './ui/BlobButton.jsx';

import PublicLayout from './layout/PublicLayout.jsx';
import ProtectedRoute from './dashboard/component/ProtectedRoute.jsx'; 

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import NotFound from './pages/NotFound.jsx';
import EmailVerification from './pages/EmailVerification.jsx';
import SchedulePage from '../src/dashboard/page/student/schedule/SchedulePage.jsx';
// ==========================================
// NAYA IMPORT: Reset Password Page
// ==========================================
import ResetPassword from './pages/ResetPassword.jsx'; 

// ==========================================
// STUDENT IMPORTS
// ==========================================
import StudentLayout from './dashboard/page/StudentLayout.jsx';
import StudentDashboard from './dashboard/page/student/Dashboard.jsx';
import StudentBatches from './dashboard/page/student/MyBatches.jsx';
import ExploreCourses from "./dashboard/page/student/courses/ExploreCourses.jsx";
import MyBatches from "./dashboard/page/student/batch/MyBatch.jsx";
import ContinueLearning from "./dashboard/page/student/courses/ContinueLearning.jsx";
import ProgressPage from "./dashboard/component/ui/UnderDevelopment.jsx";
import RewatchLesson from './dashboard/page/student/courses/RewatchLesson.jsx';
import LiveClass from "./dashboard/page/student/courses/LiveClass.jsx";
import StudyMaterial from "./dashboard/page/student/courses/StudyMaterial.jsx";
import AssesmentList from "./dashboard/page/student/assestment/AssessmentList.jsx";
import AssessmentsAttempt from "./dashboard/page/student/assestment/AssessmentAttempt.jsx";
import ResultAssessments from "./dashboard/page/student/assestment/AssessmentResults.jsx";
import StudentAttendance from "./dashboard/page/student/attendance/Attendance.jsx";
import StudentCertificates from "./dashboard/page/student/certificate/Certificates.jsx";
import StudentPayments from "./dashboard/page/student/payment/StudentPayment.jsx";
import ClassroomPage  from "../src/dashboard/page/student/courses/RewatchLesson.jsx";
import UpcomingLiveClasses from "./dashboard/page/student/LiveClass/UpcomingLiveClasses.jsx";


// ==========================================
// TEACHER IMPORTS
// ==========================================
import TeacherLayout from './dashboard/page/teacher/TeacherLayout.jsx';
import TeacherDashboard from './dashboard/page/teacher/Dashboard.jsx';
import TeacherBatches from './dashboard/page/teacher/MyBatches.jsx';
import TeacherActiveBatches from './dashboard/page/teacher/batch/TeacherActiveBatches.jsx';
import TeacherUpcomingBatches from './dashboard/page/teacher/batch/TeacherUpcomingBatches.jsx'
import TeacherCompletedBatches from './dashboard/page/teacher/batch/TeacherCompletedBatches.jsx'

// ==========================================
// ADMIN IMPORTS
// ==========================================
import AdminLayout from './dashboard/page/admin/AdminLayout.jsx';
import AdminDashboard from './dashboard/page/admin/Dashboard.jsx';
import AdminCourses from './dashboard/page/admin/Courses.jsx';
import TeachersList from './dashboard/page/admin/TeachersList.jsx';
import StudentsList from './dashboard/page/admin/StudentsList.jsx';
import AllUsersList from './dashboard/page/admin/AllUsersList.jsx';
import AddCourse from './dashboard/page/admin/course/AddCourse.jsx';
import ManageCourse from './dashboard/page/admin/course/ManageCourse.jsx';
import AllCourses from './dashboard/page/admin/course/AllCourses.jsx';
import DraftCourses from './dashboard/page/admin/course/DraftCourses.jsx';
import PublishedCourses from './dashboard/page/admin/course/PublishedCourses.jsx';
import BatchManagement from './dashboard/page/admin/batch/BatchManagement.jsx';
import AddBatch from './dashboard/page/admin/batch/AddBatch.jsx';
import BatchDetails from './dashboard/page/admin/batch/BatchDetails.jsx';
import EditBatch from './dashboard/page/admin/batch/EditBatch.jsx';
import BatchSchedules from './dashboard/page/admin/batch/BatchSchedules.jsx';
import CreateSchedule from './dashboard/page/admin/batch/CreateSchedule.jsx';
import TeacherAssign from './dashboard/page/admin/batch/TeacherAssign.jsx';



// ==========================================
// Profile IMPORTS
// ==========================================
import Profile from './dashboard/page/Profile.jsx';
import AssessmentList from './dashboard/page/student/assestment/AssessmentList.jsx';
import AssessmentResults from './dashboard/page/student/assestment/AssessmentResults.jsx';

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
          <Route path="*" element={<NotFound />} /> </Route>
        {/* Email Verification - Without Public Header/Footer */}
        <Route path="/confirm-email"   element={<EmailVerification />}     />

        {/* ==========================================
            NAYA ROUTE: Reset Password Page 
            (Email link se aane wale users ke liye)
        ========================================== */}
        <Route path="/reset-password" element={<ResetPassword />}   />

        {/* ==========================================
            STUDENT DASHBOARD ROUTES (Protected)
        ========================================== */}

<Route element={<ProtectedRoute allowedRoles={['Student']} />}>
  <Route path="/student" element={<StudentLayout />}>
    <Route index element={<StudentDashboard />} />

    <Route
      path="profile"
      element={<Profile role="student" />}
    />

    <Route path="batches" element={<MyBatches />} />

    <Route
      path="continue"
      element={<ContinueLearning />}
    />

    <Route path="schedule" element={<SchedulePage />} />

    <Route path="courses" element={<StudentBatches />} />
      <Route path="/student/progress" element={<ProgressPage />} />
   <Route path="rewatch/:lessonId"element={<RewatchLesson />} />
    <Route path="/student/live-class/:batchId/:lessonId" element={<LiveClass />} />
      <Route path="/student/materials" element={<StudyMaterial />} />
        <Route path="/student/assessments/List" element={<AssessmentList />} />
            <Route path="/student/assessments/Attempt" element={<ProgressPage />} />
                 <Route path="/student/assessments/results" element={<AssessmentResults />} />
                      <Route path="/student/attendance" element={<StudentAttendance />} />
               <Route path="/student/certificates" element={<StudentCertificates />} />
             <Route path="/student/payments" element={<StudentPayments />} />
             <Route path="live/upcoming" element={<UpcomingLiveClasses />} />

    <Route path="/student/classroom/:batchId" element={<ClassroomPage />} />


    <Route path="explore" element={<ExploreCourses />} />

    <Route path="live" element={<div>Live Classes</div>} />

  </Route>
</Route>


        {/* ==========================================
            TEACHER DASHBOARD ROUTES (Protected)
        ========================================== */}
       
<Route element={<ProtectedRoute allowedRoles={['Trainer']} />}>
  <Route path="/teacher" element={<TeacherLayout />}>
    {/* Teacher Dashboard */}
    <Route index element={<TeacherDashboard />} />
    {/* Teacher Profile */}
    <Route path="profile"  element={<Profile role="teacher" />} />
    {/* Teacher Schedule */}
    <Route path="schedule" element={<SchedulePage />} />
    {/* Teacher Batches */}
    <Route path="batches/active"  element={<TeacherActiveBatches />} />
        <Route path="batches/upcoming"  element={<TeacherUpcomingBatches />} />
                <Route path="batches/completed"  element={<TeacherCompletedBatches />} />
    {/* Live Classes */}
    <Route path="live"  element={<div>Live Classes</div>}  />
    {/* Assessments */}
    <Route path="assessments" element={<div>Assessments</div>}  />
  </Route>
</Route>


        {/* ==========================================
            ADMIN DASHBOARD ROUTES (Protected)
        ========================================== */}
  <Route element={<ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />

    <Route path="profile" element={<Profile role="admin" />} />

    <Route path="payments" element={<div>Payments</div>} />

    <Route path="users" element={<AllUsersList />} />
    <Route path="users/students" element={<StudentsList />} />
    <Route path="users/teachers" element={<TeachersList />} />

    {/* Courses */}
    <Route path="courses" element={<AllCourses />} />
    <Route path="courses/add" element={<AddCourse />} />
    <Route path="courses/manage/:id" element={<ManageCourse />} />
  <Route path="courses/draft" element={<DraftCourses />} />
    <Route path="courses/published" element={<PublishedCourses />} />

    {/* Batches */}
    <Route path="batches" element={<BatchManagement />} />
  <Route path="batches/add" element={<AddBatch />} /> 
  <Route path="batches/:id" element={<BatchDetails />} /> 
 <Route path="batches/edit/:id" element={<EditBatch />} />
  <Route path="schedules" element={<BatchSchedules />} />
  <Route path="schedules/create" element={<CreateSchedule />} />
  <Route path="teacher-assign" element={<TeacherAssign />} />
    <Route path="settings" element={<div>Settings</div>} />
  </Route>
</Route>

      </Routes>
    </AppProvider>
  );
}