// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // 1. Agar token nahi hai, toh login page (home) par bhej do
  if (!token || !user) {
    return <Navigate to="/" replace />; 
  }

  // 2. Agar allowedRoles diye gaye hain aur user ka role match nahi karta
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = user.roles?.some(role => allowedRoles.includes(role));
    
    if (!hasAccess) {
      // Agar access nahi hai, toh uske actual role ke dashboard par redirect karein
      if (user.roles?.includes('SuperAdmin') || user.roles?.includes('Admin')) {
        return <Navigate to="/admin" replace />;
      } else if (user.roles?.includes('Trainer')) {
        return <Navigate to="/teacher" replace />;
      } else {
        return <Navigate to="/student" replace />;
      }
    }
  }

  return <Outlet />;
}