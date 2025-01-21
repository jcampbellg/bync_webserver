export const dynamic = 'force-dynamic'
import { z } from 'zod'
import { amountValidation, descriptionValidation, idValidation, notesValidation, symbolValidation, timestampValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import db from '@/utils/db'
import { Balance, Transaction } from '@/utils/dbTypes'

type Params = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)
  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation,
    notes: notesValidation,
    currency: symbolValidation,
    amount: amountValidation,
    paidAt: timestampValidation,
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  const accountExists = await db('accounts').where('id', accountId)

  if (accountExists.length === 0) {
    return NextResponse.json({ error: 'Account does not exist' }, { status: 400 })
  }

  const balance = await db<Balance>('balances').where('accountId', accountId).andWhere('currency', input.data.currency).then(b => b[0])

  if (!balance) {
    return NextResponse.json({ error: 'Balance does not exist' }, { status: 400 })
  }

  // Update Balance
  await db('balances').where('id', balance.id).update({
    amount: balance.amount + input.data.amount
  })

  const transaction = await db<Transaction>('transactions').insert({
    description: input.data.description,
    notes: input.data.notes,
    currency: input.data.currency,
    amount: input.data.amount,
    paidAt: input.data.paidAt,
    accountId: accountId
  }).returning('*').then(t => t[0])

  return NextResponse.json<{ transaction: Transaction }>({ transaction }, { status: 200 })
}