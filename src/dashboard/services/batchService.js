const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7081/api').replace(/\/+$/, '');
const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json', // POST requests ke liye zaroori hai
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const batchService = {
  // 1. Get All Batches
  getBatchesList: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE}/Batch/Get-List-Batch?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch batches.');
    return data;
  },

  // 2. Create New Batch
  createBatch: async (batchData) => {
    const url = `${API_BASE}/Batch/Create-Batch`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(batchData),
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      let errorMessage = resData.message || resData.title || 'Failed to create batch.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },

    getBatchById: async (id) => {
    if (!id) throw new Error('Batch ID is missing.');
    // Path structure exactly aapke swagger ke according
    const url = `${API_BASE}/Batch/Get-ById-Batch/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Failed to fetch batch details.');
    return data;
  },
    updateBatch: async (id, data) => {
    if (!id) throw new Error('Batch ID is missing.');
    
    const url = `${API_BASE}/Batch/Update-Batch/${id}`; // Path parameter as per swagger
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      let errorMessage = resData.message || resData.title || 'Failed to update batch.';
      if (resData.errors) {
        errorMessage = Object.entries(resData.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join(' | ');
      }
      throw new Error(errorMessage);
    }
    return resData;
  },
    deleteBatch: async (id) => {
    if (!id) throw new Error('Batch ID is missing.');
    const url = `${API_BASE}/Batch/Delete-Batch/${id}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to delete/archive batch.');
    }
    return resData;
  },
   togglePublishBatch: async (id, currentPublishStatus) => {
    if (!id) throw new Error('Batch ID is missing.');
    
    // The backend likely expects a DTO. We send the opposite of the current status.
    // Check your Swagger UI to confirm if the key is "isPublished" or "publish".
    const payload = { 
      isPublished: !currentPublishStatus 
    };

    const url = `${API_BASE}/Batch/Update-BatchStatus/${id}/publish`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(), // Make sure getHeaders includes 'Content-Type': 'application/json'
      body: JSON.stringify(payload), // Send the body!
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to toggle publish status.');
    }
    return resData;
  },
   updateBatchStatus: async (id, statusValue) => {
    if (!id) throw new Error('Batch ID is missing.');
    
    // Backend DTO format: mostly { status: 1 } ya direct number. 
    // Agar backend reject kare, toh payload check karein.
    const payload = { status: Number(statusValue) };

    const url = `${API_BASE}/Batch/Update-BatchStatus/${id}/status`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    
    const resData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to update batch status.');
    }
    return resData;
  }
  // ==========================================
  // Future APIs for actions (Uncomment when available)
  // ==========================================
  
  // togglePublish: async (id) => {
  //   const response = await fetch(`${API_BASE}/Batch/Toggle-Publish?Id=${id}`, {
  //     method: 'PUT', headers: getHeaders(),
  //   });
  //   return response.json();
  // },

  // changeStatus: async (id, status) => {
  //   const response = await fetch(`${API_BASE}/Batch/Change-Status`, {
  //     method: 'PUT',
  //     headers: getHeaders(),
  //     body: JSON.stringify({ id, status })
  //   });
  //   return response.json();
  // },

  // archiveBatch: async (id) => {
  //   const response = await fetch(`${API_BASE}/Batch/Archive?Id=${id}`, {
  //     method: 'DELETE', headers: getHeaders(),
  //   });
  //   return response.json();
  // }
};