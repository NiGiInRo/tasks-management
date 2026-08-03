import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { createTestProject } from './helpers/factories.js';

describe('Tasks API', () => {
  describe('POST /projects/:projectId/tasks', () => {
    it('creates a task under an existing project and returns 201', async () => {
      const project = await createTestProject();

      const res = await request(app)
        .post(`/projects/${project.id}/tasks`)
        .send({ title: 'Write tests', priority: 'HIGH' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: 'Write tests',
        priority: 'HIGH',
        status: 'TODO',
        projectId: project.id,
      });
    });

    it('returns 400 when title is missing', async () => {
      const project = await createTestProject();

      const res = await request(app).post(`/projects/${project.id}/tasks`).send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation error');
    });

    it('returns 404 when the project does not exist, not an empty list', async () => {
      const res = await request(app)
        .post(`/projects/${crypto.randomUUID()}/tasks`)
        .send({ title: 'Orphan task' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Project not found' });
    });
  });

  describe('GET /projects/:projectId/tasks', () => {
    it('lists tasks for the project', async () => {
      const project = await createTestProject();
      await request(app).post(`/projects/${project.id}/tasks`).send({ title: 'Task 1' });
      await request(app).post(`/projects/${project.id}/tasks`).send({ title: 'Task 2' });

      const res = await request(app).get(`/projects/${project.id}/tasks`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('returns 404 when the project does not exist', async () => {
      const res = await request(app).get(`/projects/${crypto.randomUUID()}/tasks`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Project not found' });
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('updates a task, including status, and returns 200', async () => {
      const project = await createTestProject();
      const created = await request(app)
        .post(`/projects/${project.id}/tasks`)
        .send({ title: 'Move me' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}`)
        .send({ status: 'IN_PROGRESS' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('returns 400 for an invalid status value', async () => {
      const project = await createTestProject();
      const created = await request(app)
        .post(`/projects/${project.id}/tasks`)
        .send({ title: 'Bad status' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}`)
        .send({ status: 'NOT_A_STATUS' });

      expect(res.status).toBe(400);
    });

    it('returns 404 when the task does not exist', async () => {
      const res = await request(app)
        .patch(`/tasks/${crypto.randomUUID()}`)
        .send({ title: 'Whatever' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deletes the task and returns 204', async () => {
      const project = await createTestProject();
      const created = await request(app)
        .post(`/projects/${project.id}/tasks`)
        .send({ title: 'To delete' });

      const res = await request(app).delete(`/tasks/${created.body.id}`);

      expect(res.status).toBe(204);
    });

    it('returns 404 when the task does not exist', async () => {
      const res = await request(app).delete(`/tasks/${crypto.randomUUID()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });
  });
});
