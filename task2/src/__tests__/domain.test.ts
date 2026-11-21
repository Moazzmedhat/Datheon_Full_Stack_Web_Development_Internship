import { describe, it, expect } from "vitest";
import { validateTaskInput } from "../domain/validator";
import { calculateStats, filterTasks, sortTasks } from "../domain/taskService";
import { InMemoryTaskRepository } from "../infrastructure/storage/inMemoryRepository";
import type { Task } from "../domain/entities";

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

describe("validateTaskInput (Domain Validator)", () => {
  it("rejects empty title", () => {
    const res = validateTaskInput({ title: "", category: "Work" });
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("Title is required.");
  });

  it("rejects title with only whitespace", () => {
    const res = validateTaskInput({ title: "   ", category: "Work" });
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("Title is required.");
  });

  it("rejects title exceeding 120 chars", () => {
    const res = validateTaskInput({ title: "a".repeat(121), category: "Work" });
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("Title must be 120 characters or fewer.");
  });

  it("rejects invalid category", () => {
    const res = validateTaskInput({ title: "Valid title", category: "InvalidCat" });
    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/Category must be one of/);
  });

  it("rejects malformed due date", () => {
    const res = validateTaskInput({ title: "Valid title", category: "Work", due: "not-a-date" });
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("Due date must be in YYYY-MM-DD format.");
  });

  it("rejects invalid priority", () => {
    const res = validateTaskInput({ title: "Valid title", category: "Work", priority: "SuperUrgent" });
    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/Priority must be one of/);
  });

  it("accepts valid input with trimmed title and priority", () => {
    const res = validateTaskInput({
      title: "  Trimmed task  ",
      category: "Personal",
      due: "2025-10-15",
      priority: "Urgent",
    });
    expect(res.isValid).toBe(true);
    expect(res.data?.title).toBe("Trimmed task");
    expect(res.data?.category).toBe("Personal");
    expect(res.data?.due).toBe("2025-10-15");
    expect(res.data?.priority).toBe("Urgent");
  });
});

describe("calculateStats (Domain Service)", () => {
  it("calculates accurate stats for empty list", () => {
    const stats = calculateStats([]);
    expect(stats.total).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.active).toBe(0);
    expect(stats.percentage).toBe(0);
    expect(stats.byCategory.Work.total).toBe(0);
    expect(stats.byPriority.Medium).toBe(0);
  });

  it("calculates accurate percentage, breakdown and counts", () => {
    const tasks = [
      makeTask({ id: "1", done: true, category: "Work", priority: "Urgent" }),
      makeTask({ id: "2", done: false, category: "Work", priority: "Low" }),
      makeTask({ id: "3", done: true, category: "Personal", priority: "High" }),
      makeTask({ id: "4", done: false, category: "Study", priority: "Medium" }),
    ];
    const stats = calculateStats(tasks);
    expect(stats.total).toBe(4);
    expect(stats.completed).toBe(2);
    expect(stats.active).toBe(2);
    expect(stats.percentage).toBe(50);
    expect(stats.byCategory.Work.total).toBe(2);
    expect(stats.byCategory.Work.completed).toBe(1);
    expect(stats.byPriority.Urgent).toBe(1);
    expect(stats.byPriority.High).toBe(1);
  });
});

describe("filterTasks with Search Query & Priority", () => {
  const tasks = [
    makeTask({ id: "1", title: "Write documentation", category: "Work", priority: "High" }),
    makeTask({ id: "2", title: "Buy groceries", category: "Personal", priority: "Low" }),
    makeTask({ id: "3", title: "Read TypeScript book", category: "Study", priority: "Urgent" }),
  ];

  it("filters tasks by substring search", () => {
    const result = filterTasks(tasks, "All", "All", "doc");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("is case-insensitive", () => {
    const result = filterTasks(tasks, "All", "All", "GROCERIES");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by priority", () => {
    const urgent = filterTasks(tasks, "All", "All", "", "Urgent");
    expect(urgent).toHaveLength(1);
    expect(urgent[0].id).toBe("3");
  });
});

describe("sortTasks options", () => {
  const tasks = [
    makeTask({ id: "1", title: "Zebra", created: 100, priority: "Low" }),
    makeTask({ id: "2", title: "Apple", created: 200, priority: "Urgent" }),
  ];

  it("sorts by title ascending", () => {
    const sorted = sortTasks(tasks, "titleAsc");
    expect(sorted[0].title).toBe("Apple");
    expect(sorted[1].title).toBe("Zebra");
  });

  it("sorts by creation descending", () => {
    const sorted = sortTasks(tasks, "createdDesc");
    expect(sorted[0].id).toBe("2");
    expect(sorted[1].id).toBe("1");
  });

  it("sorts by priority descending (Urgent first)", () => {
    const sorted = sortTasks(tasks, "priorityDesc");
    expect(sorted[0].id).toBe("2"); // Urgent
    expect(sorted[1].id).toBe("1"); // Low
  });
});

describe("InMemoryTaskRepository (Repository Pattern)", () => {
  it("saves and loads tasks", () => {
    const repo = new InMemoryTaskRepository();
    expect(repo.load()).toEqual([]);

    const t = makeTask({ id: "mem-1" });
    repo.save([t]);
    expect(repo.load()).toEqual([t]);
  });

  it("exports and imports JSON", () => {
    const repo = new InMemoryTaskRepository();
    const t = makeTask({ id: "json-1" });
    repo.save([t]);

    const json = repo.exportJson();
    expect(typeof json).toBe("string");

    const repo2 = new InMemoryTaskRepository();
    repo2.importJson(json);
    expect(repo2.load()).toHaveLength(1);
    expect(repo2.load()[0].id).toBe("json-1");
  });

  it("notifies subscribers on change", () => {
    const repo = new InMemoryTaskRepository();
    let notifiedCount = 0;
    const unsub = repo.subscribe((tasks) => {
      notifiedCount += tasks.length;
    });

    repo.save([makeTask({ id: "s1" })]);
    expect(notifiedCount).toBe(1);

    unsub();
    repo.save([makeTask({ id: "s2" })]);
    expect(notifiedCount).toBe(1);
  });
});
