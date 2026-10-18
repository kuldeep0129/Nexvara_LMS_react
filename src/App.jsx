import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from './ctx.jsx';
import { GooFilter } from './ui/BlobButton.jsx';
import Header, { Announcement } from './sections/Header.jsx';
import Footer from './sections/Footer.jsx';
import ScrollManager from './ScrollManager.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import About from './pages/About.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import StudentAccess from './ui/StudentAccess.jsx';
import StudentAssistant from './ui/StudentAssistant.jsx';

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" richColors closeButton duration={4000} />
      <ScrollManager />
      <GooFilter />
      <a className="skip" href="#main">Skip to content</a>
      <Announcement />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/programs" element={<ProgramsPage />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/resources" element={<ResourcesPage />} />
    <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <StudentAccess />
<StudentAssistant />
    </AppProvider>
  );
}