import { useCallback, useRef, useState } from 'react';
import { submitContact } from '../services/contactApi.js';

export default function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submittingRef = useRef(false);

  const sendContact = useCallback(async (payload) => {
    if (submittingRef.current) {
      return {
        ok: false,
        error: 'A contact submission is already in progress.',
      };
    }

    submittingRef.current = true;
    setLoading(true);
    setError('');

    try {
      const data = await submitContact(payload);

      return {
        ok: true,
        data,
      };
    } catch (err) {
      const responseData = err?.response?.data;

      let message =
        responseData?.message ||
        responseData?.title ||
        responseData?.detail ||
        err?.message ||
        'We could not send your message. Please try again.';

      // ASP.NET Core validation errors
      if (responseData?.errors) {
        const firstError = Object.values(responseData.errors)
          .flat()
          .find(
            (value) =>
              typeof value === 'string' && value.trim()
          );

        if (firstError) {
          message = firstError;
        }
      }

      // Network / connection errors
      if (
        err?.code === 'ERR_NETWORK' ||
        (!err?.response && err?.request)
      ) {
        message =
          'Unable to connect to the server. Please check the API URL, CORS configuration, and whether the backend is running.';
      }

      setError(message);

      return {
        ok: false,
        error: message,
      };
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }, []);

  return {
    sendContact,
    loading,
    error,
  };
}