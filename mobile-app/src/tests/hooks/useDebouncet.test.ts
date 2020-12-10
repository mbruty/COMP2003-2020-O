import useDebouncer from "../../hooks/useDebouncer";

const delay = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
};

describe("useDebouncer tests", () => {
  it("Debounces with a 0ms delay", async () => {
    const debounceMe = jest.fn((value: string) => {});

    const debouncer = useDebouncer<string>(debounceMe, 0);
    debouncer("Hello world");
    await delay(0);
    expect(debounceMe).toBeCalledWith("Hello world");
  });
  it("Debounces with a 0ms delay", () => {
    const debounceMe = jest.fn((value: string) => {});

    const debouncer = useDebouncer<string>(debounceMe, 0);
    debouncer("Hello world");
    expect(debounceMe).toBeCalledTimes(0);
  });
  it("Debounces with a 100 milisecond delay", async () => {
    const debounceMe = jest.fn((value: string) => {});

    const debouncer = useDebouncer<string>(debounceMe, 100);
    debouncer("Hello world");
    await delay(100);
    expect(debounceMe).toBeCalledWith("Hello world");
  });
  it("Resets the delay when called again", async () => {
    const debounceMe = jest.fn((value: string) => {});

    const debouncer = useDebouncer<string>(debounceMe, 100);
    debouncer("Hello world");
    await delay(60);
    debouncer("Goodbye world");
    await delay(100);
    expect(debounceMe).toBeCalledWith("Goodbye world");
  });
  it("Doesn't call the function before the time", async () => {
    const debounceMe = jest.fn((value: string) => {});

    const debouncer = useDebouncer<string>(debounceMe, 100);
    debouncer("Hello world");
    await delay(99);
    expect(debounceMe).toBeCalledTimes(0);
  });
  it("Two debouncers don't trip over eachother", async () => {
    const debounceMe = jest.fn((value: string) => {});
    const debounceMeTwo = jest.fn((value: string) => {});

    const debouncer = useDebouncer<string>(debounceMe, 100);
    const debouncerTwo = useDebouncer<string>(debounceMeTwo, 100);
    debouncer("Hello world");
    await delay(100);
    expect(debounceMe).toBeCalledWith("Hello world");
    expect(debounceMeTwo).toBeCalledTimes(0);
  });
  it("Two debouncers don't trip over eachother when both called", async () => {
    const debounceMe = jest.fn((value: string) => {});
    const debounceMeTwo = jest.fn((value: string) => {});

    const debouncer = useDebouncer<string>(debounceMe, 100);
    const debouncerTwo = useDebouncer<string>(debounceMeTwo, 100);
    debouncer("Hello world");
    debouncerTwo("Goodbye world");
    await delay(100);
    expect(debounceMe).toBeCalledWith("Hello world");
    expect(debounceMeTwo).toBeCalledWith("Goodbye world");
  });
});
