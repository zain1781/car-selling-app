import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const token = localStorage.getItem('jwtToken');

  // Debug: Log the required roles
  console.log('Required roles:', requiredRoles);

  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Debug: Log the decoded token and user role
    console.log('Decoded token:', decoded);
    console.log('User role:', decoded.role);
    console.log('Role check:', requiredRoles.includes(decoded.role));

    if (!requiredRoles.includes(decoded.role)) {
      console.log(`Access denied: User role "${decoded.role}" not in required roles:`, requiredRoles);
      return <Navigate to="/" replace />;
    }

    // Check token expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.log('Token expired, redirecting to login');
      localStorage.clear(); // Clear all stored data
      return <Navigate to="/login" replace />;
    }

    console.log('Access granted to protected route');
    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.clear(); // Clear all stored data
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
