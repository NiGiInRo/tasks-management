import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Projects API', () => {
  describe('POST /projects', () => {
    it('creates a project and returns 201', async () => {
      const res = await request(app)
        .post('/projects')
        .send({ name: 'Website redesign', description: 'Q3 revamp' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: 'Website redesign',
        description: 'Q3 revamp',
      });
      expect(res.body.id).toBeTypeOf('string');
    });

    it('returns 400 when name is missing', async () => {
      const res = await request(app).post('/projects').send({ description: 'no name' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation error');
      expect(res.body.details).toBeDefined();
    });
  });

  describe('GET /projects', () => {
    it('lists existing projects', async () => {
      await request(app).post('/projects').send({ name: 'Project A' });
      await request(app).post('/projects').send({ name: 'Project B' });

      const res = await request(app).get('/projects');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /projects/:id', () => {
    it('returns the project when it exists', async () => {
      const created = await request(app).post('/projects').send({ name: 'Findable' });

      const res = await request(app).get(`/projects/${created.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });

    it('returns 404 when the project does not exist', async () => {
      const res = await request(app).get(`/projects/${crypto.randomUUID()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Project not found' });
    });
  });

  describe('PATCH /projects/:id', () => {
    it('updates the project and returns 200', async () => {
      const created = await request(app).post('/projects').send({ name: 'Old name' });

      const res = await request(app)
        .patch(`/projects/${created.body.id}`)
        .send({ name: 'New name' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('New name');
    });

    it('returns 400 when the body is empty', async () => {
      const created = await request(app).post('/projects').send({ name: 'Any' });

      const res = await request(app).patch(`/projects/${created.body.id}`).send({});

      expect(res.status).toBe(400);
    });

    it('returns 404 when the project does not exist', async () => {
      const res = await request(app)
        .patch(`/projects/${crypto.randomUUID()}`)
        .send({ name: 'Whatever' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('deletes the project and returns 204', async () => {
      const created = await request(app).post('/projects').send({ name: 'To delete' });

      const deleteRes = await request(app).delete(`/projects/${created.body.id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/projects/${created.body.id}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 404 when the project does not exist', async () => {
      const res = await request(app).delete(`/projects/${crypto.randomUUID()}`);

      expect(res.status).toBe(404);
    });
  });
});
