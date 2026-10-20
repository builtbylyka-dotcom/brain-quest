import { act, renderHook } from "@testing-library/react";
import { useTimer } from "./useTimer";

function setHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout", "performance", "Date"] });
    setHidden(false);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down and fires onExpire exactly once", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useTimer({ duration: 3, running: true, resetKey: "q1", onExpire }));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.read()).toBeCloseTo(2, 0);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.read()).toBe(0);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it("stops immediately when running turns false", () => {
    const onExpire = vi.fn();
    const { result, rerender } = renderHook(({ running }) => useTimer({ duration: 20, running, resetKey: "q1", onExpire }), {
      initialProps: { running: true },
    });
    act(() => vi.advanceTimersByTime(2000));
    rerender({ running: false });
    const frozen = result.current.read();
    act(() => vi.advanceTimersByTime(30000));
    expect(result.current.read()).toBe(frozen);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it("resets for each new question key", () => {
    const { result, rerender } = renderHook(({ k }) => useTimer({ duration: 20, running: true, resetKey: k, onExpire: () => {} }), {
      initialProps: { k: "q1" },
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.read()).toBeLessThan(16);
    rerender({ k: "q2" });
    expect(result.current.read()).toBe(20);
  });

  it("does not lose time while the tab is hidden", () => {
    const { result } = renderHook(() => useTimer({ duration: 20, running: true, resetKey: "q1", onExpire: () => {} }));
    act(() => vi.advanceTimersByTime(1000));
    const before = result.current.read();
    act(() => setHidden(true));
    act(() => vi.advanceTimersByTime(10000));
    expect(result.current.read()).toBeCloseTo(before, 1);
    act(() => setHidden(false));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.read()).toBeGreaterThan(before - 1.3);
  });

  it("cleans up its interval on unmount, leaving no timers behind", () => {
    const onExpire = vi.fn();
    const { unmount } = renderHook(() => useTimer({ duration: 5, running: true, resetKey: "q1", onExpire }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(10000));
    expect(onExpire).not.toHaveBeenCalled();
  });

  it("never runs more than one interval across re-renders", () => {
    const { rerender } = renderHook(() => useTimer({ duration: 20, running: true, resetKey: "q1", onExpire: () => {} }));
    for (let i = 0; i < 5; i++) rerender();
    expect(vi.getTimerCount()).toBe(1);
  });
});
