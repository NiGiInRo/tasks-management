import { apiRequest } from './client';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
}

export function listProjects() {
  return apiRequest<Project[]>('/projects');
}

export function getProject(id: string) {
  return apiRequest<Project>(`/projects/${id}`);
}

export function createProject(input: CreateProjectInput) {
  return apiRequest<Project>('/projects', { method: 'POST', body: input });
}

export function updateProject(id: string, input: UpdateProjectInput) {
  return apiRequest<Project>(`/projects/${id}`, { method: 'PATCH', body: input });
}

export function deleteProject(id: string) {
  return apiRequest<void>(`/projects/${id}`, { method: 'DELETE' });
}