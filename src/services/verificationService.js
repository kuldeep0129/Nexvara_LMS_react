const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const verificationService = {
  verifyEmail: async (userId, token) => {
    if (!userId || !token) {
      throw new Error("Missing userId or token");
    }

    // API endpoint ke according query parameters
    const url = new URL(`${API_BASE}/Account/Email-Confirmation`);
    url.searchParams.append('userId', userId);
    url.searchParams.append('token', token);

    const response = await fetch(url.toString(), {
      method: 'POST', // Screenshot ke according POST request
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || data.title || 'Verification failed. The link may be invalid or expired.');
      error.status = response.status;
      // Backend agar specific error code bhej raha ho toh yahan map karein
      error.code = data.code; 
      throw error;
    }

    return data;
  }
};