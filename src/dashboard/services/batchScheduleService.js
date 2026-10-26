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

export const batchScheduleService = {
  // 1. Get Schedules List with Filters
  getSchedulesList: async (params) => {
    const query = new URLSearchParams();
    
    // Default params
    query.append('PageNumber', params.pageNumber || 1);
    query.append('PageSize', params.pageSize || 10);

    // Optional Filters
    if (params.search) query.append('Search', params.search);
    if (params.batchId) query.append('BatchId', params.batchId);
    if (params.dayOfWeek !== undefined && params.dayOfWeek !== '') query.append('DayOfWeek', params.dayOfWeek);
    if (params.isActive !== undefined && params.isActive !== '') query.append('IsActive', params.isActive);
    if (params.sortBy) query.append('SortBy', params.sortBy);
    if (params.sortDescending !== undefined) query.append('SortDescending', params.sortDescending);

    const url = `${API_BASE}/Batch/Get-List-batch-schedules?${query.toString()}`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) throw new Error(data.message || 'Failed to fetch schedules.');
    return data;
  },

  // 2. Toggle Schedule Status
  toggleScheduleStatus: async (batchId, scheduleId) => {
    if (!batchId || !scheduleId) throw new Error('Batch ID and Schedule ID are required.');
    
    const url = `${API_BASE}/Batch/Update-Status-BatchSchedule?batchId=${batchId}&scheduleId=${scheduleId}`;
    const response = await fetch(url, { method: 'PATCH', headers: getHeaders() });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to update status.');
    return data;
  },
    createSchedule: async (batchId, payload) => {
    if (!batchId) throw new Error('Batch ID is required.');
    
    const url = `${API_BASE}/Batch/Create-Batch/${batchId}/schedules`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      let errorMessage = resData.message || resData.title || 'Failed to create schedule.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },
    getScheduleById: async (id) => {
    if (!id) throw new Error('Schedule ID is missing.');
    const url = `${API_BASE}/Batch/Get-ById-BatchSchedule/${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch schedule details.');
    return data;
  },
  updateSchedule: async (batchId, scheduleId, payload) => {
    if (!batchId || !scheduleId) throw new Error('Batch ID and Schedule ID are required.');
    
    const url = `${API_BASE}/Batch/Update-batches/${batchId}/schedules/${scheduleId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      let errorMessage = resData.message || resData.title || 'Failed to update schedule.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },
    getSchedulesByBatchId: async (batchId) => {
    if (!batchId) throw new Error('Batch ID is required.');
    
    const url = `${API_BASE}/Batch/Get-ByID-BatchList/${batchId}/schedules`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch batch schedules.');
    return data;
  }
};