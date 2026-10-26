import { useState, useEffect, useCallback } from 'react';
import { batchService } from '../services/batchService';

export function useBatches(initialPageSize = 10) {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchBatches = useCallback(async (page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await batchService.getBatchesList(page, pageSize);
      const data = response.data || {};
      setBatches(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong while fetching batches.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchBatches(pageNumber);
  }, [fetchBatches, pageNumber]);

  const handleDeleteBatch = async (id) => {
    setActionLoadingId(id);
    try {
      await batchService.deleteBatch(id);
      await fetchBatches(pageNumber); 
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setActionLoadingId(null);
    }
  };

  // FIXED: Accept currentPublishStatus
  const handleTogglePublish = async (id, currentPublishStatus) => {
    setActionLoadingId(id);
    try {
      await batchService.togglePublishBatch(id, currentPublishStatus);
      await fetchBatches(pageNumber); 
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setActionLoadingId(null);
    }
  };

    const handleUpdateStatus = async (id, statusValue) => {
    setActionLoadingId(id);
    try {
      await batchService.updateBatchStatus(id, statusValue);
      await fetchBatches(pageNumber); // List refresh
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setActionLoadingId(null);
    }
  };


  return { 
    batches, 
    isLoading, 
    error, 
    pageNumber, 
    totalPages, 
    totalCount, 
    setPageNumber, 
    fetchBatches,
    handleDeleteBatch, 
    handleTogglePublish,
    handleUpdateStatus,
    actionLoadingId    
  };
}