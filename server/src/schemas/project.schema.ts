import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  description: z.string().trim().min(1).optional(),
});

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required').optional(),
    description: z.string().trim().min(1).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (name, description) must be provided',
  });

export const projectIdParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;