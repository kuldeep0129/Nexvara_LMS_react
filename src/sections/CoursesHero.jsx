import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { EASE } from '../ui/Reveal.jsx';
import { COURSES } from '../data.js';
import '../styles/courseshero.css';

const CHIPS = [['All courses', '#courses'], ['What is included', '#includes'], ['FAQs', '#course-faq']];

// Job title shown in the rotating "Become a ..." line. Falls back to the course title.
const ROLE = {
  '.NET Full Stack': '.NET Developer',
  'Java Backend': 'Java Developer',
  'React and Next.js': 'React Developer',
  'Python Programming': 'Python Developer',
  'AI and Machine Learning': 'ML Engineer',
  'Data Analytics': 'Data Analyst',
  'Cloud and DevOps': 'DevOps Engineer',
  'Software Testing': 'QA Engineer',
};
const LEVEL = { Beginner: 1, 'Beginner+': 2, Intermediate: 3 };

const weeks = COURSES.map((c) => c.weeks);
const STATS = [
  [String(COURSES.length), 'Course tracks'],
  [`${Math.min(...weeks)} to ${Math.max(...weeks)}`, 'Weeks per course'],
  ['100%', 'Hands-on projects'],
  ['1 ID', 'Verifiable certificate'],
];

const colA = COURSES.filter((_, i) => i % 2 === 0);
const colB = COURSES.filter((_, i) => i % 2 === 1);

function Tile({ c }) {
  return (
    <li className="cth-tile" style={{ '--c': c.c, '--cs': c.cs }}>
      <span className="m"><i className={c.mono} aria-hidden="true" /></span>
      <span className="t"><b>{c.title}</b><small>{c.weeks} weeks</small></span>
    </li>
  );
}

function Col({ list, rev }) {
  // The list is rendered twice so the loop is seamless.
  return (
    <div className={`cth-col${rev ? ' rev' : ''}`} aria-hidden="true">
      <ul className="cth-track">
        {[...list, ...list].map((c, i) => <Tile key={c.title + i} c={c} />)}
      </ul>
    </div>
  );
}

export default function CoursesHero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % COURSES.length), 3200);
    return () => clearInterval(t);
  }, [reduce]);
  const c = COURSES[i];
  const role = ROLE[c.title] || c.title;
  const lv = LEVEL[c.level] || 2;
  const up = (d) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.75, ease: EASE } });

  return (
    <section className="cth" aria-labelledby="cth-h1">
      <div className="ab-mesh" aria-hidden="true"><span /><span /><span /></div>
      <div className="wrap cth-in">
        <div className="cth-copy">
          <motion.nav className="ab-crumbs" aria-label="Breadcrumb" {...up(0)}>
            <Link to="/">Home</Link><Icon name="chevron" /><span aria-current="page">Courses</span>
          </motion.nav>
          <motion.span className="ab-pill" {...up(0.05)}><i /> Courses</motion.span>
          <motion.h1 id="cth-h1" {...up(0.12)}>Learn skills that <em className="grad">companies hire for</em></motion.h1>
          <motion.p className="cth-role" {...up(0.2)} aria-live="off">
            <span>Become a</span>
            <span className="cth-slot">
              <AnimatePresence mode="wait" initial={false}>
                <motion.b key={role} style={{ color: c.c }} initial={{ y: '70%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-70%', opacity: 0 }} transition={{ duration: 0.38, ease: EASE }}>
                  {role}
                </motion.b>
              </AnimatePresence>
            </span>
          </motion.p>
          <motion.p className="ab-lead" {...up(0.28)}>
            Eight job-focused tracks across development, data, AI, cloud and testing. Each one is mentor-led, project-based and ends with a certificate you can verify.
          </motion.p>
          <motion.div className="cth-cta" {...up(0.36)}>
            <BlobButton size="lg" href="#courses" iconRight="arrow">Explore Courses</BlobButton>
            <BlobButton size="lg" variant="outline" href="#apply">Talk to a counsellor</BlobButton>
          </motion.div>
          <motion.dl className="cth-stats" initial="h" animate="s" variants={{ s: { transition: { delayChildren: 0.55, staggerChildren: 0.08 } } }}>
            {STATS.map(([v, l]) => (
              <motion.div key={l} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }}>
                <dt>{v}</dt><dd>{l}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div className="cth-vis" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: EASE }}>
          <div className="cth-marquee">
            <Col list={colA} />
            <Col list={colB} rev />
          </div>

          <div className="cth-spot" style={{ '--c': c.c, '--cs': c.cs }} role="group" aria-label="Featured course">
            <div className="cth-spot-h"><span><i />Now exploring</span><small>{String(i + 1).padStart(2, '0')} / {String(COURSES.length).padStart(2, '0')}</small></div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={c.title} className="cth-spot-b" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.35, ease: EASE }}>
                <span className="m"><i className={c.mono} aria-hidden="true" /></span>
                <div>
                  <b>{c.title}</b>
                  <ul>{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="cth-spot-f">
              <span><Icon name="clock" />{c.weeks} weeks</span>
              <span className="lv"><span className="bars" aria-hidden="true">{[1, 2, 3].map((n) => <i key={n} className={n <= lv ? 'on' : ''} />)}</span>{c.level}</span>
            </div>
            <span className="cth-prog" aria-hidden="true"><motion.i key={i} initial={{ scaleX: 0 }} animate={{ scaleX: reduce ? 1 : 1 }} transition={{ duration: reduce ? 0 : 3.2, ease: 'linear' }} /></span>
          </div>
        </motion.div>

        <motion.ul className="cth-chips" aria-label="Jump to section" {...up(0.7)}>
          {CHIPS.map(([label, href], k) => (
            <li key={href}><a href={href}><span>{String(k + 1).padStart(2, '0')}</span>{label}</a></li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
