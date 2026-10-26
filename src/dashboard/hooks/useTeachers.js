import { useState, useEffect, useCallback } from 'react';
import { teacherService } from '../services/teacherService';

export function useTeachers(initialPageSize = 10) {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [togglingId, setTogglingId] = useState(null);

  const fetchTeachers = useCallback(async (page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await teacherService.getTeachersList(page, pageSize);
      const data = response.data || {};
      setTeachers(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchTeachers(pageNumber);
  }, [fetchTeachers, pageNumber]);

  const toggleStatus = async (userId) => {
    setTogglingId(userId);
    try {
      await teacherService.toggleTeacherStatus(userId);
      await fetchTeachers(pageNumber); 
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setTogglingId(null);
    }
  };

  return { teachers, isLoading, error, pageNumber, totalPages, totalCount, setPageNumber, toggleStatus, togglingId, fetchTeachers };
}