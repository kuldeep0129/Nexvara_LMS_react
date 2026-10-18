import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Reveal } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { STREAMS } from '../data.js';

export default function Students() {
  const { setProgram } = useApp();
  const [k, setK] = useState('B.Tech');
  const d = STREAMS[k];

  return (
    <section className="sec tint" id="students" aria-labelledby="h-stu">
      <div className="wrap">
        <SectionHead eyebrow="Eligibility" id="h-stu" title={<>Programs for <em className="grad">every student</em></>}>
          Choose your degree and see which programs and course tracks suit you best.
        </SectionHead>

        <Reveal>
          <div className="chips" role="group" aria-label="Choose your degree">
            {Object.keys(STREAMS).map((key) => (
              <button key={key} className="chip" type="button" aria-pressed={k === key} onClick={() => setK(key)}>
                {k === key && <motion.span layoutId="stream-chip" className="chip-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span>{key}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={k}
              className="stu"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="sp-side">
                <span className="tag">{k}</span>
                <h3>Best fit for {k === 'Other' ? 'other degrees' : `${k} students`}</h3>
                <p>{d.note}</p>
                <div className="tags">{d.courses.map((c) => <span className="tag" key={c}>{c}</span>)}</div>
                <BlobButton variant="amber" href="#apply" onClick={() => setProgram(k === 'Other' ? 'Not sure (counselling)' : d.programs[0][0])}>
                  Apply now
                </BlobButton>
              </div>
              <div className="sp-list">
                {d.programs.map(([name, dur, text], i) => (
                  <motion.div
                    className="sp-row"
                    key={name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 + i * 0.07, ease: EASE }}
                  >
                    <b>{name}</b>
                    <span className="tag"><Icon name="clock" />{dur}</span>
                    <p>{text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
