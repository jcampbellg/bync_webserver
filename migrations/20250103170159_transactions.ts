import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary()
    table.string('description').notNullable()
    table.string('notes').defaultTo('')
    table.integer('accountId').unsigned().nullable()
    table.foreign('accountId').references('id').inTable('accounts')
    table.integer('groupId').unsigned().nullable()
    table.foreign('groupId').references('id').inTable('groups')
    table.integer('categoryId').unsigned().nullable()
    table.foreign('categoryId').references('id').inTable('categories')
    table.string('currency').notNullable()
    table.float('amount').notNullable()
    table.timestamp('paidAt').nullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('debts', (table) => {
    table.increments('id').primary()
    table.string('description').notNullable()
    table.string('notes').defaultTo('')
    table.integer('accountId').unsigned().nullable()
    table.foreign('accountId').references('id').inTable('accounts')
    table.integer('groupId').unsigned().nullable().defaultTo(null)
    table.foreign('groupId').references('id').inTable('groups')
    table.integer('categoryId').unsigned().nullable().defaultTo(null)
    table.foreign('categoryId').references('id').inTable('categories')
    table.string('currency').notNullable()
    table.float('amount').notNullable()
    table.timestamp('dueAt').nullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('debts_payments', (table) => {
    table.increments('id').primary()
    table.integer('transactionId').unsigned().notNullable()
    table.foreign('transactionId').references('id').inTable('transactions')
    table.integer('debtId').unsigned().notNullable()
    table.foreign('debtId').references('id').inTable('debts')
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('debts_payments')
  await knex.schema.dropTable('debts')
  await knex.schema.dropTable('transactions')
}