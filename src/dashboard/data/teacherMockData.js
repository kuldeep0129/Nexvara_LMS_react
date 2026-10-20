// src/data/teacherMockData.js
export const teacherData = {
  stats: [
    { label: 'Active Batches', value: '4', icon: '👨‍🏫', color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Students', value: '128', icon: '👥', color: 'bg-purple-100 text-purple-600' },
    { label: 'Pending Grading', value: '12', icon: '📝', color: 'bg-orange-100 text-orange-600' },
    { label: 'Upcoming Classes', value: '2', icon: '🎥', color: 'bg-green-100 text-green-600' },
  ],
  upcomingClasses: [
    { id: 1, topic: 'React State Management', batch: 'FS-2024-A', time: 'Today, 4:00 PM', platform: 'Google Meet' },
    { id: 2, topic: 'Database Normalization', batch: 'DB-2024-C', time: 'Tomorrow, 10:00 AM', platform: 'Zoom' },
  ],
  pendingGrading: [
    { id: 101, studentName: 'Aarav Patel', assessment: 'React Hooks Assessment', submittedAt: '2 hours ago', maxMarks: 100 },
    { id: 102, studentName: 'Sneha Gupta', assessment: 'CSS Layout Quiz', submittedAt: '5 hours ago', maxMarks: 50 },
    { id: 103, studentName: 'Rohan Verma', assessment: 'JavaScript Basics', submittedAt: '1 day ago', maxMarks: 100 },
  ]
};