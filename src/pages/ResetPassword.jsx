import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hook/useAuth';
import ToastNotification from '../ui/ToastNotification';
import logo from '../images/nexvara-logo-sort.png';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Hook se resetPassword function nikal rahe hain
  const { isLoading, resetPassword } = useAuth();

  // URL se params read kar rahe hain
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });

  const showToast = (type, title, message) => setToast({ visible: true, type, title, message });
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Page load hote hi check karo ki URL mein params hain ya nahi
  useEffect(() => {
    if (!userId || !token) {
      showToast('error', 'Invalid Link', 'The reset link is missing userId or token.');
    }
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId || !token) {
      return showToast('error', 'Invalid Link', 'Cannot reset password without a valid link.');
    }

    if (password !== confirmPassword) {
      return showToast('error', 'Mismatch', 'Passwords do not match.');
    }

    if (password.length < 6) {
      return showToast('error', 'Weak Password', 'Password must be at least 6 characters.');
    }

    // API Payload format (Screenshot ke hisaab se exact)
    const payload = {
      userId: userId,
      token: token,
      newPassword: password,
      confirmPassword: confirmPassword
    };

    const result = await resetPassword(payload);

    if (result.success) {
      showToast('success', 'Password Reset!', result.data.message || 'You can now login with your new password.');
      
      // 2.5 seconds baad login page par redirect
      setTimeout(() => {
        navigate('/'); 
        // Agar aapke paas direct login page ka route hai toh navigate('/login') karein
      }, 2500);
    } else {
      showToast('error', 'Reset Failed', result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      
      {/* Background blobs for premium look */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

      <ToastNotification 
        isVisible={toast.visible} 
        type={toast.type} 
        title={toast.title} 
        message={toast.message} 
        onClose={closeToast} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative z-10"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Nexvara" className="w-14 h-14 mb-4 object-contain" />
            <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
            <p className="text-gray-500 text-sm mt-2 text-center">
              Enter a strong new password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] transition-all"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7c3aed] text-sm font-medium transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7c3aed] transition-all"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70 mt-6"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password? <Link to="/" className="text-[#7c3aed] font-semibold hover:underline">Back to Login</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}