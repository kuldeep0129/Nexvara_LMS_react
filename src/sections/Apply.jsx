import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Icon from '../ui/Icon.jsx';
import BlobButton from '../ui/BlobButton.jsx';
import { EASE, Reveal } from '../ui/Reveal.jsx';
import { useApp } from '../ctx.jsx';
import { daysLeft } from '../hooks.js';
import { CONTACT, PROGRAM_OPTIONS, QUALIFICATIONS, SITE } from '../data.js';
import { useEnquiry } from '../hook/useEnquiry.js';

import '../styles/apply.css';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  qual: '',
  callingTime: 'never',
  msg: '',
  ok: false,
};

const CALLING_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  
];

function validateForm(values, program) {
  const errors = {};

  const phone = values.phone
    .replace(/[\s()-]/g, '')
    .replace(/^(\+91|91|0)(?=\d{10}$)/, '');

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  } else if (values.name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }

  if (!values.qual) {
    errors.qual = 'Please select your qualification.';
  }

  if (!program?.trim()) {
    errors.program = 'Please select a program.';
  }

  if (!CALLING_OPTIONS.some((option) => option.value === values.callingTime)) {
    errors.callingTime = 'Please select a calling preference.';
  }

  if (values.msg.trim().length > 1000) {
    errors.msg = 'Message cannot exceed 1000 characters.';
  }

  if (!values.ok) {
    errors.ok = 'Please provide consent before submitting.';
  }

  return errors;
}

