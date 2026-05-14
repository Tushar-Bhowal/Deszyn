import { z } from 'zod';

export const webEnvSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  NEXT_PUBLIC_PYTHON_API_URL: z.url(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;
