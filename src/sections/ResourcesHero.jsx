import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { EASE } from '../ui/Reveal.jsx';
import { CERTS, FAQ, POSTS, SHOTS } from '../data.js';
import '../styles/resourceshero.css';

const CHIPS = [['Blogs and guides', '#resources'], ['Verify certificate', '#certificates'], ['Student work', '#work'], ['Student and parent corner', '#corner']];

const STATS = [
  [String(POSTS.length), 'Career guides'],
  ['Online', 'Certificate check'],
  [String(SHOTS.length), 'Student projects'],
  [String(FAQ.s.length + FAQ.p.length), 'FAQs answered'],
];

/** Types a certificate ID, "verifies" it, shows the result, then loops. Static when motion is reduced. */
function VerifyDemo() {
  const reduce = useReducedMotion();
  const [id, rec] = Object.entries(CERTS)[0];
  const [n, setN] = useState(reduce ? id.length : 0);
  const [phase, setPhase] = useState(reduce ? 'ok' : 'type'); // type | check | ok

  useEffect(() => {
    if (reduce) return;
    let t;
    if (phase === 'type') {
      t = n < id.length ? setTimeout(() => setN(n + 1), 85) : setTimeout(() => setPhase('check'), 450);
    } else if (phase === 'check') {
      t = setTimeout(() => setPhase('ok'), 900);
    } else {
      t = setTimeout(() => { setN(0); setPhase('type'); }, 3200);
    }
    return () => clearTimeout(t);
  }, [reduce, phase, n, id]);

  return (
    <div className="rh-card rh-verify" aria-label="Certificate verification preview" role="img">
      <div className="rh-card-h"><span className="rh-ic"><Icon name="shield" /></span><b>Verify certificate</b><small>Demo</small></div>
      <div className={`rh-input${phase === 'type' ? ' focus' : ''}`}>
        <span>{id.slice(0, n)}</span>{phase === 'type' && <i className="caret" />}
        {n === 0 && phase === 'type' && <em>Enter certificate ID</em>}
        <span className={`rh-btn${phase === 'check' ? ' busy' : ''}`}>{phase === 'check' ? <i className="spin" /> : 'Verify'}</span>
      </div>
      <div className="rh-result">
        <AnimatePresence mode="wait" initial={false}>
          {phase === 'ok' && (
            <motion.div key="ok" className="rh-ok" initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
              <span className="tick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
              <div><b>Certificate is valid</b><small>{rec[1]} · {rec[2]}</small></div>
            </motion.div>
          )}
          {phase !== 'ok' && (
            <motion.div key="wait" className="rh-wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {phase === 'check' ? 'Checking record…' : 'Every certificate carries a unique ID'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ResourcesHero() {
  const post = POSTS[0];
  const q = FAQ.p[0][0];
  const up = (d) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.75, ease: EASE } });
  const side = (d, x) => ({ initial: { opacity: 0, x }, animate: { opacity: 1, x: 0 }, transition: { delay: d, duration: 0.8, ease: EASE } });

  return (
    <section className="rh" aria-labelledby="rh-h1">
      <div className="ab-mesh" aria-hidden="true"><span /><span /><span /></div>
      <div className="wrap rh-in">
        <div className="rh-copy">
          <motion.nav className="ab-crumbs" aria-label="Breadcrumb" {...up(0)}>
            <Link to="/">Home</Link><Icon name="chevron" /><span aria-current="page">Resources</span>
          </motion.nav>
          <motion.span className="ab-pill" {...up(0.05)}><i /> Resources</motion.span>
          <motion.h1 id="rh-h1" {...up(0.12)}>Guides, proof and answers <em className="grad">in one place</em></motion.h1>
          <motion.p className="ab-lead" {...up(0.22)}>
            Read career articles, verify any certificate with its ID, see what students have built, and find clear answers on fees, progress and support for students and parents.
          </motion.p>
          <motion.div className="rh-cta" {...up(0.32)}>
            <BlobButton size="lg" href="#certificates" icon="shield">Verify Certificate</BlobButton>
            <BlobButton size="lg" variant="outline" href="#resources" iconRight="arrow">Read Guides</BlobButton>
          </motion.div>
          <motion.dl className="rh-stats" initial="h" animate="s" variants={{ s: { transition: { delayChildren: 0.5, staggerChildren: 0.08 } } }}>
            {STATS.map(([v, l]) => (
              <motion.div key={l} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }}>
                <dt>{v}</dt><dd>{l}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <div className="rh-vis" aria-hidden="false">
          <motion.div className="rh-float a" {...side(0.35, 40)}>
            <a className="rh-card rh-post" href="#resources" style={{ '--c': post.c, '--cs': post.cs }} tabIndex={-1} aria-label={post.title}>
              <span className="th"><Icon name={post.icon} /></span>
              <div><small>{post.cat} · {post.read}</small><b>{post.title}</b></div>
            </a>
          </motion.div>
          <motion.div className="rh-float b" {...side(0.5, 0)} initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
            <VerifyDemo />
          </motion.div>
          <motion.div className="rh-float c" {...side(0.65, -40)}>
            <a className="rh-card rh-qa" href="#corner" tabIndex={-1} aria-label={q}>
              <span className="rh-ic"><Icon name="msg" /></span>
              <div><small>Parent corner</small><b>{q}</b></div>
              <span className="rh-pill">Answered</span>
            </a>
          </motion.div>
        </div>

        <motion.ul className="rh-chips" aria-label="Jump to section" {...up(0.75)}>
          {CHIPS.map(([label, href], k) => (
            <li key={href}><a href={href}><span>{String(k + 1).padStart(2, '0')}</span>{label}</a></li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
