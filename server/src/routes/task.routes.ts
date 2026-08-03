import { Router } from 'express';
import { asyncHandler } from '../middlewares/async-handler.js';
import { validate } from '../middlewares/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskListParamSchema,
  taskIdParamSchema,
} from '../schemas/task.schema.js';
import * as taskController from '../controllers/task.controller.js';

export const taskRouter = Router();

taskRouter.get(
  '/projects/:projectId/tasks',
  validate(taskListParamSchema, 'params'),
  asyncHandler(taskController.listTasks),
);

taskRouter.post(
  '/projects/:projectId/tasks',
  validate(taskListParamSchema, 'params'),
  validate(createTaskSchema, 'body'),
  asyncHandler(taskController.createTask),
);

taskRouter.patch(
  '/tasks/:id',
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  asyncHandler(taskController.updateTask),
);

taskRouter.delete(
  '/tasks/:id',
  validate(taskIdParamSchema, 'params'),
  asyncHandler(taskController.deleteTask),
);