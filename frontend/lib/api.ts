import type { AnnotatedImage, Polygon, Task, TaskPriority, TaskStatus } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { 'Content-Type': 'application/json', ...init?.headers },
    credentials: 'include',
  });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const error = await response.json();
      message = typeof error === 'string' ? error : JSON.stringify(error);
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function login(email: string, password: string) {
  return request<{ id: number; email: string; name: string }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchTasks(date: string) {
  return request<Task[]>(`/tasks/?date=${encodeURIComponent(date)}`);
}

export function createTask(payload: { title: string; status: TaskStatus; priority: TaskPriority; due_date: string; tags: string[] }) {
  return request<Task>('/tasks/', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateTask(id: number, payload: Partial<{ title: string; status: TaskStatus; priority: TaskPriority; due_date: string; tags: string[] }>) {
  return request<Task>(`/tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function deleteTask(id: number) {
  return request<void>(`/tasks/${id}/`, { method: 'DELETE' });
}

export function fetchImages() {
  return request<AnnotatedImage[]>('/images/');
}

export function uploadImage(file: File, title: string) {
  const form = new FormData();
  form.append('image', file);
  form.append('title', title);
  return request<AnnotatedImage>('/images/', { method: 'POST', body: form });
}

export function savePolygon(imageId: number, payload: { label: string; color: string; points: { x: number; y: number }[] }) {
  return request<Polygon>(`/images/${imageId}/polygons/`, { method: 'POST', body: JSON.stringify(payload) });
}

export function removePolygon(id: number) {
  return request<void>(`/polygons/${id}/`, { method: 'DELETE' });
}
