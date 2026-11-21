import { useState, useMemo, useCallback, useEffect } from "react";
import type { Task, StatusFilter, CategoryFilter, PriorityFilter, SortOrder, Priority } from "./types";
import { useTasks } from "./hooks/useTasks";
import { filterTasks, sortTasks, progress, todayString, tomorrowString } from "./lib/tasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Toast, { type ToastMessage } from "./components/feedback/Toast";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import AnalyticsModal from "./components/modals/AnalyticsModal";
import FocusWidget from "./components/FocusWidget";

type SmartView = "today" | "tomorrow" | "week" | "planned" | "completed" | "tasks" | "work" | "personal" | "study";

function formatKpiTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function App() {
  const {
    tasks,
    stats,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    duplicateTask,
    restoreTask,
    clearCompleted,
    toggleTimer,
    resetTimer,
  } = useTasks();

  const [currentView, setCurrentView] = useState<SmartView>("today");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("smart");
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);

  // Theme: "system" | "light" | "dark"
  const [theme, setTheme] = useState<"system" | "light" | "dark">(() => {
    try {
      return (localStorage.getItem("taskboard.theme") as "system" | "light" | "dark") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("taskboard.theme", theme);
    } catch {
      // storage unavailable
    }

    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Sync category filter if user clicks a category view in sidebar
  const handleSelectView = (view: SmartView) => {
    setCurrentView(view);
    if (view === "work") {
      setCategoryFilter("Work");
      setStatusFilter("All");
    } else if (view === "personal") {
      setCategoryFilter("Personal");
      setStatusFilter("All");
    } else if (view === "study") {
      setCategoryFilter("Study");
      setStatusFilter("All");
    } else if (view === "completed") {
      setStatusFilter("Completed");
      setCategoryFilter("All");
    } else {
      setCategoryFilter("All");
      setStatusFilter("All");
    }
  };

  // Filter tasks based on current smart view
  const viewFilteredTasks = useMemo(() => {
    const today = todayString();
    const tomorrow = tomorrowString();

    return tasks.filter((task) => {
      if (currentView === "today") {
        // Today view: tasks due today, or active tasks without a specific future date
        return !task.due || task.due <= today;
      }
      if (currentView === "tomorrow") {
        return task.due === tomorrow;
      }
      if (currentView === "week") {
        if (!task.due) return false;
        const d = new Date(task.due + "T00:00:00");
        const now = new Date();
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 0 && diffDays <= 7;
      }
      if (currentView === "planned") {
        return Boolean(task.due);
      }
      if (currentView === "completed") {
        return task.done;
      }
      if (currentView === "work") {
        return task.category === "Work";
      }
      if (currentView === "personal") {
        return task.category === "Personal";
      }
      if (currentView === "study") {
        return task.category === "Study";
      }
      return true; // "tasks" = all
    });
  }, [tasks, currentView]);

  // Further filter by status, category, search, priority, and sort
  const filteredAndSorted = useMemo(() => {
    const baseList = filterTasks(
      viewFilteredTasks,
      statusFilter,
      categoryFilter,
      searchQuery,
      priorityFilter
    );
    return sortTasks(baseList, sortOrder);
  }, [viewFilteredTasks, statusFilter, categoryFilter, searchQuery, priorityFilter, sortOrder]);

  const [completed] = useMemo(() => progress(tasks), [tasks]);
  const hasCompleted = tasks.some((t) => t.done);

  // KPI Metrics Calculation for Top Bar
  const tasksToBeCompleted = useMemo(() => {
    return viewFilteredTasks.filter((t) => !t.done).length;
  }, [viewFilteredTasks]);

  const viewCompletedTasks = useMemo(() => {
    return viewFilteredTasks.filter((t) => t.done).length;
  }, [viewFilteredTasks]);

  const elapsedSeconds = useMemo(() => {
    return viewFilteredTasks.reduce((acc, t) => acc + (t.timeSpent ?? 0), 0);
  }, [viewFilteredTasks]);

  // Only sum user-specified task estimates. Never automatically add 25m or any arbitrary time!
  const totalEstimatedMinutes = useMemo(() => {
    return viewFilteredTasks.reduce((acc, t) => acc + (t.estimatedMinutes ?? 0), 0);
  }, [viewFilteredTasks]);

  const estimatedTimeDisplay = formatKpiTime(totalEstimatedMinutes * 60);

  // Time & count badges for sidebar navigation
  const sidebarMetrics = useMemo(() => {
    const today = todayString();
    const tomorrow = tomorrowString();

    const getMetrics = (predicate: (t: Task) => boolean) => {
      const matched = tasks.filter(predicate);
      const timeSec = matched.reduce((sum, t) => sum + (t.timeSpent ?? 0), 0);
      return {
        time: formatKpiTime(timeSec),
        count: matched.filter((t) => !t.done).length,
      };
    };

    return {
      today: getMetrics((t) => !t.due || t.due <= today),
      tomorrow: getMetrics((t) => t.due === tomorrow),
      week: getMetrics((t) => {
        if (!t.due) return false;
        const d = new Date(t.due + "T00:00:00");
        const now = new Date();
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 0 && diffDays <= 7;
      }),
      planned: getMetrics((t) => Boolean(t.due)),
      completed: getMetrics((t) => t.done),
      tasks: getMetrics(() => true),
      work: getMetrics((t) => t.category === "Work"),
      personal: getMetrics((t) => t.category === "Personal"),
      study: getMetrics((t) => t.category === "Study"),
    };
  }, [tasks]);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  const handleUpdate = useCallback(
    (
      id: string,
      title: string,
      category: Parameters<typeof updateTask>[2],
      due: string,
      done: boolean,
      created: number,
      priority: Priority = "Medium",
      estimatedMinutes: number = 0
    ) => {
      updateTask(id, title, category, due, done, created, priority, estimatedMinutes);
      setEditingTask(null);
    },
    [updateTask]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const taskToDelete = tasks.find((t) => t.id === id);
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
      deleteTask(id);

      if (taskToDelete) {
        setToast({
          id: String(Date.now()),
          text: `Task deleted.`,
          actionLabel: "Undo",
          onAction: () => {
            restoreTask(taskToDelete);
          },
        });
      }
    },
    [deleteTask, editingTask, tasks, restoreTask]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      duplicateTask(id);
      setToast({
        id: String(Date.now()),
        text: "Task duplicated.",
      });
    },
    [duplicateTask]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : prev === "light" ? "system" : "dark"));
  }, []);

  const viewTitle = useMemo(() => {
    switch (currentView) {
      case "today":
        return "Today";
      case "tomorrow":
        return "Tomorrow";
      case "week":
        return "This Week";
      case "planned":
        return "Planned";
      case "completed":
        return "Completed";
      case "work":
        return "Work";
      case "personal":
        return "Personal";
      case "study":
        return "Study";
      case "tasks":
      default:
        return "Tasks";
    }
  }, [currentView]);

  return (
    <ErrorBoundary>
      <div className="tick-app">
        {/* Left Dark Sidebar matching reference image */}
        <aside className="tick-sidebar">
          {/* Top Search Input */}
          <div className="sidebar-search">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <label htmlFor="task-search" className="visually-hidden">
              Search
            </label>
            <input
              id="task-search"
              type="search"
              className="sidebar-search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Smart Views Navigation */}
          <nav className="sidebar-nav" aria-label="Smart Views">
            <button
              type="button"
              className={`nav-item ${currentView === "today" ? "nav-item--active" : ""}`}
              onClick={() => handleSelectView("today")}
            >
              <span className="nav-icon nav-icon--today">☼</span>
              <span className="nav-title">Today</span>
              <span className="nav-meta">
                <span className="nav-time">{sidebarMetrics.today.time}</span>
                <span className="nav-count">{sidebarMetrics.today.count}</span>
              </span>
            </button>

            <button
              type="button"
              className={`nav-item ${currentView === "tomorrow" ? "nav-item--active" : ""}`}
              onClick={() => handleSelectView("tomorrow")}
            >
              <span className="nav-icon nav-icon--tomorrow">💡</span>
              <span className="nav-title">Tomorrow</span>
              <span className="nav-meta">
                <span className="nav-time">{sidebarMetrics.tomorrow.time}</span>
                <span className="nav-count">{sidebarMetrics.tomorrow.count}</span>
              </span>
            </button>

            <button
              type="button"
              className={`nav-item ${currentView === "week" ? "nav-item--active" : ""}`}
              onClick={() => handleSelectView("week")}
            >
              <span className="nav-icon nav-icon--week">📅</span>
              <span className="nav-title">This Week</span>
              <span className="nav-meta">
                <span className="nav-time">{sidebarMetrics.week.time}</span>
                <span className="nav-count">{sidebarMetrics.week.count}</span>
              </span>
            </button>

            <button
              type="button"
              className={`nav-item ${currentView === "planned" ? "nav-item--active" : ""}`}
              onClick={() => handleSelectView("planned")}
            >
              <span className="nav-icon nav-icon--planned">🗓️</span>
              <span className="nav-title">Planned</span>
              <span className="nav-meta">
                <span className="nav-time">{sidebarMetrics.planned.time}</span>
                <span className="nav-count">{sidebarMetrics.planned.count}</span>
              </span>
            </button>

            <button
              type="button"
              className={`nav-item ${currentView === "completed" ? "nav-item--active" : ""}`}
              onClick={() => handleSelectView("completed")}
            >
              <span className="nav-icon nav-icon--completed">✓</span>
              <span className="nav-title">Completed</span>
              <span className="nav-meta">
                <span className="nav-time">{sidebarMetrics.completed.time}</span>
                <span className="nav-count">{sidebarMetrics.completed.count}</span>
              </span>
            </button>

            <button
              type="button"
              className={`nav-item ${currentView === "tasks" ? "nav-item--active" : ""}`}
              onClick={() => handleSelectView("tasks")}
            >
              <span className="nav-icon nav-icon--tasks">📈</span>
              <span className="nav-title">Tasks</span>
              <span className="nav-meta">
                <span className="nav-time">{sidebarMetrics.tasks.time}</span>
                <span className="nav-count">{sidebarMetrics.tasks.count}</span>
              </span>
            </button>
          </nav>

          {/* Category / Project Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Projects</div>
            <nav className="sidebar-nav" aria-label="Projects">
              <button
                type="button"
                className={`nav-item ${currentView === "work" ? "nav-item--active" : ""}`}
                onClick={() => handleSelectView("work")}
              >
                <span className="nav-icon">💼</span>
                <span className="nav-title">Work</span>
                <span className="nav-meta">
                  <span className="nav-count">{sidebarMetrics.work.count}</span>
                </span>
              </button>

              <button
                type="button"
                className={`nav-item ${currentView === "personal" ? "nav-item--active" : ""}`}
                onClick={() => handleSelectView("personal")}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-title">Personal</span>
                <span className="nav-meta">
                  <span className="nav-count">{sidebarMetrics.personal.count}</span>
                </span>
              </button>

              <button
                type="button"
                className={`nav-item ${currentView === "study" ? "nav-item--active" : ""}`}
                onClick={() => handleSelectView("study")}
              >
                <span className="nav-icon">📚</span>
                <span className="nav-title">Study</span>
                <span className="nav-meta">
                  <span className="nav-count">{sidebarMetrics.study.count}</span>
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Status & Priority Filter Buttons */}
          <div className="sidebar-status-filter" role="group" aria-label="Filter tasks">
            <span className="sidebar-section-title">Filter Status</span>
            <div className="sidebar-filter-pills">
              {(["All", "Active", "Completed"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`sidebar-pill-btn ${statusFilter === s ? "sidebar-pill-btn--active" : ""}`}
                  aria-pressed={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <span className="sidebar-section-title" style={{ marginTop: "0.5rem" }}>Priority</span>
            <div className="sidebar-filter-pills">
              {(["All", "Urgent", "High", "Medium", "Low"] as PriorityFilter[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`sidebar-pill-btn ${priorityFilter === p ? "sidebar-pill-btn--active" : ""}`}
                  aria-pressed={priorityFilter === p}
                  onClick={() => setPriorityFilter(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <button
              type="button"
              className="btn-add-project"
              onClick={() => handleSelectView("tasks")}
            >
              <span className="plus-coral">+</span> Add Project
            </button>

            <div className="sidebar-footer-actions">
              <button
                type="button"
                className="btn-icon-footer"
                onClick={() => setShowAnalytics(true)}
                title="Productivity Insights"
                aria-label="View productivity insights"
              >
                📊
              </button>
              <button
                type="button"
                className="btn-icon-footer"
                onClick={toggleTheme}
                title={`Theme: ${theme}`}
                aria-label={`Toggle theme (currently ${theme})`}
              >
                {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="tick-main">
          {/* Main Top Header */}
          <header className="tick-header">
            <h1 className="tick-header-title">{viewTitle}</h1>

            <div className="tick-header-actions">
              {/* Sort Order Selector */}
              <div className="sort-wrapper">
                <label htmlFor="sort-select" className="visually-hidden">
                  Sort
                </label>
                <div className="sort-icon-box" title="Sort tasks">
                  <span aria-hidden="true">⇅</span>
                  <select
                    id="sort-select"
                    className="tick-sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    aria-label="Sort tasks"
                  >
                    <option value="smart">Smart Order</option>
                    <option value="dueAsc">Due Date (Soonest)</option>
                    <option value="priorityDesc">Priority (Urgent first)</option>
                    <option value="createdDesc">Newest First</option>
                    <option value="titleAsc">Title (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </header>

          {/* 4-Column KPI Overview Banner (Coral numbers) matching reference image */}
          <div className="tick-kpi-bar" role="region" aria-label="Task statistics">
            <div className="kpi-column">
              <span className="kpi-number">{estimatedTimeDisplay}</span>
              <span className="kpi-label">Estimated Time</span>
            </div>

            <div className="kpi-column">
              <span className="kpi-number">{tasksToBeCompleted}</span>
              <span className="kpi-label">Tasks to be Completed</span>
            </div>

            <div className="kpi-column">
              <span className="kpi-number">{formatKpiTime(elapsedSeconds)}</span>
              <span className="kpi-label">Elapsed Time</span>
            </div>

            <div className="kpi-column">
              <span className="kpi-number">{viewCompletedTasks}</span>
              <span className="kpi-label">Completed Tasks</span>
            </div>
          </div>

          {/* Task Quick Add / Edit Form */}
          <TaskForm
            key={editingTask?.id ?? "new"}
            editingTask={editingTask}
            onAdd={addTask}
            onUpdate={handleUpdate}
            onCancelEdit={handleCancelEdit}
            currentCategory={viewTitle}
          />

          {/* Task List / Empty State */}
          <TaskList
            tasks={filteredAndSorted}
            allTasksEmpty={tasks.length === 0}
            editingId={editingTask?.id ?? null}
            onToggle={toggleTask}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
            hideCompleted={hideCompleted}
            onToggleHideCompleted={() => setHideCompleted(!hideCompleted)}
          />

          {/* Action to delete all completed tasks when available */}
          {hasCompleted && (
            <div className="clear-completed-footer">
              <button
                type="button"
                className="btn btn-danger btn-clear-tick"
                onClick={clearCompleted}
              >
                Delete completed ({completed})
              </button>
            </div>
          )}

          {/* Bottom Floating Pomodoro / Focus Widget */}
          <FocusWidget />
        </main>

        <Toast toast={toast} onDismiss={() => setToast(null)} />

        <AnalyticsModal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          stats={stats}
        />
      </div>
    </ErrorBoundary>
  );
}
