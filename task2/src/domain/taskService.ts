import type { Task, StatusFilter, CategoryFilter, PriorityFilter, Priority, Category, SortOrder, TaskStats } from "./entities";

/** Returns "YYYY-MM-DD" for today in local time */
export function todayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Returns "YYYY-MM-DD" for tomorrow in local time */
export function tomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns the number of whole days between dateStr and today (local time).
 * Positive = dateStr is in the past (overdue).
 */
export function daysOverdue(dateStr: string): number {
  if (!dateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  const diff = today.getTime() - due.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(task: Task): boolean {
  if (!task.due || task.done) return false;
  return daysOverdue(task.due) > 0;
}

/** Human-readable due label computed in local time */
export function dueLabel(due: string): string {
  if (!due) return "";
  const today = todayString();
  const tomorrow = tomorrowString();
  if (due === today) return "Due today";
  if (due === tomorrow) return "Due tomorrow";
  const days = daysOverdue(due);
  if (days > 0) return `Overdue by ${days} day${days === 1 ? "" : "s"}`;
  
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function filterTasks(
  tasks: Task[],
  status: StatusFilter,
  category: CategoryFilter,
  searchQuery: string = "",
  priority: PriorityFilter = "All"
): Task[] {
  const query = searchQuery.trim().toLowerCase();

  return tasks.filter((t) => {
    const statusMatch =
      status === "All" ||
      (status === "Active" && !t.done) ||
      (status === "Completed" && t.done);

    const categoryMatch = category === "All" || t.category === category;

    const priorityMatch =
      priority === "All" || (t.priority ?? "Medium") === priority;

    const searchMatch = !query || t.title.toLowerCase().includes(query);

    return statusMatch && categoryMatch && priorityMatch && searchMatch;
  });
}

const PRIORITY_WEIGHT: Record<Priority, number> = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Sorts tasks based on user preference or smart default
 * Default smart sort: active before completed, then by due date asc (no-due-date last), then created asc
 */
export function sortTasks(tasks: Task[], order: SortOrder = "smart"): Task[] {
  return [...tasks].sort((a, b) => {
    if (order === "dueAsc") {
      if (a.due && !b.due) return -1;
      if (!a.due && b.due) return 1;
      if (a.due && b.due && a.due !== b.due) return a.due.localeCompare(b.due);
      return a.created - b.created;
    }

    if (order === "priorityDesc") {
      const aWeight = PRIORITY_WEIGHT[a.priority ?? "Medium"];
      const bWeight = PRIORITY_WEIGHT[b.priority ?? "Medium"];
      if (aWeight !== bWeight) return bWeight - aWeight;
      return a.created - b.created;
    }

    if (order === "createdDesc") {
      return b.created - a.created;
    }

    if (order === "titleAsc") {
      return a.title.localeCompare(b.title);
    }

    // Default "smart" order:
    // Completed last
    if (a.done !== b.done) return a.done ? 1 : -1;

    const aHasDue = Boolean(a.due);
    const bHasDue = Boolean(b.due);

    // No-due-date tasks go after due-date tasks
    if (aHasDue && !bHasDue) return -1;
    if (!aHasDue && bHasDue) return 1;

    // Both have due date -> sort ascending
    if (aHasDue && bHasDue) {
      if (a.due < b.due) return -1;
      if (a.due > b.due) return 1;
    }

    // Fall back to creation order
    return a.created - b.created;
  });
}

export function formatTimeSpent(seconds: number = 0): string {
  if (!seconds || seconds <= 0) return "0s";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  }
  return `${secs}s`;
}

/** Returns detailed task stats */
export function calculateStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const active = total - completed;
  const overdue = tasks.filter((t) => isOverdue(t)).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const totalTimeSpent = tasks.reduce((sum, t) => sum + (t.timeSpent ?? 0), 0);

  const byCategory: Record<Category, { total: number; completed: number }> = {
    Work: { total: 0, completed: 0 },
    Personal: { total: 0, completed: 0 },
    Study: { total: 0, completed: 0 },
  };

  const byPriority: Record<Priority, number> = {
    Urgent: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  tasks.forEach((t) => {
    if (byCategory[t.category]) {
      byCategory[t.category].total += 1;
      if (t.done) byCategory[t.category].completed += 1;
    }
    const prio = t.priority ?? "Medium";
    if (byPriority[prio] !== undefined) {
      byPriority[prio] += 1;
    }
  });

  return { total, completed, active, overdue, percentage, totalTimeSpent, byCategory, byPriority };
}

/** Backward-compatible progress helper: returns [completed count, total count] */
export function progress(tasks: Task[]): [number, number] {
  const done = tasks.filter((t) => t.done).length;
  return [done, tasks.length];
}
