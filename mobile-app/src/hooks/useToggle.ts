import { useState } from "react";

type Toggle = [value: boolean, setValue: () => void];
const useToggle = (defaultVal: boolean): Toggle => {
  const [state, setState] = useState<boolean>(defaultVal);
  const toggle = () => {
    setState(!state);
  };
  return [state, toggle];
};

export default useToggle;
