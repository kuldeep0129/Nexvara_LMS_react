import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { Card, EASE, Item, Reveal, Stagger, TiltCard } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import useSeo from '../useSeo.js';
import { ACHIEVEMENTS, HERO_STATS, PROGRAMS, REVIEWS, SITE } from '../data.js';
import logo from '../images/nexvara-logo-sort.png';
import '../styles/about2.css';
import { ABOUT_FAQ, ABOUT_SEO, AUDIENCES, CTA, MV, PROCESS, TEAM, VALUES, WHO, WHY } from './aboutData.js';

/* ---------- small helpers ---------- */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, { duration: 1.5, ease: EASE, onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v) + suffix) });
    return () => c.stop();
  }, [seen, to, suffix]);
  return <b ref={ref}>{to + suffix}</b>;
}

const Ico = ({ name, c, cs, live }) => (
  <span className={`ab-ico${live ? ' live' : ''}`} data-k={name} style={{ color: c, background: cs }}><Icon name={name} /></span>
);

const TECH = [
  ['.NET', 'devicon-dotnetcore-plain colored'],
  ['Java', 'devicon-java-plain colored'],
  ['React', 'devicon-react-original colored'],
  ['Python', 'devicon-python-plain colored'],
  ['AI/ML', 'devicon-tensorflow-original colored'],
  ['Data', 'devicon-pandas-plain colored'],
  ['Cloud', 'devicon-azure-plain colored'],
  ['Testing', 'devicon-selenium-original colored'],
];

/* ---------- 01 Hero ---------- */
function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });
  const rY = useTransform(sx, [-1, 1], [-9, 9]);
  const rX = useTransform(sy, [-1, 1], [7, -7]);
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <section className="ab-hero" aria-labelledby="ab-h1">
      <div className="ab-mesh" aria-hidden="true"><span /><span /><span /></div>
      <div className="wrap ab-hero-in">
        <div className="ab-hero-copy">
          <motion.nav className="ab-crumbs" aria-label="Breadcrumb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/">Home</Link><Icon name="chevron" /><span aria-current="page">About Us</span>
          </motion.nav>
          <motion.span className="ab-pill" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.6, ease: EASE }}>
            <i /> About {SITE.name}
          </motion.span>
          <motion.h1 id="ab-h1" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.8, ease: EASE }}>
            We turn students into <em className="grad"><span className="nw">job-ready</span> builders</em>.
          </motion.h1>
          <motion.p className="ab-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.8, ease: EASE }}>
            Mentor-led summer training, internships, apprenticeships and project-based learning. Real code, weekly reviews and certificates you can verify.
          </motion.p>
          <motion.div className="ab-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.8, ease: EASE }}>
            <BlobButton size="lg" href="#apply" iconRight="arrow">Apply Now</BlobButton>
            <BlobButton size="lg" variant="outline" href="#programs">Explore Programs</BlobButton>
          </motion.div>
          <motion.dl className="ab-stats" initial="h" animate="s" variants={{ s: { transition: { delayChildren: 0.55, staggerChildren: 0.09 } } }}>
            {HERO_STATS.map((s) => (
              <motion.div key={s.label} variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }}>
                <dt><Counter to={s.to} suffix={s.suffix} /></dt>
                <dd>{s.label}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <div className="ab-vis-wrap" onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
          <motion.div className="ab-vis" style={{ rotateX: rX, rotateY: rY }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: EASE }}>
            <div className="ab-glass">
              <div className="ab-glass-h"><i /><i /><i /><span>learning-path</span></div>
              {[['Learn', 'concepts to code', 86, 'var(--blue)'], ['Build', 'real project', 64, 'var(--mint)'], ['Grow', 'portfolio and interviews', 42, '#B97800']].map(([t, s, v, c], i) => (
                <div className="ab-row" key={t}>
                  <span className="n" style={{ background: c }}>{i + 1}</span>
                  <div><b>{t}</b><small>{s}</small><span className="bar"><motion.i style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.9 + i * 0.15, duration: 1.1, ease: EASE }} /></span></div>
                </div>
              ))}
            </div>
            <span className="ab-float f1"><Icon name="check" /> Code reviewed</span>
            <span className="ab-float f2"><Icon name="award" /> Certificate ID verified</span>
            <span className="ab-float f3"><Icon name="github" /> Pull request merged</span>
            <span className="ab-orbit o1" /><span className="ab-orbit o2" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 02 Who we are ---------- */
