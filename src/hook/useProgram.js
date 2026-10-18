
import { useCallback, useEffect, useState } from 'react';
import { getPrograms } from '../services/programApi';

export function usePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(0);

  const refetch = useCallback(() => {
    setRequestId((id) => id + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPrograms() {
      setLoading(true);
      setError(null);

      try {
        const response = await getPrograms();

        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const normalized = list.map((p) => ({
          ...p,
          points: Array.isArray(p.points)
            ? p.points
            : typeof p.points === 'string'
              ? p.points.split(',').map((x) => x.trim()).filter(Boolean)
              : [],
          fee:
            p.fee == null ||
            ['null', 'string', ''].includes(
              String(p.fee).trim().toLowerCase()
            )
              ? 'Contact us'
              : p.fee,
        }));

        if (!cancelled) {
          setPrograms(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setPrograms([]);
          setError(
            err.response?.data?.message ||
              err.message ||
              'Unable to load programs. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPrograms();

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  return { programs, loading, error, refetch };
}
