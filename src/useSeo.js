

import { useEffect } from 'react';

/** Tiny SEO helper (no extra package). Sets title, description, canonical, Open Graph, Twitter and JSON-LD for the current page. */
export default function useSeo({ title, description, path = '/', jsonLd = [], image }) {
  useEffect(() => {
    const origin = window.location.origin;
    const url = origin + path;
    const prevTitle = document.title;
    const touched = [];

    const setMeta = (attr, key, value) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute('content');
      el.setAttribute('content', value);
      touched.push(() => (created ? el.remove() : el.setAttribute('content', prev ?? '')));
    };

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large');
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    if (image) setMeta('property', 'og:image', image.startsWith('http') ? image : origin + image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    let link = document.head.querySelector('link[rel="canonical"]');
    const linkCreated = !link;
    const prevHref = link?.getAttribute('href');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);

    const scripts = jsonLd.map((obj) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.dataset.seo = 'page';
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
      return s;
    });

    return () => {
      document.title = prevTitle;
      touched.forEach((undo) => undo());
      linkCreated ? link.remove() : link.setAttribute('href', prevHref);
      scripts.forEach((s) => s.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path]);
}
