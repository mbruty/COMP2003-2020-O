import useToggle from "../hooks/useToggle";
import { renderHook, act } from "@testing-library/react-hooks";

describe("Use toggle hook", () => {
  it("Toggles from false to true", () => {
    const { result } = renderHook(() => useToggle(false));
    const [value, toggle] = result.current;
    expect(value).toBe(false);
    act(() => toggle());
    expect(result.current[0]).toBe(true);
  });
  
  it("Toggles from true to false", () => {
    const { result } = renderHook(() => useToggle(true));
    const [value, toggle] = result.current;
    expect(value).toBe(true);
    act(() => toggle());
    expect(result.current[0]).toBe(false);
  });
});
