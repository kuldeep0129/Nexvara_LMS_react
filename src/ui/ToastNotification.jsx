import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import '../styles/toast.css'; // Hum thodi si custom CSS bhi likhenge

export default function ToastNotification({ 
  isVisible, 
  type = 'success', // 'success' | 'error' | 'info'
  title, 
  message, 
  onClose, 
  duration = 4000 
}) {
  
  // Auto-close timer
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // Icon & Color logic based on type
  const config = {
    success: { 
      icon: '✓', 
      color: '#10b981', 
      bg: 'rgba(16, 185, 129, 0.1)', 
      border: 'rgba(16, 185, 129, 0.2)' 
    },
    error: { 
      icon: '✕', 
      color: '#ef4444', 
      bg: 'rgba(239, 68, 68, 0.1)', 
      border: 'rgba(239, 68, 68, 0.2)' 
    },
    info: { 
      icon: 'ℹ', 
      color: '#3b82f6', 
      bg: 'rgba(59, 130, 246, 0.1)', 
      border: 'rgba(59, 130, 246, 0.2)' 
    }
  };

  const currentConfig = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="toast-wrapper"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="toast-container" style={{ borderColor: currentConfig.border }}>
            {/* Animated Icon */}
            <motion.div 
              className="toast-icon"
              style={{ color: currentConfig.color, backgroundColor: currentConfig.bg }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              {currentConfig.icon}
            </motion.div>

            {/* Text Content */}
            <div className="toast-content">
              <h4 className="toast-title">{title}</h4>
              <p className="toast-message">{message}</p>
            </div>

            {/* Close Button */}
            <button className="toast-close" onClick={onClose} aria-label="Close notification">
              ×
            </button>

            {/* Animated Progress Bar */}
            {duration > 0 && (
              <motion.div 
                className="toast-progress"
                style={{ backgroundColor: currentConfig.color }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}