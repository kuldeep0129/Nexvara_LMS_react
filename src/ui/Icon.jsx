import { ICONS } from '../icons.js';

export default function Icon({ name, className = '', style }) {
  return (
    <svg
      className={`ic ${className}`}
      style={style}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }}
    />
  );
}
