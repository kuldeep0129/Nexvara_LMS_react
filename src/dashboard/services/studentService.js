const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const createStudentFormData = (id, formData = {}) => {
  const data = new FormData();
  
  if (id) data.append('Id', String(id)); 
  if (formData.profileImage instanceof File) data.append('ProfileImage', formData.profileImage);

  // FIX: Backend String expect kar raha hai, isliye '0', '1', '2' ko "Male", "Female" mein convert karo
  let genderValue = formData.gender;
  if (genderValue === '0' || genderValue === 'Male') genderValue = 'Male';
  else if (genderValue === '1' || genderValue === 'Female') genderValue = 'Female';
  else if (genderValue === '2' || genderValue === 'Other') genderValue = 'Other';

  let dobValue = formData.dateOfBirth;
  if (dobValue && dobValue.length === 10) {
    dobValue = new Date(dobValue).toISOString();
  }

  // Sirf WAHI fields jo Backend DTO accept karta hai
  const fields = {
    Gender: genderValue,
    DateOfBirth: dobValue,
    Qualification: formData.qualification,
    collegename: formData.collegeName, 
    Address: formData.address,
    Passingyear: formData.passingYear,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      data.append(key, String(value));
    }
  });

  return data;
};

export const studentService = {
  getStudentsList: async (pageNumber = 1, pageSize = 10) => {
    const response = await fetch(`${API_BASE}/Account/Get-List-StudentProfile?PageNumber=${pageNumber}&PageSize=${pageSize}`, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch students list.');
    return data;
  },

  getStudentById: async (id) => {
    if (!id) throw new Error('Student ID is missing for GET request.');
    const response = await fetch(`${API_BASE}/Account/Get-ById-StudentProfile?Id=${encodeURIComponent(id)}`, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.title || 'Failed to fetch student details.');
    return data;
  },

  updateStudent: async (id, formData = {}) => {
    if (!id) throw new Error('Student ID is missing for UPDATE request.');
    const data = createStudentFormData(id, formData);
    
    const response = await fetch(`${API_BASE}/Account/Update-Student-Profile`, {
      method: 'POST', headers: getHeaders(), body: data,
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      // Agar backend se validation error aaye, toh usko clearly screen par dikhane ke liye
      let errorMessage = resData.message || resData.title || 'Failed to update student.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },

  toggleStudentStatus: async (id) => {
    if (!id) throw new Error('Student ID is missing for TOGGLE request.');
    const response = await fetch(`${API_BASE}/Account/Update-Status-Student-Profile?Id=${encodeURIComponent(id)}`, {
      method: 'PUT', headers: getHeaders()
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  }
};