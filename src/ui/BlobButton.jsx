import Icon from './Icon.jsx';
import { Link } from 'react-router-dom';

/**
 * Gooey "blob" button. Needs <GooFilter /> rendered once in the app.
 * variant: primary | outline | soft | amber    size: sm | md | lg    block: full width
 */
export default function BlobButton({ variant = 'primary', size = 'md', icon, iconRight, block, className = '', children, ...rest }) {
 const Tag = rest.to ? Link : rest.href ? 'a' : 'button';
  const extra = Tag === 'button' && !rest.type ? { type: 'button' } : {};
  return (
    <Tag className={`blob-btn ${variant} ${size}${block ? ' block' : ''} ${className}`} {...extra} {...rest}>
      <span className="blob-btn__inner">
        <span className="blob-btn__blobs" aria-hidden="true">
          <i className="blob-btn__blob" />
          <i className="blob-btn__blob" />
          <i className="blob-btn__blob" />
          <i className="blob-btn__blob" />
        </span>
        <span className="blob-btn__label">
          {icon && <Icon name={icon} />}
          {children}
          {iconRight && <Icon name={iconRight} className="go" />}
        </span>
      </span>
    </Tag>
  );
}

export function GooFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="goo-filter">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="9" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}
