// src/services/enquiryApi.js
import api from './api.js';

export const createEnquiry = async (payload) => {
  const response = await api.post('/WebstiteUI/CreateEnquiry', payload);
  const result = response.data;

  // Handle APIs that return { success: false, message: "..." }
  if (result?.success === false) {
    throw new Error(result.message || 'Unable to submit your application.');
  }

  return result;
};