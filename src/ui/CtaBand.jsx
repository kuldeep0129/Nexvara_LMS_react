import BlobButton from './BlobButton.jsx';
import { Reveal } from './Reveal.jsx';
import { useApp } from '../ctx.jsx';

/** Dark gradient call-to-action panel. Uses the .ab-final styles from about.css. */
export default function CtaBand({ title, text }) {
  const { demo } = useApp();
  return (
    <section className="sec ab-final-sec" aria-label="Apply">
      <div className="wrap">
        <Reveal className="ab-final">
          <div className="ab-final-bg" aria-hidden="true"><span /><span /><span /></div>
          <span className="ab-pill dark"><i /> Admissions open</span>
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="ab-cta center">
            <BlobButton size="lg" variant="amber" href="#apply" iconRight="arrow">Apply Now</BlobButton>
            <BlobButton size="lg" variant="soft" href="#" icon="phone" onClick={demo}>Book a free call</BlobButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
