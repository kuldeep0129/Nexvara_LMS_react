import { useState, useEffect, useCallback } from 'react';
import { exploreCourseService } from '../services/exploreCourseService';

export function useExploreCourses(initialPageSize = 6) {
  // --- Data States ---
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Pagination States ---
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // --- Filter States (Backend DTO ke hisaab se) ---
  const [filters, setFilters] = useState({
    search: '',
    priceType: '',
    enrollmentStatus: '',
    level: '',
    mode: '',
    sortBy: 'Popular',
  });

  // --- API Fetch Function ---
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await exploreCourseService.getExploreCourses({
        ...filters,
        pageNumber,
        pageSize,
      });

      // Response structure mapping (ExploreCourseResponseDto)
      const data = response?.data || response;
      setCourses(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pageNumber, pageSize]);

  // --- Debounced Fetch Effect (Search ke liye) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 400); // 400ms debounce taaki har keypress pe API na hit ho

    return () => clearTimeout(timer);
  }, [fetchCourses]);

  // --- Update Filter (Resets to Page 1) ---
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPageNumber(1);
  };

  // --- Reset All Filters ---
  const resetFilters = () => {
    setFilters({
      search: '',
      priceType: '',
      enrollmentStatus: '',
      level: '',
      mode: '',
      sortBy: 'Popular',
    });
    setPageNumber(1);
  };

  return {
    courses,
    isLoading,
    error,
    filters,
    updateFilter,
    resetFilters,
    pageNumber,
    setPageNumber,
    totalPages,
    totalCount,
    refresh: fetchCourses, // Error aane pe dobara try karne ke liye
  };
}