function SubmissionToast({ toast, onClose }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.type}
          className={`apply-toast apply-toast--${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.22 }}
        >
          <span className="apply-toast-icon" aria-hidden="true">
            {toast.type === 'loading' ? (
              <span className="apply-spinner" />
            ) : toast.type === 'success' ? (
              <Icon name="check-circle" />
            ) : (
              <Icon name="alert-circle" />
            )}
          </span>

          <div className="apply-toast-copy">
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>

          {toast.type !== 'loading' && (
            <button
              type="button"
              className="apply-toast-close"
              onClick={onClose}
              aria-label="Dismiss notification"
            >
              <Icon name="x" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Apply() {
  const { program, setProgram } = useApp();

  const [v, setV] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(null);
  const [toast, setToast] = useState(null);

  const {
    submitEnquiry,
    loading: isSubmitting,
    resetEnquiry,
  } = useEnquiry();

  const left = daysLeft(SITE.deadline);

  const set = (key) => (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    setV((current) => ({ ...current, [key]: value }));

    setErr((current) => ({ ...current, [key]: '' }));

    if (toast?.type === 'error') {
      setToast(null);
    }
  };

  const handleProgramChange = (event) => {
    setProgram(event.target.value);
    setErr((current) => ({ ...current, program: '' }));

    if (toast?.type === 'error') {
      setToast(null);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors = validateForm(v, program);
    setErr(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setToast({
        type: 'error',
        title: 'Please check your details',
        message: 'Correct the highlighted fields and submit again.',
      });
      return;
    }

    const phone = v.phone
      .replace(/[\s()-]/g, '')
      .replace(/^(\+91|91|0)(?=\d{10}$)/, '');

    const payload = {
      name: v.name.trim(),
      email: v.email.trim(),
      phone,
      qualification: v.qual,
      program: program.trim(),
      callingTime: v.callingTime,
      message: v.msg.trim(),
    };

    setToast({
      type: 'loading',
      title: 'Submitting your application…',
      message: 'Please wait. Do not close this form or submit it again.',
    });

    const result = await submitEnquiry(payload);

    if (result.ok) {
      setSent({
        name: v.name.trim().split(/\s+/)[0],
      });

      setToast({
        type: 'success',
        title: 'Application submitted successfully',
        message: 'Thank you! Your enquiry has been sent to our team.',
      });
    } else if (result.reason !== 'already-submitting') {
      setToast({
        type: 'error',
        title: 'Submission failed',
        message: result.error || 'Please try again in a moment.',
      });
    }
  };

  const field = (id, label, input, key = id) => (
    <div>
      <label htmlFor={`f-${id}`}>{label}</label>
      {input}
      {err[key] && (
        <span className="err" role="alert">
          {err[key]}
        </span>
      )}
    </div>
  );

  const cls = (key) => `fld${err[key] ? ' bad' : ''}`;

  const resetForm = () => {
    setV(EMPTY);
    setErr({});
    setSent(null);
    setToast(null);
    resetEnquiry();
  };

  return (
    <section className="sec apply" id="apply" aria-labelledby="h-apply">
      <div className="mesh soft" aria-hidden="true">
        <span className="m1" />
        <span className="m3" />
      </div>

      <div className="wrap ap-wrap">
        <Reveal>
          <span className="eyebrow">Apply</span>

          <h2 id="h-apply">
            Start your <em className="grad">application</em>
          </h2>

          <p className="lead">
            Tell us about yourself. Our counselling team will contact you to
            confirm eligibility, fees and batch dates.
          </p>

          <ul className="cinfo">
            {CONTACT.map(([ic, k, t]) => (
              <li key={k}>
                <span className="pc-ic">
                  <Icon name={ic} />
                </span>
                <div>
                  <b>{k}</b>
                  <span>{t}</span>
                </div>
              </li>
            ))}
          </ul>

          <ul className="next">
            {[
              'A counsellor reviews your form and calls you.',
              'You receive eligibility, fee and batch details in writing.',
              'You confirm your seat and get joining instructions.',
            ].map((text) => (
              <li key={text}>
                <Icon name="check" />
                {text}
              </li>
            ))}
          </ul>

          {/* <span className="dl">
            <Icon name="clock" />
            Applications close {SITE.deadlineLabel} ·{' '}
            {left > 0
              ? `${left} ${left === 1 ? 'day' : 'days'} left`
              : 'next intake opens soon'}
          </span> */}
        </Reveal>

        <Reveal delay={0.12} className="formc">
          <AnimatePresence mode="wait" initial={false}>
            {!sent ? (
              <motion.div
                key="form"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3>Application form</h3>
                <p className="fsub">
                  Share your details and our team will get back to you.
                </p>

                <SubmissionToast
                  toast={toast}
                  onClose={() => setToast(null)}
                />

                <form onSubmit={submit} noValidate>
                  <fieldset
                    className="apply-fields"
                    disabled={isSubmitting}
                  >
                    <div className="fg">
                      <div className="full">
                        {field(
                          'name',
                          'Full name',
                          <input
                            className={cls('name')}
                            id="f-name"
                            name="name"
                            autoComplete="name"
                            maxLength={100}
                            placeholder="Your name"
                            value={v.name}
                            onChange={set('name')}
                            aria-invalid={Boolean(err.name)}
                          />,
                        )}
                      </div>

                      {field(
                        'email',
                        'Email',
                        <input
                          className={cls('email')}
                          id="f-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          maxLength={254}
                          placeholder="you@example.com"
                          value={v.email}
                          onChange={set('email')}
                          aria-invalid={Boolean(err.email)}
                        />,
                      )}

                      {field(
                        'phone',
                        'Mobile number',
                        <input
                          className={cls('phone')}
                          id="f-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          maxLength={16}
                          placeholder="10-digit number"
                          value={v.phone}
                          onChange={set('phone')}
                          aria-invalid={Boolean(err.phone)}
                        />,
                      )}

                      {field(
                        'qual',
                        'Current qualification',
                        <select
                          className={cls('qual')}
                          id="f-qual"
                          name="qualification"
                          value={v.qual}
                          onChange={set('qual')}
                          aria-invalid={Boolean(err.qual)}
                        >
                          <option value="">Select qualification</option>
                          {QUALIFICATIONS.map((qualification) => (
                            <option key={qualification} value={qualification}>
                              {qualification}
                            </option>
                          ))}
                        </select>,
                      )}

                      {field(
                        'program',
                        'Program',
                        <select
                          className={cls('program')}
                          id="f-program"
                          name="program"
                          value={program || ''}
                          onChange={handleProgramChange}
                          aria-invalid={Boolean(err.program)}
                        >
                          <option value="">Select program</option>
                          {PROGRAM_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>,
                      )}

                      {field(
                        'callingTime',
                        'Preferred calling time',
                        <select
                          className={cls('callingTime')}
                          id="f-callingTime"
                          name="callingTime"
                          value={v.callingTime}
                          onChange={set('callingTime')}
                          aria-invalid={Boolean(err.callingTime)}
                        >
                          {CALLING_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>,
                      )}

                      <div className="full">
                        <label htmlFor="f-msg">Message (optional)</label>
                        <textarea
                          className={`fld${err.msg ? ' bad' : ''}`}
                          id="f-msg"
                          name="message"
                          rows={4}
                          maxLength={1000}
                          placeholder="Course interest, preferred batch or any question"
                          value={v.msg}
                          onChange={set('msg')}
                          aria-invalid={Boolean(err.msg)}
                        />

                        <span className="apply-char-count">
                          {v.msg.length}/1000
                        </span>

                        {err.msg && (
                          <span className="err" role="alert">
                            {err.msg}
                          </span>
                        )}
                      </div>

                      <div className="full">
                        <label className="consent" htmlFor="f-ok">
                          <input
                            type="checkbox"
                            id="f-ok"
                            name="consent"
                            checked={v.ok}
                            onChange={set('ok')}
                          />
                          <span>
                            I agree to be contacted about my application.
                          </span>
                        </label>

                        {err.ok && (
                          <span className="err" role="alert">
                            {err.ok}
                          </span>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <div className="apply-submit">
                    <BlobButton
                      type="submit"
                      size="lg"
                      block
                      iconRight={isSubmitting ? undefined : 'arrow'}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting…' : 'Submit application'}
                    </BlobButton>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="ok"
                className="okc"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="tick">
                  <Icon name="check" />
                </span>

                <h3>Application received</h3>

                <p className="apply-success-copy">
                  Thank you, <b>{sent.name}</b>. Your enquiry has been
                  submitted successfully.
                </p>

                <SubmissionToast
                  toast={toast}
                  onClose={() => setToast(null)}
                />

                <BlobButton
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                >
                  Fill another form
                </BlobButton>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}