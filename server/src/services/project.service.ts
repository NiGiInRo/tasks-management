import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type { CreateProjectInput, UpdateProjectInput } from '../schemas/project.schema.js';

export function listProjects() {
  return prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
}

export function createProject(data: CreateProjectInput) {
  return prisma.project.create({ data });
}

export function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function updateProject(id: string, data: UpdateProjectInput) {
  try {
    return await prisma.project.update({ where: { id }, data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return null;
    }
    throw err;
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return false;
    }
    throw err;
  }
}