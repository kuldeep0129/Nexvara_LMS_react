import { useCallback, useEffect, useState } from 'react';
import { getCourses } from '../services/courseApi';

function normalizeCourse(course) {
  return {
    ...course,

    // API icon -> existing UI technology icon
    mono: course.icon || '',

    // API fields -> existing UI field names
    desc: course.summary || course.description || '',
    weeks: course.duration ?? '',
    c: course.color || '#143A70',
    cs: course.softColor || '#CFE1F8',
    badge: course.demand || '',

    // API comma-separated strings -> arrays
    tags: Array.isArray(course.tags)
      ? course.tags
      : typeof course.tags === 'string'
        ? course.tags
            .split(',')
            .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean)
        : [],

    modules: Array.isArray(course.point)
      ? course.point
      : typeof course.point === 'string'
        ? course.point.split(',').map((x) => x.trim()).filter(Boolean)
        : [],

    build: course.lastProjectName || '',
  };
}

export function useCourses(featured = false) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(0);

  const refetch = useCallback(() => {
    setRequestId((id) => id + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      setLoading(true);
      setError(null);

      try {
        const response = await getCourses(featured);

        // Supports both { data: [...] } and direct array responses.
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const normalized = list.map(normalizeCourse);

        if (!cancelled) {
          setCourses(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setCourses([]);
          setError(
            err.response?.data?.message ||
              err.message ||
              'Unable to load courses. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, [featured, requestId]);

  return { courses, loading, error, refetch };
}
