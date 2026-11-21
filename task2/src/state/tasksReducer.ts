import type { Task } from "../types";

export type TasksAction =
  | { type: "ADD"; payload: Task }
  | { type: "UPDATE"; payload: Task }
  | { type: "TOGGLE"; payload: { id: string } }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "RESTORE"; payload: Task }
  | { type: "CLEAR_COMPLETED" }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "TOGGLE_TIMER"; payload: { id: string } }
  | { type: "TICK_TIMERS" }
  | { type: "RESET_TIMER"; payload: { id: string } };

export function tasksReducer(state: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];

    case "UPDATE":
      return state.map((t) =>
        t.id === action.payload.id
          ? {
              ...t,
              ...action.payload,
              created: t.created, // preserve original created
              timeSpent: action.payload.timeSpent ?? t.timeSpent ?? 0,
              isTimerRunning: action.payload.isTimerRunning ?? t.isTimerRunning ?? false,
            }
          : t
      );

    case "TOGGLE":
      return state.map((t) =>
        t.id === action.payload.id
          ? {
              ...t,
              done: !t.done,
              // If task is completed, pause its active timer
              isTimerRunning: !t.done ? false : t.isTimerRunning,
            }
          : t
      );

    case "DELETE":
      return state.filter((t) => t.id !== action.payload.id);

    case "RESTORE":
      if (state.some((t) => t.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];

    case "CLEAR_COMPLETED":
      return state.filter((t) => !t.done);

    case "SET_TASKS":
      return [...action.payload];

    case "TOGGLE_TIMER":
      return state.map((t) => {
        if (t.id === action.payload.id) {
          const willRun = !t.isTimerRunning;
          return { ...t, isTimerRunning: willRun };
        }
        // When starting a timer, pause other running timers for single-task focus
        return { ...t, isTimerRunning: false };
      });

    case "TICK_TIMERS":
      return state.map((t) =>
        t.isTimerRunning
          ? { ...t, timeSpent: (t.timeSpent ?? 0) + 1 }
          : t
      );

    case "RESET_TIMER":
      return state.map((t) =>
        t.id === action.payload.id
          ? { ...t, timeSpent: 0, isTimerRunning: false }
          : t
      );

    default:
      return state;
  }
}
