import ProgramsHero from '../sections/ProgramsHero.jsx';
import CtaBand from '../ui/CtaBand.jsx';
import useSeo from '../useSeo.js';
import Programs from '../sections/Programs.jsx';
import Students from '../sections/Students.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import Projects from '../sections/Projects.jsx';
import { PROGRAMS, SITE } from '../data.js';

const SEO = {
  title: 'Programs | Summer Training, Internship, Apprenticeship & Projects',
  description:
    'Compare summer training, internships, apprenticeships, industrial training and project-based learning. See duration, mode, eligibility and fees, pick your stream and learn how admission works.',
};

export default function ProgramsPage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  useSeo({
    ...SEO,
    path: '/programs',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: SEO.title, description: SEO.description, url: origin + '/programs', isPartOf: { '@type': 'WebSite', name: SITE.name } },
      { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Training programs', itemListElement: PROGRAMS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, description: p.summary })) },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' }, { '@type': 'ListItem', position: 2, name: 'Programs' }] },
    ],
  });

  return (
    <>
      <ProgramsHero />
      <Programs />
      <Students />
      <HowItWorks />
      <Projects />
      <CtaBand title="Found your program? Apply in two minutes." text="Choose a program, fill a short form and we will confirm eligibility, batch dates and fees in writing. No payment is taken at this stage." />
    </>
  );
}
