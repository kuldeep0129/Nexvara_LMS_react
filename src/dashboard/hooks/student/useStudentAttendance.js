import { useCallback, useEffect, useMemo, useState } from "react";
import { studentService } from "../../services/student/studentService";

const read = (obj, camel, pascal, fallback = undefined) =>
  obj?.[camel] ?? obj?.[pascal] ?? fallback;

const getPayload = (response) =>
  read(response, "data", "Data", response);

const normalizeAttendance = (item) => {
  const joinedAt = read(item, "joinedAt", "JoinedAt", null);
  const leftAt = read(item, "leftAt", "LeftAt", null);
  const durationInSeconds = Number(
    read(item, "durationInSeconds", "DurationInSeconds", 0) || 0
  );

  return {
    id: read(item, "id", "Id"),
    liveClassId: read(item, "liveClassId", "LiveClassId", null),
    liveClassTitle: read(item, "liveClassTitle", "LiveClassTitle", "Live Class"),
    batchName: read(item, "batchName", "BatchName", "Unassigned batch"),
    moduleName: read(item, "moduleName", "ModuleName", "General session"),
    joinedAt,
    leftAt,
    status: read(item, "status", "Status", null),
    durationInSeconds,
    isActive: read(item, "isActive", "IsActive", true),
  };
};

export const formatDuration = (seconds = 0) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m`;
  return `${remainingSeconds}s`;
};

export const normalizeAttendanceStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();
  if (value === "present") return "Present";
  if (value === "late") return "Late";
  if (value === "absent") return "Absent";
  if (value === "leave" || value === "approved leave") return "Leave";
  return "Unmarked";
};

export const useStudentAttendance = (pageSize = 100) => {
  const [records, setRecords] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const fetchAttendance = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await studentService.getMyClassAttendance({
        pageNumber,
        pageSize,
        signal,
      });

      const payload = getPayload(response);
      const rawItems = Array.isArray(payload)
        ? payload
        : read(payload, "items", "Items", []);

      const safeItems = Array.isArray(rawItems) ? rawItems : [];

      setRecords(safeItems.map(normalizeAttendance));
      setTotalCount(
        Number(read(payload, "totalCount", "TotalCount", safeItems.length))
      );
      setTotalPages(
        Math.max(1, Number(read(payload, "totalPages", "TotalPages", 1)) || 1)
      );
    } catch (err) {
      if (err.name === "AbortError") return;
      setRecords([]);
      setTotalCount(0);
      setTotalPages(1);
      setError(err.message || "Unable to load attendance records.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [pageNumber, pageSize, refreshIndex]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAttendance(controller.signal);
    return () => controller.abort();
  }, [fetchAttendance]);

  const refresh = useCallback(() => {
    setRefreshIndex((value) => value + 1);
  }, []);

  const changePage = useCallback((nextPage) => {
    setPageNumber((current) => {
      const next = Number(nextPage);
      if (!Number.isFinite(next)) return current;
      return Math.min(Math.max(1, next), totalPages);
    });
  }, [totalPages]);

  const stats = useMemo(() => {
    const counts = records.reduce((result, record) => {
      const status = normalizeAttendanceStatus(record.status);
      result[status] = (result[status] || 0) + 1;
      return result;
    }, {});

    const marked = (counts.Present || 0) + (counts.Late || 0) +
      (counts.Absent || 0) + (counts.Leave || 0);
    const attended = (counts.Present || 0) + (counts.Late || 0);

    return {
      loaded: records.length,
      present: counts.Present || 0,
      absent: counts.Absent || 0,
      late: counts.Late || 0,
      leave: counts.Leave || 0,
      unmarked: counts.Unmarked || 0,
      marked,
      percentage: marked > 0 ? (attended / marked) * 100 : null,
    };
  }, [records]);

  const batchAttendance = useMemo(() => {
    const groups = new Map();

    records.forEach((record) => {
      const name = record.batchName || "Unassigned batch";
      if (!groups.has(name)) {
        groups.set(name, {
          id: name,
          course: name,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
          unmarked: 0,
        });
      }

      const group = groups.get(name);
      group.total += 1;
      const status = normalizeAttendanceStatus(record.status).toLowerCase();
      group[status] = (group[status] || 0) + 1;
    });

    return Array.from(groups.values()).map((group) => {
      const marked = group.present + group.absent + group.late + group.leave;
      return {
        ...group,
        percentage: marked
          ? ((group.present + group.late) / marked) * 100
          : null,
      };
    });
  }, [records]);

  return {
    records,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    loading,
    error,
    stats,
    batchAttendance,
    changePage,
    refresh,
  };
};
