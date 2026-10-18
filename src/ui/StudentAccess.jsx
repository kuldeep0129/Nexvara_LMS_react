
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../ctx.jsx';
import '../styles/student-access.css';
import logo from '../images/nexvara-logo-sort.png';

const API_BASE = (
  import.meta.env.VITE_STUDENT_AUTH_ENDPOINT || ''
).replace(/\/$/, '');

export default function StudentAccess() {
  const { studentAccessOpen, closeStudentAccess } = useApp();

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  useEffect(() => {
    if (!studentAccessOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = event => {
      if (event.key === 'Escape') closeStudentAccess();
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [studentAccessOpen, closeStudentAccess]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setShowPassword(false);
  }

  function update(event) {
    const { name, value, checked, type } = event.target;

    setForm(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (mode !== 'forgot' && !form.password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (!form.fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }

      if (form.password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (!form.agree) {
        setError('Please accept the student portal terms.');
        return;
      }
    }

    if (!API_BASE) {
      setError(
        'Authentication API is not configured. Set VITE_STUDENT_AUTH_ENDPOINT.'
      );
      return;
    }

    const endpoint = {
      login: '/login',
      register: '/register',
      forgot: '/forgot-password',
    }[mode];

    const payload = mode === 'register'
      ? {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }
      : mode === 'forgot'
        ? { email: form.email.trim() }
        : {
            email: form.email.trim(),
            password: form.password,
          };

    setBusy(true);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || 'Request failed. Please try again.'
        );
      }

      setSuccess(
        data.message ||
        (mode === 'forgot'
          ? 'If your account exists, reset instructions will be sent.'
          : mode === 'register'
            ? 'Registration request submitted.'
            : 'Login request completed.')
      );
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {studentAccessOpen && (
        <motion.div
          className="sa-overlay"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              closeStudentAccess();
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
        className={`sa-dialog sa-dialog--${mode}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sa-title"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 250, damping: 24 }}
          >
            <button
              className="sa-close"
              type="button"
              onClick={closeStudentAccess}
              aria-label="Close login dialog"
            >
              ×
            </button>

            <div className="sa-showcase">
              <div className="sa-brand">
  <img
    className="sa-brand-logo"
    src={logo}
    alt="Nexvara Technologies"
  />
  <span>
    NEXVARA <b>LEARN</b>
  </span>
</div>

              <div className="sa-showcase-copy">
                <span className="sa-kicker">YOUR NEXT CHAPTER</span>
                <h2>
                  Learn today.
                  <br />
                  <em>Build your future.</em>
                </h2>
                <p>
                  One portal for your learning journey, projects and progress.
                </p>
              </div>

              <div className="sa-feature">
                <span>✧</span>
                <div>
                  <b>Keep growing</b>
                  <small>Every skill moves you forward</small>
                </div>
              </div>

              <div className="sa-feature">
                <span>✓</span>
                <div>
                  <b>Your journey in one place</b>
                  <small>Courses · Projects · Certificates</small>
                </div>
              </div>
            </div>

            <div className="sa-form-side">
              <span className="sa-eyebrow">STUDENT PORTAL</span>

              <h1 id="sa-title">
                {mode === 'login'
                  ? 'Welcome back'
                  : mode === 'register'
                    ? 'Create your account'
                    : 'Reset password'}
              </h1>

              <p className="sa-subtitle">
                {mode === 'login'
                  ? 'Sign in to continue your learning journey.'
                  : mode === 'register'
                    ? 'Create your student account to get started.'
                    : 'Enter your registered email address.'}
              </p>

              <div className="sa-tabs">
                <button
                  type="button"
                  className={mode === 'login' ? 'active' : ''}
                  onClick={() => switchMode('login')}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  className={mode === 'register' ? 'active' : ''}
                  onClick={() => switchMode('register')}
                >
                  Create account
                </button>
              </div>

              <form className="sa-form" onSubmit={submit}>
                {mode === 'register' && (
                  <label>
                    Full name
                    <input
                      name="fullName"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={update}
                      placeholder="Enter your full name"
                      required
                    />
                  </label>
                )}

                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                {mode === 'register' && (
                  <label>
                    Phone number
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={update}
                      placeholder="Your phone number"
                    />
                  </label>
                )}

                {mode !== 'forgot' && (
                  <label>
                    Password
                    <span className="sa-password">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={
                          mode === 'login'
                            ? 'current-password'
                            : 'new-password'
                        }
                        value={form.password}
                        onChange={update}
                        placeholder="Enter your password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(value => !value)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </span>
                  </label>
                )}

                {mode === 'register' && (
                  <>
                    <label>
                      Confirm password
                      <input
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={update}
                        placeholder="Re-enter your password"
                        required
                      />
                    </label>

                    <label className="sa-terms">
                      <input
                        name="agree"
                        type="checkbox"
                        checked={form.agree}
                        onChange={update}
                      />
                      I agree to the student portal terms.
                    </label>
                  </>
                )}

                {mode === 'login' && (
                  <button
                    className="sa-forgot"
                    type="button"
                    onClick={() => switchMode('forgot')}
                  >
                    Forgot password?
                  </button>
                )}

                {error && (
                  <p className="sa-message error" role="alert">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="sa-message success" role="status">
                    {success}
                  </p>
                )}

                <button
                  className="sa-submit"
                  type="submit"
                  disabled={busy}
                >
                  {busy
                    ? 'Please wait…'
                    : mode === 'login'
                      ? 'Sign in to portal →'
                      : mode === 'register'
                        ? 'Create student account →'
                        : 'Send reset instructions →'}
                </button>

                {mode === 'forgot' && (
                  <button
                    className="sa-back"
                    type="button"
                    onClick={() => switchMode('login')}
                  >
                    Back to sign in
                  </button>
                )}
              </form>

              <p className="sa-bottom">
                Need help? <a href="/contact" onClick={closeStudentAccess}>
                  Contact our team
                </a>
              </p>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
