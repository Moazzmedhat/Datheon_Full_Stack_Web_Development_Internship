export type Category = "Work" | "Personal" | "Study";

export type Priority = "Low" | "Medium" | "High" | "Urgent";

export type Task = {
  id: string;
  title: string;
  category: Category;
  due: string; // "YYYY-MM-DD" or ""
  done: boolean;
  created: number;
  priority?: Priority;
  timeSpent?: number; // Total seconds tracked on this task
  isTimerRunning?: boolean; // Whether stopwatch is currently active
  estimatedMinutes?: number; // Optional user-defined estimated minutes (defaults to 0)
};

export type StatusFilter = "All" | "Active" | "Completed";
export type CategoryFilter = "All" | Category;
export type PriorityFilter = "All" | Priority;
export type SortOrder = "smart" | "dueAsc" | "priorityDesc" | "createdDesc" | "titleAsc";

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  percentage: number;
  totalTimeSpent: number; // in seconds
  byCategory: Record<Category, { total: number; completed: number }>;
  byPriority: Record<Priority, number>;
}
