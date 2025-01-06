import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary()
    table.string('description').notNullable()
    table.string('notes').defaultTo('')
    table.boolean('isDebt').notNullable().defaultTo(false)
    table.boolean('isPaid').notNullable().defaultTo(true)
    table.boolean('isOverpaid').notNullable().defaultTo(false)
    table.boolean('isPending').notNullable().defaultTo(false)
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('payments', (table) => {
    table.increments('id').primary()
    table.integer('transactionId').unsigned().notNullable()
    table.foreign('transactionId').references('id').inTable('transactions')
    table.integer('accountId').unsigned().nullable()
    table.foreign('accountId').references('id').inTable('accounts')
    table.integer('groupId').unsigned().nullable()
    table.foreign('groupId').references('id').inTable('groups')
    table.integer('categoryId').unsigned().nullable()
    table.foreign('categoryId').references('id').inTable('categories')
    table.string('currency').notNullable()
    table.float('amount').notNullable()
    table.timestamp('paidAt').notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('debts', (table) => {
    table.increments('id').primary()
    table.integer('transactionId').unsigned().notNullable()
    table.foreign('transactionId').references('id').inTable('transactions')
    table.integer('groupId').unsigned().nullable()
    table.foreign('groupId').references('id').inTable('groups')
    table.integer('categoryId').unsigned().nullable()
    table.foreign('categoryId').references('id').inTable('categories')
    table.string('currency').notNullable()
    table.float('amount').notNullable()
    table.timestamp('dueAt').notNullable()
    table.unique(['transactionId', 'currency'])
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('debts')
  await knex.schema.dropTable('payments')
  await knex.schema.dropTable('transactions')
}