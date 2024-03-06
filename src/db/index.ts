import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

// export * from './schema/auth-schema'
// import * as auth from './schema/auth-schema'
// export * from './schema/customer-schema'
// import * as customers from './schema/customer-schema'
// export * from './schema/nodes-schema'
// import * as nodes from './schema/nodes-schema'
// import * as relations from './relations'

const client = postgres(process.env.DATABASE_URL!)

const db = drizzle(client, {
  logger: true,
  // schema: { ...auth, ...customers, ...nodes, ...relations },
})

export default db
