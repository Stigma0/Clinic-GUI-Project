import React, { useState, createContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);


  const roleNames = ['Doctor', 'Patient', 'Manager'];

  const getRoleName = () => {
    return roleNames[userRole];
  };

  return (
    <UserContext.Provider value={{ userRole, setUserRole, isAuthenticated, setIsAuthenticated, getRoleName, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
