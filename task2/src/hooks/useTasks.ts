import { useReducer, useEffect, useCallback, useMemo } from "react";
import type { Task, Category, Priority, TaskStats } from "../types";
import { tasksReducer } from "../state/tasksReducer";
import { calculateStats } from "../domain/taskService";
import type { ITaskRepository } from "../infrastructure/storage/taskRepository";
import { defaultTaskRepository } from "../infrastructure/storage/localStorageRepository";

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useTasks(repository: ITaskRepository = defaultTaskRepository) {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, () =>
    repository.load() as Task[]
  );

  // Persist to storage whenever tasks change
  useEffect(() => {
    repository.save(tasks);
  }, [tasks, repository]);

  // Subscribe to external storage changes (cross-tab synchronization)
  useEffect(() => {
    if (!repository.subscribe) return;
    const unsubscribe = repository.subscribe((updatedTasks) => {
      dispatch({ type: "SET_TASKS", payload: updatedTasks });
    });
    return unsubscribe;
  }, [repository]);

  // Interval timer tick for active tasks
  const hasRunningTimer = tasks.some((t) => t.isTimerRunning);
  useEffect(() => {
    if (!hasRunningTimer) return;
    const interval = setInterval(() => {
      dispatch({ type: "TICK_TIMERS" });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasRunningTimer]);

  const addTask = useCallback(
    (title: string, category: Category, due: string, priority: Priority = "Medium", estimatedMinutes: number = 0) => {
      const task: Task = {
        id: generateId(),
        title: title.trim(),
        category,
        due,
        done: false,
        created: Date.now(),
        priority,
        timeSpent: 0,
        isTimerRunning: false,
        estimatedMinutes: estimatedMinutes > 0 ? estimatedMinutes : 0,
      };
      dispatch({ type: "ADD", payload: task });
      return task;
    },
    []
  );

  const updateTask = useCallback(
    (
      id: string,
      title: string,
      category: Category,
      due: string,
      done: boolean,
      created: number,
      priority: Priority = "Medium",
      estimatedMinutes: number = 0
    ) => {
      dispatch({
        type: "UPDATE",
        payload: {
          id,
          title: title.trim(),
          category,
          due,
          done,
          created,
          priority,
          estimatedMinutes: estimatedMinutes > 0 ? estimatedMinutes : 0,
        },
      });
    },
    []
  );

  const duplicateTask = useCallback((id: string) => {
    const original = tasks.find((t) => t.id === id);
    if (!original) return;
    const cloned: Task = {
      ...original,
      id: generateId(),
      title: `${original.title} (Copy)`,
      done: false,
      created: Date.now(),
      timeSpent: 0,
      isTimerRunning: false,
    };
    dispatch({ type: "ADD", payload: cloned });
  }, [tasks]);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: "TOGGLE", payload: { id } });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE", payload: { id } });
  }, []);

  const restoreTask = useCallback((task: Task) => {
    dispatch({ type: "RESTORE", payload: task });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" });
  }, []);

  const toggleTimer = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_TIMER", payload: { id } });
  }, []);

  const resetTimer = useCallback((id: string) => {
    dispatch({ type: "RESET_TIMER", payload: { id } });
  }, []);

  const exportTasks = useCallback(() => {
    return repository.exportJson();
  }, [repository]);

  const importTasks = useCallback(
    (jsonString: string) => {
      const loaded = repository.importJson(jsonString);
      dispatch({ type: "SET_TASKS", payload: loaded });
      return loaded;
    },
    [repository]
  );

  const stats: TaskStats = useMemo(() => calculateStats(tasks), [tasks]);

  return {
    tasks,
    stats,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    duplicateTask,
    restoreTask,
    clearCompleted,
    toggleTimer,
    resetTimer,
    exportTasks,
    importTasks,
  };
}
