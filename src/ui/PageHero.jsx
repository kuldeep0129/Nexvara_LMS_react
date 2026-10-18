import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icon.jsx';
import { EASE } from './Reveal.jsx';

/** Compact animated header for inner pages. chips = [[label, '#sectionId'], ...] */
export default function PageHero({ crumb, eyebrow, title, lead, chips = [] }) {
  const up = (d) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.75, ease: EASE } });
  return (
    <section className="ph" aria-labelledby="ph-h1">
      <div className="ab-mesh" aria-hidden="true"><span /><span /><span /></div>
      <div className="wrap ph-in">
        <motion.nav className="ab-crumbs" aria-label="Breadcrumb" {...up(0)}>
          <Link to="/">Home</Link><Icon name="chevron" /><span aria-current="page">{crumb}</span>
        </motion.nav>
        <motion.span className="ab-pill" {...up(0.05)}><i /> {eyebrow}</motion.span>
        <motion.h1 id="ph-h1" {...up(0.12)}>{title}</motion.h1>
        <motion.p className="ab-lead" {...up(0.22)}>{lead}</motion.p>
        {chips.length > 0 && (
          <motion.ul className="ph-chips" aria-label="Jump to section" {...up(0.34)}>
            {chips.map(([label, href], i) => (
              <li key={href}><a href={href}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a></li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
