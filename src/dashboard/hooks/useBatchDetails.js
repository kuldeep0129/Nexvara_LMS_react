import { useState, useEffect, useCallback } from 'react';
import { batchService } from '../services/batchService';

export function useBatchDetails(batchId) {
  const [batch, setBatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBatch = useCallback(async () => {
    if (!batchId) {
      setIsLoading(false);
      setError("Batch ID is missing.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await batchService.getBatchById(batchId);
      setBatch(res.data || res);
    } catch (err) {
      setError(err.message || 'Failed to fetch batch details.');
    } finally {
      setIsLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  return { batch, isLoading, error, fetchBatch };
}