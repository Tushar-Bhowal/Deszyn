import { z } from 'zod';

export const serverEnvSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(8000),

  // databases
  AUTH_DATABASE_URL: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),

  // auth
  BETTER_AUTH_SECRET: z.string().min(32, 'Secret must be at least 32 chars'),

  // urls
  WEB_BASE_URL: z.url(),
  API_BASE_URL: z.url(),
  PYTHON_API_BASE_URL: z.url(),

  // email
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.email(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
