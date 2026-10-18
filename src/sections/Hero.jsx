import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { EASE } from '../ui/Reveal.jsx';
import { HERO_STATS, ORBIT } from '../data.js';

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v) + suffix),
    });
    return () => c.stop();
  }, [seen, to, suffix]);
  return <b ref={ref}>{to + suffix}</b>;
}
const COURSES = [
  [
    <>
      <i className="devicon-dotnetcore-plain colored"></i>
      {' .NET Full Stack'}
    </>,
    99,
    'var(--blue)',
  ],
  [
    <>
      <i className="devicon-python-plain colored"></i>
      {' Data Analytics'}
    </>,
    74,
    'var(--mint)',
  ],
  [
    <>
      <i className="devicon-react-original colored"></i>
      {' React and Next.js'}
    </>,
    96,
    '#B97800',
  ],
];

function HeroScene() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 90, damping: 16 });
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 90, damping: 16 });

  // Touch screens have no pointer to follow, so the scene sways on its own.
  useEffect(() => {
    if (!window.matchMedia('(hover:none)').matches) return;
    const a = animate(mx, [-0.28, 0.28, -0.28], { duration: 14, repeat: Infinity, ease: 'easeInOut' });
    const b = animate(my, [0.08, -0.12, 0.08], { duration: 11, repeat: Infinity, ease: 'easeInOut' });
    return () => {
      a.stop();
      b.stop();
    };
  }, [mx, my]);

  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="scene"
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.25, ease: EASE }}
    >
      <div className="scene-glow" aria-hidden="true" />
      <motion.div className="scene-3d" style={{ rotateX: rx, rotateY: ry }}>
        <div className="s-floor" aria-hidden="true" />

        {/* back orbit chips sit behind, front ones pass in front of the panel */}
        <div className="orbit" aria-hidden="true">
          {ORBIT.map((t, i) => (
            <span className="orb" key={t} style={{ '--i': i }}>
              <span className="orb-chip">{t}</span>
            </span>
          ))}
        </div>

        <div className="s-panel" role="img" aria-label="Preview of a student learning dashboard">
          <div className="sp-top">
            <span className="sp-avatars">
              <i style={{ background: 'var(--amber)' }}>K</i>
              <i style={{ background: 'var(--blue)', color: '#fff' }}>R</i>
              <i style={{ background: 'var(--mint)', color: '#fff' }}>H</i>
            </span>
            <span className="sp-title">Your learning path</span>
            <span className="sp-live">
              <i /> Live
            </span>
          </div>
          <div className="sp-body">
            <svg className="sp-ring" viewBox="0 0 84 84" aria-hidden="true">
              <circle cx="42" cy="42" r="34" fill="none" stroke="var(--sky)" strokeWidth="9" />
              <motion.circle
                cx="42" cy="42" r="34" fill="none" stroke="var(--blue)" strokeWidth="9" strokeLinecap="round"
                transform="rotate(-90 42 42)" strokeDasharray="260"
                initial={{ strokeDashoffset: 214 }} animate={{ strokeDashoffset: 214 * (1 - 0.72) }}
                transition={{ duration: 1.6, delay: 0.9, ease: EASE }}
              />
              <text x="42" y="47" textAnchor="middle" fontSize="17" fontWeight="800" fill="var(--ink)" fontFamily="var(--font-display)">99%</text>
            </svg>
            <div className="sp-rows">
              {COURSES.map(([n, v, c], i) => (
                <div key={n} className="sp-row2">
                  <span>{n}</span>
                  <div className="meter">
                    <motion.i
                      style={{ background: c, width: `${v}%`, transformOrigin: 'left' }}
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ duration: 1.1, delay: 1 + i * 0.15, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sp-next">
            <Icon name="clock" /> Next: mentor review, Saturday 5 PM
          </div>
        </div>

        <div className="s-card c1">
          <span className="ico"><Icon name="check" /></span>
          <div><b>Capstone shipped</b><small>Reviewed by a mentor</small></div>
        </div>
        <div className="s-card c2">
          <span className="ico amber"><Icon name="users" /></span>
          <div><b>Live mentor session</b><small>Every Saturday</small></div>
        </div>
        <div className="s-card c3">
          <span className="ico blue"><Icon name="shield" /></span>
          <div><b>Certificate verified</b><small>ID matched online</small></div>
        </div>
        <i className="sphere sp1" aria-hidden="true" />
        <i className="sphere sp2" aria-hidden="true" />
        <i className="sphere sp3" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}

const line = (i) => ({
  initial: { opacity: 0, y: 34, rotateX: -40 },
  animate: { opacity: 1, y: 0, rotateX: 0 },
  transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE },
});

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="h1">
      <div className="mesh" aria-hidden="true">
        <span className="m1" /><span className="m2" /><span className="m3" />
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="live" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <i /> Admissions open for the November 2026 batches
          </motion.span>
          <h1 id="h1" style={{ perspective: 800 }}>
            <motion.span className="ln" {...line(0)}>Learn.</motion.span>{' '}
            <motion.span className="ln" {...line(1)}>Build.</motion.span>{' '}
            <motion.span className="ln" {...line(2)}>
              <span className="hl">Gain <span style={{ whiteSpace: 'nowrap' }}>Real-World</span> Experience.</span>
            </motion.span>
          </h1>
          <motion.p className="lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}>
            Mentor-led training, internships and project-based programs for B.Tech, BCA, MCA, Diploma and management students. Build projects you can show, and finish with a certificate you can verify online.
          </motion.p>
          <motion.div className="hero-btns" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
            <BlobButton size="lg" href="/programs" iconRight="arrow">Explore Programs</BlobButton>
            <BlobButton size="lg" variant="outline" href="#students">Find Your Training</BlobButton>
          </motion.div>
          <motion.div className="stats" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}>
            {HERO_STATS.map((s) => (
              <div className="stat" key={s.label}>
                <Counter to={s.to} suffix={s.suffix} />
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div>
          <HeroScene />
          <p className="ph-note">3D preview scene. Swap in real student photos when ready.</p>
        </div>
      </div>
    </section>
  );
}
