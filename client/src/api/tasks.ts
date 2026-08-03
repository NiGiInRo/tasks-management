import { apiRequest } from './client';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
export const TASK_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  DONE: 'Hecho',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};

export function listTasks(projectId: string) {
  return apiRequest<Task[]>(`/projects/${projectId}/tasks`);
}

export function createTask(projectId: string, input: CreateTaskInput) {
  return apiRequest<Task>(`/projects/${projectId}/tasks`, { method: 'POST', body: input });
}

export function updateTask(id: string, input: UpdateTaskInput) {
  return apiRequest<Task>(`/tasks/${id}`, { method: 'PATCH', body: input });
}

export function deleteTask(id: string) {
  return apiRequest<void>(`/tasks/${id}`, { method: 'DELETE' });
}