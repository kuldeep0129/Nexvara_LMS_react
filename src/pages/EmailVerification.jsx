import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verificationService } from '../services/verificationService';
import '../styles/email-verification.css';

const STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  INVALID: 'invalid',
  EXPIRED: 'expired',
  ALREADY_VERIFIED: 'already_verified',
  SERVER_ERROR: 'server_error',
};

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Email template link se userId aur token extract kar rahe hain
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  
  const [currentState, setCurrentState] = useState(STATES.LOADING);
  const [errorMessage, setErrorMessage] = useState('');
  
  const hasFetched = useRef(false);

  // Apne project ka actual login route yahan dalein
  const LOGIN_ROUTE = '/'; 

  const verifyToken = async () => {
    // Agar URL mein userId ya token missing hai
    if (!userId || !token) {
      setCurrentState(STATES.INVALID);
      return;
    }

    setCurrentState(STATES.LOADING);
    setErrorMessage('');

    try {
      // API Call with userId and token
      await verificationService.verifyEmail(userId, token);
      setCurrentState(STATES.SUCCESS);
    } catch (error) {
      // Backend error responses ke according states handle karna
      // (Aapko apne backend response code ke hisaab se ise adjust karna hoga)
      if (error.status === 400 || error.status === 404 || error.code === 'INVALID_TOKEN') {
        setCurrentState(STATES.INVALID);
      } else if (error.status === 410 || error.code === 'TOKEN_EXPIRED') {
        setCurrentState(STATES.EXPIRED);
      } else if (error.code === 'ALREADY_VERIFIED') {
        setCurrentState(STATES.ALREADY_VERIFIED);
      } else {
        setCurrentState(STATES.SERVER_ERROR);
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      verifyToken();
      hasFetched.current = true;
    }
  }, [userId, token]);

  // Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 } }
  };

  const renderContent = () => {
    switch (currentState) {
      case STATES.LOADING:
        return (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div 
              className="ev-icon-wrapper loading"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <div className="ev-spinner" />
            </motion.div>
            <h1 className="ev-title">Verifying Your Email...</h1>
            <p className="ev-message">Please wait while we verify your email address.</p>
          </motion.div>
        );

      case STATES.SUCCESS:
        return (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ev-icon-wrapper success" variants={iconVariants} initial="hidden" animate="visible">
              ✓
            </motion.div>
            <h1 className="ev-title">Email Verified Successfully!</h1>
            <p className="ev-message">Your email address has been verified successfully. Your Nexvara Learn account is now ready to use.</p>
            <button className="ev-button primary" onClick={() => navigate(LOGIN_ROUTE)}>
              Continue to  →
            </button>
          </motion.div>
        );

      case STATES.INVALID:
        return (
          <motion.div key="invalid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ev-icon-wrapper error" variants={iconVariants} initial="hidden" animate="visible">
              ✕
            </motion.div>
            <h1 className="ev-title">Invalid Verification Link</h1>
            <p className="ev-message">This verification link is invalid or missing required parameters. Please check the link or request a new verification email.</p>
            <button className="ev-button secondary" onClick={() => navigate(LOGIN_ROUTE)}>
              Go to Login
            </button>
          </motion.div>
        );

      case STATES.EXPIRED:
        return (
          <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ev-icon-wrapper error" variants={iconVariants} initial="hidden" animate="visible">
              ⏳
            </motion.div>
            <h1 className="ev-title">Verification Link Expired</h1>
            <p className="ev-message">Your verification link has expired. Please request a new verification email.</p>
            <button className="ev-button secondary" onClick={() => navigate(LOGIN_ROUTE)}>
              Back to Login
            </button>
          </motion.div>
        );

      case STATES.ALREADY_VERIFIED:
        return (
          <motion.div key="already_verified" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ev-icon-wrapper success" variants={iconVariants} initial="hidden" animate="visible">
              ✓
            </motion.div>
            <h1 className="ev-title">Email Already Verified</h1>
            <p className="ev-message">Your email address has already been verified. You can continue to your  portal.</p>
            <button className="ev-button primary" onClick={() => navigate(LOGIN_ROUTE)}>
              Continue to  →
            </button>
          </motion.div>
        );

      case STATES.SERVER_ERROR:
      default:
        return (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="ev-icon-wrapper error" variants={iconVariants} initial="hidden" animate="visible">
              !
            </motion.div>
            <h1 className="ev-title">Verification Failed</h1>
            <p className="ev-message">{errorMessage || "We couldn't verify your email right now. Please try again later."}</p>
            <button className="ev-button primary" onClick={verifyToken}>
              Try Again
            </button>
            <button className="ev-button secondary" onClick={() => navigate(LOGIN_ROUTE)}>
              Back to Login
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="ev-page-wrapper">
      <div className="ev-bg-blob top-left" />
      <div className="ev-bg-blob bottom-right" />

      <motion.div 
        className="ev-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}