function Who() {
  return (
    <section className="sec white" id="who" aria-labelledby="ab-who">
      <div className="wrap ab-who">
        <div>
          <Reveal>
            <span className="eyebrow">{WHO.eyebrow}</span>
            <h2 id="ab-who" className="ab-h2">{WHO.title}</h2>
          </Reveal>
          {WHO.paras.map((p, i) => (<Reveal key={i} delay={0.08 * (i + 1)}><p className="ab-p">{p}</p></Reveal>))}
          <Stagger className="ab-points" as="ul">
            {WHO.points.map(([ic, t, d]) => (
              <Item as="li" key={t}>
                <Ico name={ic} c="var(--blue)" cs="var(--sky)" />
                <div><b>{t}</b><p>{d}</p></div>
              </Item>
            ))}
          </Stagger>
        </div>
        <Reveal className="ab-story" delay={0.1}>
          <div className="ab-story-card">
            <span className="ab-quote-mark" aria-hidden="true">“</span>
            <p>Our test for every lesson is simple: can the student build something with it by the end of the week?</p>
            <footer><span className="av"><img src={logo} alt={`${SITE.name} logo`} /></span><div><b>{SITE.name}</b><small>Training philosophy</small></div></footer>
          </div>
          <div className="ab-chips" aria-label="Focus areas">
            {TECH.map(([t, cls], i) => (
              <motion.span key={t} className="ab-tech" initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}>
                <i className={cls} aria-hidden="true" />{t}
              </motion.span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 03 Mission and vision ---------- */
function MissionVision() {
  return (
    <section className="sec" id="mission" aria-labelledby="ab-mv">
      <div className="wrap">
        <SectionHead eyebrow="Mission and vision" id="ab-mv" title={<>What we work for, <em className="grad">every single batch</em></>} />
        <Stagger className="ab-mv">
          {MV.map((m) => (
            <TiltCard key={m.tag} className="ab-mv-card">
              <Ico name={m.icon} c={m.c} cs={m.cs} live />
              <span className="ab-tag" style={{ color: m.c }}>{m.tag}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <span className="ab-mv-glow" style={{ background: m.cs }} aria-hidden="true" />
            </TiltCard>
          ))}
        </Stagger>
        <Reveal className="ab-values">
          <b>Our values</b>
          <ul>{VALUES.map((v) => (<li key={v}><Icon name="check" />{v}</li>))}</ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 04 Why choose us ---------- */
function Why() {
  return (
    <section className="sec white" id="why" aria-labelledby="ab-why">
      <div className="wrap">
        <SectionHead eyebrow="Why choose us" id="ab-why" title={<>Six reasons students <em className="grad">stay and succeed</em></>}>
          Training that is designed around outcomes you can show, not hours you can count.
        </SectionHead>
        <Stagger className="ab-why">
          {WHY.map((w, i) => (
            <Card key={w.title} className="ab-why-card">
              <span className="ab-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <Ico name={w.icon} c={w.c} cs={w.cs} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </Card>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- 05 Learning process ---------- */
function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <section className="sec" id="process" aria-labelledby="ab-proc">
      <div className="wrap">
        <SectionHead eyebrow="Learning process" id="ab-proc" title={<>From first call to <em className="grad">verified certificate</em></>}>
          A clear six-step path, so you always know what happens next.
        </SectionHead>
        <ol className="ab-tl" ref={ref}>
          <span className="ab-tl-line" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></span>
          {PROCESS.map((s, i) => (
            <motion.li key={s.title} className={`ab-step${i % 2 ? ' r' : ''}`} initial={{ opacity: 0, x: i % 2 ? 90 : -90 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ duration: 0.75, ease: EASE }}>
              <motion.span className="ab-node" initial={{ scale: 0.4 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}><Icon name={s.icon} /></motion.span>
              <div className="ab-step-card">
                <small>Step {i + 1}</small>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 06 Programs and audience ---------- */
function ProgramsAudience() {
  const [id, setId] = useState(AUDIENCES[0].id);
  const { setProgram } = useApp();
  const aud = AUDIENCES.find((a) => a.id === id);
  const list = PROGRAMS.filter((p) => aud.programs.includes(p.title));
  return (
    <section className="sec white" id="who-for" aria-labelledby="ab-prog">
      <div className="wrap">
        <SectionHead eyebrow="Programs and audience" id="ab-prog" title={<>Find the program that fits <em className="grad">your degree</em></>}>
          Choose your stream to see the programs we recommend.
        </SectionHead>
        <Reveal>
          <div className="tabs" role="tablist" aria-label="Choose your stream">
            {AUDIENCES.map((a) => (
              <button key={a.id} type="button" role="tab" aria-selected={id === a.id} className="tab" onClick={() => setId(a.id)}>
                {id === a.id && <motion.span layoutId="ab-tab" className="tab-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.div key={id} role="tabpanel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
            <p className="ab-aud-note"><Icon name="info" /> {aud.note}</p>
            <div className="ab-progs">
              {list.map((p, i) => (
                <motion.article key={p.id} className="abp" style={{ '--c': p.c, '--cs': p.cs }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}>
                  <div className="abp-in">
                    <div className="abp-top">
                      <span className="abp-ic"><Icon name={p.icon} /></span>
                      <span className="abp-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p className="abp-sum">{p.summary}</p>
                    <ul className="abp-facts">
                      <li><Icon name="clock" /><span>{p.duration}</span></li>
                      <li><Icon name="laptop" /><span>{p.mode}</span></li>
                      <li><Icon name="cap" /><span>{p.eligibility}</span></li>
                    </ul>
                    <div className="abp-foot">
                      <span className="abp-fee"><small>Fee</small><b>{p.fee}</b></span>
                      <a className="abp-apply" href="#apply" onClick={() => setProgram(p.title)}>Apply <Icon name="arrow" /></a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <Reveal className="ab-inline-cta"><BlobButton href="#programs" variant="soft" iconRight="arrow">See all program details</BlobButton></Reveal>
      </div>
    </section>
  );
}

/* ---------- 07 Team ---------- */
function Team() {
  const { demo } = useApp();
  return (
    <section className="sec" id="team" aria-labelledby="ab-team">
      <div className="wrap">
        <SectionHead eyebrow="Team and mentors" id="ab-team" title={<>Learn from people who <em className="grad">ship software</em></>}>
          Our mentors are working professionals who review your code the way they review their own team's.
        </SectionHead>
        <Stagger className="ab-team">
          {TEAM.map((m) => (
            <TiltCard key={m.role} className="ab-member" max={6}>
              <div className="ab-avatar" style={{ background: m.cs, color: m.c }}>
                <span>{m.init}</span>
                <i className="ring" style={{ borderColor: m.c }} />
              </div>
              <h3>{m.name}</h3>
              <p className="role">{m.role}</p>
              <p className="exp"><Icon name="briefcase" />{m.exp}</p>
              <ul className="ab-skills">{m.skills.map((s) => (<li key={s}>{s}</li>))}</ul>
              <a href="#" className="ab-in" aria-label={`${m.role} on LinkedIn`} onClick={demo}><Icon name="linkedin" /></a>
            </TiltCard>
          ))}
        </Stagger>
        <p className="ab-note">Sample profiles. Replace with your real mentors, photos and experience.</p>
      </div>
    </section>
  );
}

/* ---------- 08 Achievements and testimonials ---------- */
function Proof() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold) return;
    const t = setInterval(() => setI((x) => (x + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, [hold]);
  const r = REVIEWS[i];
  return (
    <section className="sec white" id="proof" aria-labelledby="ab-proof">
      <div className="wrap">
        <SectionHead eyebrow="Achievements and testimonials" id="ab-proof" title={<>Results our students <em className="grad">talk about</em></>} />
        <div className="ab-proof">
          <Reveal className="ab-testi" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
            <span className="ab-quote-mark" aria-hidden="true">“</span>
            <div className="ab-testi-body" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.blockquote key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: EASE }}>
                  <p>{r.text}</p>
                  <footer>
                    <span className="av" style={{ background: r.bg, color: r.c }}>{r.init}</span>
                    <div><b>{r.name}</b><small>{r.role}</small></div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
            <div className="ab-dots" role="group" aria-label="Choose testimonial">
              {REVIEWS.map((_, k) => (
                <button key={k} type="button" aria-label={`Testimonial ${k + 1}`} aria-current={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)} />
              ))}
            </div>
            <small className="ab-note-s">Sample reviews. Replace with genuine, consented student feedback.</small>
          </Reveal>
          <Stagger className="ab-ach">
            {ACHIEVEMENTS.map(([ic, t]) => (
              <Card key={t} className="ab-ach-card">
                <Ico name={ic} c="var(--blue)" cs="var(--sky)" />
                <b>{t}</b>
              </Card>
            ))}
            <Item className="ab-ach-stat">
              <div><Counter to={100} suffix="%" /><span>Hands-on projects</span></div>
              <div><Counter to={6} /><span>Steps to certificate</span></div>
            </Item>
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ---------- 09 FAQ ---------- */
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="sec" id="faq" aria-labelledby="ab-faq">
      <div className="wrap ab-faq-wrap">
        <div className="ab-faq-side">
          <SectionHead eyebrow="FAQs" id="ab-faq" title={<>Questions, <em className="grad">answered</em></>}>
            Cannot find what you need? Our counselling desk replies within one working day.
          </SectionHead>
          <Reveal><BlobButton href="#apply" variant="outline" icon="msg">Talk to a counsellor</BlobButton></Reveal>
        </div>
        <Stagger className="faq" gap={0.05}>
          {ABOUT_FAQ.map(([q, a], idx) => {
            const isOpen = open === idx;
            return (
              <Item key={q} className={`fq${isOpen ? ' open' : ''}`}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`ab-ans-${idx}`} id={`ab-q-${idx}`} onClick={() => setOpen(isOpen ? -1 : idx)}>
                    <span>{q}</span><Icon name="chevron" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`ab-ans-${idx}`} role="region" aria-labelledby={`ab-q-${idx}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} style={{ overflow: 'hidden' }}>
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

/* ---------- 10 Final CTA ---------- */
function FinalCta() {
  const { demo } = useApp();
  return (
    <section className="sec ab-final-sec" aria-labelledby="ab-cta">
      <div className="wrap">
        <Reveal className="ab-final">
          <div className="ab-final-bg" aria-hidden="true"><span /><span /><span /></div>
          <span className="ab-pill dark"><i /> Admissions open</span>
          <h2 id="ab-cta">{CTA.title}</h2>
          <p>{CTA.text}</p>
          <div className="ab-cta center">
            <BlobButton size="lg" variant="amber" href="#apply" iconRight="arrow">Apply Now</BlobButton>
            <BlobButton size="lg" variant="soft" href="#" icon="phone" onClick={demo}>Book a free call</BlobButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- page ---------- */
export default function About() {
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'AboutPage', name: ABOUT_SEO.title, description: ABOUT_SEO.description, url: `${typeof window !== 'undefined' ? window.location.origin : ''}/about`, isPartOf: { '@type': 'WebSite', name: SITE.name } },
    { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE.name, slogan: SITE.tagline, description: ABOUT_SEO.description },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: typeof window !== 'undefined' ? window.location.origin + '/' : '/' }, { '@type': 'ListItem', position: 2, name: 'About Us' }] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: ABOUT_FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
  useSeo({ ...ABOUT_SEO, path: '/about', jsonLd });

  return (
    <>
      <Hero />
      <Who />
      <MissionVision />
      <Why />
      <Process />
      <ProgramsAudience />
      {/* <Team /> */}
      <Proof />
      <Faq />
      <FinalCta />
    </>
  );
}
