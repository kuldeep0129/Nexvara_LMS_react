
import { useState, useEffect, useCallback, useMemo } from "react";
import { studentService } from "../../services/student/studentService";

const getValue = (obj, camel, pascal, fallback = null) =>
  obj?.[camel] ?? obj?.[pascal] ?? fallback;

const mapLiveClass = (item) => ({
  id: getValue(item, "id", "Id"),
  batchId: getValue(item, "batchId", "BatchId"),
  batchName: getValue(item, "batchName", "BatchName", "My Batch"),

  moduleId: getValue(item, "moduleId", "ModuleId"),
  moduleName: getValue(item, "moduleName", "ModuleName", "Live Session"),

  title: getValue(item, "title", "Title", "Upcoming Live Class"),
  description: getValue(item, "description", "Description", ""),

  scheduledStartAt: getValue(
    item,
    "scheduledStartAt",
    "ScheduledStartAt"
  ),

  scheduledEndAt: getValue(
    item,
    "scheduledEndAt",
    "ScheduledEndAt"
  ),

  meetingProvider: getValue(
    item,
    "meetingProvider",
    "MeetingProvider"
  ),

  meetingUrl: getValue(item, "meetingUrl", "MeetingUrl"),
});

export const useUpcomingLiveClasses = () => {
  const [classes, setClasses] = useState([]);

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUpcomingClasses = useCallback(
    async (page = 1, signal) => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await studentService.getUpcomingLiveClasses({
            pageNumber: page,
            pageSize: pagination.pageSize,
            signal,
          });

        const data = response?.data ?? response?.Data ?? {};
        const items = data?.items ?? data?.Items ?? [];

        setClasses(items.map(mapLiveClass));

        setPagination({
          pageNumber:
            getValue(data, "pageNumber", "PageNumber", page),

          pageSize:
            getValue(data, "pageSize", "PageSize", 10),

          totalCount:
            getValue(data, "totalCount", "TotalCount", items.length),

          totalPages:
            getValue(data, "totalPages", "TotalPages", 1),
        });

      } catch (err) {
        if (err.name === "AbortError") return;

        setClasses([]);
        setError(
          err.message || "Unable to load upcoming live classes."
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [pagination.pageSize]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchUpcomingClasses(pagination.pageNumber, controller.signal);

    return () => controller.abort();
  }, [fetchUpcomingClasses, pagination.pageNumber]);

  const filteredClasses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return classes;

    return classes.filter((item) =>
      [
        item.title,
        item.description,
        item.batchName,
        item.moduleName,
        item.meetingProvider,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [classes, search]);

  const changePage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    setPagination((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const refresh = () => {
    fetchUpcomingClasses(pagination.pageNumber);
  };

  return {
    classes: filteredClasses,
    totalClasses: pagination.totalCount,
    pagination,
    search,
    setSearch,
    isLoading,
    error,
    changePage,
    refresh,
  };
};
