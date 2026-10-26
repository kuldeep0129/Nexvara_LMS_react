const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7081/api').replace(/\/+$/, '');
const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const teacherAssignService = {
  // 1. Get Batches List
  getTeacherAssignments: async (requestVm) => {
    const query = new URLSearchParams({
      PageNumber: requestVm.PageNumber,
      PageSize: requestVm.PageSize,
      Status: requestVm.Status
    }).toString();

    const url = `${API_BASE}/Teacher/Get-List-BatchTeacher-Assign-Admin?${query}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch assignments.');
    return data;
  },

  // 2. Get All Teachers for Dropdown (UPDATED ENDPOINT)
  getAllTeachers: async () => {
    const url = `${API_BASE}/Teacher/Get-List-Teacher-IdName`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch teachers list.');
    }
    
    // API response structure ke hisaab se array extract karein
    // (Agar response { data: [...] } aata hai toh data.data, warna direct array)
    return data.data || data || [];
  },

  // 3. Assign Teacher to Batch
  assignTeacherToBatch: async (batchId, payload) => {
    const url = `${API_BASE}/Teacher/Create-AssignBatch/${batchId}/teachers`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload), // { teacherId, isPrimary }
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || data.title || 'Failed to assign teacher.');
    }
    return data;
  },
    getBatchTeachers: async (batchId) => {
    const url = `${API_BASE}/Teacher/Get-List-Batch/${batchId}/teachers`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch batch teachers.');
    }
    
    // API response ke andar 'data' array mein data hai
    return data.data || data || [];
  },
    updateTeacherStatus: async (batchId, teacherId) => {
    const url = `${API_BASE}/Teacher/Update-BatchAssign/${batchId}/teachers/${teacherId}/status`;
    
    const response = await fetch(url, {
      method: 'PATCH', // Screenshot ke according PATCH request
      headers: getHeaders(),
      // Body nahi bhejni kyunki URL mein hi sab kuch hai
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update teacher status.');
    }
    return data;
  }
};