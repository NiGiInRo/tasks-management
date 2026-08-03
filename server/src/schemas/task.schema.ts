import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  description: z.string().trim().min(1).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'title is required').optional(),
    description: z.string().trim().min(1).nullable().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (title, description, status, priority) must be provided',
  });

export const taskListParamSchema = z.object({
  projectId: z.string().uuid('projectId must be a valid UUID'),
});

export const taskIdParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;