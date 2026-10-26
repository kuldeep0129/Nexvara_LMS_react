import { useState, useEffect, useCallback } from 'react';
import { batchScheduleService } from '../services/batchScheduleService';

// Hook mein specificBatchId parameter add kiya
export function useBatchSchedules(initialPageSize = 10, specificBatchId = null) {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    dayOfWeek: '',
    isActive: ''
  });

  // Action Loading
  const [togglingId, setTogglingId] = useState(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      let response;
      
      // Logic: Agar specificBatchId hai toh specific API call karo
      if (specificBatchId) {
        response = await batchScheduleService.getSchedulesByBatchId(specificBatchId);
        
        // Specific API direct array ya {data: []} return kar sakti hai
        const data = response.data || response;
        const items = Array.isArray(data) ? data : (data.items || []);
        
        setSchedules(items);
        setTotalPages(1); // Pagination nahi hai specific batch mein
        setTotalCount(items.length);
      } else {
        // Warna Global List API call karo with filters & pagination
        response = await batchScheduleService.getSchedulesList({
          pageNumber,
          pageSize,
          ...filters
        });
        
        const data = response.data || {};
        setSchedules(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize, filters, specificBatchId]); // specificBatchId dependency mein add kiya

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleToggleStatus = async (batchId, scheduleId) => {
    setTogglingId(scheduleId);
    try {
      await batchScheduleService.toggleScheduleStatus(batchId, scheduleId);
      await fetchSchedules(); // Refresh list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setTogglingId(null);
    }
  };

  const handleUpdateSchedule = async (batchId, scheduleId, payload) => {
    setTogglingId(scheduleId);
    try {
      await batchScheduleService.updateSchedule(batchId, scheduleId, payload);
      await fetchSchedules(); // Refresh list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setTogglingId(null);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPageNumber(1);
  };

  return { 
    schedules, isLoading, error, 
    pageNumber, totalPages, totalCount, setPageNumber,
    filters, updateFilter,
    handleToggleStatus, togglingId,
    handleUpdateSchedule, 
    refetch: fetchSchedules
  };
}