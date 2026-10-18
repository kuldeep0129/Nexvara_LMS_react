import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];
const VIEW = { once: true, margin: '0px 0px -8% 0px' };

// Starts slightly visible so the page never looks empty before scroll.
export const fadeUp = {
  hidden: { opacity: 0.2, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Fades a single block up when it scrolls into view. */
export function Reveal({ as = 'div', delay = 0, children, ...rest }) {
  const M = motion[as];
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{ hidden: fadeUp.hidden, show: { ...fadeUp.show, transition: { ...fadeUp.show.transition, delay } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its <Item>, <Card> and <TiltCard> children. */
export function Stagger({ as = 'div', gap = 0.08, delay = 0, children, ...rest }) {
  const M = motion[as];
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function Item({ as = 'div', children, ...rest }) {
  const M = motion[as];
  return (
    <M variants={fadeUp} {...rest}>
      {children}
    </M>
  );
}

/** Standard card: fade-up on reveal, lifts on hover. Use inside <Stagger>. */
export function Card({ as = 'div', className = '', children, ...rest }) {
  const M = motion[as];
  return (
    <M
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`card card-h ${className}`}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Card with a subtle 3D tilt and a light glare that follows the pointer (mouse only). */
export function TiltCard({ className = '', max = 5, style, children, ...rest }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });
  const [on, setOn] = useState(false);
  const glare = useMotionTemplate`radial-gradient(260px circle at ${gx}% ${gy}%, rgba(255,255,255,.75), rgba(255,255,255,0) 65%)`;

  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
    setOn(true);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
    setOn(false);
  };

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, ...style }}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`card card-h tilt ${className}`}
      {...rest}
    >
      {children}
      <motion.span className="glare" aria-hidden="true" style={{ background: glare, opacity: on ? 1 : 0 }} />
    </motion.div>
  );
}
