"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "partial" | "call" | "result";
  result?: unknown;
}

export function getToolDescription(
  toolName: string,
  args: Record<string, unknown>
): string {
  const path = typeof args.path === "string" ? args.path : "";
  const filename = path.split("/").filter(Boolean).pop() || path || "file";

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Viewing ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
      default:
        return `Editing ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": {
        const newPath = typeof args.new_path === "string" ? args.new_path : "";
        const newFilename =
          newPath.split("/").filter(Boolean).pop() || newPath || "file";
        return `Renaming ${filename} → ${newFilename}`;
      }
      case "delete":
        return `Deleting ${filename}`;
      default:
        return `Managing ${filename}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({
  toolName,
  args,
  state,
  result,
}: ToolCallBadgeProps) {
  const description = getToolDescription(toolName, args);
  const isComplete = state === "result";
  const isError =
    isComplete &&
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as { success: boolean }).success === false;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div
          className={`w-2 h-2 rounded-full ${isError ? "bg-red-500" : "bg-emerald-500"}`}
        />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{description}</span>
    </div>
  );
}
