type Props = {
  /** "no-tasks" = nothing exists; "no-match" = filters hide everything */
  variant: "no-tasks" | "no-match";
  onToggleHideCompleted?: () => void;
  hideCompleted?: boolean;
  hasCompleted?: boolean;
};

export default function EmptyState({
  variant,
  onToggleHideCompleted,
  hideCompleted = false,
}: Props) {
  if (variant === "no-tasks") {
    return (
      <div className="empty-state empty-state--styled" role="status" aria-live="polite">
        <div className="empty-state__circle" aria-hidden="true">
          <div className="empty-illustration-card">
            <div className="empty-card-header" />
            <div className="empty-card-line empty-card-line--1" />
            <div className="empty-card-line empty-card-line--2" />
            <div className="empty-card-line empty-card-line--3" />
          </div>
        </div>
        <h3 className="empty-state__heading">Nothing here yet</h3>
        <p className="empty-state__body">
          Click the input box above to add a new task
        </p>

        {onToggleHideCompleted && (
          <button
            type="button"
            className="btn-hide-completed"
            onClick={onToggleHideCompleted}
          >
            {hideCompleted ? "Show Completed Tasks ▾" : "Hide Completed Tasks ▴"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="empty-state empty-state--styled" role="status" aria-live="polite">
      <div className="empty-state__circle" aria-hidden="true">
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h3 className="empty-state__heading">No matching tasks</h3>
      <p className="empty-state__body">
        Try changing the status or category filter.
      </p>

      {onToggleHideCompleted && (
        <button
          type="button"
          className="btn-hide-completed"
          onClick={onToggleHideCompleted}
        >
          {hideCompleted ? "Show Completed Tasks ▾" : "Hide Completed Tasks ▴"}
        </button>
      )}
    </div>
  );
}
