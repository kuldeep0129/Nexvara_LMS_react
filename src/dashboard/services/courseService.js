const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7081/api').replace(/\/+$/, '');

const getToken = () => localStorage.getItem('token');

// YEH FUNCTION MISSING THA (Ab add kar diya hai)
const getHeaders = () => {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const courseService = {
  // 1. Create Course
  createCourse: async (formData) => {
    const url = `${API_BASE}/Course/Create-Course`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(), // Updated
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

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(), // Updated
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch courses list.');
    return data;
  },

  // 3. Get Course By ID
  getCourseById: async (id) => {
    if (!id) throw new Error('Course ID is missing.');
    
    const response = await fetch(`${API_BASE}/Course/Get-Course?Id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getHeaders(), // Ab yeh kaam karega
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
      headers: getHeaders(), // Ab yeh bhi kaam karega
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  },

  // 5. Update Course
  updateCourse: async (id, formData) => {
    if (!id) throw new Error('Course ID is missing.');
    formData.append('Id', String(id));

    // YAHAN METHOD 'PUT' KAR DIYA HAI (Swagger screenshot ke according)
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
   getDraftCoursesList: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE}/Course/Get-List-Draft-Course?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch draft courses.');
    return data;
  },
   getDraftCoursesList: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE}/Course/Get-List-Draft-Course?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch draft courses.');
    return data;
  },

  // NAYA: Get Published Courses List
  getPublishedCoursesList: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE}/Course/Get-List-Publish-Course?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch published courses.');
    return data;
  }
};