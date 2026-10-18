import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Item, Stagger } from '../ui/Reveal.jsx';
import { STEPS } from '../data.js';
import '../styles/howit.css';

// Celebration particles: emoji and colour dots that burst out of the last node.
const BURST = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 2 ? 0.2 : 0);
  const dist = 62 + (i % 3) * 20;
  const glyph = ['✨', '🎉', '⭐', '🎓'][i % 4];
  return { i, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, glyph, dot: i % 4 === 0 || i % 4 === 2 ? false : true, color: ['#16A06F', '#F2A31B', '#3C86D8', '#D9482B'][i % 4] };
});

function Burst() {
  return (
    <span className="st-burst" aria-hidden="true">
      {BURST.map((p) => (
        <motion.span
          key={p.i}
          className={p.dot ? 'st-p dot' : 'st-p'}
          style={p.dot ? { background: p.color } : undefined}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.25, 0.9], opacity: [1, 1, 0], rotate: p.i % 2 ? 140 : -140 }}
          transition={{ duration: 1.2, delay: 0.12 + (p.i % 4) * 0.04, ease: EASE }}
        >
          {p.dot ? null : p.glyph}
        </motion.span>
      ))}
    </span>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 62%'] });
  const [done, setDone] = useState(1);
  // The line and nodes fill in as the reader scrolls through the steps.
  // The last step counts as reached a little before the very end, so it is easy to trigger.
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setDone(v > 0.96 ? STEPS.length : Math.floor(v * (STEPS.length - 1) + 0.001) + 1)
  );
  const complete = done >= STEPS.length;

  return (
    <section className="sec white" id="how" aria-labelledby="h-how">
      <div className="wrap">
        <SectionHead eyebrow="How it works" id="h-how" title={<>From first click to certificate in <em className="grad">six steps</em></>} />
        <div ref={ref}>
          <Stagger as="ol" className="steps" gap={0.1}>
            {STEPS.map((s, i) => {
              const last = i === STEPS.length - 1;
              const win = last && complete;
              return (
                <Item as="li" className={`st${win ? ' win' : ''}`} key={s.title}>
                  <span className={`st-n${i < done ? ' on' : ''}${win ? ' win' : ''}`}>
                    {win && <span className="st-ring" aria-hidden="true" />}
                    {win && <span className="st-ring r2" aria-hidden="true" />}
                    <AnimatePresence mode="wait" initial={false}>
                      {win ? (
                        <motion.span
                          key="trophy"
                          className="st-emoji"
                          role="img"
                          aria-label="Trophy"
                          initial={{ scale: 0, rotate: -140 }}
                          animate={{ scale: [0, 1.4, 1], rotate: [-140, 14, 0] }}
                          transition={{ duration: 0.75, ease: EASE }}
                        >
                          🏆
                        </motion.span>
                      ) : (
                        <motion.span key="num" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}>
                          {i + 1}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {win && <Burst />}
                  </span>
                  {i < STEPS.length - 1 && <span className={`st-link${i < done - 1 ? ' fill' : ''}`} aria-hidden="true" />}
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {last && (
                    <AnimatePresence>
                      {win && (
                        <motion.span
                          className="st-badge"
                          initial={{ opacity: 0, y: 10, scale: 0.85 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.9 }}
                          transition={{ delay: 0.45, type: 'spring', stiffness: 320, damping: 20 }}
                        >
                          <span aria-hidden="true">🎉</span> Achievement unlocked
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </Item>
              );
            })}
          </Stagger>
          <span className="st-sr" role="status">{complete ? 'All six steps complete. Certificate unlocked.' : ''}</span>
        </div>
      </div>
    </section>
  );
}
