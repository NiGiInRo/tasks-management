import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema.js';

export function listTasksByProject(projectId: string) {
  return prisma.task.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } });
}

export function createTask(projectId: string, data: CreateTaskInput) {
  return prisma.task.create({ data: { ...data, projectId } });
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  try {
    return await prisma.task.update({ where: { id }, data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return null;
    }
    throw err;
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return false;
    }
    throw err;
  }
}