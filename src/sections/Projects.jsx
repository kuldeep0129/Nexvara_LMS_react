import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Reveal, Stagger, Card } from '../ui/Reveal.jsx';
import { ASSIGNMENTS, PROJECTS, REPO_ROWS } from '../data.js';

const TABS = [
  ['Project Library', 'folder'],
  ['GitHub repositories', 'github'],
  ['Assignments', 'file'],
  ['Mentor guidance', 'users'],
];

function SampleProjects() {
  return (
    <Stagger className="pj-grid" gap={0.07}>
      {PROJECTS.map((p) => (
        <Card className="proj" key={p.title}>
          <span className="tag" style={{ alignSelf: 'flex-start' }}>{p.level}</span>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
          <div className="tags">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        </Card>
      ))}
    </Stagger>
  );
}

function Repos() {
  return (
    <div className="repo-wrap">
      <div className="repo" role="img" aria-label="Sample repository view">
        <div className="repo-h">
          <Icon name="github" />
          <b>institute-name / student-result-portal</b>
          <span className="tag">CI passing</span>
        </div>
        {REPO_ROWS.map(([ic, name, msg], i) => (
          <motion.div className="repo-r" key={name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <Icon name={ic} /><span>{name}</span><small>{msg}</small>
          </motion.div>
        ))}
        <div className="lang">
          <i style={{ width: '58%', background: '#7C5CE0' }} /><i style={{ width: '30%', background: '#3C86D8' }} /><i style={{ width: '12%', background: '#F2A31B' }} />
        </div>
        <div className="lang-l"><span>C# 58%</span><span>TypeScript 30%</span><span>SQL 12%</span></div>
      </div>
      <div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: 14 }}>Your portfolio starts on day one</h3>
        <ul className="ul-check">
          {['A personal repository for every project', 'Branches, pull requests and reviewer comments', 'A clear README that recruiters can follow', 'Automated tests that run on every push'].map((t) => (
            <li key={t}><Icon name="check" />{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Assignments() {
  const [done, setDone] = useState(() => ASSIGNMENTS.map(() => false));
  const n = done.filter(Boolean).length;
  return (
    <div className="as-wrap">
      <div className="as-list">
        {ASSIGNMENTS.map(([t, s], i) => (
          <label className="as" key={t}>
            <input type="checkbox" checked={done[i]} onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))} />
            <span><b>{t}</b><small>{s}</small></span>
          </label>
        ))}
      </div>
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Try it: tick what you finish</h3>
        <p style={{ color: 'var(--muted)', fontSize: '.93rem', marginBottom: 16 }}>Assignments are small weekly steps toward the final project.</p>
        <div className="meter" aria-hidden="true">
          <motion.i animate={{ width: `${(n / ASSIGNMENTS.length) * 100}%` }} transition={{ duration: 0.6, ease: EASE }} />
        </div>
        <p style={{ marginTop: 10, fontWeight: 700 }}>{n} of {ASSIGNMENTS.length} complete</p>
      </div>
    </div>
  );
}

function Mentor() {
 
const msgs = [
  ['me', 'Ananya Verma', 'I have completed the login API. Could you review it before I move to the next module?'],
  ['mt', 'Kuldeep Tiwari', 'Sure. The flow looks good. Add proper validation and handle invalid login responses before moving ahead.'],
  ['me', 'Ananya Verma', 'Got it. I will make the changes and push the updated code for review.'],
];

  return (
    <div className="mentor-wrap">
      <div className="card">
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
          <span className="avatar">KT</span>
          <div><b style={{ fontSize: '1.1rem' }}>Kuldeep Tiwari</b><div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Senior Engineer</div></div>
        </div>
        <ul className="ul-check">
          {['Weekly one-to-one progress check', 'Written code review on every pull request', 'Mock interview before the final week'].map((t) => (
            <li key={t}><Icon name="check" />{t}</li>
          ))}
        </ul>
      </div>
      <div className="bubs">
        {msgs.map(([who, label, text], i) => (
          <motion.div key={text} className={`bub ${who}`} initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15 + i * 0.6, duration: 0.45, ease: EASE }}>
            <small>{label}</small>{text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const PANELS = [SampleProjects, Repos, Assignments, Mentor];

export default function Projects() {
  const [t, setT] = useState(0);
  const Panel = PANELS[t];
  const onKey = (e) => {
    if (e.key === 'ArrowRight') setT((t + 1) % TABS.length);
    if (e.key === 'ArrowLeft') setT((t + TABS.length - 1) % TABS.length);
  };
  return (
    <section className="sec" id="projects" aria-labelledby="h-proj">
      <div className="wrap">
        <SectionHead eyebrow="Practical learning" id="h-proj" title={<>Learn by <em className="grad">shipping real work</em></>}>
          Sample projects, GitHub repositories, weekly assignments and mentor guidance are part of every program.
        </SectionHead>
        <Reveal>
          <div className="tabs" role="tablist" aria-label="Practical learning" onKeyDown={onKey}>
            {TABS.map(([label, ic], i) => (
              <button key={label} role="tab" id={`tab-${i}`} aria-selected={t === i} aria-controls="tab-panel" tabIndex={t === i ? 0 : -1} className="tab" type="button" onClick={() => setT(i)}>
                {t === i && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span><Icon name={ic} />{label}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.div key={t} id="tab-panel" role="tabpanel" aria-labelledby={`tab-${t}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
            <Panel />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
