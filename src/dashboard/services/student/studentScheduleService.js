
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getStudentSchedule = async (dateTime, signal) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const endpoint = baseUrl.endsWith("/api")
    ? `${baseUrl}/Student/Get-List-Student-Schedule`
    : `${baseUrl}/api/Student/Get-List-Student-Schedule`;

  const params = new URLSearchParams({
    dateTime,
  });

  const response = await fetch(`${endpoint}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ||
      error?.Message ||
      `Unable to load schedule (${response.status})`
    );
  }

  const result = await response.json();

  if (result.success === false || result.Success === false) {
    throw new Error(
      result.message ||
      result.Message ||
      "Failed to load schedule."
    );
  }

  // Supports both wrapped and direct list responses.
  const sessions =
    result.data ??
    result.Data ??
    result.result ??
    result.Result ??
    result;

  if (!Array.isArray(sessions)) {
    throw new Error("Invalid schedule response from server.");
  }

  return sessions;
};
