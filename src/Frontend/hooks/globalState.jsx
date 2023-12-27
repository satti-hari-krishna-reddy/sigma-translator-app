import { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [val, setVal] = useState('');
  const [pipelines,setPipelines] = useState([]);
  const [result, setResult] = useState('Enter your sigma rule...');

  return (
    <GlobalStateContext.Provider value={{pipelines, setPipelines, val, setVal, result, setResult }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);