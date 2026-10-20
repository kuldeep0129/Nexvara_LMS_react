// src/services/authService.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const authService = {
  register: async (userData) => {
    // ... (Aapka existing register code same rahega)
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

    // NAYA: Token aur User data save karna
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data)); 
      // data.data mein roles, userId, email sab hai
    }

    return data;
  }
};