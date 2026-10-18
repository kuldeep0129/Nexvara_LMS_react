import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BlobButton from '../ui/BlobButton.jsx';
import Hero from '../sections/Hero.jsx';
import Programs from '../sections/Programs.jsx';
import Courses from '../sections/Courses.jsx';
import Students from '../sections/Students.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
// import Projects from '../sections/Projects.jsx';
// import Partners from '../sections/Partners.jsx';
import Certificates from '../sections/Certificates.jsx';
// import Blogs from '../sections/Blogs.jsx';
import Corner from '../sections/Corner.jsx';
// import Work from '../sections/Work.jsx';
import Apply from '../sections/Apply.jsx';
  import CoursesPreview from '../sections/CoursesPreview.jsx';
     import ProgramsPreview from '../sections/ProgramsPreview.jsx';

// Sticky bottom bar for phones. Sirf Home par dikhta hai.
function MobileBar() {
  const [scrolled, setScrolled] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 560);
    on();
    window.addEventListener('scroll', on, { passive: true });
    const el = document.getElementById('apply');
    const io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.15 });
    el && io.observe(el);
    return () => {
      window.removeEventListener('scroll', on);
      io.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {scrolled && !atForm && (
        <motion.div className="mbar" initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <BlobButton variant="outline" href="#programs" block>Programs</BlobButton>
          <BlobButton href="#apply" block>Apply Now</BlobButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      {/* <Programs /> */}
         <ProgramsPreview />
      {/* <Courses /> */}
   <CoursesPreview />
      <Students />
      <HowItWorks />
      {/* <Projects /> */}
      {/* <Partners /> */}
      <Certificates />
      {/* <Blogs /> */}
      <Corner />
      {/* <Work /> */}
      <Apply />
      <MobileBar />
    </>
  );
}