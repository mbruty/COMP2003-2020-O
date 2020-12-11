const useDebouncer = <T>(
  callBack: (value: T) => void,
  delay: number
): ((value: T) => void) => {
  let timeout;
  const func = (value: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callBack(value);
    }, delay);
  };
  return func;
};

export default useDebouncer;
