import type { StatusFilter, CategoryFilter, PriorityFilter, SortOrder } from "../types";

type Props = {
  statusFilter: StatusFilter;
  categoryFilter: CategoryFilter;
  onStatusChange: (s: StatusFilter) => void;
  onCategoryChange: (c: CategoryFilter) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  priorityFilter?: PriorityFilter;
  onPriorityChange?: (p: PriorityFilter) => void;
  sortOrder?: SortOrder;
  onSortOrderChange?: (order: SortOrder) => void;
};

const STATUS_OPTIONS: StatusFilter[] = ["All", "Active", "Completed"];
const CATEGORY_OPTIONS: CategoryFilter[] = ["All", "Work", "Personal", "Study"];
const PRIORITY_OPTIONS: PriorityFilter[] = ["All", "Urgent", "High", "Medium", "Low"];

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: "Smart Order", value: "smart" },
  { label: "Due Date (Soonest)", value: "dueAsc" },
  { label: "Priority (Urgent first)", value: "priorityDesc" },
  { label: "Newest First", value: "createdDesc" },
  { label: "Title (A–Z)", value: "titleAsc" },
];

export default function FilterBar({
  statusFilter,
  categoryFilter,
  onStatusChange,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  sortOrder,
  onSortOrderChange,
}: Props) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      <div className="filter-bar-top">
        {onSearchChange !== undefined && (
          <div className="filter-search">
            <label htmlFor="task-search" className="filter-label">
              Search
            </label>
            <input
              id="task-search"
              type="search"
              className="form-input search-input"
              placeholder="Search tasks..."
              value={searchQuery ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {onSortOrderChange !== undefined && sortOrder !== undefined && (
          <div className="filter-sort">
            <label htmlFor="sort-select" className="filter-label">
              Sort
            </label>
            <select
              id="sort-select"
              className="form-select sort-select"
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="filter-group">
        <span className="filter-label" id="status-filter-label">
          Status
        </span>
        <div className="filter-buttons" role="group" aria-labelledby="status-filter-label">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-btn${statusFilter === s ? " filter-btn--active" : ""}`}
              aria-pressed={statusFilter === s}
              onClick={() => onStatusChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label" id="category-filter-label">
          Category
        </span>
        <div className="filter-buttons" role="group" aria-labelledby="category-filter-label">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-btn${categoryFilter === c ? " filter-btn--active" : ""}`}
              aria-pressed={categoryFilter === c}
              onClick={() => onCategoryChange(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {onPriorityChange !== undefined && priorityFilter !== undefined && (
        <div className="filter-group">
          <span className="filter-label" id="priority-filter-label">
            Priority
          </span>
          <div className="filter-buttons" role="group" aria-labelledby="priority-filter-label">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                className={`filter-btn${priorityFilter === p ? " filter-btn--active" : ""}`}
                aria-pressed={priorityFilter === p}
                onClick={() => onPriorityChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
