import { useEffect, useState } from 'react';
import { getActiveAnnouncements } from '../services/announcementApi.js';

export default function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnnouncements() {
      try {
        setLoading(true);
        setError('');

        const data = await getActiveAnnouncements(
          controller.signal
        );

        setAnnouncements(data);
      } catch (err) {
        if (err?.name === 'CanceledError' ||
            err?.code === 'ERR_CANCELED') {
          return;
        }

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.title ||
          err?.message ||
          'Announcements could not be loaded.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAnnouncements();

    return () => controller.abort();
  }, []);

  return {
    announcements,
    loading,
    error,
  };
}