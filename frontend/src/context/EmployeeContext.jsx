import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employeeEmail, setEmployeeEmail] = useState('');

  return (
    <EmployeeContext.Provider value={{ employeeEmail, setEmployeeEmail }}>
      {children}
    </EmployeeContext.Provider>
  );
};
