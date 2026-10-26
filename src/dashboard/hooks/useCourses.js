import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/courseService';

export function useCourses(initialPageSize = 10) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCourses = useCallback(async (page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await courseService.getCoursesList(page, pageSize);
      const data = response.data || {};
      setCourses(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchCourses(pageNumber);
  }, [fetchCourses, pageNumber]);

  const toggleStatus = async (id) => {
    setTogglingId(id);
    try {
      await courseService.toggleCourseStatus(id);
      await fetchCourses(pageNumber);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setTogglingId(null);
    }
  };

  return { 
    courses, isLoading, error, pageNumber, totalPages, totalCount, setPageNumber, fetchCourses,
    toggleStatus, togglingId
  };
}