// src/data/adminMockData.js
export const adminData = {
  stats: [
    { label: 'Total Revenue', value: '₹ 4,25,000', change: '+12.5%', isPositive: true, icon: '💰', color: 'bg-green-100 text-green-600' },
    { label: 'Total Students', value: '1,248', change: '+8.2%', isPositive: true, icon: '👥', color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Teachers', value: '24', change: '+2', isPositive: true, icon: '👨‍🏫', color: 'bg-purple-100 text-purple-600' },
    { label: 'Pending Enrollments', value: '18', change: '-5', isPositive: false, icon: '⏳', color: 'bg-orange-100 text-orange-600' },
  ],
  revenueChart: [
    { month: 'Jan', amount: 40000 },
    { month: 'Feb', amount: 55000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 70000 },
    { month: 'May', amount: 85000 },
    { month: 'Jun', amount: 127000 },
  ],
  recentUsers: [
    { id: 1, name: 'Aarav Patel', email: 'aarav@example.com', role: 'Student', status: 'Active', joinedAt: '2 hours ago' },
    { id: 2, name: 'Prof. Verma', email: 'verma@nexvara.com', role: 'Teacher', status: 'Active', joinedAt: '5 hours ago' },
    { id: 3, name: 'Sneha Gupta', email: 'sneha@example.com', role: 'Student', status: 'Inactive', joinedAt: '1 day ago' },
    { id: 4, name: 'Rohan Das', email: 'rohan@example.com', role: 'Student', status: 'Active', joinedAt: '2 days ago' },
  ]
};