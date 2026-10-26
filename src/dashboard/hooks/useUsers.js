import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export function useUsers(initialPageSize = 10) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = useCallback(async (page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await userService.getUsersList(page, pageSize);
      const data = response.data || {};
      setUsers(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchUsers(pageNumber);
  }, [fetchUsers, pageNumber]);

  const toggleStatus = async (userId) => {
    setTogglingId(userId);
    try {
      await userService.toggleUserStatus(userId);
      await fetchUsers(pageNumber); 
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setTogglingId(null);
    }
  };

  return { users, isLoading, error, pageNumber, totalPages, totalCount, setPageNumber, toggleStatus, togglingId, fetchUsers };
}