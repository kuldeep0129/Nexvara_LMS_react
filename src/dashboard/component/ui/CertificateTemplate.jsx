import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { SITE } from "../../../data";
import logo from "../../../images/nexvara-logo.png";
import signature from "../../../images/DirectorSignature.png";
import "../../../styles/certificate.css";

function Qr() {
  // Matches the QR-style mark in the supplied certificate design.
  // The authoritative verification code is also printed beside the certificate ID.
  const N = 11;
  const cells = useMemo(() => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const finders = [[0, 0], [N - 5, 0], [0, N - 5]];
    const inFinder = (x, y) => finders.find(([fx, fy]) =>
      x >= fx - 1 && x <= fx + 5 && y >= fy - 1 && y <= fy + 5
    );
    const out = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const f = finders.find(([fx, fy]) => x >= fx && x < fx + 5 && y >= fy && y < fy + 5);
        if (f) {
          const dx = x - f[0];
          const dy = y - f[1];
          const ring = dx === 0 || dy === 0 || dx === 4 || dy === 4;
          const core = dx >= 1 && dx <= 3 && dy >= 1 && dy <= 3 ? dx === 2 && dy === 2 : false;
          if (ring || core) out.push([x, y]);
        } else if (!inFinder(x, y) && rnd() > 0.5) {
          out.push([x, y]);
        }
      }
    }
    return out;
  }, []);

  return (
    <svg viewBox={`0 0 ${N} ${N}`} role="img" aria-label="Certificate QR-style mark" shapeRendering="crispEdges" width="58" height="58">
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0E1A33" />)}
    </svg>
  );
}

export default function CertificateTemplate({ certificate }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ry = useSpring(mx, { stiffness: 120, damping: 18 });
  const rx = useSpring(my, { stiffness: 120, damping: 18 });

  const move = (event) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    mx.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
    my.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  if (!certificate) return null;

  return (
    <div className="cert-stage certificate-print-card" ref={ref} onPointerMove={move} onPointerLeave={reset}>
      <motion.div className="cert" style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}>
        <div className="wm" aria-hidden="true">NEXVARA</div>
        <img className="cert-logo" src={logo} alt={`${SITE.name} logo`} width="120" height="48" />
        <div className="cert-in">
          <small className="o">{SITE.name}</small>
          <h3>Certificate of Completion</h3>
          <p>This is to certify that</p>
          <div className="nm">{certificate.studentName}</div>
          <p>
            has successfully completed the <b>{certificate.course}</b> program
            and fulfilled the course completion requirements.
          </p>
          <div className="cert-f">
            <div className="sig-wrap">
              <img className="sig-img" src={signature} alt="Signature of the Program Director" />
              <div className="sig">Program Director<span className="id">Issued {certificate.issuedDate}</span></div>
            </div>
            <div className="certificate-qr"><Qr /><span className="id">Verify online</span></div>
            <div className="sig">Certificate ID<span className="id">{certificate.certificateId}</span></div>
          </div>
          {certificate.verificationCode && (
            <p className="certificate-verification-code">Verification code: {certificate.verificationCode}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
