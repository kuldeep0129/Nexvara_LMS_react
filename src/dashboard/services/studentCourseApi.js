import api from "./axios";

export const getExploreCourses = async (params = {}) => {
  const response = await api.get(
    "/api/Student/Get-List-Explore-Course",
    {
      params: {
        search: params.search || "",
        priceType: params.priceType || "",
        enrollmentStatus: params.enrollmentStatus || "",
        level: params.level || "",
        mode: params.mode || "",
        sortBy: params.sortBy || "popular",
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 12,
      },
    }
  );

  return response.data;
};