export const dynamic = 'force-dynamic'
import { z } from 'zod'
import db from '@/utils/db'
import { Transaction } from '@/utils/dbTypes'
import { amountValidation, descriptionValidation, idValidation, notesValidation, symbolValidation, timestampValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
  params: Promise<{ id: string, transactionId: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)
  const transactionId = parseInt((await params).transactionId)

  const transaction = await db<Transaction>('transactions').select('*').where('id', transactionId).andWhere('accountId', accountId)

  if (transaction.length === 0) {
    return NextResponse.json({ message: 'Transaction not found' }, { status: 404 })
  }

  return NextResponse.json({
    transaction: transaction[0]
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)
  const transactionId = parseInt((await params).transactionId)

  const transToUpdate = await db<Transaction>('transactions').select('*').where('accountId', accountId).andWhere('id', transactionId)

  if (transToUpdate.length === 0) {
    return NextResponse.json({ message: 'Transaction not found' }, { status: 404 })
  }

  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation.optional(),
    notes: notesValidation.optional(),
    accountId: idValidation.optional(),
    groupId: idValidation.optional(),
    categoryId: idValidation.optional(),
    currency: symbolValidation.optional(),
    amount: amountValidation.optional(),
    paidAt: timestampValidation.optional(),
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  if (input.data.accountId) {
    const accountExists = await db('accounts').where('id', accountId)

    if (accountExists.length === 0) {
      return NextResponse.json({ error: 'Account does not exist' }, { status: 400 })
    }
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

  const transaction = await db<Transaction>('transactions').where('id', transactionId).update(input.data).returning('*').then(t => t[0])

  return NextResponse.json({ transaction })
}