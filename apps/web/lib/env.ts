import { webEnvSchema } from '@deszyn/config';
import { z } from 'zod';

const parsed = webEnvSchema.safeParse({
  APP_ENV: process.env.APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_PYTHON_API_URL: process.env.NEXT_PUBLIC_PYTHON_API_URL,
});

if (!parsed.success) {
  console.error('Invalid environment variables:\n', z.treeifyError(parsed.error));
  throw new Error('Fix environment variables before starting the app.');
}

export const env = parsed.data;
