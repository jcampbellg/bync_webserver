import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('currencies', (table) => {
    table.increments('id').primary()
    table.string('symbol').notNullable().unique()
    table.string('notes').defaultTo('')
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('currencies')
}