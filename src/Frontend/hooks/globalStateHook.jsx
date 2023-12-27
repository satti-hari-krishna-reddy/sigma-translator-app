import { useGlobalState } from './globalState';

export const useDropdownState = () => {
  const { pipelines, setPipelines, val, setVal, result, setResult} = useGlobalState();

  return { pipelines, setPipelines, val, setVal, result, setResult };
};

