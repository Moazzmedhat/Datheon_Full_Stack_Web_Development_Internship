import type { Task } from "../../domain/entities";

export interface ITaskRepository {
  /** Loads all persisted tasks */
  load(): Promise<Task[]> | Task[];

  /** Persists task array */
  save(tasks: Task[]): Promise<void> | void;

  /** Exports tasks as a JSON string */
  exportJson(): string;

  /** Imports tasks from a JSON string, returns loaded tasks or throws */
  importJson(jsonString: string): Task[];

  /** Subscribes to external storage changes (e.g. cross-tab sync) */
  subscribe?(onChange: (tasks: Task[]) => void): () => void;
}
