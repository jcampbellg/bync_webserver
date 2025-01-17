import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('balances', (table) => {
    table.increments('id').primary()
    table.integer('accountId').unsigned().notNullable()
    table.foreign('accountId').references('id').inTable('accounts')
    table.string('currency').notNullable()
    table.float('amount').nullable()
    table.unique(['accountId', 'currency'])
    table.boolean('isSelected').notNullable().defaultTo(false)
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('balances')
}