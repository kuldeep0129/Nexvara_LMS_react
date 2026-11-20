import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/courseService'; // Path check kar lena

export const useCourseCurriculum = (courseId) => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Naya State: Syllabus Add karne ke liye loading state
  const [isAdding, setIsAdding] = useState(false);

  // 1. Fetch Course Data
  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await courseService.getCourseCurriculum(courseId);
      // Response structure: { data: {...}, success: true }
      if (response.success && response.data) {
        setCourseData(response.data);
      } else {
        throw new Error(response.message || 'Failed to load data');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while fetching course details.');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // 2. Add Syllabus Data
const addSyllabus = async (formData) => {
    setIsAdding(true);
    try {
      const payload = {
        courseId: Number(courseId),
        title: formData.title,
        description: formData.description,
        displayOrder: Number(formData.displayOrder),
      };
      
      console.log("Sending Payload:", payload); // Yeh check karein
      
      await courseService.createSyllabus(payload);
      await fetchCourse(); 
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsAdding(false);
    }
  };

  // Load data on initial render or courseId change
  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // useCourseCurriculum.js ke andar add karein
  const [togglingSyllabusId, setTogglingSyllabusId] = useState(null);

  const toggleSyllabusStatus = async (syllabusId) => {
    setTogglingSyllabusId(syllabusId);
    try {
      await courseService.updateSyllabusStatus(syllabusId);
      await fetchCourse(); // Data refetch karein
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setTogglingSyllabusId(null);
    }
  };

  // return statement me add karein:
  return { 
    courseData, isLoading, error, 
    addSyllabus, isAdding, 
    toggleSyllabusStatus, togglingSyllabusId, // <--- Yeh add karein
    refetch: fetchCourse 
  };
  
};