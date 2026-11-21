import React, { useState, useEffect, useRef } from "react";
import type { Task, Category, Priority } from "../types";
import { validateTaskInput } from "../domain/validator";

type Props = {
  editingTask: Task | null;
  onAdd: (title: string, category: Category, due: string, priority?: Priority, estimatedMinutes?: number) => void;
  onUpdate: (
    id: string,
    title: string,
    category: Category,
    due: string,
    done: boolean,
    created: number,
    priority?: Priority,
    estimatedMinutes?: number
  ) => void;
  onCancelEdit: () => void;
  currentCategory?: string;
};

const CATEGORIES: { label: Category; icon: string }[] = [
  { label: "Work", icon: "💼" },
  { label: "Personal", icon: "👤" },
  { label: "Study", icon: "📚" },
];

const PRIORITIES: { label: Priority; colorClass: string }[] = [
  { label: "Low", colorClass: "prio-low" },
  { label: "Medium", colorClass: "prio-medium" },
  { label: "High", colorClass: "prio-high" },
  { label: "Urgent", colorClass: "prio-urgent" },
];

export default function TaskForm({
  editingTask,
  onAdd,
  onUpdate,
  onCancelEdit,
  currentCategory = "Tasks",
}: Props) {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [category, setCategory] = useState<Category>(editingTask?.category ?? "Work");
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? "Medium");
  const [due, setDue] = useState(editingTask?.due ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState<string>(
    editingTask?.estimatedMinutes && editingTask.estimatedMinutes > 0 ? String(editingTask.estimatedMinutes) : ""
  );
  const [error, setError] = useState("");
  const [showOptions, setShowOptions] = useState(Boolean(editingTask));

  const titleRef = useRef<HTMLInputElement>(null);

  // Focus title input when editing starts
  useEffect(() => {
    if (editingTask) {
      titleRef.current?.focus();
    }
  }, [editingTask]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedEst = estimatedMinutes ? parseInt(estimatedMinutes, 10) : 0;
    const validation = validateTaskInput({ title, category, due, priority, estimatedMinutes: parsedEst });
    if (!validation.isValid) {
      setError(validation.error);
      titleRef.current?.focus();
      return;
    }
    setError("");

    if (editingTask) {
      onUpdate(
        editingTask.id,
        validation.data.title,
        validation.data.category,
        validation.data.due ?? "",
        editingTask.done,
        editingTask.created,
        validation.data.priority ?? "Medium",
        validation.data.estimatedMinutes ?? 0
      );
    } else {
      onAdd(
        validation.data.title,
        validation.data.category,
        validation.data.due ?? "",
        validation.data.priority ?? "Medium",
        validation.data.estimatedMinutes ?? 0
      );
    }

    setTitle("");
    setCategory("Work");
    setPriority("Medium");
    setDue("");
    setEstimatedMinutes("");
    if (!editingTask) setShowOptions(false);
  }

  function handleCancel() {
    setTitle("");
    setCategory("Work");
    setPriority("Medium");
    setDue("");
    setEstimatedMinutes("");
    setError("");
    onCancelEdit();
  }

  const isEditing = editingTask !== null;

  return (
    <form
      className={`quick-task-form ${isEditing ? "quick-task-form--editing" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="quick-task-bar">
        <span className="quick-add-plus" aria-hidden="true">+</span>

        <label htmlFor="task-title" className="visually-hidden">
          Task Title
        </label>

        <input
          id="task-title"
          ref={titleRef}
          type="text"
          className="quick-task-input"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          onFocus={() => setShowOptions(true)}
          maxLength={120}
          placeholder={`Add a task to "${currentCategory}", press 「Enter」 to save`}
          aria-describedby={error ? "title-error" : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="off"
        />

        {/* Right side icon hints matching screenshot */}
        <div className="quick-bar-actions">
          <div className="quick-bar-pomos" title="Estimated Pomodoros" aria-hidden="true">
            <span className="pomo-dot" />
            <span className="pomo-dot" />
            <span className="pomo-dot" />
            <span className="pomo-chevron">›</span>
          </div>

          <button
            type="button"
            className={`btn-quick-toggle ${showOptions || isEditing ? "btn-quick-toggle--active" : ""}`}
            onClick={() => setShowOptions(!showOptions)}
            title="Toggle task options (category, priority, due date)"
            aria-label="Toggle task options"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-submit-task"
            aria-label={isEditing ? "Save changes" : "Add task"}
          >
            {isEditing ? "Save changes" : "Add task"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary btn-cancel-edit"
              onClick={handleCancel}
              aria-label="Cancel edit"
            >
              Cancel edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <p id="title-error" className="form-error quick-form-error" role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}

      {/* Expanded / Detail Options Tray */}
      {(showOptions || isEditing || title.length > 0) && (
        <div className="quick-options-tray">
          <div className="quick-option-col">
            <span className="quick-option-label">Category:</span>
            <div className="pill-selector pill-selector--compact" role="radiogroup" aria-label="Category">
              {CATEGORIES.map((c) => {
                const isSelected = category === c.label;
                return (
                  <button
                    key={c.label}
                    type="button"
                    className={`pill-option pill-option--${c.label.toLowerCase()}${isSelected ? " pill-option--selected" : ""}`}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setCategory(c.label)}
                  >
                    <span aria-hidden="true">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="quick-option-col">
            <span className="quick-option-label">Priority:</span>
            <div className="pill-selector pill-selector--compact" role="radiogroup" aria-label="Priority">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    className={`pill-option ${p.colorClass}${isSelected ? " pill-option--selected" : ""}`}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setPriority(p.label)}
                  >
                    <span className={`prio-dot prio-dot--${p.label.toLowerCase()}`} aria-hidden="true" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="quick-option-col quick-option-col--due">
            <span className="quick-option-label">Due Date:</span>
            <input
              id="task-due"
              type="date"
              className="form-input form-input--compact"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              aria-label="Due Date"
            />
          </div>

          <div className="quick-option-col quick-option-col--est">
            <span className="quick-option-label">Est. Time:</span>
            <input
              id="task-estimate"
              type="number"
              min="0"
              max="480"
              placeholder="0 min"
              className="form-input form-input--compact form-input--est"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
              aria-label="Estimated time in minutes"
            />
          </div>

          <div className="quick-char-counter">
            {title.length}/120
          </div>
        </div>
      )}
    </form>
  );
}
