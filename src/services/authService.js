const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const authService = {
  register: async (userData) => {
    const payload = {
      fullName: userData.fullName,
      email: userData.email,
      mobileNo: userData.phone,
      password: userData.password,
      role: 2 
    };
    const response = await fetch(`${API_BASE}/Account/Register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.title || 'Registration failed.');
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/Account/Login-User`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || data.title || 'Invalid credentials. Please try again.');
    }
    
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data)); 
    }
    return data;
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE}/Account/Forgot-Password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.title || 'Failed to send reset email.');
    return data;
  },

  resetPassword: async (payload) => {
    const response = await fetch(`${API_BASE}/Account/Reset-Password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      },
      body: JSON.stringify(payload), 
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || data.title || 'Failed to reset password. The link may be expired.');
    }
    
    return data;
  },

   changePassword: async (payload) => {
    // payload = { currentPassword, newPassword, confirmPassword }
    const response = await fetch(`${API_BASE}/Account/Change-Password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Secure API Call
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || data.title || 'Failed to change password. Please check your current password.');
    }
    
    return data;
  }
}; // <-- Extra bracket yahan se hata diya gaya hai