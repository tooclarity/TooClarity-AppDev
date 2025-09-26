// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    initialized: false,
  });

  useEffect(() => {
    // Simulate auth initialization (e.g., check local storage or API)
    setTimeout(() => {
      setAuth({ isAuthenticated: false, initialized: true }); // Default to unauthenticated
    }, 1000); // Simulate async initialization
  }, []);

  const logout = () => {
    setAuth({ isAuthenticated: false, initialized: true });
  };

  return (
    <AuthContext.Provider value={{ ...auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider; // Default export for the provider