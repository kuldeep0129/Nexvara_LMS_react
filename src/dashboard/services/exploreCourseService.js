const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

// Get authentication token
const getToken = () => {
  return localStorage.getItem("token");
};

// Common request headers
const getHeaders = () => {
  const token = getToken();

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Safely parse API response
const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
};

// Read camelCase and PascalCase API properties
const getValue = (data, ...keys) => {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }

  return undefined;
};

// Validate HTTP and API-level responses
const validateResponse = (response, data, fallbackMessage) => {
  const success = getValue(data, "success", "Success");
  const message = getValue(data, "message", "Message");

  if (!response.ok) {
    throw new Error(
      message ||
        getValue(data, "title", "Title") ||
        `${fallbackMessage} (HTTP ${response.status})`
    );
  }

  if (success === false) {
    throw new Error(message || fallbackMessage);
  }

  return data;
};

export const exploreCourseService = {
  /**
   * Get batches/courses for the Explore Courses page.
   */
  getExploreCourses: async (filters = {}) => {
    if (!API_BASE) {
      throw new Error("API base URL is not configured.");
    }

    const {
      search = "",
      priceType = "",
      enrollmentStatus = "",
      level = "",
      mode = "",
      sortBy = "Popular",
      pageNumber = 1,
      pageSize = 6,
    } = filters;

    const params = new URLSearchParams();

    if (search.trim()) params.set("Search", search.trim());
    if (priceType) params.set("PriceType", priceType);
    if (enrollmentStatus) params.set("EnrollmentStatus", enrollmentStatus);
    if (level !== "" && level !== null && level !== undefined)
      params.set("Level", String(level));
    if (mode) params.set("Mode", mode);
    if (sortBy) params.set("SortBy", sortBy);

    params.set("PageNumber", String(Math.max(1, Number(pageNumber) || 1)));
    params.set("PageSize", String(Math.max(1, Number(pageSize) || 6)));

    const response = await fetch(
      `${API_BASE}/Student/Get-List-Explore-Course?${params.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const data = await parseResponse(response);

    return validateResponse(response, data, "Failed to fetch courses.");
  },

  /**
   * Enroll the logged-in student in a batch.
   *
   * Backend returns:
   * - Free course: enrollment data only.
   * - Paid course: enrollment + Razorpay order (razorpayOrderId, razorpayKeyId,
   *   amount, currency, paymentId).
   *
   * Payment verification must be handled by a separate backend endpoint.
   */
  enrollInBatch: async (batchId, courseId) => {
    if (!API_BASE) {
      throw new Error("API base URL is not configured.");
    }

    const parsedBatchId = Number(batchId);
    const parsedCourseId = Number(courseId);

    if (!Number.isInteger(parsedBatchId) || parsedBatchId <= 0) {
      throw new Error("Invalid batch ID.");
    }

    if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
      throw new Error("Invalid course ID.");
    }

    const token = getToken();

    if (!token) {
      throw new Error("Please log in before enrolling in a batch.");
    }

    const response = await fetch(
      `${API_BASE}/Student/Create-StudentEnrollment`,
      {
        method: "POST",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: parsedBatchId,
          courseId: parsedCourseId,
        }),
      }
    );

    const data = await parseResponse(response);

    return validateResponse(response, data, "Failed to enroll in batch.");
  },

  /**
   * Verify Razorpay payment signature (recommended — backend endpoint needed).
   *
   * Expected backend endpoint: POST /Payment/Verify
   */
  verifyPayment: async (payload) => {
    if (!API_BASE) {
      throw new Error("API base URL is not configured.");
    }

    const response = await fetch(`${API_BASE}/Student/Verify`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);

    return validateResponse(response, data, "Payment verification failed.");
  },
};

export default exploreCourseService;