import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [program, setProgram] = useState('');
  const [studentAccessOpen, setStudentAccessOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const timer = useRef();

  const toast = useCallback((m) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(''), 2600);
  }, []);
const openStudentAccess = useCallback(() => {
  setStudentAccessOpen(true);
}, []);

const closeStudentAccess = useCallback(() => {
  setStudentAccessOpen(false);
}, []);
  // Use on links that do not have a real page yet.
  const demo = useCallback(
    (e) => {
      e.preventDefault();
      toast('Demo link. This page will be added later.');
    },
    [toast]
  );

  return (
    <Ctx.Provider value={{ program, setProgram, toast, demo, studentAccessOpen, openStudentAccess, closeStudentAccess, }}>
      {children}
      <div className="toast-wrap">
        <AnimatePresence>
          {msg && (
            <motion.div
              key={msg}
              className="toast"
              role="status"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
            >
              {msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
