import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Reveal } from '../ui/Reveal.jsx';
import { CERTS, CRITERIA, SITE } from '../data.js';
import logo from '../images/nexvara-logo.png';
import '../styles/certificate.css';
import signature from '../images/DirectorSignature.png';

function Qr() {
  // Decorative placeholder QR: three finder squares plus seeded random modules.
  const N = 11;
  const cells = useMemo(() => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const finders = [[0, 0], [N - 5, 0], [0, N - 5]];
    const inFinder = (x, y) => finders.find(([fx, fy]) => x >= fx - 1 && x <= fx + 5 && y >= fy - 1 && y <= fy + 5);
    const out = [];
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const f = finders.find(([fx, fy]) => x >= fx && x < fx + 5 && y >= fy && y < fy + 5);
        if (f) {
          const dx = x - f[0], dy = y - f[1];
          const ring = dx === 0 || dy === 0 || dx === 4 || dy === 4;
          const core = dx >= 1 && dx <= 3 && dy >= 1 && dy <= 3 ? dx === 2 && dy === 2 : false;
          if (ring || core) out.push([x, y]);
        } else if (!inFinder(x, y) && rnd() > 0.5) out.push([x, y]);
      }
    return out;
  }, []);
  return (
    <svg id="qr" viewBox={`0 0 ${N} ${N}`} role="img" aria-label="Sample QR code" shapeRendering="crispEdges">
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0E1A33" />)}
    </svg>
  );
}

function Certificate() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ry = useSpring(mx, { stiffness: 120, damping: 18 });
  const rx = useSpring(my, { stiffness: 120, damping: 18 });
  const move = (e) => {
    if (e.pointerType !== 'mouse') return;
    const b = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - b.left) / b.width - 0.5) * 12);
    my.set(-((e.clientY - b.top) / b.height - 0.5) * 12);
  };
  return (
    <div className="cert-stage" ref={ref} onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div className="cert" style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}>
        <div className="wm" aria-hidden="true">SAMPLE</div>
        <img className="cert-logo" src={logo} alt={`${SITE.name} logo`} width="120" height="48" />
        <div className="cert-in">
          <small className="o">{SITE.name}</small>
          <h3>Certificate of Completion</h3>
          <p>This is to certify that</p>
          <div className="nm">Student Name</div>
          <p>has successfully completed the <b>.NET Full Stack Program</b> and met the attendance, assessment and project requirements.</p>
          <div className="cert-f">
<div className="sig-wrap">
  <img className="sig-img" src={signature} alt="Signature of the Program Director" />
  <div className="sig">Program Director<span className="id">Issued 12 Aug 2026</span></div>
</div>
            <Qr />
            <div className="sig">Certificate ID<span className="id">INST-26-00142</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Certificates() {
  const [id, setId] = useState('');
  const [res, setRes] = useState(null);
  const [bad, setBad] = useState(false);

  const verify = (raw) => {
    const v = raw.trim().toUpperCase();
    if (!v) { setBad(true); setRes({ ok: false, empty: true }); return; }
    setBad(false);
    const c = CERTS[v];
    setRes(c ? { ok: true, c } : { ok: false, v });
  };

  return (
    <section className="sec white" id="certificates" aria-labelledby="h-cert">
      <div className="wrap">
        <SectionHead eyebrow="Certificates and verification" id="h-cert" title={<>A certificate <em className="grad">anyone can check</em></>}>
          Every certificate carries a unique ID. Employers and colleges can confirm it online in seconds.
        </SectionHead>
        <div className="cert-wrap">
          <Reveal><Certificate /></Reveal>
          <Reveal delay={0.1}>
            <div className="issuer">
              <span className="pc-ic" style={{ '--c': 'var(--blue)', '--cs': 'var(--sky)' }}><Icon name="award" /></span>
              <div><b>Issued by {SITE.name}</b><div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Signed by the program director. Partner names appear only where authorised.</div></div>
            </div>
            <b>Completion criteria</b>
            <ul className="crit">{CRITERIA.map((t) => <li key={t}><Icon name="check" />{t}</li>)}</ul>
            <div className="vbox">
              <h3><Icon name="shield" />Verify Certificate</h3>
              <form className="vrow" noValidate onSubmit={(e) => { e.preventDefault(); verify(id); }}>
                <label htmlFor="vId" className="sr">Certificate ID</label>
                <input className={`fld${bad ? ' bad' : ''}`} id="vId" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter ID, e.g. INST-26-00142" autoComplete="off" />
                <BlobButton type="submit" size="md">Verify Certificate</BlobButton>
              </form>
              <p className="vhint">Demo: try <button type="button" onClick={() => { setId('INST-26-00142'); verify('INST-26-00142'); }}>INST-26-00142</button></p>
              <div className="vout" aria-live="polite">
                <AnimatePresence mode="wait">
                  {res && (
                    <motion.div key={JSON.stringify(res)} className={`vres ${res.ok ? 'ok' : 'no'}`} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                      {res.ok ? (
                        <>
                          <b><Icon name="shield" />Certificate is valid</b>
                          <span>Holder: {res.c[0]}</span><span>Program: {res.c[1]}</span><span>Issued: {res.c[2]} by {SITE.name}</span>
                          <span className="demo-tag" style={{ justifySelf: 'start', marginTop: 6 }}>Demo record</span>
                        </>
                      ) : res.empty ? (
                        <><b><Icon name="info" />Enter a certificate ID</b>The ID is printed below the QR code on the certificate.</>
                      ) : (
                        <><b><Icon name="info" />No record found for {res.v}</b>Check the ID and try again. If it still fails, contact support with a copy of the certificate.</>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
