import Knex from 'knex'
import dotenv from 'dotenv'
dotenv.config()

export const config: { [key: string]: Knex.Knex.Config } = {
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations',
    },
    pool: {
      acquireTimeoutMillis: 60000,
      min: 0,
      max: 10
    }
  }
}

const db = Knex(config.production)

export default db