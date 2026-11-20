
import { useCallback, useEffect, useState } from "react";
import { getStudentSchedule } from "../../services/student/studentScheduleService";

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const useStudentSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSessions = useCallback(async (date, signal) => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentSchedule(date, signal);

      setSessions(data);
    } catch (err) {
      if (err.name === "AbortError") return;

      setSessions([]);
      setError(err.message || "Something went wrong.");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchSessions(selectedDate, controller.signal);

    return () => controller.abort();
  }, [selectedDate, fetchSessions]);

  const changeDate = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const refresh = () => {
    fetchSessions(selectedDate);
  };

  return {
    sessions,
    selectedDate,
    setSelectedDate: changeDate,
    loading,
    error,
    refresh,
  };
};
