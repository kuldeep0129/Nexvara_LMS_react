import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Reveal } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { POSTS } from '../data.js';
import '../styles/blogs2.css';

function Thumb({ p, big }) {
  return (
    <div className="bl-thumb" aria-hidden="true">
      <span className="bl-dots" />
      <span className="bl-blob b1" />
      <span className="bl-blob b2" />
      <span className="bl-tile"><Icon name={p.icon} /></span>
      {big && (
        <>
          <span className="bl-chip c1"><Icon name="check" />Step by step</span>
          <span className="bl-chip c2"><Icon name="clock" />{p.read}</span>
        </>
      )}
    </div>
  );
}

function PostCard({ p, big, demo }) {
  return (
    <motion.a
      layout
      href="#"
      onClick={demo}
      className={`bl-card${big ? ' big' : ''}`}
      style={{ '--c': p.c, '--cs': p.cs }}
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="bl-in">
        <Thumb p={p} big={big} />
        <div className="bl-body">
          <div className="bl-meta">
            <span className="bl-cat"><i />{p.cat}</span>
            {!big && <span className="bl-read"><Icon name="clock" />{p.read}</span>}
          </div>
          <h3>{p.title}</h3>
          <div className="bl-foot">
            <span className="bl-go">Read article <Icon name="arrow" /></span>
            {big && <span className="bl-sample">Featured guide</span>}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function Blogs() {
  const { demo } = useApp();
  const cats = useMemo(() => ['All', ...Array.from(new Set(POSTS.map((p) => p.cat)))], []);
  const [cat, setCat] = useState('All');
  const all = cat === 'All';
  const list = all ? POSTS : POSTS.filter((p) => p.cat === cat);

  return (
    <section className="sec" id="resources" aria-labelledby="h-blog">
      <div className="wrap">
        <SectionHead
          eyebrow="Blogs and career resources"
          id="h-blog"
          title={<>Guides for <em className="grad">your next step</em></>}
          action={<BlobButton variant="outline" href="#" onClick={demo} iconRight="arrow">Read All Articles</BlobButton>}
        >
          Career advice, interview preparation, tutorials, project ideas and internship tips from our mentors.
        </SectionHead>

        <Reveal>
          <div className="bl-filters" role="tablist" aria-label="Filter articles by topic">
            {cats.map((c) => (
              <button key={c} type="button" role="tab" aria-selected={cat === c} className={`bl-f${cat === c ? ' on' : ''}`} onClick={() => setCat(c)}>
                {cat === c && <motion.span layoutId="bl-pill" className="bl-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className={`bl-grid${all ? '' : ' flat'}`}>
          <AnimatePresence mode="popLayout" initial>
            {list.map((p, i) => (
              <PostCard key={p.title} p={p} big={all && i === 0 && p.big} demo={demo} />
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="bl-sub">
          <div className="bl-sub-ic"><Icon name="mail" /></div>
          <div className="bl-sub-t"><b>Get new guides in your inbox</b><span>One short email when we publish. No spam, unsubscribe anytime.</span></div>
          <BlobButton href="#" onClick={demo} iconRight="arrow">Notify me</BlobButton>
        </Reveal>
      </div>
    </section>
  );
}
