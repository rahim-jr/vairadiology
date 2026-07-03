"use client";

import { useDroppable } from "@dnd-kit/core";
import { Icon, type IconName } from "@/components/shared/Icons";
import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";

export const columns: {
  id: TaskStatus;
  title: string;
  hint: string;
  icon: IconName;
}[] = [
  {
    id: "todo",
    title: "To Do",
    hint: "Ideas and incoming work",
    icon: "clipboard",
  },
  {
    id: "in_progress",
    title: "In Progress",
    hint: "Active focus items",
    icon: "clock",
  },
  {
    id: "done",
    title: "Done",
    hint: "Completed outcomes",
    icon: "checkCircle",
  },
];

type Props = {
  id: TaskStatus;
  title: string;
  hint: string;
  icon: IconName;
  tasks: Task[];
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function Column({
  id,
  title,
  hint,
  icon,
  tasks,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className="column"
      style={{ borderColor: isOver ? "rgba(34, 211, 238, .65)" : undefined }}
    >
      <div className="column-header">
        <div>
          <div className="column-title">
            <Icon name={icon} size={18} /> {title}
          </div>
          <div className="helper">{hint}</div>
        </div>
        <div className="actions">
          <span className="badge">{tasks.length} tasks</span>
          <button
            className="ghost-btn icon-button"
            type="button"
            onClick={() => onAdd(id)}
            aria-label={`Add task to ${title}`}
          >
            +
          </button>
        </div>
      </div>
      <div className="task-list">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="empty">
            <div className="empty-visual">
              <Icon name={icon} size={34} />
            </div>
            No {title.toLowerCase()} tasks for this date.
          </div>
        )}
      </div>
    </section>
  );
}
