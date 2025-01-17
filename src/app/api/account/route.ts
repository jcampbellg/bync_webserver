export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Account } from '@/utils/dbTypes'
import { descriptionValidation, notesValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'


export async function GET() {
  const accounts = await db<Account>('accounts').select('*').orderBy('description')

  return NextResponse.json<{ accounts: Account[] }>({ accounts })
}

export async function POST(request: NextRequest) {
  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation,
    notes: notesValidation,
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  const accountExists = await db<Account>('accounts').select('*').where('description', 'ilike', input.data.description)

  if (accountExists.length > 0) {
    return NextResponse.json({ message: 'Account already exists' }, { status: 403 })
  }

  const account = await db<Account>('accounts').insert({
    description: input.data.description,
    notes: input.data.notes,
    isSelected: true
  }).returning('*').then(c => c[0])

  if (!account) {
    return NextResponse.json({ message: 'Error creating account' }, { status: 500 })
  }

  await db<Account>('accounts').whereNot('id', account.id).update({ isSelected: false })

  if (!!body.currency) {
    const url = `http://localhost:${process.env.port || 3000}/api/account/${account.id}/balance`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify(body)
    })
  }

  return NextResponse.json<{ account: Account }>({ account }, { status: 200 })
}