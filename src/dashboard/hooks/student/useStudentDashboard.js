
import { useState, useEffect, useCallback } from "react";
import { studentDashboardService } from "../../services/student/studentDashboardService";

// =====================================================
// Helper: Support PascalCase and camelCase API response
// =====================================================

const getValue = (obj, camelKey, pascalKey, fallback = null) => {
  return obj?.[camelKey] ?? obj?.[pascalKey] ?? fallback;
};

// =====================================================
// Normalize Dashboard Response
// =====================================================

const normalizeDashboard = (response) => {
  const data =
    response?.data ??
    response?.Data ??
    response?.result ??
    response?.Result ??
    response;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid dashboard response from server.");
  }

  const statsData = getValue(data, "stats", "Stats", {});

  const coursesData = getValue(data, "courses", "Courses", []);

  const gradesData = getValue(
    data,
    "recentGrades",
    "RecentGrades",
    []
  );

  return {
    studentName: getValue(
      data,
      "studentName",
      "StudentName",
      "Student"
    ),

    stats: {
      enrolledCourses: Number(
        getValue(statsData, "enrolledCourses", "EnrolledCourses", 0)
      ),

      liveClasses: Number(
        getValue(statsData, "liveClasses", "LiveClasses", 0)
      ),

      certificates: Number(
        getValue(statsData, "certificates", "Certificates", 0)
      ),

      assignmentsDue: Number(
        getValue(statsData, "assignmentsDue", "AssignmentsDue", 0)
      ),
    },

    courses: Array.isArray(coursesData)
      ? coursesData.map((course) => ({
          batchId: getValue(course, "batchId", "BatchId"),
          courseId: getValue(course, "courseId", "CourseId"),

          courseName: getValue(
            course,
            "courseName",
            "CourseName",
            "Untitled Course"
          ),

          courseImage: getValue(
            course,
            "courseImage",
            "CourseImage"
          ),

          batchName: getValue(
            course,
            "batchName",
            "BatchName",
            "N/A"
          ),

          batchCode: getValue(
            course,
            "batchCode",
            "BatchCode",
            ""
          ),

          progress: Math.min(
            100,
            Math.max(
              0,
              Number(
                getValue(course, "progress", "Progress", 0)
              )
            )
          ),

          nextClassDate: getValue(
            course,
            "nextClassDate",
            "NextClassDate"
          ),

          nextClassTime: getValue(
            course,
            "nextClassTime",
            "NextClassTime"
          ),
        }))
      : [],

    recentGrades: Array.isArray(gradesData)
      ? gradesData.map((grade) => ({
          id: getValue(grade, "id", "Id"),
          title: getValue(
            grade,
            "title",
            "Title",
            "Assessment"
          ),

          score: Number(
            getValue(grade, "score", "Score", 0)
          ),

          total: Number(
            getValue(grade, "total", "Total", 0)
          ),

          percentage: Number(
            getValue(
              grade,
              "percentage",
              "Percentage",
              0
            )
          ),

          isPassed: Boolean(
            getValue(grade, "isPassed", "IsPassed", false)
          ),
        }))
      : [],
  };
};

// =====================================================
// Student Dashboard Hook
// =====================================================

export const useStudentDashboard = () => {
  const [dashboard, setDashboard] = useState({
    studentName: "Student",

    stats: {
      enrolledCourses: 0,
      liveClasses: 0,
      certificates: 0,
      assignmentsDue: 0,
    },

    courses: [],
    recentGrades: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // Fetch Dashboard
  // =====================================================

  const fetchDashboard = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      setError("");

      const response =
        await studentDashboardService.getStudentDashboard(signal);

      const result = normalizeDashboard(response);

      setDashboard(result);

    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Student Dashboard Error:", err);

      setError(
        err.message || "Unable to load student dashboard."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // =====================================================
  // Initial API Call
  // =====================================================

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboard(controller.signal);

    return () => controller.abort();
  }, [fetchDashboard]);

  // =====================================================
  // Refresh Dashboard
  // =====================================================

  const refreshDashboard = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    stats: dashboard.stats,
    courses: dashboard.courses,
    recentGrades: dashboard.recentGrades,
    studentName: dashboard.studentName,

    isLoading,
    error,

    fetchDashboard: refreshDashboard,
    refreshDashboard,
  };
};
