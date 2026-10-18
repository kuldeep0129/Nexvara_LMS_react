import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Item, Reveal, Stagger } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { FAQ } from '../data.js';

function Faq({ q, a, open, onToggle }) {
  return (
    <div className={`fq${open ? ' open' : ''}`}>
      <button type="button" aria-expanded={open} onClick={onToggle}>
        <span>{q}</span>
        <Icon name="chevron" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} style={{ overflow: 'hidden' }}>
            <p className="ans">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PROGRESS = [['Attendance', '92%', 92], ['Assignments', '8 of 10', 80], ['Project milestones', '60%', 60]];

export default function Corner() {
  const { setProgram } = useApp();
  const [aud, setAud] = useState('s');
  const [openIdx, setOpenIdx] = useState(0);
  const pick = (a) => { setAud(a); setOpenIdx(0); };

  return (
    <section className="sec white" id="corner" aria-labelledby="h-corner">
      <div className="wrap">
        <SectionHead eyebrow="Student and parent corner" id="h-corner" title={<>Clear answers on fees, progress and <em className="grad">support</em></>} />
        <div className="corner">
          <Reveal>
            <div className="seg" role="group" aria-label="Choose audience">
              {[['s', 'For students'], ['p', 'For parents']].map(([k, label]) => (
                <button key={k} type="button" aria-pressed={aud === k} onClick={() => pick(k)}>
                  {aud === k && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={aud} className="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {FAQ[aud].map(([q, a], i) => (
                  <Faq key={q} q={q} a={a} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
                ))}
              </motion.div>
            </AnimatePresence>
          </Reveal>

          <Stagger className="info" gap={0.1}>
            <Item className="card">
              <h3><Icon name="rupee" />Fees and refund policy</h3>
              <div className="kv">
                <div><span>Fee details</span><b>Shown on every program</b></div>
                <div><span>Payment options</span><b>Confirmed in writing</b></div>
                <div><span>Refund window</span><b>Published before you pay</b></div>
              </div>
              <p className="vhint">Final policy text goes here before launch.</p>
            </Item>
            {/* <Item className="card">
              <h3><Icon name="trend" />Progress tracking <span className="demo-tag">Sample</span></h3>
              <div className="prog">
                {PROGRESS.map(([k, v, w], i) => (
                  <div className="row" key={k}>
                    <div><span>{k}</span><b>{v}</b></div>
                    <div className="meter">
                      <motion.i
                        style={{ width: `${w}%`, transformOrigin: 'left' }}
                        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.12, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Item> */}
            <Item className="card">
              <h3><Icon name="msg" />Counselling and support</h3>
              <div className="kv">
                <div><span>Free counselling call</span><b>Before you apply</b></div>
                <div><span>Support hours</span><b>Mon to Sat, 10 AM to 6 PM</b></div>
              </div>
              <div style={{ marginTop: 16 }}>
                <BlobButton variant="soft" size="sm" href="#apply" onClick={() => setProgram('Not sure (counselling)')}>Book a counselling call</BlobButton>
              </div>
            </Item>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
