import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { EASE } from '../ui/Reveal.jsx';
import { PROGRAMS } from '../data.js';
import '../styles/programshero.css';

const CHIPS = [['All programs', '#programs'], ['By your stream', '#students'], ['How it works', '#how'], ['Practical projects', '#projects']];

// Lowest "From ₹x" fee found in PROGRAMS (falls back to a dash).
const minFee = (() => {
  const n = PROGRAMS.map((p) => Number((p.fee.match(/₹\s?([\d,]+)/) || [])[1]?.replace(/,/g, ''))).filter(Boolean);
  return n.length ? '₹' + Math.min(...n).toLocaleString('en-IN') + '*' : '-';
})();

const STATS = [
  [String(PROGRAMS.length), 'Program types'],
  ['4 wks to 12 mo', 'Duration range'],
  [minFee, 'Starting fee'],
  ['Verified', 'Certificate ID'],
];

export default function ProgramsHero() {
  const up = (d) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.75, ease: EASE } });
  return (
    <section className="pgh" aria-labelledby="pgh-h1">
      <div className="ab-mesh" aria-hidden="true"><span /><span /><span /></div>
      <div className="wrap pgh-in">
        <div className="pgh-copy">
          <motion.nav className="ab-crumbs" aria-label="Breadcrumb" {...up(0)}>
            <Link to="/">Home</Link><Icon name="chevron" /><span aria-current="page">Programs</span>
          </motion.nav>
          <motion.span className="ab-pill" {...up(0.05)}><i /> Programs</motion.span>
          <motion.h1 id="pgh-h1" {...up(0.12)}>Pick the program that <em className="grad">fits your goal</em></motion.h1>
          <motion.p className="ab-lead" {...up(0.22)}>
            Five ways to learn by building: summer training, internships, apprenticeships, industrial training and project-based learning. Compare duration, mode, eligibility and fees in one place.
          </motion.p>
          <motion.div className="pgh-cta" {...up(0.32)}>
            <BlobButton size="lg" href="#apply" iconRight="arrow">Apply Now</BlobButton>
            <BlobButton size="lg" variant="outline" href="#programs">Compare Programs</BlobButton>
          </motion.div>
          <motion.dl className="pgh-stats" initial="h" animate="s" variants={{ s: { transition: { delayChildren: 0.5, staggerChildren: 0.08 } } }}>
            {STATS.map(([v, l]) => (
              <motion.div key={l} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }}>
                <dt>{v}</dt><dd>{l}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.aside className="pgh-panel" aria-label="Programs at a glance" initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: EASE }}>
          <div className="pgh-panel-h"><b>Programs at a glance</b><span>{PROGRAMS.length} options</span></div>
          <ul>
            {PROGRAMS.map((p, i) => (
              <motion.li key={p.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.08, duration: 0.5, ease: EASE }}>
                <a href="#programs" style={{ '--c': p.c, '--cs': p.cs }}>
                  <span className="ic-wrap"><Icon name={p.icon} /></span>
                  <span className="t"><b>{p.title}</b><small>{p.mode}</small></span>
                  <span className="d">{p.duration}</span>
                  <Icon name="arrow" />
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="pgh-panel-f"><Icon name="award" /> Certificate with a verifiable ID on completion</div>
        </motion.aside>

        <motion.ul className="pgh-chips" aria-label="Jump to section" {...up(0.7)}>
          {CHIPS.map(([label, href], i) => (
            <li key={href}><a href={href}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a></li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
