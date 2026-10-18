import { Reveal } from './Reveal.jsx';

export default function SectionHead({ eyebrow, title, id, children, action }) {
  return (
    <Reveal className="shead">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={id}>{title}</h2>
        {children && <p>{children}</p>}
      </div>
      {action}
    </Reveal>
  );
}
