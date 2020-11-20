import React, { useState } from "react";

const useToggle = (defaultVal: boolean) => {
  const [state, setState] = useState<boolean>(defaultVal);
  const toggle = () => {
    setState(!state);
  };
  return [state, toggle];
};

export default useToggle;
