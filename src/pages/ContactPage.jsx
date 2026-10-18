import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../ui/PageHero.jsx';
import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { EASE, Item, Reveal, Stagger } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import useSeo from '../useSeo.js';
import useContact from '../hook/useContact.js';
import { CONTACT, PROGRAM_OPTIONS, QUALIFICATIONS, SITE } from '../data.js';

const PHONE = CONTACT.find((c) => c[0] === 'phone')?.[2] || '';
const EMAIL = CONTACT.find((c) => c[0] === 'mail')?.[2] || '';
const ADDRESS = CONTACT.find((c) => c[0] === 'pin')?.[2] || '';
const HOURS = CONTACT.find((c) => c[0] === 'clock')?.[2] || '';
const DIGITS = PHONE.replace(/\D/g, '');

const SEO = {
  title: 'Contact Us | Talk to Our Counselling Desk, Call, WhatsApp or Visit',
  description:
    'Get in touch for admissions, courses, partnerships or certificate help. Call, WhatsApp, email or send a message and our counselling team replies within one working day.',
};

const TOPICS = [
  { id: 'admission', label: 'Admission', icon: 'cap' },
  { id: 'course', label: 'Course info', icon: 'book' },
  { id: 'partner', label: 'Partnership', icon: 'link' },
  { id: 'other', label: 'Other', icon: 'msg' },
];
const TIMES = ['Any time', 'Morning (10 am to 1 pm)', 'Afternoon (1 pm to 4 pm)', 'Evening (4 pm to 6 pm)'];
const MAX = 500;
const EMPTY = { topic: 'admission', name: '', email: '', phone: '', qual: '', program: '', time: 'Any time', msg: '', ok: false, website: '' };

/* Live "open now" status in Indian Standard Time (Mon to Sat, 10:00 to 18:00). */
function useOpenNow() {
  const calc = () => {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t)?.value;
    const day = g('weekday');
    const mins = (parseInt(g('hour'), 10) % 24) * 60 + parseInt(g('minute'), 10);
    return day !== 'Sun' && mins >= 600 && mins < 1080;
  };
  const [open, setOpen] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setOpen(calc()), 60000);
    return () => clearInterval(t);
  }, []);
  return open;
}

function validate(v) {
  const e = {};
  const phone = v.phone.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (!/^[6-9]\d{9}$/.test(phone)) e.phone = 'Enter a 10-digit Indian mobile number.';
  if (v.topic === 'admission' && !v.program) e.program = 'Choose the program you are interested in.';
  if (v.msg.trim().length < 10) e.msg = 'Tell us a little more (at least 10 characters).';
  if (!v.ok) e.ok = 'Please tick the consent box so we can contact you.';
  return e;
}

