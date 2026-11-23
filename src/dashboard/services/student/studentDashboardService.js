
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7081/api";

const getHeaders = () => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  return {
    Accept: "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

const readResponse = async (response) => {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      throw new Error("You are not authorized to access this dashboard.");
    }

    throw new Error(
      result?.message ||
      result?.Message ||
      `Unable to load dashboard (${response.status}).`
    );
  }

  if (
    result?.success === false ||
    result?.Success === false
  ) {
    throw new Error(
      result?.message ||
      result?.Message ||
      "Failed to fetch student dashboard."
    );
  }

  return result;
};

const getStudentDashboard = async (signal) => {
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");

  const endpoint = baseUrl.endsWith("/api")
    ? `${baseUrl}/Student/Get-Student-Dashboard`
    : `${baseUrl}/api/Student/Get-Student-Dashboard`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: getHeaders(),
    signal,
  });

  return readResponse(response);
};

export const studentDashboardService = {
  getStudentDashboard,
};
