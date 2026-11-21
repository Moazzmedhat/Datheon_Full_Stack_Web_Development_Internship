import type { Category, Priority } from "./entities";

export const VALID_CATEGORIES: readonly Category[] = ["Work", "Personal", "Study"] as const;
export const VALID_PRIORITIES: readonly Priority[] = ["Low", "Medium", "High", "Urgent"] as const;

export interface ValidationSuccess<T> {
  isValid: true;
  data: T;
  error?: undefined;
}

export interface ValidationError {
  isValid: false;
  data?: undefined;
  error: string;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

export interface TaskInput {
  title: string;
  category: Category;
  due?: string;
  priority?: Priority;
  estimatedMinutes?: number;
}

export function validateTaskInput(input: {
  title: string;
  category: string;
  due?: string;
  priority?: string;
  estimatedMinutes?: number | string;
}): ValidationResult<TaskInput> {
  const trimmedTitle = (input.title ?? "").trim();

  if (!trimmedTitle) {
    return {
      isValid: false,
      error: "Title is required.",
    };
  }

  if (trimmedTitle.length > 120) {
    return {
      isValid: false,
      error: "Title must be 120 characters or fewer.",
    };
  }

  if (!VALID_CATEGORIES.includes(input.category as Category)) {
    return {
      isValid: false,
      error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    };
  }

  const due = input.due ? input.due.trim() : "";
  if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    return {
      isValid: false,
      error: "Due date must be in YYYY-MM-DD format.",
    };
  }

  let priority: Priority = "Medium";
  if (input.priority) {
    if (!VALID_PRIORITIES.includes(input.priority as Priority)) {
      return {
        isValid: false,
        error: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
      };
    }
    priority = input.priority as Priority;
  }

  const rawEst = typeof input.estimatedMinutes === "string" ? parseInt(input.estimatedMinutes, 10) : input.estimatedMinutes;
  const estimatedMinutes = typeof rawEst === "number" && !isNaN(rawEst) && rawEst > 0 ? Math.floor(rawEst) : 0;

  return {
    isValid: true,
    data: {
      title: trimmedTitle,
      category: input.category as Category,
      due,
      priority,
      estimatedMinutes,
    },
  };
}
