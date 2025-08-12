import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

function ProtectedWrapper({ children }) {
  const auth = useContext(AuthContext);

  if (!auth?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedWrapper;
