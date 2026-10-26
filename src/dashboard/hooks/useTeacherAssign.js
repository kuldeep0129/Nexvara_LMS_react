import { useState, useEffect, useCallback } from 'react';
import { teacherAssignService } from '../services/teacherAssignService';

// C# Enum Mapping
const STATUS_ENUM = {
  All: 1,
  Active: 2,
  Upcoming: 3, // Backend Enum mein Upcomming (double m) hai, par frontend mein hum 'Upcoming' tab use kar rahe hain, map sahi hai.
  Draft: 4,
  Completed: 5
};

export function useTeacherAssign(initialPageSize = 10) {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination State
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Tab Filter State
  const [activeTab, setActiveTab] = useState('All');

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // activeTab se Enum value nikal rahe hain (e.g., 'Upcoming' -> 3)
      const statusValue = STATUS_ENUM[activeTab] || 1;

      const response = await teacherAssignService.getTeacherAssignments({
        PageNumber: pageNumber,
        PageSize: pageSize,
        Status: statusValue
      });
      
      const data = response.data || {};
      setAssignments(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error("Hook Error Caught:", err);
      setError(err.message || 'Something went wrong while fetching data.');
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize, activeTab]); // Dependency array mein activeTab hai, so tab change hote hi API call hogi

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setPageNumber(1); // Naye tab par hamesha page 1 se start karo
  };

  return { 
    assignments, isLoading, error, 
    pageNumber, totalPages, totalCount, setPageNumber,
    activeTab, handleTabChange,
    refetch: fetchAssignments
  };
}