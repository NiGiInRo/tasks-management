import type { RequestHandler } from 'express';
import * as projectService from '../services/project.service.js';
import type { CreateProjectInput, UpdateProjectInput } from '../schemas/project.schema.js';

export const listProjects: RequestHandler = async (_req, res) => {
  const projects = await projectService.listProjects();
  res.json(projects);
};

export const createProject: RequestHandler = async (req, res) => {
  const project = await projectService.createProject(req.body as CreateProjectInput);
  res.status(201).json(project);
};

export const getProject: RequestHandler = async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.json(project);
};

export const updateProject: RequestHandler = async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body as UpdateProjectInput);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.json(project);
};

export const deleteProject: RequestHandler = async (req, res) => {
  const deleted = await projectService.deleteProject(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.status(204).send();
};