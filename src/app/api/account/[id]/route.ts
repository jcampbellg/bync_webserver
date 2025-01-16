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

  return NextResponse.json<{ account: Account }>({
    account: accounts[0]
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation.optional(),
    notes: notesValidation.optional(),
    isDefault: z.boolean().optional(),
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  if (!!input.data.description) {
    const accountExists = await db<Account>('accounts').select('*').where('description', 'ilike', input.data.description)

    if (accountExists.length > 0) {
      return NextResponse.json({ message: 'Account already exists with that name' }, { status: 403 })
    }
  }

  if (!!input.data.isDefault) {
    await db<Account>('accounts').whereNot('id', id).update({ isDefault: false })
  }

  const account = await db<Account>('accounts').update({
    description: input.data.description,
    notes: input.data.notes,
    updatedAt: new Date().toISOString(),
    isDefault: input.data.isDefault
  }).where('id', id).returning('*').then(c => c[0])

  if (!account) {
    return NextResponse.json({ message: 'Error updating account' }, { status: 500 })
  }

  return NextResponse.json<{ account: Account }>({ account }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  await db<Balance>('balances').delete().where('accountId', id)
  await db<Account>('accounts').delete().where('id', id).returning('*').then(c => c[0])

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}