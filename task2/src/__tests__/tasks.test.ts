import { describe, it, expect } from "vitest";
import {
  todayString,
  tomorrowString,
  daysOverdue,
  isOverdue,
  dueLabel,
  filterTasks,
  sortTasks,
  progress,
} from "../../src/lib/tasks";
import type { Task } from "../../src/types";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "t1",
    title: "Test",
    category: "Work",
    due: "",
    done: false,
    created: 1000,
    ...overrides,
  };
}

describe("todayString / tomorrowString", () => {
  it("returns YYYY-MM-DD format for today", () => {
    expect(todayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("tomorrow is one day after today", () => {
    const today = new Date(todayString());
    const tomorrow = new Date(tomorrowString());
    const diff = tomorrow.getTime() - today.getTime();
    expect(diff).toBe(24 * 60 * 60 * 1000);
  });
});

describe("daysOverdue", () => {
  it("returns positive number for a past date", () => {
    // 2 days ago
    const past = new Date();
    past.setDate(past.getDate() - 2);
    const dateStr = past.toISOString().slice(0, 10);
    expect(daysOverdue(dateStr)).toBeGreaterThanOrEqual(2);
  });

  it("returns 0 for today", () => {
    expect(daysOverdue(todayString())).toBe(0);
  });

  it("returns negative for future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const dateStr = future.toISOString().slice(0, 10);
    expect(daysOverdue(dateStr)).toBeLessThan(0);
  });
});

describe("isOverdue", () => {
  it("returns false for tasks with no due date", () => {
    expect(isOverdue(makeTask({ due: "" }))).toBe(false);
  });

  it("returns false for completed tasks even if past due", () => {
    expect(isOverdue(makeTask({ due: "2000-01-01", done: true }))).toBe(false);
  });

  it("returns true for active tasks past their due date", () => {
    expect(isOverdue(makeTask({ due: "2000-01-01", done: false }))).toBe(true);
  });

  it("returns false for tasks due today", () => {
    expect(isOverdue(makeTask({ due: todayString(), done: false }))).toBe(false);
  });
});

describe("dueLabel", () => {
  it("returns empty string for empty due", () => {
    expect(dueLabel("")).toBe("");
  });

  it("returns 'Due today' for today", () => {
    expect(dueLabel(todayString())).toBe("Due today");
  });

  it("returns 'Due tomorrow' for tomorrow", () => {
    expect(dueLabel(tomorrowString())).toBe("Due tomorrow");
  });

  it("returns overdue message for past date", () => {
    const label = dueLabel("2000-01-01");
    expect(label).toMatch(/^Overdue by \d+ days?$/);
  });

  it("singular 'day' when overdue by 1", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const label = dueLabel(yesterday.toISOString().slice(0, 10));
    expect(label).toBe("Overdue by 1 day");
  });

  it("returns formatted date for future", () => {
    // Pick a far-future date that's definitely not today or tomorrow
    const label = dueLabel("2099-06-15");
    expect(label).not.toBe("");
    expect(label).not.toBe("Due today");
    expect(label).not.toBe("Due tomorrow");
    expect(label).not.toMatch(/^Overdue/);
  });
});

describe("filterTasks", () => {
  const tasks: Task[] = [
    makeTask({ id: "1", done: false, category: "Work" }),
    makeTask({ id: "2", done: true, category: "Personal" }),
    makeTask({ id: "3", done: false, category: "Study" }),
  ];

  it("All + All returns everything", () => {
    expect(filterTasks(tasks, "All", "All")).toHaveLength(3);
  });

  it("Active filter returns only active tasks", () => {
    const result = filterTasks(tasks, "Active", "All");
    expect(result.every((t) => !t.done)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("Completed filter returns only done tasks", () => {
    const result = filterTasks(tasks, "Completed", "All");
    expect(result.every((t) => t.done)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it("category filter works with status All", () => {
    expect(filterTasks(tasks, "All", "Work")).toHaveLength(1);
    expect(filterTasks(tasks, "All", "Study")).toHaveLength(1);
  });

  it("combined filters apply together", () => {
    // Active Work tasks
    expect(filterTasks(tasks, "Active", "Work")).toHaveLength(1);
    // Completed Work tasks
    expect(filterTasks(tasks, "Completed", "Work")).toHaveLength(0);
  });
});

describe("sortTasks", () => {
  it("active tasks come before completed", () => {
    const tasks: Task[] = [
      makeTask({ id: "done", done: true, due: "", created: 1 }),
      makeTask({ id: "active", done: false, due: "", created: 2 }),
    ];
    const sorted = sortTasks(tasks);
    expect(sorted[0].id).toBe("active");
    expect(sorted[1].id).toBe("done");
  });

  it("tasks with due dates come before no-due-date tasks", () => {
    const tasks: Task[] = [
      makeTask({ id: "noDue", due: "", created: 1 }),
      makeTask({ id: "hasDue", due: "2099-01-01", created: 2 }),
    ];
    const sorted = sortTasks(tasks);
    expect(sorted[0].id).toBe("hasDue");
    expect(sorted[1].id).toBe("noDue");
  });

  it("sorts by ascending due date", () => {
    const tasks: Task[] = [
      makeTask({ id: "later", due: "2099-06-01", created: 1 }),
      makeTask({ id: "sooner", due: "2099-01-01", created: 2 }),
    ];
    const sorted = sortTasks(tasks);
    expect(sorted[0].id).toBe("sooner");
    expect(sorted[1].id).toBe("later");
  });

  it("falls back to creation order when no due dates", () => {
    const tasks: Task[] = [
      makeTask({ id: "b", due: "", created: 200 }),
      makeTask({ id: "a", due: "", created: 100 }),
    ];
    const sorted = sortTasks(tasks);
    expect(sorted[0].id).toBe("a");
    expect(sorted[1].id).toBe("b");
  });

  it("does not mutate the original array", () => {
    const tasks: Task[] = [
      makeTask({ id: "1", due: "2099-06-01" }),
      makeTask({ id: "2", due: "2099-01-01" }),
    ];
    const original = [...tasks];
    sortTasks(tasks);
    expect(tasks[0].id).toBe(original[0].id);
  });
});

describe("progress", () => {
  it("returns [0, 0] for empty list", () => {
    expect(progress([])).toEqual([0, 0]);
  });

  it("counts correctly", () => {
    const tasks: Task[] = [
      makeTask({ id: "1", done: true }),
      makeTask({ id: "2", done: false }),
      makeTask({ id: "3", done: true }),
    ];
    expect(progress(tasks)).toEqual([2, 3]);
  });
});
