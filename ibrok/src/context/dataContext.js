import React, { createContext, useContext, useState } from 'react';

const MainGroupContext = createContext();

export const MainGroupProvider = ({ children }) => {
  const [mainGroup, setMainGroup] = useState([]);

  const updateMainGroup = (newMainGroup) => {
    setMainGroup(newMainGroup);
  };

  return (
    <MainGroupContext.Provider value={{ mainGroup, updateMainGroup }}>
      {children}
    </MainGroupContext.Provider>
  );
};

export const useMainGroup = () => {
  const context = useContext(MainGroupContext);
  if (!context) {
    throw new Error('useMainGroup must be used within a MainGroupProvider');
  }
  return context;
};