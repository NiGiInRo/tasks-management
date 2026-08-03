import { prisma } from '../../src/lib/prisma.js';

export function createTestProject(overrides: { name?: string; description?: string } = {}) {
  return prisma.project.create({
    data: {
      name: overrides.name ?? 'Test project',
      description: overrides.description,
    },
  });
}
