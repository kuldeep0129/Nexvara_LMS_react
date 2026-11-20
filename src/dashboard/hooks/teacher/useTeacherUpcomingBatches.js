
import { useState, useEffect, useCallback } from 'react';
import { batchService } from '../../services/teacher/batchService';

const COLOR_MAP_KEYS = ['blue', 'purple', 'emerald', 'amber'];

const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (timeValue) => {
  if (!timeValue) return '';

  // Supports TimeSpan values such as 10:30:00 or 10:30
  const [hours, minutes] = String(timeValue).split(':');

  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);

  if (
    !Number.isInteger(parsedHours) ||
    !Number.isInteger(parsedMinutes) ||
    parsedHours < 0 ||
    parsedHours > 23 ||
    parsedMinutes < 0 ||
    parsedMinutes > 59
  ) {
    return '';
  }

  const date = new Date();
  date.setHours(parsedHours, parsedMinutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDaysUntilStart = (startDate) => {
  if (!startDate) return null;

  const start = new Date(startDate);

  if (Number.isNaN(start.getTime())) return null;

  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );
};

const getPreparationData = (item) => {
  const isContentReady = item.contentReady ?? null;
  const isScheduleReady = item.scheduleReady ?? null;
  const isStudentsReady =
    item.studentsReady ?? (Number(item.studentCount || 0) > 0);
  const isAssessmentReady = item.assessmentReady ?? null;

  const checks = [
    isContentReady,
    isScheduleReady,
    isStudentsReady,
    isAssessmentReady,
  ].filter((value) => typeof value === 'boolean');

  const preparation = checks.length
    ? Math.round(
        (checks.filter(Boolean).length / checks.length) * 100
      )
    : null;

  return {
    preparation,
    contentReady: isContentReady,
    scheduleReady: isScheduleReady,
    studentsReady: isStudentsReady,
    assessmentReady: isAssessmentReady,
  };
};

// Handles common API response wrappers and pagination property names.
const getPaginationData = (response) => {
  const wrapper = response?.data ?? response;

  // Supports:
  // { data: { data: [...] } }
  // { data: { items: [...] } }
  // { data: { Data: [...] } }
  // { data: [...] }
  const pageData =
    wrapper?.data ??
    wrapper?.Data ??
    wrapper;

  const items =
    Array.isArray(pageData) ? pageData :
    pageData?.items ??
    pageData?.Items ??
    pageData?.data ??
    pageData?.Data ??
    [];

  return {
    items: Array.isArray(items) ? items : [],
    totalPages:
      pageData?.totalPages ??
      pageData?.TotalPages ??
      wrapper?.totalPages ??
      wrapper?.TotalPages ??
      1,
    totalCount:
      pageData?.totalRecords ??
      pageData?.TotalRecords ??
      pageData?.totalCount ??
      pageData?.TotalCount ??
      wrapper?.totalRecords ??
      wrapper?.TotalRecords ??
      wrapper?.totalCount ??
      wrapper?.TotalCount ??
      items.length,
  };
};

export const useTeacherUpcomingBatches = (initialPageSize = 10) => {
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
      const response = await batchService.getMyUpcomingBatches(
        'Upcoming',
        pageNumber,
        pageSize
      );

      const {
        items,
        totalPages: apiTotalPages,
        totalCount: apiTotalCount,
      } = getPaginationData(response);

      const mappedBatches = items.map((item, index) => {
        const nextClassObj = item.nextClass ?? null;

        const nextClassDate = nextClassObj?.sessionDate
          ? formatDate(nextClassObj.sessionDate)
          : 'Not Scheduled';

        const startTime = formatTime(nextClassObj?.startTime);
        const endTime = formatTime(nextClassObj?.endTime);

        const nextClassTime = startTime
          ? `${startTime}${endTime ? ` - ${endTime}` : ''}`
          : '-';

        const daysUntilStart = getDaysUntilStart(item.startDate);

        const preparationData = getPreparationData(item);

        return {
          id: item.id,
          name: item.name || 'Untitled Batch',
          course: item.courseName || 'N/A',
          code: item.batchCode || 'N/A',

          students: item.studentCount ?? 0,
          maxStudents: item.capacity ?? 0,

          progress: item.courseProgress ?? 0,
          attendance: item.attendancePercentage ?? 0,

          startDate: formatDate(item.startDate),
          endDate: formatDate(item.endDate),

          // Next class information
          nextClass: nextClassDate,
          nextClassTime,
          classType: nextClassObj?.classType || 'N/A',
          meetingLink: nextClassObj?.meetingLink || null,
          moduleName: nextClassObj?.moduleName || null,

          // Upcoming batch information
          startIn:
            daysUntilStart === null
              ? 'Not Scheduled'
              : daysUntilStart === 0
                ? 'Today'
                : `${daysUntilStart} Days`,

          // Actual schedule information from API
          classTime: item.classTime || nextClassTime,
          days: item.scheduleDays || 'Not configured',

          teacherRole: item.teacherRole || 'Assigned Teacher',

          // Preparation checklist
          ...preparationData,

          // Pending work
          pendingAssignments: item.pendingAssignmentCount ?? 0,
          pendingAssessments: item.pendingAssessmentCount ?? 0,

          status: item.status || 'Upcoming',

          // UI decoration only
          color: COLOR_MAP_KEYS[index % COLOR_MAP_KEYS.length],
        };
      });

      setBatches(mappedBatches);
      setTotalPages(Math.max(1, Number(apiTotalPages) || 1));
      setTotalCount(Number(apiTotalCount) || 0);
    } catch (err) {
      console.error('Upcoming Batches Fetch Error:', err);

      setError(
        err?.message ||
          'Something went wrong while fetching upcoming batches.'
      );

      setBatches([]);
      setTotalPages(1);
      setTotalCount(0);
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
    pageSize,
    totalPages,
    totalCount,

    setPageNumber,
    refetch: fetchBatches,
  };
};
