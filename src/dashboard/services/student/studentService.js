const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7081/api"
).replace(/\/+$/, "");

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const readResponse = async (response, fallbackMessage) => {
  const result = await response.json().catch(() => ({}));

  if (
    !response.ok ||
    result?.success === false ||
    result?.Success === false
  ) {
    throw new Error(
      result?.message ||
      result?.Message ||
      fallbackMessage
    );
  }

  return result;
};

export const studentService = {
  getEnrolledBatches: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    status = "",
    sortBy = "Progress",
  }) => {
    const params = new URLSearchParams({
      PageNumber: String(pageNumber),
      PageSize: String(pageSize),
    });

    if (search) params.append("Search", search);
    if (status) params.append("Status", status);
    if (sortBy) params.append("SortBy", sortBy);

    const response = await fetch(
      `${API_BASE}/Student/Get-List-Enrolled-Batches?${params.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return readResponse(response, "Failed to fetch enrolled batches.");
  },

  // Continue Learning
  getContinueLearning: async () => {
    const response = await fetch(
      `${API_BASE}/Student/Get-Continue-Learning`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return readResponse(
      response,
      "Failed to fetch continue learning data."
    );
  },
    getUpcomingLiveClasses: async ({
    pageNumber = 1,
    pageSize = 10,
    signal,
  } = {}) => {
    const params = new URLSearchParams({
      PageNumber: String(pageNumber),
      PageSize: String(pageSize),
    });

    const response = await fetch(
      `${API_BASE}/LiveClass/Get-Student-Upcoming-LiveClasses?${params.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
        signal,
      }
    );

    return readResponse(
      response,
      "Failed to fetch upcoming live classes."
    );
  },
   // Logged-in student's class attendance history.
  // StudentId is intentionally not sent from the frontend; backend reads it from JWT.
  getMyClassAttendance: async ({
    pageNumber = 1,
    pageSize = 100,
    signal,
  } = {}) => {
    const params = new URLSearchParams({
      PageNumber: String(pageNumber),
      PageSize: String(pageSize),
    });

    const response = await fetch(
      `${API_BASE}/Student/Get-Student-My-Class-Attendance?${params.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
        signal,
      }
    );

    return readResponse(
      response,
      "Failed to fetch your attendance history."
    );
  },
    // Student ID is intentionally not sent. Backend reads it from the JWT claim.
  getMyCertificates: async ({ signal } = {}) => {
    const response = await fetch(`${API_BASE}/Student/Get-My-Certificates`, {
      method: "GET",
      headers: getHeaders(),
      signal,
    });
    return readResponse(response, "Failed to fetch your certificates.");
  },

  // Public verification endpoint. It does not require the student's JWT.
  verifyCertificate: async (verificationCode) => {
    const response = await fetch(
      `${API_BASE}/Certificate/Verify/${encodeURIComponent(verificationCode)}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );
    return readResponse(response, "Certificate verification failed.");
  },
    getMyPayments: async ({ signal } = {}) => {
    const response = await fetch(
      `${API_BASE}/Student/Get-Studnet-My-Payment`,
      {
        method: "GET",
        headers: getHeaders(),
        signal,
      }
    );

    return readResponse(response, "Failed to fetch your payment history.");
  },
};