const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7081/api"
).replace(/\/+$/, "");

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const readResponse = async (response, fallbackMessage) => {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result?.message ||
      result?.Message ||
      fallbackMessage
    );
  }

  if (result?.success === false || result?.Success === false) {
    throw new Error(
      result?.message ||
      result?.Message ||
      fallbackMessage
    );
  }

  return result;
};

const fetchMyBatches = async (status, pageNumber, pageSize) => {
  const params = new URLSearchParams({
    PageNumber: String(pageNumber),
    PageSize: String(pageSize),
    Status: status,
  });

  const response = await fetch(
    `${API_BASE}/Teacher/Get-My-Active-Batches?${params}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return readResponse(response, `Failed to fetch ${status} batches.`);
};

export const batchService = {
  getMyBatches: (status = "Active", pageNumber = 1, pageSize = 10) =>
    fetchMyBatches(status, pageNumber, pageSize),

  getMyUpcomingBatches: (status = "Upcoming", pageNumber = 1, pageSize = 10) =>
    fetchMyBatches(status, pageNumber, pageSize),

  getMyCompletedBatches: (pageNumber = 1, pageSize = 10) =>
    fetchMyBatches("Completed", pageNumber, pageSize),

  getBatchById: async (batchId) => {
    if (!batchId) throw new Error("Batch ID is required.");

    const response = await fetch(
      `${API_BASE}/Batch/Get-BatchById/${batchId}`,
      { method: "GET", headers: getHeaders() }
    );

    return readResponse(response, "Failed to fetch batch details.");
  },

  getBatchStudents: async (batchId) => {
    if (!batchId) throw new Error("Batch ID is required.");

    const response = await fetch(
      `${API_BASE}/Batch/Get-BatchStudents/${batchId}`,
      { method: "GET", headers: getHeaders() }
    );

    return readResponse(response, "Failed to fetch students.");
  },

  getBatchSyllabus: async (batchId) => {
    if (!batchId) throw new Error("Batch ID is required.");

    const response = await fetch(
      `${API_BASE}/Batch/Get-BatchSyllabus/${batchId}`,
      { method: "GET", headers: getHeaders() }
    );

    return readResponse(response, "Failed to fetch syllabus.");
  },

  // Teacher Batch Overview
  getBatchOverview: async (batchId) => {
    if (!batchId) throw new Error("Batch ID is required.");

    const response = await fetch(
      `${API_BASE}/Teacher/Get-Batch-Overview/${batchId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return readResponse(response, "Failed to fetch batch overview.");
  },

  // Upload material
  // Expected backend route:
  // POST /api/Teacher/Upload-Batch-Material/{batchId}
  uploadBatchMaterial: async (batchId, { title, moduleId, file }) => {
    if (!batchId) throw new Error("Batch ID is required.");
    if (!title?.trim()) throw new Error("Material title is required.");
    if (!file) throw new Error("Please select a file.");

    const formData = new FormData();

    formData.append("Title", title.trim());
    formData.append("File", file);

    if (moduleId) {
      formData.append("ModuleId", String(moduleId));
    }

    const response = await fetch(
      `${API_BASE}/Teacher/Upload-Batch-Material/${batchId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
        body: formData,
      }
    );

    return readResponse(response, "Failed to upload material.");
  },
  createCourseMaterial: async (formData) => {
    // FormData bhejte waqt Content-Type manually set NAHI karte
    const response = await fetch(`${API_BASE}/Course/Create-CourseMaterial`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {}),
      },
      body: formData,
    });

    return readResponse(response, "Failed to create material.");
  },

    // ... existing code ...

  getCourseModules: async (pageNumber = 1, pageSize = 100, courseId) => {
    const params = new URLSearchParams({ 
      PageNumber: String(pageNumber), 
      PageSize: String(pageSize) 
    });
    
    if (courseId) {
      params.append("CourseId", String(courseId));
    }

    // Endpoint updated to Course-Syllabus
    const response = await fetch(`${API_BASE}/Course/Get-List-Course-Syllabus?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return readResponse(response, "Failed to fetch modules.");
  },
    // Toggle Material Status API
  updateCourseMaterialStatus: async (id) => {
    if (!id) throw new Error("Material ID is required.");
    
    // ✅ FIX: Id ko path me nahi, query parameter (?Id=) me bhejein
    const url = `${API_BASE}/Course/update-status-CourseMaterial?Id=${id}`;
    
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  },
  getCourseMaterialById: async (id) => {
    if (!id) throw new Error("Material ID is required.");
    const url = `${API_BASE}/Course/CouseMaterial?Id=${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return readResponse(response, "Failed to fetch material details.");
  },

  // Update Material API (FormData)
  updateCourseMaterial: async (formData) => {
    const url = `${API_BASE}/Course/Update-CourseMaterial`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        // Content-Type set nahi karna, browser khud boundary set karega
        ...(localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {}),
      },
      body: formData,
    });
    return readResponse(response, "Failed to update material.");
  },


  // Create Course Video API
  createCourseVideo: async (formData) => {
    if (!formData) {
      throw new Error("Video form data is required.");
    }

    const response = await fetch(
      `${API_BASE}/LiveClass/Create-CourseVideo`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
        body: formData,
      }
    );

    return readResponse(
      response,
      "Failed to create course video."
    );
  },

  getBatchClasses: async (batchId) => {
  if (!batchId) throw new Error("Batch ID is required.");

  // API endpoint ke exact route: Get-List-CourseVideo
  const params = new URLSearchParams({
    batchId: String(batchId),
  });

  const response = await fetch(
    `${API_BASE}/LiveClass/Get-List-CourseVideo?${params}`,
    { method: "GET", headers: getHeaders() }
  );

  return readResponse(response, "Failed to fetch classes.");
},
  updateCourseVideo: async (formData) => {
    const response = await fetch(`${API_BASE}/LiveClass/Update-CourseVideo`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
      },
      body: formData,
    });
    return readResponse(response, "Failed to update class.");
  },

   updateCourseVideoStatus: async (id) => {
    if (!id) throw new Error("Class ID is required.");
    
    const response = await fetch(`${API_BASE}/LiveClass/update-status-CourseVideo?Id=${id}`, {
      method: "PUT",
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Failed to update status / delete class.");
    return data;
  },
// batchService.js ke andar add karein
getStudentCourseVideos: async (batchId) => {
  if (!batchId) throw new Error("Batch ID is required.");
  
  const params = new URLSearchParams({ 
    batchId: String(batchId) 
  });

  const response = await fetch(`${API_BASE}/LiveClass/Get-Student-CourseVideo?${params}`, {
    method: "GET",
    headers: getHeaders(),
  });
  
  return readResponse(response, "Failed to fetch student videos.");
},


  // ==========================================
  // STUDENT VIDEO PROGRESS APIs
  // ==========================================

  // 1. Get saved progress of selected video
  getVideoProgress: async (videoId) => {
    if (!videoId) throw new Error("Video ID is required.");

    const response = await fetch(
      `${API_BASE}/LiveClass/${videoId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return readResponse(response, "Failed to fetch video progress.");
  },

  // 2. Start a new watch session
  startVideoSession: async (videoId) => {
    if (!videoId) throw new Error("Video ID is required.");

    const response = await fetch(
      `${API_BASE}/LiveClass/StartSession`,
      {
        method: "POST",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId: Number(videoId) }),
      }
    );

    return readResponse(response, "Failed to start video session.");
  },

  // 3. Save video progress/checkpoint
  saveVideoProgress: async (payload) => {
    if (!payload) throw new Error("Progress payload is required.");

    const response = await fetch(
      `${API_BASE}/LiveClass/SaveProgress`,
      {
        method: "POST",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return readResponse(response, "Failed to save video progress.");
  },

  // 4. End watch session
  endVideoSession: async (sessionId, reason = "Completed") => {
    if (!sessionId) return null;

    const params = new URLSearchParams({
      sessionId: String(sessionId),
      reason: String(reason),
    });

    const response = await fetch(
      `${API_BASE}/LiveClass/EndSession?${params}`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );

    return readResponse(response, "Failed to end video session.");
  },

   getBatchAttendanceSummary: async (batchId) => {
    if (!batchId) throw new Error("Batch ID is required.");

    const response = await fetch(
      `${API_BASE}/Teacher/Get-List-AttendanceSummery/${batchId}/teacher`,
      { method: "GET", headers: getHeaders() }
    );

    return readResponse(response, "Failed to fetch batch attendance summary.");
  },

  // 2. Particular student attendance detail (drill-down)
  getParticularStudentAttendanceSummary: async (batchId, studentId) => {
    if (!batchId) throw new Error("Batch ID is required.");
    if (!studentId) throw new Error("Student ID is required.");

    const response = await fetch(
      `${API_BASE}/Teacher/Get-List-Particular-Student/${studentId}/AttendanceSummary/${batchId}`,
      { method: "GET", headers: getHeaders() }
    );

    return readResponse(response, "Failed to fetch student attendance summary.");
  },

   createStudentAttendance: async (payload) => {
    if (!payload?.attendanceRecords?.length) {
      throw new Error("At least one attendance record is required.");
    }

    const response = await fetch(`${API_BASE}/Teacher/Create-Student-Attendance`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return readResponse(response, "Failed to mark attendance.");
  },

    // Get teacher's batch class sessions (for attendance marking)
  getTeacherBatchClassSessions: async (batchId, pageNumber = 1, pageSize = 100) => {
    if (!batchId) throw new Error("Batch ID is required.");

    const params = new URLSearchParams({
      batchId: String(batchId),
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    });

    const response = await fetch(
      `${API_BASE}/Teacher/Get-List-BatchClassSession?${params}`,
      { method: "GET", headers: getHeaders() }
    );

    return readResponse(response, "Failed to fetch batch class sessions.");
  },
};