/* ---------- quick contact cards ---------- */
function QuickCards() {
  const [copied, setCopied] = useState('');
  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 1800);
    } catch { /* clipboard blocked: the link still works */ }
  };
  const cards = [
    { key: 'call', icon: 'phone', title: 'Call us', value: PHONE, href: `tel:+${DIGITS}`, copy: PHONE, c: 'var(--blue)', cs: 'var(--sky)', cta: 'Call now' },
    { key: 'wa', icon: 'msg', title: 'WhatsApp', value: 'Chat with a counsellor', href: `https://wa.me/${DIGITS}?text=${encodeURIComponent('Hi, I would like to know more about your programs.')}`, c: '#0E7A4F', cs: 'var(--mint-soft)', cta: 'Start chat', ext: true },
    { key: 'mail', icon: 'mail', title: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, copy: EMAIL, c: '#B97800', cs: 'var(--amber-soft)', cta: 'Write email' },
    { key: 'visit', icon: 'pin', title: 'Visit', value: ADDRESS, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`, c: 'var(--coral)', cs: 'var(--coral-soft)', cta: 'Open in Maps', ext: true },
  ];
  return (
    <Stagger className="ct-cards">
      {cards.map((c) => (
        <Item key={c.key} className="ct-card">
          <span className="ab-ico" style={{ color: c.c, background: c.cs }}><Icon name={c.icon} /></span>
          <h3>{c.title}</h3>
          <p>{c.value}</p>
          <div className="ct-card-act">
            <a href={c.href} {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} style={{ color: c.c }}>{c.cta} <Icon name="arrow" /></a>
            {c.copy && (
              <button type="button" onClick={() => copy(c.key, c.copy)} aria-label={`Copy ${c.title.toLowerCase()}`}>
                <Icon name={copied === c.key ? 'check' : 'file'} />{copied === c.key ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        </Item>
      ))}
    </Stagger>
  );
}

/* Field wrapper. Defined outside the form so inputs keep focus while typing. */
function F({ id, label, hint, err, children }) {
  return (
    <div className={`ct-f${err[id] ? ' bad' : ''}`}>
      <label htmlFor={`ct-${id}`}>{label}</label>
      {children}
      {err[id] ? <span className="err" id={`ct-${id}-e`} role="alert">{err[id]}</span> : hint ? <span className="ct-hint">{hint}</span> : null}
    </div>
  );
}

/* ---------- the form ---------- */
function ContactForm() {
  const { program } = useApp();
  const [v, setV] = useState(() => ({ ...EMPTY, program: PROGRAM_OPTIONS.includes(program) ? program : '' }));
  const [err, setErr] = useState({});
  const [touched, setTouched] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | failed
  const [result, setResult] = useState(null);
  const { sendContact, loading, error: apiError } = useContact();
  const opened = useRef(Date.now());
  const formRef = useRef(null);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setV((s) => {
      const next = { ...s, [k]: val };
      if (touched[k] || err[k]) setErr((x) => ({ ...x, [k]: validate(next)[k] || '' }));
      return next;
    });
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErr((x) => ({ ...x, [k]: validate(v)[k] || '' }));
  };

  const filled = useMemo(() => {
    const e = validate(v);
    const keys = ['name', 'email', 'phone', 'msg', 'ok'].concat(v.topic === 'admission' ? ['program'] : []);
    return Math.round(((keys.length - keys.filter((k) => e[k]).length) / keys.length) * 100);
  }, [v]);

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    const found = validate(v);
    setErr(found);
    setTouched({ name: 1, email: 1, phone: 1, program: 1, msg: 1, ok: 1 });
    if (Object.keys(found).length) {
      const first = ['name', 'email', 'phone', 'program', 'msg', 'ok'].find((k) => found[k]);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    // Spam guards: never report a fake success or send honeypot submissions to the API.
    if (v.website || Date.now() - opened.current < 3000) {
      setState('failed');
      return;
    }

    setState('sending');
    const { website, ok, ...payload } = v;
    const response = await sendContact({
      ...payload,
      phone: v.phone.replace(/[\s-]/g, ''),
      consent: ok,
      page: 'contact',
      sentAt: new Date().toISOString(),
    });

    if (!response.ok) {
      setState('failed');
      return;
    }

    const res = response.data;
    setResult({
      ...(res && typeof res === 'object' ? res : {}),
      name: v.name.trim().split(' ')[0],
      topic: TOPICS.find((t) => t.id === v.topic)?.label,
      ref: res?.ref || res?.reference || res?.referenceNumber || res?.data?.ref || res?.data?.reference || '',
    });
    setState('sent');
  };

  const reset = () => {
    setV({ ...EMPTY });
    setErr({});
    setTouched({});
    setState('idle');
    opened.current = Date.now();
  };

  const aria = (id) => ({ id: `ct-${id}`, name: id, 'aria-invalid': !!err[id] || undefined, 'aria-describedby': err[id] ? `ct-${id}-e` : undefined });

  return (
    <div className="ct-formc" id="send">
      <AnimatePresence mode="wait" initial={false}>
        {state !== 'sent' ? (
          <motion.div key="form" exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
            <div className="ct-fh">
              <div>
                <h2>Send us a message</h2>
                <p>We reply within one working day. Fields marked * are required.</p>
              </div>
              <div className="ct-prog" aria-label={`Form ${filled}% complete`}>
                <span>{filled}%</span>
                <i><motion.b animate={{ width: `${filled}%` }} transition={{ duration: 0.4, ease: EASE }} /></i>
              </div>
            </div>

            <form ref={formRef} onSubmit={submit} noValidate>
              <fieldset className="ct-topics">
                <legend>What can we help with?</legend>
                <div role="radiogroup" aria-label="Enquiry type">
                  {TOPICS.map((t) => (
                    <button key={t.id} type="button" role="radio" aria-checked={v.topic === t.id} className="ct-topic" onClick={() => setV((s) => ({ ...s, topic: t.id }))}>
                      {v.topic === t.id && <motion.span layoutId="ct-topic-pill" className="ct-topic-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                      <span><Icon name={t.icon} />{t.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="ct-grid">
                <F err={err} id="name" label="Full name *">
                  <input className="fld" {...aria('name')} autoComplete="name" placeholder="Your name" value={v.name} onChange={set('name')} onBlur={blur('name')} />
                </F>
                <F err={err} id="phone" label="Mobile number *">
                  <input className="fld" {...aria('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit number" value={v.phone} onChange={set('phone')} onBlur={blur('phone')} />
                </F>
                <div className="ct-full">
                  <F err={err} id="email" label="Email *">
                    <input className="fld" {...aria('email')} type="email" autoComplete="email" placeholder="you@example.com" value={v.email} onChange={set('email')} onBlur={blur('email')} />
                  </F>
                </div>
                <AnimatePresence initial={false}>
                  {v.topic === 'admission' && (
                    <motion.div className="ct-full ct-two" key="adm" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} style={{ overflow: 'hidden' }}>
                      <F err={err} id="program" label="Program of interest *">
                        <select className="fld" {...aria('program')} value={v.program} onChange={set('program')} onBlur={blur('program')}>
                          <option value="">Select a program</option>
                          {PROGRAM_OPTIONS.map((q) => <option key={q}>{q}</option>)}
                        </select>
                      </F>
                      <F err={err} id="qual" label="Current qualification">
                        <select className="fld" {...aria('qual')} value={v.qual} onChange={set('qual')}>
                          <option value="">Select</option>
                          {QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}
                        </select>
                      </F>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="ct-full">
                  <F err={err} id="time" label="Best time to call">
                    <select className="fld" {...aria('time')} value={v.time} onChange={set('time')}>
                      {TIMES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </F>
                </div>
                <div className="ct-full">
                  <F err={err} id="msg" label="Your message *">
                    <textarea className="fld" {...aria('msg')} rows={5} maxLength={MAX} placeholder="Tell us about your goal, course interest or question" value={v.msg} onChange={set('msg')} onBlur={blur('msg')} />
                    <span className={`ct-count${v.msg.length > MAX - 40 ? ' warn' : ''}`} aria-live="off">{v.msg.length}/{MAX}</span>
                  </F>
                </div>

                {/* Honeypot: real people never see or fill this. */}
                <div className="ct-hp" aria-hidden="true">
                  <label htmlFor="ct-website">Website</label>
                  <input id="ct-website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
                </div>

                <div className="ct-full">
                  <label className="consent" htmlFor="ct-ok">
                    <input type="checkbox" id="ct-ok" name="ok" checked={v.ok} onChange={set('ok')} onBlur={blur('ok')} aria-invalid={!!err.ok || undefined} />
                    <span>I agree to be contacted about my enquiry. We never share your details.</span>
                  </label>
                  {err.ok && <span className="err" role="alert">{err.ok}</span>}
                </div>
              </div>

              {state === 'failed' && (
                <p className="ct-fail" role="alert">
                  <Icon name="info" /> {apiError || 'We could not send your message. Please try again, or write to'}{' '}
                  {!apiError && <a href={`mailto:${EMAIL}`}>{EMAIL}</a>}
                </p>
              )}

              <div className="ct-submit">
                <BlobButton type="submit" size="lg" block iconRight={state === 'sending' ? undefined : 'arrow'} disabled={state === 'sending' || loading}>
                  {state === 'sending' ? 'Sending…' : state === 'failed' ? 'Try again' : 'Send message'}
                </BlobButton>
                <small><Icon name="shield" /> Your details are used only to reply to this enquiry.</small>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div key="ok" className="ct-ok" role="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: EASE }}>
            <span className="ct-tick"><svg viewBox="0 0 52 52" aria-hidden="true"><motion.path d="M14 27l8 8 16-17" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.5, ease: EASE }} /></svg></span>
            <h2>Message received{result?.name ? `, ${result.name}` : ''}!</h2>
            <p>Thanks for reaching out{result?.topic ? ` about ${result.topic.toLowerCase()}` : ''}. A counsellor will contact you within one working day.</p>
            <p className="ct-ref">Reference <code>{result?.ref}</code></p>
            
            <div className="ct-ok-act">
              <BlobButton variant="outline" size="sm" onClick={reset}>Send another message</BlobButton>
              <BlobButton size="sm" href="#top" iconRight="arrow">Back to top</BlobButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- side panel ---------- */
function SidePanel() {
  const open = useOpenNow();
  return (
    <Reveal className="ct-side">
      <div className={`ct-status${open ? ' on' : ''}`} role="status">
        <i aria-hidden="true" />
        <div>
          <b>{open ? 'We are open now' : 'We are currently closed'}</b>
          <span>{open ? 'Call or WhatsApp for the fastest reply.' : 'Send a message and we will reply when we open.'}</span>
        </div>
      </div>

      <h2>What happens next</h2>
      <ol className="ct-steps">
        {[
          ['We read your message', 'Your enquiry goes straight to the right counsellor.'],
          ['We reply within one working day', 'By phone, WhatsApp or email, whichever you prefer.'],
          ['You get clear details in writing', 'Eligibility, fees and batch dates, with no pressure to pay.'],
        ].map(([t, d], i) => (
          <li key={t}><span>{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>
        ))}
      </ol>

      <div className="ct-hours">
        <Icon name="clock" />
        <div><b>Office hours</b><span>{HOURS}</span></div>
      </div>
      <div className="ct-hours">
        <Icon name="shield" />
        <div><b>Certificate help</b><span>Have a certificate ID? <Link to="/resources#certificates">Verify it online</Link>.</span></div>
      </div>
    </Reveal>
  );
}

export default function ContactPage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  useSeo({
    ...SEO,
    path: '/contact',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'ContactPage', name: SEO.title, description: SEO.description, url: origin + '/contact', isPartOf: { '@type': 'WebSite', name: SITE.name } },
      { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE.name, email: EMAIL, telephone: `+${DIGITS}`, address: { '@type': 'PostalAddress', streetAddress: ADDRESS }, contactPoint: [{ '@type': 'ContactPoint', contactType: 'admissions', telephone: `+${DIGITS}`, email: EMAIL, availableLanguage: ['English', 'Hindi'], hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '18:00' } }] },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' }, { '@type': 'ListItem', position: 2, name: 'Contact' }] },
    ],
  });

  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Contact us"
        title={<>Let's talk about <em className="grad">your goals</em></>}
        lead="Questions about admissions, courses, fees or partnerships? Call, WhatsApp, email or send us a message. A real counsellor replies within one working day."
        chips={[['Ways to reach us', '#reach'], ['Send a message', '#send']]}
      />
      <section className="sec ct-reach" id="reach" aria-label="Ways to reach us">
        <div className="wrap"><QuickCards /></div>
      </section>
      <section className="sec white ct-main" aria-label="Contact form">
        <div className="wrap ct-wrap">
          <Reveal delay={0.05}><ContactForm /></Reveal>
          <SidePanel />
        </div>
      </section>
    </>
  );
}
