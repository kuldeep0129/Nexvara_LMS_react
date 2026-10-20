
import { Outlet } from 'react-router-dom';

import Header, { Announcement } from '../sections/Header.jsx';
import Footer from '../sections/Footer.jsx';
import StudentAccess from '../ui/StudentAccess.jsx';
import StudentAssistant from '../ui/StudentAssistant.jsx';

export default function PublicLayout() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Announcement />
      <Header />

      <main id="main">
        <Outlet />
      </main>

      <Footer />
      <StudentAccess />
      <StudentAssistant />
    </>
  );
}
