import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { useApp } from '../ctx.jsx';  
import logo from '../images/nexvara-logo-sort.png';
import {daysLeft } from '../hooks.js';
import { ANNOUNCEMENTS, NAV, SITE } from '../data.js';
import useAnnouncements from '../hook/useAnnouncements.js';


export function Announcement() {
  const { announcements, loading, error } = useAnnouncements();

  const group = (hidden = false) => (
    <div className="tk-g" aria-hidden={hidden || undefined}>
      {announcements.map((item, index) => (
        <span className="ann-api-item" key={item.id ?? `${item.title}-${index}`}>
          <span className="ann-api-title">{item.title}</span>

          {item.sortDescription && (
            <span className="ann-api-desc">{item.sortDescription}</span>
          )}

          <span className="ann-api-sep" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="ann">
      <div className="wrap ann-in">
        <span className="badge">Latest Updates</span>

        <div className="ticker" aria-label="Latest announcements" aria-live="polite">
          {loading ? (
            <span className="ann-status">Loading latest announcements...</span>
          ) : error ? (
            <span className="ann-status">Announcements are temporarily unavailable.</span>
          ) : announcements.length > 0 ? (
            <div className="tk-track">
              {group(false)}
              {group(true)}
            </div>
          ) : (
            <span className="ann-status">Stay tuned for upcoming announcements.</span>
          )}
        </div>

        <a className="al" href="#apply">
          Apply now <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}


export function Logo({ light }) {
  return (
    <Link
      className={`logo${light ? ' light' : ''}`}
      href="/"
      aria-label={`${SITE.name} home`}
    >
      <span className="logo-mark">
        <img
          src={logo}
          alt={`${SITE.name} logo`}
          className="logo-image"
        />
      </span>

      <span>
        <b>{SITE.name}</b>
        <small>{SITE.tagline}</small>
      </span>
    </Link>
  );
}

export default function Header() {
const { openStudentAccess } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  return (
    <header className={`nav-shell${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap">
        <motion.nav
          className="glass-nav"
          aria-label="Main"
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo />
          <ul className="nav-links">
            {NAV.map((n) => (
              <li key={n.label}>
              <NavLink to={n.to} end className={({ isActive }) => `nav-link${isActive ? ' on' : ''}`}>
  {({ isActive }) => (
    <>
      {isActive && (
        <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
      )}
      <span>{n.label}</span>
    </>
  )}
</NavLink>
              </li>
            ))}
          </ul>
          <div className="nav-cta">
            <BlobButton variant="soft" size="sm" icon="user" href="#student-access" onClick={(e) => {
  e.preventDefault();
  setOpen(false);
  openStudentAccess();
}}>
              Student Login
            </BlobButton>
            <BlobButton size="sm" href="#apply">
              Apply Now
            </BlobButton>
          </div>
          <button
            className="burger"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </motion.nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              className="glass-drawer"
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="drawer-links">
                {NAV.map((n, i) => (
                  <motion.li key={n.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                   <NavLink to={n.to} end className={({ isActive }) => `pill${isActive ? ' on' : ''}`} onClick={() => setOpen(false)}>
  {n.label}
</NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className="drawer-cta">
                <BlobButton variant="soft" icon="user" href="#student-access" block onClick={(e) => {
  e.preventDefault();
  setOpen(false);
  openStudentAccess();
}}>
                  Student Login
                </BlobButton>
                <BlobButton href="#apply" block onClick={() => setOpen(false)}>
                  Apply Now
                </BlobButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
