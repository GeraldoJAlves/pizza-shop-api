import type { Config } from 'drizzle-kit'
export default {
  schema: './src/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
} satisfies Config
