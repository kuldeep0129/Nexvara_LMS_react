import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../ctx.jsx';
import logo from '../images/nexvara-logo-sort.png';
import '../styles/student-access.css';

import { useAuth } from '../hook/useAuth';
import ToastNotification from '../ui/ToastNotification';

export default function StudentAccess() {
  const { studentAccessOpen, closeStudentAccess } = useApp();
  const navigate = useNavigate();
  
  const { 
    isLoading, error: apiError, success: apiSuccess, 
    registerUser, loginUser, forgotPassword, clearMessages 
  } = useAuth();

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', agree: false,
  });

  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });

  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  const passwordRules = [
    { label: 'At least 8 characters', valid: form.password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(form.password) },
    { label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(form.password) },
    { label: 'One number (0-9)', valid: /[0-9]/.test(form.password) },
    { label: 'One special character (@#$!)', valid: /[^A-Za-z0-9\s]/.test(form.password) },
  ];

  const isPasswordStrong = passwordRules.every(rule => rule.valid);
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  useEffect(() => {
    if (!studentAccessOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = event => { if (event.key === 'Escape') closeStudentAccess(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [studentAccessOpen, closeStudentAccess]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setValidationError('');
    clearMessages(); 
    setShowPassword(false);
    setShowConfirmPassword(false);
    closeToast(); 
  }

  function update(event) {
    const { name, value, checked, type } = event.target;
    let newValue = value;
    if (name === 'fullName') newValue = value.replace(/[^a-zA-Z\s]/g, '');
    if (name === 'phone') newValue = value.replace(/\D/g, '').slice(0, 10);

    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : newValue }));
    if (validationError) setValidationError('');
    if (apiError) clearMessages();
  }

  async function submit(event) {
    event.preventDefault();
    setValidationError('');
    clearMessages();

    if (!form.email.trim()) return setValidationError('Please enter your email address.');
    if (mode !== 'forgot' && !form.password) return setValidationError('Please enter your password.');

    // ==========================================
    // LOGIN LOGIC
    // ==========================================
    if (mode === 'login') {
      const result = await loginUser({ email: form.email, password: form.password });
      if (result.success) {
        showToast('success', 'Login Successful', result.data.message || 'Welcome back!');
        setForm(prev => ({ ...prev, password: '' }));
        const roles = result.data.data.roles || [];
        closeStudentAccess();
        setTimeout(() => {
          if (roles.includes('SuperAdmin') || roles.includes('Admin')) navigate('/admin');
          else if (roles.includes('Trainer')) navigate('/teacher');
          else navigate('/student');
        }, 1000);
      } else {
        showToast('error', 'Login Failed', result.error);
      }
      return;
    }

    // ==========================================
    // FORGOT PASSWORD LOGIC (NAYA)
    // ==========================================
    if (mode === 'forgot') {
      const result = await forgotPassword(form.email.trim());
      if (result.success) {
        showToast('success', 'Email Sent!', result.data.message || 'Check your inbox for reset instructions.');
        setForm(prev => ({ ...prev, email: '' })); // Clear email
      } else {
        showToast('error', 'Failed', result.error);
      }
      return;
    }

    // ==========================================
    // REGISTER LOGIC
    // ==========================================
    if (mode === 'register') {
      if (!form.fullName.trim()) return setValidationError('Please enter your full name.');
      if (!isPasswordStrong) return setValidationError('Please fulfill all password requirements.');
      if (form.password !== form.confirmPassword) return setValidationError('Passwords do not match.');
      if (!form.agree) return setValidationError('Please accept the student portal terms.');

      const result = await registerUser(form);
      if (result.success) {
        showToast('success', 'Account Created!', result.data.message || 'Your portal is ready.');
        setForm({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', agree: false });
        setTimeout(() => {
          switchMode('login');
          showToast('info', 'Welcome!', 'Please sign in with your new credentials.');
        }, 2500); 
      } else {
        showToast('error', 'Registration Failed', result.error);
      }
    } 
  }

  return (
    <>
      <ToastNotification isVisible={toast.visible} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

      <AnimatePresence>
        {studentAccessOpen && (
          <motion.div className="sa-overlay" onMouseDown={e => { if (e.target === e.currentTarget) closeStudentAccess(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section className={`sa-dialog sa-dialog--${mode}`} role="dialog" aria-modal="true" initial={{ opacity: 0, y: 25, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.97 }} transition={{ type: 'spring', stiffness: 250, damping: 24 }}>
              <button className="sa-close" type="button" onClick={closeStudentAccess}>×</button>

              <div className="sa-showcase">
                <div className="sa-brand">
                  <img className="sa-brand-logo" src={logo} alt="Nexvara Technologies" />
                 <span>NEXVARA <b>TECHNOLOGIES</b></span>
                </div>
                <div className="sa-showcase-copy">
                  <span className="sa-kicker">YOUR NEXT CHAPTER</span>
                  <h2>Learn today.<br /><em>Build your future.</em></h2>
                  <p>One portal for your learning journey, projects and progress.</p>
                </div>
                <div className="sa-feature">
                  <span>✧</span>
                  <div><b>Keep growing</b><small>Every skill moves you forward</small></div>
                </div>
                <div className="sa-feature">
                  <span>✓</span>
                  <div><b>Your journey in one place</b><small>Courses · Projects · Certificates</small></div>
                </div>
              </div>

              <div className="sa-form-side">
                <span className="sa-eyebrow">STUDENT PORTAL</span>
                <h1 id="sa-title">
                  {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create your account' : 'Forgot Password'}
                </h1>
                <p className="sa-subtitle">
                  {mode === 'login' ? 'Sign in to continue your learning journey.' : mode === 'register' ? 'Create your student account to get started.' : 'Enter your email to receive reset instructions.'}
                </p>

                {mode !== 'forgot' && (
                  <div className="sa-tabs">
                    <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Sign in</button>
                    <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Create account</button>
                  </div>
                )}

                <form className="sa-form" onSubmit={submit}>
                  {mode === 'register' && (
                    <label>Full name<input name="fullName" type="text" value={form.fullName} onChange={update} placeholder="Enter your full name" required /></label>
                  )}

                  <label>
                    Email address
                    <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required />
                  </label>

                  {mode === 'register' && (
                    <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={update} placeholder="Your phone number" maxLength={10} /></label>
                  )}

                  {mode !== 'forgot' && (
                    <label>
                      Password
                      <span className="sa-password">
                        <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update} placeholder="Enter your password" required />
                        <button type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
                      </span>
                      {mode === 'register' && form.password.length > 0 && (
                        <div className="sa-password-rules">
                          <div className={`sa-password-strength ${isPasswordStrong ? 'strong' : 'weak'}`}>{isPasswordStrong ? '✓ Strong' : 'Requirements'}</div>
                          {passwordRules.map(rule => (
                            <div key={rule.label} className={`sa-password-rule ${rule.valid ? 'valid' : 'invalid'}`}>
                              <span>{rule.valid ? '✓' : '✗'}</span> {rule.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </label>
                  )}

                  {mode === 'register' && (
                    <>
                      <label>
                        Confirm password
                        <span className="sa-password">
                          <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={update} placeholder="Re-enter your password" required />
                          <button type="button" onClick={() => setShowConfirmPassword(v => !v)}>{showConfirmPassword ? 'Hide' : 'Show'}</button>
                        </span>
                        {form.confirmPassword.length > 0 && (
                          <div className={`sa-password-match ${passwordsMatch ? 'valid' : 'invalid'}`}>
                            {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </div>
                        )}
                      </label>
                      <label className="sa-terms">
                        <input name="agree" type="checkbox" checked={form.agree} onChange={update} /> I agree to the terms.
                      </label>
                    </>
                  )}

                  {mode === 'login' && (
                    <button className="sa-forgot" type="button" onClick={() => switchMode('forgot')}>Forgot password?</button>
                  )}

                  {validationError && <p className="sa-message error">{validationError}</p>}

                  <button className="sa-submit" type="submit" disabled={isLoading}>
                    {isLoading ? 'Please wait…' : mode === 'login' ? 'Sign in →' : mode === 'register' ? 'Create account →' : 'Send Reset Link →'}
                  </button>

                  {mode === 'forgot' && (
                    <button className="sa-back" type="button" onClick={() => switchMode('login')}>Back to sign in</button>
                  )}
                </form>

                <p className="sa-bottom">Need help? <a href="/contact" onClick={closeStudentAccess}>Contact our team</a></p>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}