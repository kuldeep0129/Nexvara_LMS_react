// src/data/studentMockData.js
export const studentData = {
  stats: [
    { label: 'Enrolled Courses', value: '3', icon: '📚', color: 'bg-blue-100 text-blue-600' },
    { label: 'Live Classes', value: '2', icon: '🎥', color: 'bg-purple-100 text-purple-600' },
    { label: 'Certificates', value: '1', icon: '🏆', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Assignments Due', value: '1', icon: '📝', color: 'bg-red-100 text-red-600' },
  ],
  courses: [
    { id: 1, title: 'Full Stack Web Development', progress: 65, nextClass: 'Today, 4:00 PM', batch: 'FS-2024-A' },
    { id: 2, title: 'React Native Mobile Apps', progress: 30, nextClass: 'Tomorrow, 10:00 AM', batch: 'RN-2024-B' },
    { id: 3, title: 'UI/UX Design Masterclass', progress: 90, nextClass: 'Friday, 2:00 PM', batch: 'UI-2024-C' },
  ],
  recentGrades: [
    { id: 1, title: 'React Components Assessment', score: 85, total: 100, status: 'Passed' },
    { id: 2, title: 'CSS Layout Quiz', score: 45, total: 50, status: 'Passed' },
    { id: 3, title: 'JavaScript Basics', score: 30, total: 100, status: 'Failed' },
  ]
};