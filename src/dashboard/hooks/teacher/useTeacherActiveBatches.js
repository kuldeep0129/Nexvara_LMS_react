import { useState, useEffect, useCallback } from "react";
import { batchService } from "../../services/teacher/batchService";

const COLOR_MAP_KEYS = ["blue", "purple", "emerald"];

const getPayload = (response) => {
  return response?.data ?? response?.Data ?? response;
};

const getPageData = (response) => {
  const payload = getPayload(response);

  return payload?.data ?? payload?.Data ?? payload;
};

export const useTeacherActiveBatches = (initialPageSize = 10) => {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await batchService.getMyBatches(
        "Active",
        pageNumber,
        pageSize
      );

      const pageData = getPageData(response);
      const items = pageData?.items ?? pageData?.Items ?? [];

      const mappedBatches = items.map((item, index) => ({
        id: item.id ?? item.Id,
        name: item.name ?? item.Name ?? "Untitled Batch",
        course: item.courseName ?? item.CourseName ?? "N/A",
        code: item.batchCode ?? item.BatchCode ?? "",
        students: item.studentCount ?? item.StudentCount ?? 0,
        maxStudents: item.capacity ?? item.Capacity ?? 0,
        progress: item.courseProgress ?? item.CourseProgress ?? 0,
        attendance: item.attendancePercentage ?? item.AttendancePercentage ?? 0,

        startDate: item.startDate ?? item.StartDate ?? null,
        endDate: item.endDate ?? item.EndDate ?? null,
        nextClass: item.nextClass ?? item.NextClass ?? null,

        status: item.status ?? item.Status ?? "Active",
        color: COLOR_MAP_KEYS[index % COLOR_MAP_KEYS.length],
      }));

      setBatches(mappedBatches);
      setTotalPages(pageData?.totalPages ?? pageData?.TotalPages ?? 1);
      setTotalCount(
        pageData?.totalCount ??
        pageData?.TotalCount ??
        mappedBatches.length
      );
    } catch (err) {
      console.error("Teacher batches error:", err);
      setError(err.message || "Unable to load batches.");
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  return {
    batches,
    isLoading,
    error,
    pageNumber,
    totalPages,
    totalCount,
    setPageNumber,
    refetch: fetchBatches,
  };
};