import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { Task, StatusFilter, CategoryFilter, SortOrder, TaskStats } from "../types";
import { useTasks } from "../hooks/useTasks";
import { filterTasks, sortTasks } from "../domain/taskService";

interface TasksStateContextType {
  tasks: Task[];
  filteredAndSortedTasks: Task[];
  stats: TaskStats;
  editingTask: Task | null;
}

interface TasksActionsContextType {
  addTask: (title: string, category: Task["category"], due: string) => Task;
  updateTask: (
    id: string,
    title: string,
    category: Task["category"],
    due: string,
    done: boolean,
    created: number
  ) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  restoreTask: (task: Task) => void;
  clearCompleted: () => void;
  exportTasks: () => string;
  importTasks: (jsonString: string) => Task[];
  setEditingTask: (task: Task | null) => void;
}

interface TasksFilterContextType {
  statusFilter: StatusFilter;
  categoryFilter: CategoryFilter;
  searchQuery: string;
  sortOrder: SortOrder;
  setStatusFilter: (status: StatusFilter) => void;
  setCategoryFilter: (category: CategoryFilter) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
}

const TasksStateContext = createContext<TasksStateContextType | null>(null);
const TasksActionsContext = createContext<TasksActionsContextType | null>(null);
const TasksFilterContext = createContext<TasksFilterContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const {
    tasks,
    stats,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    restoreTask,
    clearCompleted,
    exportTasks,
    importTasks,
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("smart");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredAndSortedTasks = useMemo(
    () => sortTasks(filterTasks(tasks, statusFilter, categoryFilter, searchQuery), sortOrder),
    [tasks, statusFilter, categoryFilter, searchQuery, sortOrder]
  );

  const stateValue = useMemo<TasksStateContextType>(
    () => ({
      tasks,
      filteredAndSortedTasks,
      stats,
      editingTask,
    }),
    [tasks, filteredAndSortedTasks, stats, editingTask]
  );

  const actionsValue = useMemo<TasksActionsContextType>(
    () => ({
      addTask,
      updateTask,
      toggleTask,
      deleteTask: (id: string) => {
        if (editingTask?.id === id) {
          setEditingTask(null);
        }
        deleteTask(id);
      },
      restoreTask,
      clearCompleted,
      exportTasks,
      importTasks,
      setEditingTask,
    }),
    [addTask, updateTask, toggleTask, deleteTask, restoreTask, clearCompleted, exportTasks, importTasks, editingTask]
  );

  const filterValue = useMemo<TasksFilterContextType>(
    () => ({
      statusFilter,
      categoryFilter,
      searchQuery,
      sortOrder,
      setStatusFilter,
      setCategoryFilter,
      setSearchQuery,
      setSortOrder,
    }),
    [statusFilter, categoryFilter, searchQuery, sortOrder]
  );

  return (
    <TasksStateContext.Provider value={stateValue}>
      <TasksActionsContext.Provider value={actionsValue}>
        <TasksFilterContext.Provider value={filterValue}>
          {children}
        </TasksFilterContext.Provider>
      </TasksActionsContext.Provider>
    </TasksStateContext.Provider>
  );
}

export function useTasksState(): TasksStateContextType {
  const context = useContext(TasksStateContext);
  if (!context) {
    throw new Error("useTasksState must be used within a TaskProvider");
  }
  return context;
}

export function useTasksActions(): TasksActionsContextType {
  const context = useContext(TasksActionsContext);
  if (!context) {
    throw new Error("useTasksActions must be used within a TaskProvider");
  }
  return context;
}

export function useTasksFilters(): TasksFilterContextType {
  const context = useContext(TasksFilterContext);
  if (!context) {
    throw new Error("useTasksFilters must be used within a TaskProvider");
  }
  return context;
}
