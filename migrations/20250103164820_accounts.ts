import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary()
    table.string('description').notNullable()
    table.string('notes').defaultTo('')
    table.boolean('is_default').defaultTo(false)
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('accounts')
}