const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const userService = {
  // 1. Get All Users List
  getUsersList: async (pageNumber = 1, pageSize = 10) => {
    const response = await fetch(`${API_BASE}/Account/Get-List-Users?PageNumber=${pageNumber}&PageSize=${pageSize}`, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users list.');
    return data;
  },

  // 2. Get User By ID
  getUserById: async (id) => {
    if (!id) throw new Error('User ID is missing.');
    const response = await fetch(`${API_BASE}/Account/Get-ById-User?Id=${encodeURIComponent(id)}`, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.title || 'Failed to fetch user details.');
    return data;
  },

  // 3. Update User (Generic fields only: Name, Email, Mobile, Role)
  updateUser: async (id, formData) => {
    if (!id) throw new Error('User ID is missing.');
    
    const response = await fetch(`${API_BASE}/Account/Update-User`, {
      method: 'POST', // Ya PUT, jo aapka backend support kare
      headers: { 
        ...getHeaders(), 
        'Content-Type': 'application/json' 
      }, 
      body: JSON.stringify({ Id: id, ...formData }),
    });
    
    const resData = await response.json().catch(() => ({}));
    if (!response.ok) {
      let errorMessage = resData.message || resData.title || 'Failed to update user.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },

  // 4. Toggle User Status
  toggleUserStatus: async (id) => {
    if (!id) throw new Error('User ID is missing.');
    const response = await fetch(`${API_BASE}/Account/Update-Status-User?Id=${encodeURIComponent(id)}`, {
      method: 'PUT', headers: getHeaders()
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  }
};