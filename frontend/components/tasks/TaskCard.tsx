"use client";

import { useDraggable } from "@dnd-kit/core";
import { Icon, type IconName } from "@/components/shared/Icons";
import type { Task } from "@/lib/types";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

type PreviewProps = {
  task: Task;
  isOverlay?: boolean;
  isDragging?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

const priorityIcons: Record<Task["priority"], IconName> = {
  high: "target",
  medium: "activity",
  low: "checkCircle",
};

export function TaskPreview({
  task,
  isOverlay = false,
  isDragging = false,
  onEdit,
  onDelete,
}: PreviewProps) {
  return (
    <article
      className={`task-card${isDragging ? " dragging" : ""}${isOverlay ? " drag-overlay-card" : ""}`}
    >
      <div className="task-top">
        <h3 className="task-title">{task.title}</h3>
        <span className={`priority ${task.priority}`}>
          <Icon name={priorityIcons[task.priority]} size={13} /> {task.priority}
        </span>
      </div>
      <div className="meta-row">
        <span>
          <Icon name="calendar" size={15} /> Due {task.due_date}
        </span>
        <span>
          <Icon name="drag" size={15} /> Drag to move
        </span>
      </div>
      <div className="tags">
        {task.tags.length ? (
          task.tags.map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))
        ) : (
          <span className="helper">No tags yet</span>
        )}
      </div>
      {onEdit && onDelete ? (
        <div className="actions">
          <button
            className="ghost-btn"
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            className="ghost-btn danger"
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onDelete(task)}
          >
            Delete
          </button>
        </div>
      ) : null}
    </article>
  );
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: String(task.id), data: { task } });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="draggable-task"
      {...listeners}
      {...attributes}
    >
      <TaskPreview
        task={task}
        isDragging={isDragging}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
