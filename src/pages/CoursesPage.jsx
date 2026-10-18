import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CoursesHero from '../sections/CoursesHero.jsx';
import CtaBand from '../ui/CtaBand.jsx';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { EASE, Item, Reveal, Stagger, TiltCard } from '../ui/Reveal.jsx';
import useSeo from '../useSeo.js';
import Courses from '../sections/Courses.jsx';
import { COURSES, SITE } from '../data.js';

const SEO = {
  title: 'Courses | .NET, Java, React, Python, AI/ML, Data Analytics, Cloud & Testing',
  description:
    'Explore 8 job-focused IT courses: .NET Full Stack, Java Backend, React and Next.js, Python, AI and Machine Learning, Data Analytics, Cloud and DevOps, and Software Testing. Mentor-led, project-based, with certificates.',
};

const INCLUDES = [
  ['users', 'Live mentor sessions', 'Doubt solving and walkthroughs with working developers.'],
  ['code', 'Hands-on assignments', 'Small tasks after every concept so you practise as you learn.'],
  ['github', 'Project on GitHub', 'A graded project with source code, README and demo.'],
  ['msg', 'Weekly code reviews', 'Pull-request feedback so your code keeps getting better.'],
  ['briefcase', 'Interview preparation', 'Mock interviews and resume review before you apply.'],
  ['shield', 'Verifiable certificate', 'A unique certificate ID anyone can check online.'],
];

const FAQ = [
  ['Which course should I start with?', 'Beginners usually start with Python, Data Analytics or Software Testing. If you already code, pick a development track such as .NET Full Stack, Java Backend or React and Next.js. Our counselling desk can help you decide.'],
  ['Do I need prior experience?', 'Beginner-level courses need none. Intermediate courses list their prerequisites, for example basic programming and SQL, before you apply.'],
  ['How long does each course take?', 'Courses run 8 to 12 weeks depending on the track. The duration is shown on every course card.'],
  ['Will I work on real projects?', 'Yes. Every course ends with a graded project that you build in milestones, push to GitHub and present to a mentor.'],
  ['Can I combine a course with an internship?', 'Yes. Many students take a course first and continue into an internship or project-based program. Ask the counselling desk about the best sequence.'],
  ['Do I get a certificate?', 'Eligible students receive a certificate with a unique ID after meeting attendance, assessment and project criteria.'],
];

function Includes() {
  return (
    <section className="sec white" id="includes" aria-labelledby="h-inc">
      <div className="wrap">
        <SectionHead eyebrow="What every course includes" id="h-inc" title={<>Same strong <em className="grad">learning system</em>, whichever track you pick</>} />
        <Stagger className="cp-inc">
          {INCLUDES.map(([ic, t, d]) => (
            <TiltCard key={t} className="cp-inc-card" max={4}>
              <span className="ab-ico" style={{ color: 'var(--blue)', background: 'var(--sky)' }}><Icon name={ic} /></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </TiltCard>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="sec" id="course-faq" aria-labelledby="h-cfaq">
      <div className="wrap ab-faq-wrap">
        <div className="ab-faq-side">
          <SectionHead eyebrow="Course FAQs" id="h-cfaq" title={<>Before you <em className="grad">choose</em></>}>
            Quick answers about levels, duration and projects.
          </SectionHead>
          <Reveal><BlobButton href="#apply" variant="outline" icon="msg">Talk to a counsellor</BlobButton></Reveal>
        </div>
        <Stagger className="faq" gap={0.05}>
          {FAQ.map(([q, a], i) => {
            const on = open === i;
            return (
              <Item key={q} className={`fq${on ? ' open' : ''}`}>
                <h3>
                  <button type="button" id={`cq-${i}`} aria-expanded={on} aria-controls={`ca-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    <span>{q}</span><Icon name="chevron" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`ca-${i}`} role="region" aria-labelledby={`cq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} style={{ overflow: 'hidden' }}>
                      <p className="ans">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Item>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export default function CoursesPage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  useSeo({
    ...SEO,
    path: '/courses',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: SEO.title, description: SEO.description, url: origin + '/courses', isPartOf: { '@type': 'WebSite', name: SITE.name } },
      { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Courses', itemListElement: COURSES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Course', name: c.title, description: c.desc, educationalLevel: c.level, timeRequired: `P${c.weeks}W`, provider: { '@type': 'EducationalOrganization', name: SITE.name } } })) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' }, { '@type': 'ListItem', position: 2, name: 'Courses' }] },
    ],
  });

  return (
    <>
      <CoursesHero />
      <Courses />
      <Includes />
      <Faq />
      <CtaBand title="Ready to start your course?" text="Tell us your degree and goal, and we will recommend the right track, batch and fee in writing. No payment is taken at the application stage." />
    </>
  );
}
