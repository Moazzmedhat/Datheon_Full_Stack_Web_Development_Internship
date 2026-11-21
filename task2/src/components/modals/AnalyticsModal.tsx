import type { TaskStats } from "../../types";
import { formatTimeSpent } from "../../lib/tasks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: TaskStats;
}

export default function AnalyticsModal({ isOpen, onClose, stats }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="analytics-modal-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon" aria-hidden="true">📊</span>
            <h2 id="analytics-modal-title" className="modal-title">Productivity Insights</h2>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="stats-grid stats-grid--5">
            <div className="stat-card">
              <span className="stat-card__number">{stats.total}</span>
              <span className="stat-card__label">Total Tasks</span>
            </div>
            <div className="stat-card stat-card--success">
              <span className="stat-card__number">{stats.completed}</span>
              <span className="stat-card__label">Completed</span>
            </div>
            <div className="stat-card stat-card--primary">
              <span className="stat-card__number">{stats.active}</span>
              <span className="stat-card__label">Active</span>
            </div>
            <div className="stat-card stat-card--danger">
              <span className="stat-card__number">{stats.overdue}</span>
              <span className="stat-card__label">Overdue</span>
            </div>
            <div className="stat-card stat-card--time">
              <span className="stat-card__number">{formatTimeSpent(stats.totalTimeSpent)}</span>
              <span className="stat-card__label">Time Tracked</span>
            </div>
          </div>

          <div className="analytics-section">
            <h3 className="analytics-section__title">Completion Rate</h3>
            <div className="analytics-progress">
              <div className="analytics-progress__bar" style={{ width: `${stats.percentage}%` }} />
            </div>
            <p className="analytics-progress__text">
              {stats.percentage}% of your current workload is complete.
            </p>
          </div>

          <div className="analytics-breakdowns">
            <div className="breakdown-card">
              <h4 className="breakdown-card__title">Tasks by Category</h4>
              <ul className="breakdown-list">
                {Object.entries(stats.byCategory).map(([cat, data]) => (
                  <li key={cat} className="breakdown-item">
                    <span className="breakdown-item__name">{cat}</span>
                    <span className="breakdown-item__count">
                      {data.completed}/{data.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="breakdown-card">
              <h4 className="breakdown-card__title">Tasks by Priority</h4>
              <ul className="breakdown-list">
                {Object.entries(stats.byPriority).map(([prio, count]) => (
                  <li key={prio} className="breakdown-item">
                    <span className={`priority-dot priority-${prio.toLowerCase()}`} aria-hidden="true" />
                    <span className="breakdown-item__name">{prio}</span>
                    <span className="breakdown-item__count">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
