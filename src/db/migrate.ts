import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const connection = postgres(
  'postgres://pizza:123456@localhost:5432/pizzashop',
  { max: 1 },
)

const db = drizzle(connection)

await migrate(db, { migrationsFolder: 'drizzle' })

await connection.end()

process.exit()
