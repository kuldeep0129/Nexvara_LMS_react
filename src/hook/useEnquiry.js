// src/hook/useEnquiry.js
import { useCallback, useRef, useState } from 'react';
import { createEnquiry } from '../services/enquiryApi.js';

export function useEnquiry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  // Prevent duplicate requests, even before React updates loading state.
  const submittingRef = useRef(false);

  const submitEnquiry = useCallback(async (payload) => {
    if (submittingRef.current) {
      return { ok: false, reason: 'already-submitting' };
    }

    submittingRef.current = true;
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const result = await createEnquiry(payload);
      setSuccess(result);

      return { ok: true, data: result };
    } catch (err) {
      const responseData = err.response?.data;
      let message =
        responseData?.message ||
        responseData?.title ||
        err.message ||
        'Something went wrong. Please try again.';

      // Support ASP.NET Core validation responses.
      if (responseData?.errors) {
        const firstError = Object.values(responseData.errors)
          .flat()
          .find((value) => typeof value === 'string');

        if (firstError) {
          message = firstError;
        }
      }

      if (!err.response && err.request) {
        message =
          'Unable to connect to the server. Please check whether the API is running.';
      }

      setError(message);
      return { ok: false, error: message };
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }, []);

  const resetEnquiry = useCallback(() => {
    setError('');
    setSuccess(null);
  }, []);

  return {
    submitEnquiry,
    loading,
    error,
    success,
    resetEnquiry,
  };
}