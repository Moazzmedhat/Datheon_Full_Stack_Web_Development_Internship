import type { Task } from "../types";
import { defaultTaskRepository } from "../infrastructure/storage/localStorageRepository";

export function loadTasks(): Task[] {
  return defaultTaskRepository.load();
}

export function saveTasks(tasks: Task[]): void {
  defaultTaskRepository.save(tasks);
}
