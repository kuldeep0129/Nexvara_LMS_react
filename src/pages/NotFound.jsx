import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import BlobButton from '../ui/BlobButton.jsx';
import Icon from '../ui/Icon.jsx';
import { NAV } from '../data.js';
import { EASE } from '../ui/Reveal.jsx';


const QUICK = [
  ['Home', '/', 'home'],
  ['Programs', '/#programs', 'compass'],
  ['Courses', '/#courses', 'book'],
  ['Certificates', '/#certificates', 'shield'],
  ['Apply now', '/#apply', 'arrow'],
];

const letter = (i) => ({
  initial: { opacity: 0, y: 60, rotateX: -70, scale: 0.8 },
  animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
  transition: { delay: 0.15 + i * 0.12, duration: 0.9, ease: EASE },
});

export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const planned = NAV.some((n) => n.to === pathname);
  const label = NAV.find((n) => n.to === pathname)?.label;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-12, 12]);
  const rotX = useTransform(sy, [-1, 1], [8, -8]);
  const bgX = useTransform(sx, [-1, 1], [-18, 18]);
  const bgY = useTransform(sy, [-1, 1], [-14, 14]);

  useEffect(() => {
    document.title = planned ? `${label} · coming soon` : 'Page not found';
    return () => {
      document.title = 'Home';
    };
  }, [planned, label]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section className="nf" onPointerMove={onMove} onPointerLeave={() => { mx.set(0); my.set(0); }} aria-labelledby="nf-h">
      <motion.div className="nf-bg" style={{ x: bgX, y: bgY }} aria-hidden="true">
        <span className="nf-orb o1" />
        <span className="nf-orb o2" />
        <span className="nf-orb o3" />
        <span className="nf-grid" />
        {Array.from({ length: 14 }).map((_, i) => (
          <i key={i} className="nf-dot" style={{ '--i': i }} />
        ))}
      </motion.div>

      <div className="wrap nf-in">
        <motion.span className="nf-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <i /> {planned ? 'Coming soon' : 'Error 404'}
        </motion.span>

        <motion.div className="nf-digits" style={{ rotateX: rotX, rotateY: rotY }} aria-hidden="true">
          <motion.b className="nf-d" {...letter(0)}>4</motion.b>
          <motion.div className="nf-zero" {...letter(1)}>
            <span className="ring r1" />
            <span className="ring r2" />
            <span className="core"><Icon name="compass" /></span>
            <span className="sat s1" />
            <span className="sat s2" />
          </motion.div>
          <motion.b className="nf-d" {...letter(2)}>4</motion.b>
        </motion.div>

        <motion.h1 id="nf-h" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease: EASE }}>
          {planned ? <>The <em>{label}</em> page is being built</> : <>This page took a <em>wrong turn</em></>}
        </motion.h1>
        <motion.p className="nf-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.7, ease: EASE }}>
          {planned
            ? 'Our team is putting the finishing touches on this page. Meanwhile, explore everything already live on the home page.'
            : "The link may be broken or the page may have moved. Let's get you back to something useful."}
        </motion.p>

        <motion.div className="nf-term" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.8, duration: 0.7, ease: EASE }}>
          <div className="nf-term-bar"><i /><i /><i /><span>route-check</span></div>
          <div className="nf-term-body">
            <p><span className="p">$</span> open <b>{pathname}</b></p>
            <p className="bad">{planned ? '→ 404 · page not published yet' : '→ 404 · no page at this address'}</p>
            <p><span className="p">$</span> suggest <span className="ok">home, programs, courses</span><span className="caret" /></p>
          </div>
        </motion.div>

        <motion.div className="nf-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.7, ease: EASE }}>
          <BlobButton to="/" size="lg" icon="home">Back to Home</BlobButton>
          <BlobButton variant="outline" size="lg" onClick={() => navigate(-1)}>Go back</BlobButton>
        </motion.div>

        <motion.ul className="nf-quick" initial="h" animate="s" variants={{ s: { transition: { delayChildren: 1.1, staggerChildren: 0.07 } } }} aria-label="Quick links">
          {QUICK.map(([t, to, ic]) => (
            <motion.li key={t} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }}>
              <Link to={to} className="nf-chip"><Icon name={ic} />{t}</Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
