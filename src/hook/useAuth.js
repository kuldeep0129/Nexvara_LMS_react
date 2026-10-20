// src/hooks/useAuth.js
import { useState } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. REGISTRATION HOOK
  const registerUser = async (formData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await authService.register(formData);
      setSuccess(data.message || 'Registration successful! You can now log in.');
      return { success: true, data }; 
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 2. LOGIN HOOK
  const loginUser = async (credentials) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await authService.login(credentials);
      setSuccess(data.message || 'Login successful!');
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    isLoading,
    error,
    success,
    registerUser,
    loginUser,
    clearMessages
  };
}