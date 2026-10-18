import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * 1. Every page change scrolls to top (or to the #section in the URL).
 * 2. Any in-page "#section" link, from any page, goes to Home and scrolls there.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const go = () => {
      const el = id === 'top' ? document.body : document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (tries++ < 10) setTimeout(go, 60);
    };
    setTimeout(go, 30);
  }, [pathname, hash]);

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      e.preventDefault();
      const id = href.slice(1);
      const el = id === 'top' ? document.body : document.getElementById(id);
      if (el) {
        // The section exists on the current page: scroll to it.
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', window.location.pathname + href);
      } else {
        // Not on this page: go to Home and scroll there.
        navigate('/' + href);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  return null;
}
