import api from './api';

/**
 * GET /programs
 * Backend se programs list aayegi
 */
export const getPrograms = async () => {
  const { data } = await api.get('/WebstiteUI/programs'); // adjust endpoint if needed
  return data; // { data: [...], success, responseCode, message }
};

