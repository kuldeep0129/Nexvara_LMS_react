import { useState, useEffect, useCallback } from "react";
import { studentService } from "../../services/student/studentService";

const normalizeResponse = (response) => {
  const payload = response?.data ?? response?.Data ?? response;

  // API directly array return kare
  if (Array.isArray(payload)) {
    return payload;
  }

  // API pagination/envelope ke andar list return kare
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.Items)) {
    return payload.Items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.Data)) {
    return payload.Data;
  }

  return [];
};

export function useContinueLearning() {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContinueLearning = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await studentService.getContinueLearning();
      const result = normalizeResponse(response);

      setBatches(result);
    } catch (err) {
      setError(
        err?.message || "Unable to load your learning progress."
      );
      setBatches([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContinueLearning();
  }, [fetchContinueLearning]);

  return {
    batches,
    isLoading,
    error,
    fetchContinueLearning,
  };
}