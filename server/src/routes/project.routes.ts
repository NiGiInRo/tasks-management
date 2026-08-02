import { Router } from 'express';
import { asyncHandler } from '../middlewares/async-handler.js';
import { validate } from '../middlewares/validate.js';
import { createProjectSchema, updateProjectSchema, projectIdParamSchema } from '../schemas/project.schema.js';
import * as projectController from '../controllers/project.controller.js';

export const projectRouter = Router();

projectRouter.get('/', asyncHandler(projectController.listProjects));

projectRouter.post(
  '/',
  validate(createProjectSchema, 'body'),
  asyncHandler(projectController.createProject),
);

projectRouter.get(
  '/:id',
  validate(projectIdParamSchema, 'params'),
  asyncHandler(projectController.getProject),
);

projectRouter.patch(
  '/:id',
  validate(projectIdParamSchema, 'params'),
  validate(updateProjectSchema, 'body'),
  asyncHandler(projectController.updateProject),
);

projectRouter.delete(
  '/:id',
  validate(projectIdParamSchema, 'params'),
  asyncHandler(projectController.deleteProject),
);