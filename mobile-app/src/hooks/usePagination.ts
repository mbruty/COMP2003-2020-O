import { useState } from "react";

const usePagination = (initial: number = 0, stepSize: number = 1) => {
  const [value, setValue] = useState<number>(initial);

  const incrementPage = (step: number = stepSize) => {
    setValue(value + step);
  };

  const decrementPage = (step: number = stepSize) => {
    if (value - step > 0) {
      setValue(value - step);
    } else {
      setValue(0);
    }
  };

  return [value, incrementPage, decrementPage];
};

export default usePagination;