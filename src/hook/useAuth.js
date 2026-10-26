import { useState } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. REGISTRATION
  const registerUser = async (formData) => {
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const data = await authService.register(formData);
      setSuccess(data.message || 'Registration successful!');
      return { success: true, data }; 
    } catch (err) {
      setError(err.message || 'Unable to connect.');
      return { success: false, error: err.message };
    } finally { setIsLoading(false); }
  };

  // 2. LOGIN (Yahan fix tha)
  const loginUser = async (credentials) => {
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const data = await authService.login(credentials);
      setSuccess(data.message || 'Login successful!');
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Unable to connect.');
      return { success: false, error: err.message };
    } finally { setIsLoading(false); }
  };

  // 3. FORGOT PASSWORD
  const forgotPassword = async (email) => {
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const data = await authService.forgotPassword(email);
      setSuccess(data.message || 'Reset link sent to your email.');
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Failed to send email.');
      return { success: false, error: err.message };
    } finally { setIsLoading(false); }
  };

  // 4. RESET PASSWORD
  const resetPassword = async (payload) => {
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const data = await authService.resetPassword(payload);
      setSuccess(data.message || 'Password reset successfully!');
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
      return { success: false, error: err.message };
    } finally { setIsLoading(false); }
  };
const changePassword = async (payload) => {
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const data = await authService.changePassword(payload);
      setSuccess(data.message || 'Password changed successfully!');
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Failed to change password.');
      return { success: false, error: err.message };
    } finally { setIsLoading(false); }
  };

  const clearMessages = () => { setError(''); setSuccess(''); };

  return { 
    isLoading, 
    error, 
    success, 
    registerUser, 
    loginUser, 
    forgotPassword, 
    resetPassword, 
    changePassword,
    clearMessages 
  };
} // <-- Extra bracket yahan se hata diya gaya hai