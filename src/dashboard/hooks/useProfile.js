import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';

export function useProfile(role, userId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      let data;
      if (role === 'student') data = await profileService.getStudentProfile(userId);
      else if (role === 'teacher') data = await profileService.getTeacherProfile(userId);
      else data = { data: { userName: 'Admin User', email: 'admin@nexvara.com' } }; 
      setProfileData(data.data || data); 
    } catch (err) {
      setError(err.message || 'Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  }, [role, userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (formData) => {
    const safeFormData = formData || {};
    if (!userId) {
      setError("User ID is missing. Cannot update profile.");
      return { success: false };
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      let response;
      if (role === 'student') response = await profileService.updateStudentProfile(userId, safeFormData);
      else if (role === 'teacher') response = await profileService.updateTeacherProfile(userId, safeFormData);
      else response = { message: 'Admin profile updated successfully.' };

      setSuccess(response.message || 'Profile updated successfully!');
      await fetchProfile(); 
      return { success: true };
    } catch (err) {
      setError(err.message || 'Something went wrong while updating.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, profileData, updateProfile, fetchProfile };
}