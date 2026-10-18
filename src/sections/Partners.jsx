import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { Item, Reveal, Stagger } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { PARTNER_MODES } from '../data.js';

export default function Partners() {
  const { setProgram } = useApp();
  return (
    <section className="sec tint" id="partners" aria-labelledby="h-part">
      <div className="wrap pt-wrap">
        <Reveal>
          <span className="eyebrow">Industry and training partners</span>
          <h2 id="h-part" className="h2">Partners who <em className="grad">teach, hire and mentor</em></h2>
          <ul className="pt-modes">
            {PARTNER_MODES.map((m) => (
              <li key={m.title}>
                <span className="pc-ic" style={{ '--c': m.c, '--cs': m.cs }}><Icon name={m.icon} /></span>
                <div><b>{m.title}</b><span>{m.text}</span></div>
              </li>
            ))}
          </ul>
          <BlobButton href="#apply" iconRight="arrow" onClick={() => setProgram('Partnership enquiry')}>Become a Partner</BlobButton>
        </Reveal>
        <div>
          <Stagger className="logos" gap={0.06}>
            {Array.from({ length: 8 }, (_, i) => (
              <Item className="slot" style={{ '--i': i }} key={i}>
                <div><Icon name="shield" /><br />Authorized logo</div>
              </Item>
            ))}
          </Stagger>
          <p className="note"><Icon name="info" />A logo appears here only after the partner gives written permission and the partnership is verified.</p>
          <div className="pl">
            <div><b>Partner-led program</b><span>Slot for a program co-delivered with a verified partner.</span></div>
            <div><b>Hiring drive</b><span>Slot for a verified hiring partner and its open roles.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
