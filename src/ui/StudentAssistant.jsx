
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../ctx.jsx';
import '../styles/student-assistant.css';

const answers = {
  courses: {
    title: 'Explore courses',
    body: 'Explore Full Stack, AI, Data, Cloud and Software Testing tracks.',
    link: '/courses',
    label: 'Browse courses',
  },
  programs: {
    title: 'Find your program',
    body: 'Explore internships, summer training and project-based learning.',
    link: '/programs',
    label: 'View programs',
  },
  certificate: {
    title: 'Certificate help',
    body: 'Visit our resources page for certificate-related assistance.',
    link: '/resources',
    label: 'Open resources',
  },
  contact: {
    title: 'Talk to our team',
    body: 'Our team can help with admissions and course enquiries.',
    link: '/contact',
    label: 'Contact us',
  },
};

export default function StudentAssistant() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { openStudentAccess } = useApp();

  return (
    <div className="student-assistant">
      <AnimatePresence>
        {open && (
          <motion.aside
            className="assistant-panel"
            aria-label="Nexi student assistant"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
          >
            <header className="assistant-head">
              <div className="assistant-avatar">✦</div>
              <div>
                <b>Nexi <span>AI GUIDE</span></b>
                <small>Your student success assistant</small>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chatbot">
                ×
              </button>
            </header>

            <div className="assistant-body">
              <div className="assistant-bubble">
                Hey there! 👋 I’m Nexi. How can I help you today?
              </div>

              {selected && (
                <motion.div
                  className="assistant-bubble answer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <b>{selected.title}</b>
                  <p>{selected.body}</p>
                  <Link
                    to={selected.link}
                    onClick={() => setOpen(false)}
                  >
                    {selected.label} ↗
                  </Link>
                </motion.div>
              )}

              <div className="assistant-options">
                <button onClick={() => {
                  setOpen(false);
                  openStudentAccess();
                }}>
                  ↗ Student Login / Register
                </button>

                <button onClick={() => setSelected(answers.courses)}>
                  ▦ Explore Courses
                </button>

                <button onClick={() => setSelected(answers.programs)}>
                  ✳ Find a Program
                </button>

                <button onClick={() => setSelected(answers.certificate)}>
                  ◇ Certificate Help
                </button>

                <button onClick={() => setSelected(answers.contact)}>
                  ↗ Contact Our Team
                </button>
              </div>
            </div>

            <footer className="assistant-footer">
              <span /> Here to help you move forward
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`assistant-launcher ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(value => !value)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        aria-expanded={open}
        aria-label={open ? 'Close Nexi assistant' : 'Open Nexi assistant'}
      >
        <span className="launcher-halo" />
        <span className="launcher-icon">
          {open ? '×' : '✦'}
        </span>
        {!open && <span className="launcher-label">Ask Nexi</span>}
      </motion.button>
    </div>
  );
}
