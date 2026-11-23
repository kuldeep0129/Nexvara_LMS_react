
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

export const studentStudyMaterialService = {
  getStudyMaterials: async () => {
    const url = `${API_BASE}/Course/Get-List-Study-Material`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    return readResponse(
      response,
      "Failed to fetch study materials."
    );
  },
};
