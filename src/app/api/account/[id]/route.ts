export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Account, Balance } from '@/utils/dbTypes'
import { descriptionValidation, notesValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const accounts = await db<Account>('accounts').select('*').orderBy('description').where('id', id)

  if (accounts.length === 0) {
    return NextResponse.json({ message: 'Account not found' }, { status: 404 })
  }

  return NextResponse.json<Account>({
    ...accounts[0]
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const body = await request.json().then((data) => data).catch(() => null)

  const isValid = z.object({
    description: descriptionValidation.optional(),
    notes: notesValidation.optional()
  }).safeParse(body)

  if (!!isValid.error) {
    return NextResponse.json({ error: isValid.error }, { status: 400 })
  }

  const account = await db<Account>('accounts').update({
    description: isValid.data.description,
    notes: isValid.data.notes,
    updatedAt: new Date().toISOString()
  }).where('id', id).returning('*').then(c => c[0])

  if (!account) {
    return NextResponse.json({ message: 'Error updating account' }, { status: 500 })
  }

  return NextResponse.json<Account>(account, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  await db<Balance>('balances').delete().where('accountId', id)
  await db<Account>('accounts').delete().where('id', id).returning('*').then(c => c[0])

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}