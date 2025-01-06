export const dynamic = 'force-dynamic'
import { z } from 'zod'
import { amountValidation, descriptionValidation, notesValidation, symbolValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/db'
import { Debt, Transaction } from '@/utils/dbTypes'

export async function POST(request: NextRequest) {
  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation,
    notes: notesValidation,
    amount: amountValidation,
    currency: symbolValidation,
    groupId: z.number().int().optional(),
    categoryId: z.number().int().optional(),
    dueAt: z.string().datetime()
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  if (input.data.groupId) {
    const groupExists = await db('groups').where('id', input.data.groupId)

    if (groupExists.length === 0) {
      return NextResponse.json({ error: 'Group does not exist' }, { status: 400 })
    }
  }

  if (input.data.categoryId) {
    const categoryExists = await db('categories').where('id', input.data.categoryId)

    if (categoryExists.length === 0) {
      return NextResponse.json({ error: 'Category does not exist' }, { status: 400 })
    }
  }

  const transaction = await db<Transaction>('transactions').insert({
    description: input.data.description,
    notes: input.data.notes,
    isPaid: false,
    isDebt: true,
    isPending: true
  }).returning('*').then(t => t[0])

  await db<Debt>('debts').insert({
    transactionId: transaction.id,
    currency: input.data.currency,
    amount: input.data.amount,
    dueAt: input.data.dueAt
  })

  return NextResponse.json<Transaction>(transaction, { status: 200 })
}