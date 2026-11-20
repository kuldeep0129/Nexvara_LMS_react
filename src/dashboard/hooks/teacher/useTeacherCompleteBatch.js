import { useState, useEffect, useCallback } from 'react';
import { batchService } from '../../services/teacher/batchService'; // Apne folder structure ke hisaab se path check karein

/* =========================================================
   HOOK 1: Complete Batch Details (For BatchDetails Page)
========================================================= */
export const useBatchDetails = (batchId) => {
  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    if (!batchId) return;
    setIsLoading(true);
    setError(null);

    try {
      const [batchRes, studentsRes, syllabusRes] = await Promise.all([
        batchService.getBatchById(batchId),
        batchService.getBatchStudents(batchId),
        batchService.getBatchSyllabus(batchId)
      ]);

      const batchData = batchRes.data || batchRes;
      
      setBatch({
        ...batchData,
        startDate: batchData.startDate ? new Date(batchData.startDate).toLocaleDateString('en-GB') : 'N/A',
        endDate: batchData.endDate ? new Date(batchData.endDate).toLocaleDateString('en-GB') : 'N/A',
      });

      setStudents(studentsRes.data?.items || studentsRes.data || []);
      setSyllabus(syllabusRes.data?.items || syllabusRes.data || []);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || 'Something went wrong while fetching batch details.');
    } finally {
      setIsLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { batch, students, syllabus, isLoading, error, refetch: fetchAllData };
};

/* =========================================================
   HOOK 2: Completed Batches List (For TeacherCompletedBatches Page)
========================================================= */
const COMPLETED_COLOR_KEYS = ['slate', 'indigo', 'teal'];

export const useTeacherCompletedBatches = (initialPageSize = 10) => {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Service call: getMyCompletedBatches API call trigger karega
      const response = await batchService.getMyCompletedBatches(pageNumber, pageSize);
      const items = response.data?.items || [];
      
      const mappedBatches = items.map((item, index) => {
        const nextClassObj = item.nextClass;
        
        return {
          id: item.id,
          name: item.name,
          course: item.courseName,
          code: item.batchCode,
          students: item.studentCount,
          maxStudents: item.capacity,
          progress: item.courseProgress || 100, 
          attendance: item.attendancePercentage,
          startDate: item.startDate ? new Date(item.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          endDate: item.endDate ? new Date(item.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          
          nextClass: nextClassObj?.sessionDate ? new Date(nextClassObj.sessionDate).toLocaleDateString('en-GB') : 'Completed',
          nextClassTime: '-',
          classType: nextClassObj?.classType || 'Live', 
          
          pendingAssignments: item.pendingAssignmentCount || 0,
          pendingAssessments: item.pendingAssessmentCount || 0,
          status: item.status || 'Completed',
          color: COMPLETED_COLOR_KEYS[index % COMPLETED_COLOR_KEYS.length],
        };
      });

      setBatches(mappedBatches);
      setTotalPages(response.data?.totalPages || 1);
      setTotalCount(response.data?.totalCount || mappedBatches.length);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || 'Something went wrong while fetching completed batches.');
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  return {
    batches,
    isLoading,
    error,
    pageNumber,
    totalPages,
    totalCount,
    setPageNumber,
    refetch: fetchBatches
  };
};