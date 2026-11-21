import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import type { Task } from "../../src/types";

// Helper to build a valid stored task array
function makeStoredTask(overrides: Partial<Task> = {}): Task {
  return {
    id: `id-${Math.random().toString(36).slice(2)}`,
    title: "Stored task",
    category: "Work",
    due: "",
    done: false,
    created: Date.now(),
    ...overrides,
  };
}

function mockLocalStorage(initialData: Task[] | null = null) {
  const store: Record<string, string> = {};
  if (initialData !== null) {
    store["taskboard.tasks.v1"] = JSON.stringify(initialData);
  }
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn(),
    clear: vi.fn(),
    get _store() { return store; },
  };
}

describe("App component integration", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockLocalStorage());
  });

  // --- Adding a task ---
  it("adds a task when form is submitted with valid title", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Buy groceries");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("clears the form after adding a task", async () => {
    const user = userEvent.setup();
    render(<App />);
    const titleInput = screen.getByLabelText(/title/i);

    await user.type(titleInput, "My new task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(titleInput).toHaveValue("");
  });

  // --- Validation ---
  it("shows validation error for empty title without alerting", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/required/i);
  });

  it("shows validation error for whitespace-only title", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "   ");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("clears validation error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /add task/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/title/i), "A");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // --- Toggling completion ---
  it("toggles a task complete when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Toggle me");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    const checkbox = screen.getByLabelText(/mark "toggle me" as complete/i);
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  // --- Editing ---
  it("loads task into form when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Edit me");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /edit task: edit me/i }));

    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toHaveValue("Edit me");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("saves edited task title", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Original title");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /edit task: original title/i }));

    // Use the form input specifically (by its id)
    const titleInput = screen.getByRole("textbox", { name: /title/i });
    await user.clear(titleInput);
    await user.type(titleInput, "Updated title");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText("Updated title")).toBeInTheDocument();
    expect(screen.queryByText("Original title")).not.toBeInTheDocument();
  });

  it("cancels edit without saving changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Keep me");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /edit task: keep me/i }));
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Should not save");
    await user.click(screen.getByRole("button", { name: /cancel edit/i }));

    expect(screen.getByText("Keep me")).toBeInTheDocument();
    expect(screen.queryByText("Should not save")).not.toBeInTheDocument();
  });

  // --- Deleting ---
  it("deletes a task when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Delete me");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText("Delete me")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /delete task: delete me/i }));
    expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
  });

  // --- Filters ---
  it("filters to show only active tasks", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Active task");
    await user.click(screen.getByRole("button", { name: /add task/i }));
    await user.type(screen.getByLabelText(/title/i), "Completed task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    // Complete the second task
    await user.click(screen.getByLabelText(/mark "completed task" as complete/i));

    // Switch to Active filter
    await user.click(screen.getByRole("button", { name: /^active$/i }));

    expect(screen.getByText("Active task")).toBeInTheDocument();
    expect(screen.queryByText("Completed task")).not.toBeInTheDocument();
  });

  it("filters to show only completed tasks", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Task A");
    await user.click(screen.getByRole("button", { name: /add task/i }));
    await user.type(screen.getByLabelText(/title/i), "Task B");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByLabelText(/mark "task b" as complete/i));
    await user.click(screen.getByRole("button", { name: /^completed$/i }));

    expect(screen.queryByText("Task A")).not.toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });

  // --- localStorage persistence ---
  it("restores tasks from localStorage on mount", async () => {
    const stored = [makeStoredTask({ title: "Persisted task" })];
    vi.stubGlobal("localStorage", mockLocalStorage(stored));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Persisted task")).toBeInTheDocument();
    });
  });

  it("handles corrupt localStorage data gracefully", async () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => "CORRUPT{{{"),
      setItem: vi.fn(),
    });

    // Should render without crashing, showing empty state
    render(<App />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  // --- Delete completed ---
  it("shows delete completed button only when there are completed tasks", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByText(/delete completed/i)).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(/title/i), "Finish me");
    await user.click(screen.getByRole("button", { name: /add task/i }));
    await user.click(screen.getByLabelText(/mark "finish me" as complete/i));

    expect(screen.getByText(/delete completed/i)).toBeInTheDocument();
  });

  it("clears all completed tasks when delete completed is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/title/i), "Keep me active");
    await user.click(screen.getByRole("button", { name: /add task/i }));
    await user.type(screen.getByLabelText(/title/i), "Remove me");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByLabelText(/mark "remove me" as complete/i));
    await user.click(screen.getByRole("button", { name: /delete completed/i }));

    expect(screen.getByText("Keep me active")).toBeInTheDocument();
    expect(screen.queryByText("Remove me")).not.toBeInTheDocument();
  });
});
