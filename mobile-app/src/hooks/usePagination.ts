import { useState } from "react";

type Pagination = [
  value: number,
  incrementer: (step?: number) => void,
  decrementer: (step?: number) => void
];

const usePagination = (
  initial: number = 0,
  stepSize: number = 1,
  max: number = Number.MAX_SAFE_INTEGER
): Pagination => {
  const [value, setValue] = useState<number>(initial);

  const incrementPage = (step: number = stepSize) => {
    if (value + step <= max) {
      setValue(value + step);
    } else {
      setValue(max);
    }
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
