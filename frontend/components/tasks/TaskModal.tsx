'use client';

import { FormEvent, useState } from 'react';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

type Props = {
  task?: Task;
  defaultDate: string;
  defaultStatus: TaskStatus;
  onClose: () => void;
  onSubmit: (payload: { title: string; status: TaskStatus; priority: TaskPriority; due_date: string; tags: string[] }) => Promise<void>;
};

export function TaskModal({ task, defaultDate, defaultStatus, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(task?.due_date ?? defaultDate);
  const [tags, setTags] = useState(task?.tags.join(', ') ?? '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!dueDate) {
      setError('Due date is required.');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        status,
        priority,
        due_date: dueDate,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save task.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal form" onSubmit={handleSubmit}>
        <h2>{task ? 'Edit task' : 'Add task'}</h2>
        {error ? <div className="error">{error}</div> : null}
        <label className="field">Title<input className="input" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="field">Status<select className="select" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>{statuses.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}</select></label>
        <label className="field">Priority<select className="select" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{priorities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field">Due date<input className="input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label>
        <label className="field">Tags<input className="input" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="triage, urgent" /></label>
        <div className="actions"><button className="btn" disabled={isSaving} type="submit">{isSaving ? 'Saving…' : 'Save task'}</button><button className="ghost-btn" type="button" onClick={onClose}>Cancel</button></div>
      </form>
    </div>
  );
}
