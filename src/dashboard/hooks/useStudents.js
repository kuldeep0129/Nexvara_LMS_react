import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/studentService';

export function useStudents(initialPageSize = 10) {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Loading state jab tak status toggle ho raha ho
  const [togglingId, setTogglingId] = useState(null);

  const fetchStudents = useCallback(async (page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await studentService.getStudentsList(page, pageSize);
      const data = response.data || {};
      setStudents(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchStudents(pageNumber);
  }, [fetchStudents, pageNumber]);

  // ==========================================
  // TOGGLE STATUS FUNCTION (Yeh missing tha)
  // ==========================================
  const toggleStatus = async (userId) => {
    setTogglingId(userId); // Button pe loading spinner dikhane ke liye
    try {
      await studentService.toggleStudentStatus(userId);
      await fetchStudents(pageNumber); // API success ke baad list refresh karein
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to toggle status' };
    } finally {
      setTogglingId(null); // Loading hatayein
    }
  };

  return {
    students, 
    isLoading, 
    error, 
    pageNumber, 
    totalPages, 
    totalCount, 
    setPageNumber,
    toggleStatus, // <--- Yeh return ho raha hai ab
    togglingId,
    fetchStudents
  };
}