import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadTasks, saveTasks } from "../../src/lib/storage";
import type { Task } from "../../src/types";

const VALID_TASK: Task = {
  id: "abc123",
  title: "Test task",
  category: "Work",
  due: "2024-12-31",
  done: false,
  created: 1700000000000,
};

function mockLocalStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
  };
}

describe("loadTasks", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockLocalStorage());
  });

  it("returns empty array when nothing stored", () => {
    expect(loadTasks()).toEqual([]);
  });

  it("returns stored tasks when valid", () => {
    localStorage.setItem("taskboard.tasks.v1", JSON.stringify([VALID_TASK]));
    const result = loadTasks();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("abc123");
  });

  it("returns empty array for corrupt JSON", () => {
    localStorage.setItem("taskboard.tasks.v1", "not-json{{{{");
    expect(loadTasks()).toEqual([]);
  });

  it("returns empty array when stored value is not an array", () => {
    localStorage.setItem("taskboard.tasks.v1", JSON.stringify({ id: "x" }));
    expect(loadTasks()).toEqual([]);
  });

  it("filters out malformed items and keeps valid ones", () => {
    const badItem = { id: 123, title: null }; // wrong types
    localStorage.setItem(
      "taskboard.tasks.v1",
      JSON.stringify([VALID_TASK, badItem])
    );
    const result = loadTasks();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("abc123");
  });

  it("filters out items with invalid category", () => {
    const badCat = { ...VALID_TASK, category: "Gaming" };
    localStorage.setItem("taskboard.tasks.v1", JSON.stringify([badCat]));
    expect(loadTasks()).toEqual([]);
  });

  it("returns empty array when localStorage.getItem throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => { throw new Error("SecurityError"); }),
      setItem: vi.fn(),
    });
    expect(loadTasks()).toEqual([]);
  });
});

describe("saveTasks", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockLocalStorage());
  });

  it("stores tasks successfully", () => {
    saveTasks([VALID_TASK]);
    const raw = localStorage.getItem("taskboard.tasks.v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
  });

  it("does not throw when localStorage.setItem throws (storage full)", () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(() => { throw new DOMException("QuotaExceededError"); }),
    });
    expect(() => saveTasks([VALID_TASK])).not.toThrow();
  });
});
