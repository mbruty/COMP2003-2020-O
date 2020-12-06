import { renderHook, act } from "@testing-library/react-hooks";
import usePagination from "../hooks/usePagination";

describe("Use pagination hook", () => {
  it("Increments page by 1", () => {
    const { result } = renderHook(() => usePagination());
    const [value, increment, decrement] = result.current;
    expect(value).toBe(0);
    act(() => increment());
    expect(result.current[0]).toBe(1);
  });

  it("Decrements page by 1", () => {
    const { result } = renderHook(() => usePagination(1));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(1);
    act(() => decrement());
    expect(result.current[0]).toBe(0);
  });
  it("Doesn't decrement page when page is 0", () => {
    const { result } = renderHook(() => usePagination());
    const [value, increment, decrement] = result.current;
    expect(value).toBe(0);
    act(() => decrement());
    expect(result.current[0]).toBe(0);
  });
  it("Increments page by a stepsize", () => {
    const { result } = renderHook(() => usePagination(0, 5));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(0);
    act(() => increment());
    expect(result.current[0]).toBe(5);
  });
  it("Increments page by a stepsize", () => {
    const { result } = renderHook(() => usePagination(0, 5));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(0);
    act(() => increment());
    expect(result.current[0]).toBe(5);
  });
  it("Decrements page by a stepsize", () => {
    const { result } = renderHook(() => usePagination(6, 5));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(6);
    act(() => decrement());
    expect(result.current[0]).toBe(1);
  });
  it("Decrements page by a stepsize and doesn't go below 0", () => {
    const { result } = renderHook(() => usePagination(2, 5));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(2);
    act(() => decrement());
    expect(result.current[0]).toBe(0);
  });
  it("Increments page by a given amount", () => {
    const { result } = renderHook(() => usePagination(0, 5));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(0);
    act(() => increment(2));
    expect(result.current[0]).toBe(2);
  });
  it("Decrements page by a given amount", () => {
    const { result } = renderHook(() => usePagination(10, 5));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(10);
    act(() => decrement(2));
    expect(result.current[0]).toBe(8);
  });
  it("Doesn't increment over the max", () => {
    const { result } = renderHook(() => usePagination(10, 5, 11));
    const [value, increment, decrement] = result.current;
    expect(value).toBe(10);
    act(() => increment());
    expect(result.current[0]).toBe(11);
  });
});
