const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Teacher DTO ke according FormData banega
const createTeacherFormData = (id, formData = {}) => {
  const data = new FormData();
  
  if (id) data.append('Id', String(id)); 
  if (formData.profileImage instanceof File) data.append('ProfileImage', formData.profileImage);

  let dobValue = formData.dateOfBirth;
  if (dobValue && dobValue.length === 10) {
    dobValue = new Date(dobValue).toISOString();
  }

  // Teacher DTO ke fields
  const fields = {
    Qualification: formData.qualification,
    Experienceyear: formData.experienceYears,
    bio: formData.bio,
    specialization: formData.specialization,
    Passingyear: formData.passingYear,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      data.append(key, String(value));
    }
  });

  return data;
};

export const teacherService = {
  getTeachersList: async (pageNumber = 1, pageSize = 10) => {
    const response = await fetch(`${API_BASE}/Account/Get-List-TeacherProfile?PageNumber=${pageNumber}&PageSize=${pageSize}`, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch teachers list.');
    return data;
  },

  getTeacherById: async (id) => {
    if (!id) throw new Error('Teacher ID is missing.');
    const response = await fetch(`${API_BASE}/Account/Get-ById-TeacherProfile?Id=${encodeURIComponent(id)}`, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.title || 'Failed to fetch teacher details.');
    return data;
  },

  updateTeacher: async (id, formData = {}) => {
    if (!id) throw new Error('Teacher ID is missing.');
    const data = createTeacherFormData(id, formData);
    
    const response = await fetch(`${API_BASE}/Account/Update-Teacher-Profile`, {
      method: 'POST', headers: getHeaders(), body: data,
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      let errorMessage = resData.message || resData.title || 'Failed to update teacher.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },

  toggleTeacherStatus: async (id) => {
    if (!id) throw new Error('Teacher ID is missing.');
    const response = await fetch(`${API_BASE}/Account/Update-Status-Teacher-Profile?Id=${encodeURIComponent(id)}`, {
      method: 'PUT', headers: getHeaders()
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  }
};