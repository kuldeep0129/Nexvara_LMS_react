import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/courseService';

export function usePublishedCourses(initialPageSize = 10) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPublishedCourses = useCallback(async (page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await courseService.getPublishedCoursesList(page, pageSize);
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
    fetchPublishedCourses(pageNumber);
  }, [fetchPublishedCourses, pageNumber]);

  return { 
    courses, isLoading, error, pageNumber, totalPages, totalCount, setPageNumber 
  };
}