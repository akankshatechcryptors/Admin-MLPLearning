import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

function ProtectedWrapper({ children, allowedRoles }) {
  const auth = useContext(AuthContext);
  const [isTokenValid, setIsTokenValid] = useState(true);
  
  // Check for token in localStorage/sessionStorage on page load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Check for token in localStorage
    const token = user?.token; // Check for token in localStorage
    //console.log(token)
    if (token) {
      // If token exists, set it in context
      setIsTokenValid(true);  // Token is valid, so allow access
    } else {
      setIsTokenValid(false);  // Token not found, mark as invalid
    }
  }, [auth]);

  // If there's no token, navigate to login page
  if (!isTokenValid) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is allowed to access the page
  if (allowedRoles && !allowedRoles.includes(auth.userType)) {
    return <Navigate to="/error-page" replace />;
  }

  return children;
}

export default ProtectedWrapper;
