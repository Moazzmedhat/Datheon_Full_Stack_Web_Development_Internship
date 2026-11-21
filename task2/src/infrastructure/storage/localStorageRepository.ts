import type { Task, Category } from "../../domain/entities";
import { VALID_CATEGORIES } from "../../domain/validator";
import type { ITaskRepository } from "./taskRepository";

export const STORAGE_KEY_V1 = "taskboard.tasks.v1";

export function isValidTask(item: unknown): item is Task {
  if (!item || typeof item !== "object") return false;
  const t = item as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    t.id.length > 0 &&
    typeof t.title === "string" &&
    t.title.length > 0 &&
    VALID_CATEGORIES.includes(t.category as Category) &&
    typeof t.due === "string" &&
    typeof t.done === "boolean" &&
    typeof t.created === "number"
  );
}

export class LocalStorageTaskRepository implements ITaskRepository {
  private readonly storageKey: string;

  constructor(storageKey: string = STORAGE_KEY_V1) {
    this.storageKey = storageKey;
  }

  load(): Task[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidTask);
    } catch {
      return [];
    }
  }

  save(tasks: Task[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.warn("LocalStorageTaskRepository.save failed:", error);
    }
  }

  exportJson(): string {
    const tasks = this.load();
    return JSON.stringify(tasks, null, 2);
  }

  importJson(jsonString: string): Task[] {
    const parsed: unknown = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid file format: root element must be an array of tasks.");
    }
    const validTasks = parsed.filter(isValidTask);
    this.save(validTasks);
    return validTasks;
  }

  subscribe(onChange: (tasks: Task[]) => void): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handler = (event: StorageEvent) => {
      if (event.key === this.storageKey) {
        onChange(this.load());
      }
    };

    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  }
}

export const defaultTaskRepository = new LocalStorageTaskRepository();
