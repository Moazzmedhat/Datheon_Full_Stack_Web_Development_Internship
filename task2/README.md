# TaskBoard – Dynamic Task Manager & Productivity Tracker

A feature-rich, accessible, and scalable Task Manager and Productivity Tracker built with React 19, TypeScript, and Vite. Designed using Clean Architecture & Domain-Driven Design (DDD) principles with zero external UI or state-management dependencies.

---

## 🚀 Advanced Features

1. **Multi-Tier Priority System**:
   - Assign priorities to tasks: `Urgent`, `High`, `Medium`, `Low`.
   - Distinctive color-coded badges on task cards (Urgent: red, High: amber/orange, Medium: indigo/blue, Low: neutral slate).
   - Filter by priority in the filter bar (`All`, `Urgent`, `High`, `Medium`, `Low`).
   - Priority-based sorting (Urgent first).

2. **Multi-Mode Sorting**:
   - **Smart Order**: Active first, then ascending due dates, unscheduled last.
   - **Due Date**: Nearest deadlines first.
   - **Priority**: Urgent → High → Medium → Low.
   - **Newest First**: Creation timestamp descending.
   - **Title (A–Z)**: Alphabetical sort.

3. **Productivity Analytics & Workload Insights Modal**:
   - Access via the **"📊 Insights"** button in the header.
   - Overview metrics: Total Tasks, Completed, Active, and Overdue.
   - Completion progress bar with workload health percentage.
   - Breakdown charts by Category (`Work`, `Personal`, `Study`) and Priority (`Urgent`, `High`, `Medium`, `Low`).

4. **Global Keyboard Shortcuts**:
   - `N`: Instantly jump focus to the task title input to create a new task.
   - `/`: Quick focus to the search bar.
   - `Esc`: Cancel editing or dismiss open modals.
   - `?`: Toggle the keyboard shortcuts cheat-sheet modal (**"⌨️ Shortcuts"**).

5. **Instant Task Duplication**:
   - Clone any existing task with its category, priority, and due date in a single click via the duplicate icon button.

6. **Theme Switcher**:
   - Three-mode theme selector in the header (**☀️ Light**, **🌙 Dark**, **💻 Auto/System**).
   - Stored in localStorage and dynamically synced with `prefers-color-scheme`.

7. **Resilient Persistence & Data Portability**:
   - Versioned `localStorage` storage (`taskboard.tasks.v1`) with corruption recovery and schema sanitization.
   - **Cross-tab synchronization**: Updates in one tab immediately reflect in other open tabs via Web Storage events.
   - **JSON Backup Export & Import**: One-click export to download a `.json` backup and import to restore anytime.

8. **Non-Blocking Undo on Delete**:
   - Deleting a task surfaces a floating Toast notification with an **"Undo"** action to immediately restore the task.

---

## 📁 Architecture & File Structure

```
task_manager/
├── src/
│   ├── domain/
│   │   ├── entities.ts                 # Domain models (Task, Category, Priority, TaskStats)
│   │   ├── validator.ts                # Pure domain validation & result types
│   │   └── taskService.ts              # Domain logic (due-date logic, sorting, filtering, stats)
│   ├── infrastructure/
│   │   └── storage/
│   │       ├── taskRepository.ts       # ITaskRepository interface (DIP abstraction)
│   │       ├── localStorageRepository.ts # Versioned localStorage + cross-tab sync + import/export
│   │       └── inMemoryRepository.ts   # In-memory implementation for fast isolated tests
│   ├── application/
│   │   └── TaskContext.tsx             # Segregated contexts (State, Actions, Filters)
│   ├── state/
│   │   └── tasksReducer.ts             # Reducer supporting ADD, UPDATE, TOGGLE, DELETE, RESTORE (Undo)
│   ├── hooks/
│   │   └── useTasks.ts                 # React hook binding state, repository, and storage sync
│   ├── components/
│   │   ├── layout/
│   │   │   └── ErrorBoundary.tsx       # React error boundary with graceful fallback & recovery
│   │   ├── modals/
│   │   │   ├── AnalyticsModal.tsx      # Productivity stats & category/priority workload modal
│   │   │   └── ShortcutsModal.tsx      # Keyboard shortcuts cheat-sheet modal
│   │   ├── feedback/
│   │   │   └── Toast.tsx               # Non-intrusive action feedback with Undo capability
│   │   ├── TaskForm.tsx                # Accessible task creation & inline validation form
│   │   ├── TaskItem.tsx                # Task card with status toggle, priority badge, and duplicate
│   │   ├── TaskList.tsx                # List renderer with stable keys & empty state delegation
│   │   ├── FilterBar.tsx               # Status, Category & Priority buttons + live search + sort select
│   │   ├── ProgressSummary.tsx         # Real-time progress metric bar & completion counter
│   │   └── EmptyState.tsx              # Context-aware empty state illustrations
│   ├── lib/
│   │   ├── storage.ts                  # Stable delegate to infrastructure repository
│   │   └── tasks.ts                    # Stable delegate to domain task service
│   ├── types.ts                        # Shared type re-exports
│   ├── App.tsx                         # Main composition root
│   ├── index.css                       # Design tokens, themes, layout, and components
│   └── __tests__/
│       ├── domain.test.ts              # Domain validation, filtering, sorting & repo tests
│       ├── tasks.test.ts               # Date math, local time & overdue calculations
│       ├── tasksReducer.test.ts        # Reducer action transitions & immutability
│       ├── storage.test.ts             # Resilient storage, schema checks & error handling
│       └── App.test.tsx                # Integration flows (CRUD, undo, filters, persistence)
```

---

## 🛠️ Getting Started

```bash
npm run dev      # Start development server
npm run build    # Type-check and production build
npm test         # Run all 83 unit & integration tests
npm run lint     # Run ESLint with zero-warning threshold
```
