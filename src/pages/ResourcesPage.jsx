import ResourcesHero from '../sections/ResourcesHero.jsx';
import CtaBand from '../ui/CtaBand.jsx';
import useSeo from '../useSeo.js';

import Blogs from '../sections/Blogs.jsx';
import Certificates from '../sections/Certificates.jsx';
import Work from '../sections/Work.jsx';
import Corner from '../sections/Corner.jsx';
import { FAQ, POSTS, SITE } from '../data.js';

const SEO = {
  title: 'Resources | Career Blogs, Certificate Verification, Student Work & FAQs',
  description:
    'Career guidance articles, interview prep and tutorials, verify any certificate online with its ID, see real student projects and genuine reviews, and get clear answers for students and parents.',
};

export default function ResourcesPage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const faqs = [...FAQ.s, ...FAQ.p];
  useSeo({
    ...SEO,
    path: '/resources',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: SEO.title, description: SEO.description, url: origin + '/resources', isPartOf: { '@type': 'WebSite', name: SITE.name } },
      { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Latest articles', itemListElement: POSTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title })) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' }, { '@type': 'ListItem', position: 2, name: 'Resources' }] },
    ],
  });

  return (
    <>
      <ResourcesHero />
      <Blogs />
      <Certificates />
      <Work />
      <Corner />
      <CtaBand title="Still have questions? Talk to a counsellor." text="Book a free call to discuss programs, fees and your goals. No payment is taken at the application stage." />
    </>
  );
}
