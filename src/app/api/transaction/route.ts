export const dynamic = 'force-dynamic'
import { z } from 'zod'
import { amountValidation, descriptionValidation, notesValidation, symbolValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/db'
import { Transaction } from '@/utils/dbTypes'

export async function POST(request: NextRequest) {
  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation,
    notes: notesValidation,
    amount: amountValidation,
    currency: symbolValidation,
    account: z.number().int(),
    group: z.number().int().optional(),
    category: z.number().int().optional()
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  const accountExists = await db('accounts').where('id', input.data.account)

  if (accountExists.length === 0) {
    return NextResponse.json({ error: 'Account does not exist' }, { status: 400 })
  }

  if (input.data.group) {
    const groupExists = await db('groups').where('id', input.data.group)

    if (groupExists.length === 0) {
      return NextResponse.json({ error: 'Group does not exist' }, { status: 400 })
    }
  }

  if (input.data.category) {
    const categoryExists = await db('categories').where('id', input.data.category)

    if (categoryExists.length === 0) {
      return NextResponse.json({ error: 'Category does not exist' }, { status: 400 })
    }
  }

  const transaction = await db<Transaction>('transactions').insert({
    description: input.data.description,
    notes: input.data.notes,
    isPaid: true,
  }).returning('*').then(t => t[0])

  await db('payments').insert({
    transactionId: transaction.id,
    accountId: input.data.account,
    currency: input.data.currency,
    amount: input.data.amount,
    paidAt: new Date()
  })

  return NextResponse.json<Transaction>(transaction, { status: 200 })
}