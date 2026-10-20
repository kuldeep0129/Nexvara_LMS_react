const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const readResponse = async (response, defaultMessage) => {
  const contentType = response.headers.get('content-type') || '';
  let result = {};
  if (contentType.includes('application/json')) {
    result = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => '');
    result = text ? { message: text } : {};
  }
  if (!response.ok) {
    throw new Error(result?.message || result?.title || defaultMessage);
  }
  return result;
};

const createProfileFormData = (id, formData = {}) => {
  const data = new FormData();

  // 1. Id string ensure karein
  if (id && typeof id !== 'object') {
    data.append('Id', String(id)); 
  }

  // 2. Profile Image (File)
  if (formData.profileImage instanceof File) {
    data.append('ProfileImage', formData.profileImage);
  }

  // 3. GENDER FIX: Direct String (Male, Female) bhej rahe hain
  if (formData.gender !== undefined && formData.gender !== null && formData.gender !== '') {
    let genderString = formData.gender;
    
    // Agar select box se '0', '1', '2' aa raha hai, toh usko String mein map karo
    if (genderString === '0') genderString = 'Male';
    else if (genderString === '1') genderString = 'Female';
    else if (genderString === '2') genderString = 'Other';

    // Ab ye direct "Male", "Female" backend ko jayega
    data.append('Gender', genderString); 
  }

  // 4. DATE FORMAT FIX (ISO 8601)
  let dobValue = formData.dateOfBirth;
  if (dobValue && dobValue.length === 10) {
    dobValue = new Date(dobValue).toISOString();
  }

  // 5. Baaki fields
  const fields = {
    DateOfBirth: dobValue,
    Qualification: formData.qualification,
    collegename: formData.collegeName, 
    Address: formData.address,
    Passingyear: formData.passingYear,
    Experienceyear: formData.experienceYear,
    bio: formData.bio,
    specialization: formData.specialization,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      data.append(key, String(value));
    }
  });

  return data;
};

export const profileService = {
  // ==========================================
  // GET APIs
  // ==========================================
  getStudentProfile: async (id) => {
    if (!id) throw new Error('Student user ID is missing.');
    const response = await fetch(`${API_BASE}/Account/Get-ById-StudentProfile?id=${encodeURIComponent(id)}`, {
      method: 'GET', headers: getHeaders(),
    });
    return readResponse(response, 'Failed to fetch student profile.');
  },

  getTeacherProfile: async (id) => {
    if (!id) throw new Error('Teacher user ID is missing.');
    const response = await fetch(`${API_BASE}/Account/Get-ById-TeacherProfile?id=${encodeURIComponent(id)}`, {
      method: 'GET', headers: getHeaders(),
    });
    return readResponse(response, 'Failed to fetch teacher profile.');
  },

  // ==========================================
  // UPDATE APIs
  // ==========================================
  updateStudentProfile: async (id, formData = {}) => {
    if (!id) throw new Error('Student profile ID is missing.');
    const data = createProfileFormData(id, formData);
    const response = await fetch(`${API_BASE}/Account/Update-Student-Profile`, {
      method: 'POST', headers: getHeaders(), body: data,
    });
    return readResponse(response, 'Failed to update student profile.');
  },

  updateTeacherProfile: async (id, formData = {}) => {
    if (!id) throw new Error('Teacher profile ID is missing.');
    const data = createProfileFormData(id, formData);
    const response = await fetch(`${API_BASE}/Account/Update-Teacher-Profile`, {
      method: 'POST', headers: getHeaders(), body: data,
    });
    return readResponse(response, 'Failed to update teacher profile.');
  },
};