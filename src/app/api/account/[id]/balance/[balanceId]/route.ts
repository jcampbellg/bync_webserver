export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Balance } from '@/utils/dbTypes'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { amountValidation } from '@/utils/validation'

type Params = {
  params: Promise<{ id: string, balanceId: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)
  const balanceId = parseInt((await params).balanceId)

  const balances = await db<Balance>('balances').select('*').where('accountId', accountId).andWhere('id', balanceId)

  return NextResponse.json({
    balances
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)
  const balanceId = parseInt((await params).balanceId)
  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    amount: amountValidation.optional(),
    isSelected: z.boolean().optional()
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  const balances = await db<Balance>('balances').select('*').where('accountId', accountId).andWhere('id', balanceId)

  if (balances.length === 0) {
    return NextResponse.json({ message: 'Balance not found' }, { status: 404 })
  }

  const balance = await db<Balance>('balances').update({
    amount: input.data.amount,
    isSelected: input.data.isSelected,
    updatedAt: new Date().toISOString()
  }).where('id', balanceId).returning('*').then(c => c[0])

  if (!balance) {
    return NextResponse.json({ message: 'Error creating balance' }, { status: 500 })
  }

  if (!!input.data.isSelected) {
    await db<Balance>('balances').whereNot('id', balance.id).andWhere('accountId', accountId).update({ isSelected: false })
  }

  return NextResponse.json<{ balance: Balance }>({ balance }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const accountId = parseInt((await params).id)
  const balanceId = parseInt((await params).balanceId)

  const balanceCount = await db<Balance>('balances').count().where('accountId', accountId).first()

  if (!balanceCount || balanceCount.count === '1') {
    return NextResponse.json({ message: 'Can\'t delete all balances' }, { status: 404 })
  }

  await db<Balance>('balances').delete().where('accountId', accountId).andWhere('id', balanceId)

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}