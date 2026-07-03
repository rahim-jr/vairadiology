"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTask } from "@/lib/api";
import type { Task, TaskStatus } from "@/lib/types";
import { useDateStore } from "@/store/dateStore";
import { Column, columns } from "./Column";
import { TaskPreview } from "./TaskCard";
import { TaskModal } from "./TaskModal";

type ModalState =
  | { mode: "create"; status: TaskStatus }
  | { mode: "edit"; task: Task }
  | null;

export function Board() {
  const selectedDate = useDateStore((state) => state.selectedDate);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!selectedDate) return;
    setIsLoading(true);
    setError("");
    try {
      setTasks(await fetchTasks(selectedDate));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<TaskStatus, Task[]>>(
      (acc, column) => {
        acc[column.id] = tasks.filter((task) => task.status === column.id);
        return acc;
      },
      { todo: [], in_progress: [], done: [] },
    );
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task as Task | undefined;
    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const task = event.active.data.current?.task as Task | undefined;
    const nextStatus = event.over?.id as TaskStatus | undefined;
    if (!task || !nextStatus || task.status === nextStatus) return;

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, status: nextStatus } : item,
      ),
    );
    try {
      const updated = await updateTask(task.id, { status: nextStatus });
      setTasks((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not move task.");
      await loadTasks();
    }
  }

  async function handleDelete(task: Task) {
    const confirmed = window.confirm(`Delete “${task.title}”?`);
    if (!confirmed) return;
    await deleteTask(task.id);
    setTasks((current) => current.filter((item) => item.id !== task.id));
  }

  return (
    <>
      {error ? (
        <div className="error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="board" aria-label="Loading task board">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTask(null)}
        >
          <div className="board">
            {columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                hint={column.hint}
                icon={column.icon}
                tasks={tasksByStatus[column.id]}
                onAdd={(status) => setModal({ mode: "create", status })}
                onEdit={(task) => setModal({ mode: "edit", task })}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeTask ? <TaskPreview task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
      {modal ? (
        <TaskModal
          task={modal.mode === "edit" ? modal.task : undefined}
          defaultDate={selectedDate}
          defaultStatus={
            modal.mode === "create" ? modal.status : modal.task.status
          }
          onClose={() => setModal(null)}
          onSubmit={async (payload) => {
            if (modal.mode === "edit") {
              const updated = await updateTask(modal.task.id, payload);
              setTasks((current) =>
                current
                  .map((task) => (task.id === updated.id ? updated : task))
                  .filter((task) => task.due_date === selectedDate),
              );
            } else {
              const created = await createTask(payload);
              if (created.due_date === selectedDate)
                setTasks((current) => [...current, created]);
            }
          }}
        />
      ) : null}
    </>
  );
}
