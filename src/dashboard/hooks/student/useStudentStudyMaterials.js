
import { useState, useEffect, useCallback } from "react";
import { studentStudyMaterialService } from "../../services/student/studentStudyMaterialService";

export const useStudentStudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudyMaterials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await studentStudyMaterialService.getStudyMaterials();

      const data = response?.data ?? response?.Data;

      const materialList =
        data?.materials ??
        data?.Materials ??
        data?.material ??
        data?.Material ??
        [];

      const mappedMaterials = materialList.map((item) => ({
        id: item.id ?? item.Id,
        courseId: item.courseId ?? item.CourseId,
        courseName: item.courseName ?? item.CourseName ?? "",
        batchId: item.batchId ?? item.BatchId,
        batchName: item.batchName ?? item.BatchName ?? "",
        moduleId: item.moduleId ?? item.ModuleId,
        moduleName: item.moduleName ?? item.ModuleName ?? "",
        title: item.title ?? item.Title ?? "",
        fileUrl: item.fileUrl ?? item.FileUrl ?? "",
        fileType: item.fileType ?? item.FileType ?? "File",
        fileSize: item.fileSize ?? item.FileSize ?? 0,
        isActive: item.isActive ?? item.IsActive ?? false,
      }));

      setMaterials(mappedMaterials);
      setTotal(data?.total ?? data?.Total ?? mappedMaterials.length);
    } catch (err) {
      console.error("Fetch Study Materials Error:", err);
      setError(err.message || "Unable to load study materials.");
      setMaterials([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudyMaterials();
  }, [fetchStudyMaterials]);

  return {
    materials,
    total,
    isLoading,
    error,
    fetchStudyMaterials,
  };
};
