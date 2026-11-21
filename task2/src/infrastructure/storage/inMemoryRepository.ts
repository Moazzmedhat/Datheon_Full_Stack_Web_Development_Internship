import type { Task } from "../../domain/entities";
import type { ITaskRepository } from "./taskRepository";

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[];
  private listeners: Set<(tasks: Task[]) => void> = new Set();

  constructor(initialTasks: Task[] = []) {
    this.tasks = [...initialTasks];
  }

  load(): Task[] {
    return [...this.tasks];
  }

  save(tasks: Task[]): void {
    this.tasks = [...tasks];
    this.listeners.forEach((listener) => listener([...this.tasks]));
  }

  exportJson(): string {
    return JSON.stringify(this.tasks, null, 2);
  }

  importJson(jsonString: string): Task[] {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid format");
    }
    this.tasks = parsed;
    this.listeners.forEach((listener) => listener([...this.tasks]));
    return [...this.tasks];
  }

  subscribe(onChange: (tasks: Task[]) => void): () => void {
    this.listeners.add(onChange);
    return () => {
      this.listeners.delete(onChange);
    };
  }
}
