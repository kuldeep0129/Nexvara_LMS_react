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
};