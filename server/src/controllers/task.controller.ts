import type { RequestHandler } from 'express';
import * as taskService from '../services/task.service.js';
import * as projectService from '../services/project.service.js';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema.js';

export const listTasks: RequestHandler = async (req, res) => {
  const { projectId } = req.params;

  const project = await projectService.getProjectById(projectId);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const tasks = await taskService.listTasksByProject(projectId);
  res.json(tasks);
};

export const createTask: RequestHandler = async (req, res) => {
  const { projectId } = req.params;

  const project = await projectService.getProjectById(projectId);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const task = await taskService.createTask(projectId, req.body as CreateTaskInput);
  res.status(201).json(task);
};

export const updateTask: RequestHandler = async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body as UpdateTaskInput);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(task);
};

export const deleteTask: RequestHandler = async (req, res) => {
  const deleted = await taskService.deleteTask(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.status(204).send();
};