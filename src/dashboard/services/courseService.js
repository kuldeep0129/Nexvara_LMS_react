const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7081/api').replace(/\/+$/, '');

const getToken = () => localStorage.getItem('token');

// Standard Headers (File Uploads ke liye - Bina Content-Type ke)
const getHeaders = () => {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// JSON Data bhejne ke liye (Yeh missing tha)
const getJsonHeaders = () => {
  const token = getToken();
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const courseService = {
  // 1. Create Course (FormData - No Content-Type)
  createCourse: async (formData) => {
    const url = `${API_BASE}/Course/Create-Course`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: formData,
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        let errorMessage = resData.message || resData.title || 'Failed to create course.';
        if (resData.errors) {
          errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
        }
        throw new Error(errorMessage);
      }
      return resData;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  },

  // 2. Get Courses List
  getCoursesList: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE}/Course/Get-List-Course?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch courses list.');
    return data;
  },

  // 3. Get Course By ID
  getCourseById: async (id) => {
    if (!id) throw new Error('Course ID is missing.');
    const response = await fetch(`${API_BASE}/Course/Get-Course?Id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.title || 'Failed to fetch course details.');
    return data;
  },

  // 4. Toggle Course Status
  toggleCourseStatus: async (id) => {
    if (!id) throw new Error('Course ID is missing.');
    const response = await fetch(`${API_BASE}/Course/update-status-Course?Id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  },

  // 5. Update Course (FormData - No Content-Type)
  updateCourse: async (id, formData) => {
    if (!id) throw new Error('Course ID is missing.');
    formData.append('Id', String(id));

    const response = await fetch(`${API_BASE}/Course/Update-Course`, {
      method: 'PUT',
      headers: getHeaders(),
      body: formData,
    });
    const resData = await response.json().catch(() => ({}));
    if (!response.ok) {
      let errorMessage = resData.message || resData.title || 'Failed to update course.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },

  // 6. Get Draft Courses List
  getDraftCoursesList: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE}/Course/Get-List-Draft-Course?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch draft courses.');
    return data;
  },

  // 7. Get Published Courses List
  getPublishedCoursesList: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE}/Course/Get-List-Publish-Course?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch published courses.');
    return data;
  },

  // 8. ManageCourse API (Curriculum)
  getCourseCurriculum: async (courseId) => {
    if (!courseId) throw new Error('Course ID is required.');
    const url = `${API_BASE}/Course/${courseId}/curriculum`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch course details.');
    return data;
  },

  // 9. Create Syllabus (JSON - Requires Content-Type) -> YAHAN FIX KIYA HAI
  createSyllabus: async (payload) => {
    const url = `${API_BASE}/Course/Create-CourseSyllabus`;
    
    // Debugging ke liye
    console.log("Sending JSON Payload:", payload);
    console.log("JSON Headers:", getJsonHeaders());

    const response = await fetch(url, {
      method: 'POST',
      headers: getJsonHeaders(), // <--- Yahan getJsonHeaders() use kiya hai
      body: JSON.stringify(payload),
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      let errorMsg = data.message || data.title || 'Failed to create syllabus topic.';
      if (data.errors) errorMsg = Object.values(data.errors).flat().join(', ');
      throw new Error(errorMsg);
    }
    
    return data;
  },
    getSyllabusById: async (id) => {
    if (!id) throw new Error('Syllabus ID is required.');
    // Aapke Swagger ke hisaab se URL
    const url = `${API_BASE}/Course/CouseSyllabus?id=${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch syllabus details.');
    return data;
  },

  // 11. Update Syllabus
  updateSyllabus: async (payload) => {
    const url = `${API_BASE}/Course/Update-CourseSyllabus`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getJsonHeaders(), // JSON headers zaroori hain
      body: JSON.stringify(payload),
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      let errorMsg = data.message || 'Failed to update syllabus topic.';
      if (data.errors) errorMsg = Object.values(data.errors).flat().join(', ');
      throw new Error(errorMsg);
    }
    return data;
  },
  // courseService.js ke andar add karein
  updateSyllabusStatus: async (id) => {
    if (!id) throw new Error('Syllabus ID is required.');
    const url = `${API_BASE}/Course/update-status-CourseSyllabus?Id=${id}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  }
};