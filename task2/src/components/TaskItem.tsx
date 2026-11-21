import type { Task } from "../types";
import { dueLabel, isOverdue, formatTimeSpent } from "../lib/tasks";

type Props = {
  task: Task;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleTimer?: (id: string) => void;
  onResetTimer?: (id: string) => void;
};

const CATEGORY_CLASS: Record<string, string> = {
  Work: "cat-work",
  Personal: "cat-personal",
  Study: "cat-study",
};

export default function TaskItem({
  task,
  isEditing,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleTimer,
  onResetTimer,
}: Props) {
  const label = dueLabel(task.due);
  const overdue = isOverdue(task);
  const priority = task.priority ?? "Medium";
  const timeSpent = task.timeSpent ?? 0;
  const isTimerRunning = Boolean(task.isTimerRunning);

  return (
    <li
      className={[
        "task-item",
        task.done ? "task-item--done" : "",
        isEditing ? "task-item--editing" : "",
        isTimerRunning ? "task-item--tracking" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label className="task-checkbox-label">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.done ? "active" : "complete"}`}
        />
        <span className="checkbox-visual" aria-hidden="true" />
      </label>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          <span
            className={`category-badge ${CATEGORY_CLASS[task.category] ?? ""}`}
          >
            {task.category}
          </span>

          {priority && (
            <span className={`priority-badge priority-${priority.toLowerCase()}`}>
              {priority}
            </span>
          )}

          {label && (
            <span
              className={`due-label${overdue && !task.done ? " due-label--overdue" : ""}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {label}
            </span>
          )}

          {task.estimatedMinutes !== undefined && task.estimatedMinutes > 0 && (
            <span className="est-badge" title="User estimated duration">
              ⏱️ {task.estimatedMinutes}m
            </span>
          )}

          {/* Time spent indicator */}
          {onToggleTimer && (
            <div className="task-timer-group">
              <button
                type="button"
                className={`btn-timer${isTimerRunning ? " btn-timer--running" : ""}`}
                onClick={() => onToggleTimer(task.id)}
                aria-label={isTimerRunning ? `Pause timer for "${task.title}"` : `Start timer for "${task.title}"`}
                title={isTimerRunning ? "Pause timer" : "Start timer"}
              >
                {isTimerRunning ? (
                  <>
                    <span className="pulse-dot" aria-hidden="true" />
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    <span className="timer-display">{formatTimeSpent(timeSpent)}</span>
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span className="timer-display">{formatTimeSpent(timeSpent)}</span>
                  </>
                )}
              </button>
              {timeSpent > 0 && !isTimerRunning && onResetTimer && (
                <button
                  type="button"
                  className="btn-icon btn-reset-timer"
                  onClick={() => onResetTimer(task.id)}
                  aria-label={`Reset time spent for "${task.title}"`}
                  title="Reset time"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="task-actions">
        {onDuplicate && (
          <button
            type="button"
            className="btn btn-icon btn-duplicate"
            onClick={() => onDuplicate(task.id)}
            aria-label={`Duplicate task: ${task.title}`}
            title="Duplicate"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              width="15"
              height="15"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        )}

        <button
          type="button"
          className="btn btn-icon btn-edit"
          onClick={() => onEdit(task)}
          disabled={isEditing}
          aria-label={`Edit task: ${task.title}`}
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            width="15"
            height="15"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          type="button"
          className="btn btn-icon btn-delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task: ${task.title}`}
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            width="15"
            height="15"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </li>
  );
}
