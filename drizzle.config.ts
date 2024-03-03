import type { Config } from 'drizzle-kit'
export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgres://pizza:123456@localhost:5432/pizzashop',
  },
} satisfies Config
