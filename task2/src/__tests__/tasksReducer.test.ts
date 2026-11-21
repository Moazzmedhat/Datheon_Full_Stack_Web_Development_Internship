import { describe, it, expect } from "vitest";
import { tasksReducer } from "../../src/state/tasksReducer";
import type { Task } from "../../src/types";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "t1",
    title: "Default task",
    category: "Work",
    due: "",
    done: false,
    created: 1000,
    ...overrides,
  };
}

describe("tasksReducer", () => {
  describe("ADD", () => {
    it("adds a task to an empty list", () => {
      const task = makeTask();
      const result = tasksReducer([], { type: "ADD", payload: task });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(task);
    });

    it("appends to existing list", () => {
      const existing = makeTask({ id: "existing" });
      const newTask = makeTask({ id: "new" });
      const result = tasksReducer([existing], { type: "ADD", payload: newTask });
      expect(result).toHaveLength(2);
      expect(result[1].id).toBe("new");
    });
  });

  describe("UPDATE", () => {
    it("updates a matching task", () => {
      const original = makeTask({ id: "t1", title: "Old title", created: 999 });
      const updated = makeTask({ id: "t1", title: "New title", created: 0 });
      const result = tasksReducer([original], { type: "UPDATE", payload: updated });
      expect(result[0].title).toBe("New title");
    });

    it("preserves the original created timestamp", () => {
      const original = makeTask({ id: "t1", created: 42 });
      const payload = makeTask({ id: "t1", created: 0 });
      const result = tasksReducer([original], { type: "UPDATE", payload });
      expect(result[0].created).toBe(42);
    });

    it("does not affect other tasks", () => {
      const t1 = makeTask({ id: "t1" });
      const t2 = makeTask({ id: "t2", title: "Other" });
      const result = tasksReducer([t1, t2], {
        type: "UPDATE",
        payload: makeTask({ id: "t1", title: "Updated" }),
      });
      expect(result[1].title).toBe("Other");
    });
  });

  describe("TOGGLE", () => {
    it("flips done from false to true", () => {
      const task = makeTask({ done: false });
      const result = tasksReducer([task], { type: "TOGGLE", payload: { id: "t1" } });
      expect(result[0].done).toBe(true);
    });

    it("flips done from true to false", () => {
      const task = makeTask({ done: true });
      const result = tasksReducer([task], { type: "TOGGLE", payload: { id: "t1" } });
      expect(result[0].done).toBe(false);
    });

    it("only toggles the matching task", () => {
      const t1 = makeTask({ id: "t1", done: false });
      const t2 = makeTask({ id: "t2", done: false });
      const result = tasksReducer([t1, t2], { type: "TOGGLE", payload: { id: "t1" } });
      expect(result[0].done).toBe(true);
      expect(result[1].done).toBe(false);
    });
  });

  describe("DELETE", () => {
    it("removes the specified task", () => {
      const t1 = makeTask({ id: "t1" });
      const t2 = makeTask({ id: "t2" });
      const result = tasksReducer([t1, t2], { type: "DELETE", payload: { id: "t1" } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("t2");
    });

    it("returns empty list when last task deleted", () => {
      const task = makeTask();
      const result = tasksReducer([task], { type: "DELETE", payload: { id: "t1" } });
      expect(result).toEqual([]);
    });
  });

  describe("CLEAR_COMPLETED", () => {
    it("removes all done tasks", () => {
      const tasks: Task[] = [
        makeTask({ id: "t1", done: true }),
        makeTask({ id: "t2", done: false }),
        makeTask({ id: "t3", done: true }),
      ];
      const result = tasksReducer(tasks, { type: "CLEAR_COMPLETED" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("t2");
    });

    it("returns unchanged list when no completed tasks", () => {
      const tasks: Task[] = [
        makeTask({ id: "t1", done: false }),
        makeTask({ id: "t2", done: false }),
      ];
      const result = tasksReducer(tasks, { type: "CLEAR_COMPLETED" });
      expect(result).toHaveLength(2);
    });
  });

  describe("unknown action", () => {
    it("returns state unchanged for unknown action type", () => {
      const task = makeTask();
      // @ts-expect-error – testing runtime fallback
      const result = tasksReducer([task], { type: "UNKNOWN_ACTION" });
      expect(result).toHaveLength(1);
    });
  });
});
