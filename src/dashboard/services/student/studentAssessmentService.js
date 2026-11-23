const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7081/api"
).replace(/\/+$/, "");

const getHeaders = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const unwrap = (result) => result?.data ?? result?.Data ?? result?.result ?? result?.Result ?? result;

async function request(path, options = {}, fallback = "Assessment request failed.") {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result?.success === false || result?.Success === false) {
    throw new Error(
      result?.message || result?.Message || `${fallback} (${response.status})`
    );
  }
  return unwrap(result);
}

export const studentAssessmentService = {
  getMyAssessments: () =>
    request("/Student/Get-My-Assessments", { method: "GET" }, "Unable to load assessments."),

  getAssessmentDetails: (assessmentId) =>
    request(`/Student/Get-Assessment-Details/${assessmentId}`, { method: "GET" }, "Unable to load assessment questions."),

  startAssessment: (assessmentId) =>
    request(`/Student/Start-Assessment/${assessmentId}`, { method: "POST" }, "Unable to start assessment."),

  submitAssessment: (attemptId, payload) =>
    request(
      `/Student/Submit-Assessment/${attemptId}`,
      { method: "POST", body: JSON.stringify(payload) },
      "Unable to submit assessment."
    ),

  getMyAssessmentResults: () =>
    request("/Student/Get-My-Assessment-Results", { method: "GET" }, "Unable to load assessment results."),
};

export const assessmentUnwrap = unwrap;
