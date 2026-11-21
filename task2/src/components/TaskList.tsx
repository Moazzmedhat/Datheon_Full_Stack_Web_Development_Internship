import type { Task } from "../types";
import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";

type Props = {
  tasks: Task[];
  allTasksEmpty: boolean;
  editingId: string | null;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleTimer?: (id: string) => void;
  onResetTimer?: (id: string) => void;
  hideCompleted?: boolean;
  onToggleHideCompleted?: () => void;
};

export default function TaskList({
  tasks,
  allTasksEmpty,
  editingId,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleTimer,
  onResetTimer,
  hideCompleted = false,
  onToggleHideCompleted,
}: Props) {
  if (allTasksEmpty) {
    return (
      <EmptyState
        variant="no-tasks"
        hideCompleted={hideCompleted}
        onToggleHideCompleted={onToggleHideCompleted}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        variant="no-match"
        hideCompleted={hideCompleted}
        onToggleHideCompleted={onToggleHideCompleted}
      />
    );
  }

  const visibleTasks = hideCompleted ? tasks.filter((t) => !t.done) : tasks;

  return (
    <div className="task-list-container">
      <ul className="task-list" aria-label="Task list">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={editingId === task.id}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleTimer={onToggleTimer}
            onResetTimer={onResetTimer}
          />
        ))}
      </ul>

      {onToggleHideCompleted && (
        <div className="hide-completed-wrapper">
          <button
            type="button"
            className="btn-hide-completed"
            onClick={onToggleHideCompleted}
          >
            {hideCompleted ? "Show Completed Tasks ▾" : "Hide Completed Tasks ▴"}
          </button>
        </div>
      )}
    </div>
  );
}
