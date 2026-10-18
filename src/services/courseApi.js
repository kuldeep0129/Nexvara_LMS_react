import api from './api';

export const getCourses = async (featured = false) => {
  const { data } = await api.get('/WebstiteUI/courses');
  return data; // { data: [...], success, responseCode, message }   
}