import { useState, useEffect, useCallback } from "react";
import { studentService } from "../../services/student/studentBatchService";

export const useStudentBatches = (initialParams = {}) => {
  const [batches, setBatches] = useState([]);
  const [summary, setSummary] = useState({
    totalBatches: 0,
    activeBatches: 0,
    completedBatches: 0,
    upcomingBatches: 0,
  });
  
  // Pagination & Filters
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10, totalPages: 1 });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "Progress",
    ...initialParams,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatches = useCallback(async (customFilters = filters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await studentService.getEnrolledBatches(customFilters);
      const data = response?.data || response?.Data;

      // Mapping data from API response
      const mappedBatches = (data?.batches || []).map((batch) => ({
        enrollmentId: batch.enrollmentId ?? batch.EnrollmentId,
        batchId: batch.batchId ?? batch.BatchId,
        batchCode: batch.batchCode ?? batch.BatchCode,
        batchName: batch.batchName ?? batch.BatchName,
        courseId: batch.courseId ?? batch.CourseId,
        courseName: batch.courseName ?? batch.CourseName,
        startDate: batch.startDate ?? batch.StartDate,
        endDate: batch.endDate ?? batch.EndDate,
        progressPercentage: batch.progressPercentage ?? batch.ProgressPercentage ?? 0,
        status: batch.status ?? batch.Status ?? "Active",
        action: batch.action ?? batch.Action ?? "Enter",
      }));

      setBatches(mappedBatches);
      
      setSummary({
        totalBatches: data?.totalBatches || data?.TotalBatches || 0,
        activeBatches: data?.activeBatches || data?.ActiveBatches || 0,
        completedBatches: data?.completedBatches || data?.CompletedBatches || 0,
        upcomingBatches: data?.upcomingBatches || data?.UpcomingBatches || 0,
      });

      setPagination({
        pageNumber: data?.pageNumber || data?.PageNumber || 1,
        pageSize: data?.pageSize || data?.PageSize || 10,
        totalPages: data?.totalPages || data?.TotalPages || 1,
      });

    } catch (err) {
      console.error("Fetch Batches Error:", err);
      setError(err.message || "Unable to load enrolled batches.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBatches(filters);
  }, [fetchBatches, filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    batches,
    summary,
    pagination,
    filters,
    isLoading,
    error,
    fetchBatches,
    updateFilter,
  };
};