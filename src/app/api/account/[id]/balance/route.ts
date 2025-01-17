export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Balance, Currency } from '@/utils/dbTypes'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { amountValidation, symbolValidation } from '@/utils/validation'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)

  const balances = await db<Balance>('balances').select('*').where('accountId', accountId)

  return NextResponse.json({
    balances
  })
}

export async function POST(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)

  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    amount: amountValidation,
    currency: symbolValidation
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  const balance = await db<Balance>('balances').insert({
    accountId,
    amount: input.data.amount,
    currency: input.data.currency,
    isSelected: true,
    updatedAt: new Date().toISOString()
  }).onConflict(['accountId', 'currency']).merge().returning('*').then(c => c[0])

  if (!balance) {
    return NextResponse.json({ message: 'Error creating balance' }, { status: 500 })
  }

  await db<Balance>('balances').whereNot('id', balance.id).update({ isSelected: false })

  await db<Currency>('currencies').insert({
    symbol: input.data.currency,
  }).onConflict('symbol').merge()

  return NextResponse.json<{ balance: Balance }>({ balance }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)
  const body = await request.json().then((data) => data).catch(() => null)

  if (!body.id) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  await db<Balance>('balances').delete().where('accountId', id).andWhere('id', body.id)

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}