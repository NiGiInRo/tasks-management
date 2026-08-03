import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

const env = loadEnv('test', process.cwd(), '');

export default defineConfig({
  test: {
    env: {
      ...env,
      DATABASE_URL: env.TEST_DATABASE_URL,
    },
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
  },
});
