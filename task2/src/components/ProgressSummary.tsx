type Props = {
  completed: number;
  total: number;
};

export default function ProgressSummary({ completed, total }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="progress-summary">
      <div className="progress-text">
        <span>
          <strong>{completed}</strong> of <strong>{total}</strong> task
          {total !== 1 ? "s" : ""} completed
        </span>
        <span className="progress-percent">{percent}%</span>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${completed} of ${total} tasks completed`}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
