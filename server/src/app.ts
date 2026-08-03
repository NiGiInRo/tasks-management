import express from 'express';
import cors from 'cors';
import { projectRouter } from './routes/project.routes.js';
import { taskRouter } from './routes/task.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/projects', projectRouter);
app.use(taskRouter);

app.use(errorHandler);

export default app;