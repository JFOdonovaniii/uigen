import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolDescription } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolDescription pure function tests ---

test("str_replace_editor create", () => {
  expect(
    getToolDescription("str_replace_editor", {
      command: "create",
      path: "src/App.tsx",
    })
  ).toBe("Creating App.tsx");
});

test("str_replace_editor str_replace", () => {
  expect(
    getToolDescription("str_replace_editor", {
      command: "str_replace",
      path: "src/App.tsx",
    })
  ).toBe("Editing App.tsx");
});

test("str_replace_editor insert", () => {
  expect(
    getToolDescription("str_replace_editor", {
      command: "insert",
      path: "src/App.tsx",
    })
  ).toBe("Editing App.tsx");
});

test("str_replace_editor view", () => {
  expect(
    getToolDescription("str_replace_editor", {
      command: "view",
      path: "src/App.tsx",
    })
  ).toBe("Viewing App.tsx");
});

test("str_replace_editor undo_edit", () => {
  expect(
    getToolDescription("str_replace_editor", {
      command: "undo_edit",
      path: "src/App.tsx",
    })
  ).toBe("Undoing edit in App.tsx");
});

test("str_replace_editor unknown command falls back to Editing", () => {
  expect(
    getToolDescription("str_replace_editor", {
      command: "unknown",
      path: "src/App.tsx",
    })
  ).toBe("Editing App.tsx");
});

test("str_replace_editor no path or command (partial state) falls back to 'Editing file'", () => {
  expect(getToolDescription("str_replace_editor", {})).toBe("Editing file");
});

test("str_replace_editor extracts filename from nested path", () => {
  expect(
    getToolDescription("str_replace_editor", {
      command: "create",
      path: "src/components/ui/Button.tsx",
    })
  ).toBe("Creating Button.tsx");
});

test("file_manager rename", () => {
  expect(
    getToolDescription("file_manager", {
      command: "rename",
      path: "src/Old.tsx",
      new_path: "src/New.tsx",
    })
  ).toBe("Renaming Old.tsx → New.tsx");
});

test("file_manager delete", () => {
  expect(
    getToolDescription("file_manager", {
      command: "delete",
      path: "src/App.tsx",
    })
  ).toBe("Deleting App.tsx");
});

test("file_manager unknown command", () => {
  expect(
    getToolDescription("file_manager", {
      command: "unknown",
      path: "src/App.tsx",
    })
  ).toBe("Managing App.tsx");
});

test("unknown toolName returns toolName verbatim", () => {
  expect(
    getToolDescription("some_other_tool", { command: "create", path: "a.ts" })
  ).toBe("some_other_tool");
});

// --- ToolCallBadge component tests ---

test("shows spinner when state is 'call'", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows spinner when state is 'partial'", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="partial"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows green dot when state is 'result' with success", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="result"
      result="Success"
    />
  );
  const dot = container.querySelector(".rounded-full");
  expect(dot?.className).toContain("bg-emerald-500");
});

test("shows red dot when state is 'result' and result.success is false", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "App.tsx" }}
      state="result"
      result={{ success: false, error: "File not found" }}
    />
  );
  const dot = container.querySelector(".rounded-full");
  expect(dot?.className).toContain("bg-red-500");
});

test("renders description text", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/Button.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("no spinner when complete", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeNull();
});
